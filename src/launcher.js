const stage=document.getElementById('stage'),heroIn=document.getElementById('heroIn'),rot=document.getElementById('rot'),hero=document.getElementById('hero'),shadow=document.getElementById('shadow'),msg=document.getElementById('msg');
// The TV's installed-apps list, read through the module service, supplies each app's ID when available.
// These IDs are the fallback, tried in turn because they differ by TV year and region.
const NAMES=[
['Netflix','',['org.tizen.netflix-app','11101200001','3201907018807'],null,/^netflix/i],
['YouTube','',['9Ur5IzDKqV.TizenYouTube','111299001912'],null,/^youtube$/i],
['Prime Video','',['org.tizen.ignition','evKhCgZelL.AmazonIgnitionWebApp','3201512006785','3201910019365'],null,/prime video/i],
['Spotify','',['rJeHak5zRg.Spotify','3201606009684'],null,/^spotify/i],
['Disney+','',['MCmYXNxgcu.DisneyPlus','3201901017640','3202009021709','3202204027038'],null,/^disney/i],
['All Apps','',null,'APPS']];
const TOP=246,GAP=16;
let col=0,row=0,busy=false,slow=1,pose='idle';
const tiles=NAMES.map((n,i)=>{const d=document.createElement('div');d.className='tile';d.innerHTML='<span class="g" aria-hidden="true">'+n[1]+'</span>'+n[0];stage.insertBefore(d,shadow);d.onclick=()=>{const c=i%2,r=Math.floor(i/2);if(r===row)go(c-col,0);else if(c===col)go(0,r-row);else msg.textContent='Move one step at a time with the arrows.'};return d});
let W=0;
function layout(){W=(stage.clientWidth-GAP)/2;tiles.forEach((t,i)=>{const c=i%2,r=Math.floor(i/2);t.style.width=W+'px';t.style.left=(c*(W+GAP))+'px';t.style.bottom=(2-r)*TOP+'px'})}
const hx=c=>c*(W+GAP)+W/2-18, hy=r=>-(2-r)*TOP;
const T=(a,b)=>'translate('+a+'px,'+b+'px)';
function setT(xx,yy){hero.style.transform=T(xx,yy);shadow.style.transform=T(xx,yy)}
function place(){layout();setT(hx(col),hy(row))}
// Keeps the current row in the same spot, with the edges of its neighbours showing.
function scroll(){stage.style.transform='translateY('+((2-row)*TOP-44)+'px)'}
function mark(){tiles.forEach((t,i)=>t.classList.toggle('on',i===row*2+col))}
// Every pose stays loaded so changing pose doesn't make the TV redraw the avatar.
const POSES={};Object.keys(SP).forEach(p=>{const d=document.createElement('div');d.className='pose';d.innerHTML=SP[p];heroIn.appendChild(d);POSES[p]=d});
let showing=null;
function showPose(p){if(showing)showing.classList.remove('show');showing=POSES[p];showing.classList.add('show')}
function setPose(p){pose=p;showPose(p);heroIn.className=p==='idle'?'idle':''}
setPose('idle');layout();mark();scroll();setT(hx(col),hy(row));
setInterval(()=>{if(busy||pose!=='idle')return;showPose('blink');setTimeout(()=>{if(!busy&&pose==='idle')showPose('idle')},140)},3200);
function sched(list,d){list.forEach(([o,p])=>setTimeout(()=>setPose(p),o*d))}
function go(dc,dr){const nc=col+dc,nr=row+dr;if(busy||nc<0||nc>1||nr<0||nr>2||(dc===0&&dr===0))return;busy=true;msg.textContent='';
const x0=hx(col),y0=hy(row),x1=hx(nc),y1=hy(nr);let d,ha;
if(dr===0){const dir=dc>0?1:-1,dist=Math.abs(dc),h=60+(dist-1)*12;d=(900+(dist-1)*120)*slow;const mx=(x0+x1)/2;
hero.animate([{offset:0,transform:T(x0,y0)},{offset:0.18,transform:T(x0,y0),easing:'ease-out'},{offset:0.5,transform:T(mx,y0-h),easing:'ease-in'},{offset:0.82,transform:T(x1,y1)},{offset:1,transform:T(x1,y1)}],{duration:d});
rot.animate([{offset:0,transform:'rotate(0deg)'},{offset:0.24,transform:'rotate(0deg)',easing:'ease-in-out'},{offset:0.78,transform:'rotate('+(360*dir)+'deg)'},{offset:1,transform:'rotate('+(360*dir)+'deg)'}],{duration:d});
ha=shadow.animate([{offset:0,transform:T(x0,y0)+' scale(1)',opacity:1},{offset:0.18,transform:T(x0,y0)+' scale(1)',opacity:1,easing:'ease-out'},{offset:0.5,transform:T(mx,y0)+' scale(0.5)',opacity:0.4,easing:'ease-in'},{offset:0.82,transform:T(x1,y1)+' scale(1)',opacity:1},{offset:1,transform:T(x1,y1)+' scale(1)',opacity:1}],{duration:d});
sched([[0,'crouch'],[0.18,'jump'],[0.27,'tuck'],[0.72,'jump'],[0.82,'crouch'],[0.95,'idle']],d)}
else if(dr<0){d=850*slow;
hero.animate([{offset:0,transform:T(x0,y0)},{offset:0.22,transform:T(x0,y0),easing:'cubic-bezier(.2,.8,.4,1)'},{offset:0.62,transform:T(x1,y1-26),easing:'ease-in'},{offset:0.8,transform:T(x1,y1)},{offset:1,transform:T(x1,y1)}],{duration:d});
ha=shadow.animate([{offset:0,transform:T(x0,y0),opacity:1},{offset:0.22,transform:T(x0,y0),opacity:1},{offset:0.32,transform:T(x0,y0),opacity:0},{offset:0.33,transform:T(x1,y1)+' scale(0.5)',opacity:0},{offset:0.8,transform:T(x1,y1)+' scale(1)',opacity:1},{offset:1,transform:T(x1,y1),opacity:1}],{duration:d});
sched([[0,'crouch'],[0.22,'jump'],[0.8,'crouch'],[0.95,'idle']],d)}
else{d=760*slow;
hero.animate([{offset:0,transform:T(x0,y0)},{offset:0.12,transform:T(x0,y0),easing:'ease-out'},{offset:0.3,transform:T(x0,y0-16),easing:'cubic-bezier(.5,0,.9,.6)'},{offset:0.78,transform:T(x1,y1)},{offset:1,transform:T(x1,y1)}],{duration:d});
ha=shadow.animate([{offset:0,transform:T(x0,y0),opacity:1},{offset:0.12,transform:T(x0,y0),opacity:1},{offset:0.24,transform:T(x0,y0),opacity:0},{offset:0.25,transform:T(x1,y1)+' scale(0.5)',opacity:0},{offset:0.78,transform:T(x1,y1)+' scale(1)',opacity:1},{offset:1,transform:T(x1,y1),opacity:1}],{duration:d});
sched([[0,'crouch'],[0.12,'jump'],[0.3,'fall'],[0.78,'crouch'],[0.94,'idle']],d)}
col=nc;row=nr;mark();scroll();
ha.onfinish=()=>{setT(x1,y1);rot.style.transform='rotate(0deg)';busy=false}}
function hop(){if(busy)return;busy=true;const x=hx(col),y=hy(row),d=520*slow;
hero.animate([{offset:0,transform:T(x,y)},{offset:0.2,transform:T(x,y),easing:'ease-out'},{offset:0.48,transform:T(x,y-26),easing:'ease-in'},{offset:0.76,transform:T(x,y)},{offset:1,transform:T(x,y)}],{duration:d});
const sa=shadow.animate([{offset:0,transform:T(x,y)+' scale(1)'},{offset:0.2,transform:T(x,y)+' scale(1)'},{offset:0.48,transform:T(x,y)+' scale(0.75)'},{offset:0.76,transform:T(x,y)+' scale(1)'},{offset:1,transform:T(x,y)+' scale(1)'}],{duration:d});
sched([[0,'crouch'],[0.2,'jump'],[0.76,'crouch'],[0.92,'idle']],d);
sa.onfinish=()=>{busy=false;openTile(NAMES[row*2+col])}}

