// Runs in TizenBrew's Node service, which has the tizen API that module pages lack.
// Plain ES5 because Tizen 4.0 TVs can run a very old Node.
var http = require('http');
var url = require('url');

var PORT = 8086;
var PAGE_ORIGIN = 'http://127.0.0.1:8081';
var apps = [];

function once(fn) {
    var called = false;
    return function (value) {
        if (called) return;
        called = true;
        fn(value);
    };
}

function readApps(done) {
    var finish = once(done);
    try {
        tizen.application.getAppsInfo(function (list) {
            apps = list.map(function (a) {
                return { id: a.id, name: a.name, show: a.show };
            });
            finish(null);
        }, function (e) {
            finish(e.message || 'getAppsInfo failed');
        });
    } catch (e) {
        finish(e.message || 'getAppsInfo failed');
    }
    setTimeout(function () { finish('getAppsInfo timed out'); }, 5000);
}

function launchWithTizen(id, done) {
    var finish = once(done);
    try {
        tizen.application.launch(id, function () { finish(true); }, function () { finish(false); });
    } catch (e) {
        finish(false);
    }
    setTimeout(function () { finish(false); }, 3000);
}

// The TV's own REST API launches apps by their numeric store ID.
function launchWithRest(id, done) {
    var finish = once(done);
    if (!/^\d+$/.test(id)) return finish(false);
    var req = http.request({ host: '127.0.0.1', port: 8001, method: 'POST', path: '/api/v2/applications/' + id }, function (res) {
        res.resume();
        finish(res.statusCode >= 200 && res.statusCode < 300);
    });
    req.on('error', function () { finish(false); });
    req.setTimeout(3000, function () { req.abort(); finish(false); });
    req.end();
}

function tryEach(ids, launcher, done) {
    if (!ids.length) return done(null);
    launcher(ids[0], function (ok) {
        if (ok) return done(ids[0]);
        tryEach(ids.slice(1), launcher, done);
    });
}

function launch(ids, done) {
    tryEach(ids, launchWithTizen, function (id) {
        if (id) return done({ ok: true, id: id, via: 'tizen' });
        tryEach(ids, launchWithRest, function (restId) {
            done(restId ? { ok: true, id: restId, via: 'rest' } : { ok: false });
        });
    });
}

function sendJson(res, body) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
}

var server = http.createServer(function (req, res) {
    // Only the launcher page may use this, so other sites can't open apps on the TV.
    if (req.headers.origin !== PAGE_ORIGIN) { res.writeHead(403); return res.end(); }
    res.setHeader('Access-Control-Allow-Origin', PAGE_ORIGIN);
    var parsed = url.parse(req.url, true);
    if (parsed.pathname === '/apps') {
        readApps(function (error) {
            sendJson(res, {
                error: error,
                apps: apps
            });
        });
    } else if (parsed.pathname === '/launch') {
        launch(String(parsed.query.ids || '').split(',').filter(Boolean), function (result) {
            sendJson(res, result);
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});
// TizenBrew keeps services running, so the port may already be held by an earlier copy.
server.on('error', function (e) { console.log('tv-launcher service: ' + e.message); });
server.listen(PORT, '127.0.0.1');