// TizenBrew serves module pages from /module/. Those pages have no tizen API, so the
// module's service (src/service.js) lists and launches apps for them.
const PREVIEW=location.pathname.indexOf('/module/')!==0;
const SERVICE='http://127.0.0.1:8086';
function ask(path,done){
const x=new XMLHttpRequest();let called=false;
const finish=r=>{if(!called){called=true;done(r)}};
x.open('GET',SERVICE+path);x.timeout=15000;
x.onload=()=>{let r=null;try{r=JSON.parse(x.responseText)}catch(e){}finish(r)};
x.onerror=x.ontimeout=()=>finish(null);
x.send()}
function openTile(n){
if(PREVIEW&&n[3]!=='APPS'){msg.textContent='Preview: the TV would open '+n[0]+'.';return}
msg.textContent='Opening '+n[0]+'…';
if(n[3]==='APPS'){msg.textContent='';openApps()}else launch(n)}
function launch(n){
ask('/launch?ids='+encodeURIComponent(n[2].join(',')),r=>{
if(!r){launchDirect(n);return}
msg.textContent=r.ok?'':n[0]+' could not be opened. Is it installed on this TV?'})}
// If the service isn't running, open the app through the TV's REST API. A tile looks up its
// app's real ID in the TV's list first, because a wrong ID may not open the right thing.
// The page can't read the API's reply, so it can't confirm the app opened.
function launchDirect(n){
const post=id=>{const x=new XMLHttpRequest();x.open('POST','http://127.0.0.1:8001/api/v2/applications/'+id);x.send();
setTimeout(()=>{if(msg.textContent==='Opening '+n[0]+'…')msg.textContent='If '+n[0]+" doesn't open, check that it's installed on this TV."},4000)};
if(!n[4]){post(n[2][0]);return}
const pick=list=>{
const a=list?list.filter(x=>n[4].test(x.name))[0]:null;
if(list&&!a){msg.textContent=n[0]+" isn't installed on this TV.";return}
post(a?a.id:n[2].filter(id=>/^\d+$/.test(id))[0])};
if(installed){pick(installed);return}
listFromRemote(list=>{if(list&&list.length){installed=list;pick(list)}else pick(null)})}
// The service starts alongside the page, so it may need a few seconds to answer.
function useInstalledApps(tries){
if(PREVIEW)return;
ask('/apps',r=>{
if(!r){if(tries>0)setTimeout(()=>useInstalledApps(tries-1),1000);return}
installed=r.apps;
NAMES.forEach(n=>{
if(!n[4])return;
const a=r.apps.filter(x=>n[4].test(x.name))[0];
if(!a)return;
n[2]=[a.id].concat(n[2].filter(id=>id!==a.id))})})}
// If the service isn't running, the TV's remote-control socket can also list installed apps.
// The TV asks to allow this the first time.
function listFromRemote(done){
const name=btoa('Avatar Q Launcher');let token='';
try{token=localStorage.getItem('remoteToken')||''}catch(e){}
const urls=['ws://127.0.0.1:8001/api/v2/channels/samsung.remote.control?name='+name,'wss://127.0.0.1:8002/api/v2/channels/samsung.remote.control?name='+name+(token?'&token='+token:'')];
const attempt=i=>{let settled=false,ws;
const next=()=>{if(settled)return;settled=true;if(i+1<urls.length)attempt(i+1);else done(null)};
setTimeout(next,20000);
try{ws=new WebSocket(urls[i])}catch(e){next();return}
ws.onerror=next;ws.onclose=next;
ws.onmessage=e=>{let m={};try{m=JSON.parse(e.data)}catch(x){}
if(m.event==='ms.channel.connect'){
if(m.data&&m.data.token){try{localStorage.setItem('remoteToken',m.data.token)}catch(x){}}
ws.send(JSON.stringify({method:'ms.channel.emit',params:{event:'ed.installedApp.get',to:'host'}}))}
else if(m.event==='ed.installedApp.get'){settled=true;ws.close();
done(((m.data&&m.data.data)||[]).map(a=>({id:a.appId,name:a.name})))}
else if(m.event==='ms.channel.unauthorized')next()}};
attempt(0)}
// All Apps section: position -1 is the search bar, 0 and up are the visible list rows.
const appsView=document.getElementById('apps'),search=document.getElementById('search'),appList=document.getElementById('appList'),appNote=document.getElementById('appNote');
const SAMPLE_APPS=['Apple TV','BBC iPlayer','Disney+','Internet','Netflix','Plex','Prime Video','Spotify','Tubi','Twitch','YouTube','YouTube Kids'].map(n=>({id:n,name:n}));
let installed=null,appsOpen=false,appPos=-1,shown=[];
function drawApps(){
const q=search.value.toLowerCase();
shown=(installed||[]).filter(a=>a.name&&a.show!==false&&a.name.toLowerCase().indexOf(q)>=0).sort((a,b)=>a.name.toLowerCase()<b.name.toLowerCase()?-1:1);
appPos=Math.min(appPos,shown.length-1);
appList.innerHTML='';
shown.forEach(a=>{const d=document.createElement('div');d.className='app';d.textContent=a.name;d.onclick=()=>launch([a.name,'',[a.id]]);appList.appendChild(d)});
if(installed)appNote.textContent=shown.length?(PREVIEW?'Preview: example apps':''):'No apps match your search.';
markApp()}
function markApp(){
search.parentNode.classList.toggle('on',appPos<0);
[].forEach.call(appList.children,(d,i)=>{d.classList.toggle('on',i===appPos)});
if(appPos>=0)appList.scrollTop=Math.max(0,(appPos-3)*38);else appList.scrollTop=0}
function openApps(){
appsOpen=true;appsView.hidden=false;appPos=-1;search.value='';
if(PREVIEW)installed=SAMPLE_APPS;
if(installed){drawApps();return}
appNote.textContent='Loading your apps…';drawApps();
ask('/apps',r=>{
if(r&&r.apps&&r.apps.length){installed=r.apps;drawApps();return}
appNote.textContent="Loading your apps… If the TV asks for permission, choose Allow.";
listFromRemote(list=>{
if(list&&list.length){installed=list;drawApps()}
else appNote.textContent="Couldn't read the list of apps on this TV."})})}
function closeApps(){search.blur();appsOpen=false;appsView.hidden=true;msg.textContent=''}
function appsKey(e){
const c=e.keyCode;
if(document.activeElement===search){
// 65376 is Done and 65385 is Cancel on the TV's on-screen keyboard.
if(c===13||c===65376||c===65385||c===10009||c===27){e.preventDefault();search.blur()}
return}
if(c===38||c===40){e.preventDefault();appPos=Math.max(-1,Math.min(shown.length-1,appPos+(c===40?1:-1)));markApp()}
else if(c===13){e.preventDefault();if(appPos<0)search.focus();else if(shown[appPos]){
if(PREVIEW)msg.textContent='Preview: the TV would open '+shown[appPos].name+'.';
else{msg.textContent='Opening '+shown[appPos].name+'…';launch([shown[appPos].name,'',[shown[appPos].id]])}}}
else if(c===10009||(PREVIEW&&c===27)){e.preventDefault();closeApps()}}
search.addEventListener('input',()=>{appPos=-1;drawApps()});
search.addEventListener('blur',markApp);
// TizenBrew opens a module by navigating to it, so its own UI is the previous history entry.
function exitToBrew(){
if(PREVIEW){msg.textContent='Preview: Back would return to TizenBrew.';return}
history.back()}
// Samsung remotes report keyCode reliably; 10009 is Back, Escape and Backspace stand in for it in a browser.
document.addEventListener('keydown',e=>{if(appsOpen){appsKey(e);return}const c=e.keyCode,k={37:[-1,0],39:[1,0],38:[0,-1],40:[0,1]}[c];
if(k){e.preventDefault();go(k[0],k[1])}
else if(c===13){e.preventDefault();hop()}
else if(c===10009||(PREVIEW&&(c===27||c===8))){e.preventDefault();exitToBrew()}});
// The 700x394 design (stage plus its original padding) is scaled to fill the screen.
function fit(){const s=Math.min(innerWidth/700,innerHeight/394),tv=document.getElementById('tv');
tv.style.transform='translate('+((innerWidth-700*s)/2)+'px,'+((innerHeight-394*s)/2)+'px) scale('+s+')'}
fit();window.addEventListener('resize',()=>{fit();place()});
useInstalledApps(20);
if(PREVIEW)msg.textContent='Preview: arrows move, Enter opens, Esc is Back.';
