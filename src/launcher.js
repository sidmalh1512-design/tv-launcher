const stage=document.getElementById('stage'),heroIn=document.getElementById('heroIn'),rot=document.getElementById('rot'),hero=document.getElementById('hero'),shadow=document.getElementById('shadow'),msg=document.getElementById('msg');
const PLAY='<svg viewBox="0 0 7 7" width="14" height="14"><path fill="currentColor" d="M1 0h2v1h1v1h1v1h1v1H5v1H4v1H3v1H1z"/></svg>',DISC='<svg viewBox="0 0 7 7" width="14" height="14"><path fill="currentColor" fill-rule="evenodd" d="M2 0h3v1h1v1h1v3H6v1H5v1H2V6H1V5H0V2h1V1h1zM3 2v3h1V4h1V3H4V2z"/></svg>',NOTE='<svg viewBox="0 0 7 7" width="14" height="14"><path fill="currentColor" d="M3 0h4v5H6v1H4V5h2V2H4v4H3v1H1V6H0V5h3z"/></svg>',PORT='<svg viewBox="0 0 7 7" width="14" height="14"><path fill="currentColor" fill-rule="evenodd" d="M0 1h7v3H6v1H5v1H2V5H1V4H0zM1 2v1h5V2z"/></svg>';
// The TV's installed-apps list supplies each app's ID and icon when available.
// These IDs are the fallback, tried in turn because they differ by TV year and region.
const NAMES=[
['Netflix',PLAY,['org.tizen.netflix-app','11101200001','3201907018807'],null,/^netflix/i],
['YouTube',DISC,['9Ur5IzDKqV.TizenYouTube','111299001912'],null,/^youtube$/i],
['Prime Video',PLAY,['org.tizen.ignition','evKhCgZelL.AmazonIgnitionWebApp','3201512006785','3201910019365'],null,/prime video/i],
['Spotify',NOTE,['rJeHak5zRg.Spotify','3201606009684'],null,/^spotify/i],
['HDMI 1',PORT,null,'KEY_HDMI1'],
['HDMI 2',PORT,null,'KEY_HDMI2']];
const TOP=156,GAP=8;
let col=0,row=1,busy=false,slow=1,pose='idle';
const tiles=NAMES.map((n,i)=>{const d=document.createElement('div');d.className='tile';d.innerHTML='<span class="g" aria-hidden="true">'+n[1]+'</span>'+n[0];stage.insertBefore(d,shadow);d.onclick=()=>{const c=i%3,r=Math.floor(i/3);if(r===row)go(c-col,0);else if(c===col)go(0,r-row);else msg.textContent='Move one step at a time with the arrows.'};return d});
let W=0;
function layout(){W=(stage.clientWidth-2*GAP)/3;tiles.forEach((t,i)=>{const c=i%3,r=Math.floor(i/3);t.style.width=W+'px';t.style.left=(c*(W+GAP))+'px';t.style.bottom=(r===0?TOP:0)+'px'})}
const hx=c=>c*(W+GAP)+W/2-18, hy=r=>r===0?-TOP:0;
const T=(a,b)=>'translate('+a+'px,'+b+'px)';
function setT(xx,yy){hero.style.transform=T(xx,yy);shadow.style.transform=T(xx,yy)}
function place(){layout();setT(hx(col),hy(row))}
function mark(){tiles.forEach((t,i)=>t.classList.toggle('on',i===row*3+col))}
function setPose(p){pose=p;heroIn.innerHTML=SP[p];heroIn.className=p==='idle'?'idle':''}
setPose('idle');layout();mark();setT(hx(col),hy(row));
setInterval(()=>{if(busy||pose!=='idle')return;heroIn.innerHTML=SP.blink;setTimeout(()=>{if(!busy&&pose==='idle')heroIn.innerHTML=SP.idle},140)},3200);
function sched(list,d){list.forEach(([o,p])=>setTimeout(()=>setPose(p),o*d))}
function go(dc,dr){const nc=col+dc,nr=row+dr;if(busy||nc<0||nc>2||nr<0||nr>1||(dc===0&&dr===0))return;busy=true;msg.textContent='';
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
col=nc;row=nr;mark();
ha.onfinish=()=>{setT(x1,y1);rot.style.transform='rotate(0deg)';busy=false}}
function hop(){if(busy)return;busy=true;const x=hx(col),y=hy(row),d=520*slow;
hero.animate([{offset:0,transform:T(x,y)},{offset:0.2,transform:T(x,y),easing:'ease-out'},{offset:0.48,transform:T(x,y-26),easing:'ease-in'},{offset:0.76,transform:T(x,y)},{offset:1,transform:T(x,y)}],{duration:d});
const sa=shadow.animate([{offset:0,transform:T(x,y)+' scale(1)'},{offset:0.2,transform:T(x,y)+' scale(1)'},{offset:0.48,transform:T(x,y)+' scale(0.75)'},{offset:0.76,transform:T(x,y)+' scale(1)'},{offset:1,transform:T(x,y)+' scale(1)'}],{duration:d});
sched([[0,'crouch'],[0.2,'jump'],[0.76,'crouch'],[0.92,'idle']],d);
sa.onfinish=()=>{busy=false;open(NAMES[row*3+col])}}

const PREVIEW=!window.tizen;
function open(n){
if(PREVIEW){msg.textContent='Preview: the TV would open '+n[0]+'.';return}
msg.textContent='Opening '+n[0]+'…';
if(n[3])sendKey(n[3],n[0]);else launch(n,0)}
function launch(n,i){
const fail=()=>{if(i+1<n[2].length)launch(n,i+1);else msg.textContent=n[0]+' could not be opened. Is it installed on this TV?'};
try{tizen.application.launch(n[2][i],()=>{msg.textContent=''},fail)}catch(e){fail()}}
// Keeps the generic icon unless the app's real one actually loads: module pages are served
// over http, which may not be allowed to read the local files iconPath points to.
function showIcon(tile,path){
if(!path)return;
const img=new Image();
img.onload=()=>{const g=tile.querySelector('.g');g.innerHTML='';g.appendChild(img)};
img.src=path.charAt(0)==='/'?'file://'+path:path}
function useInstalledApps(){
if(PREVIEW)return;
try{tizen.application.getAppsInfo(list=>{NAMES.forEach((n,i)=>{
if(!n[4])return;
const a=list.filter(x=>n[4].test(x.name))[0];
if(!a)return;
n[2]=[a.id].concat(n[2].filter(id=>id!==a.id));
showIcon(tiles[i],a.iconPath)})},()=>{})}catch(e){}}
// No public Tizen API switches input without a partner privilege, so HDMI tiles press the
// key through the TV's own remote-control socket. The TV asks to allow this the first time.
function sendKey(key,label){
const name=btoa('Avatar Q Launcher');let token='';
try{token=localStorage.getItem('remoteToken')||''}catch(e){}
const urls=['ws://127.0.0.1:8001/api/v2/channels/samsung.remote.control?name='+name,'wss://127.0.0.1:8002/api/v2/channels/samsung.remote.control?name='+name+(token?'&token='+token:'')];
const fail=()=>{msg.textContent=label+' could not be switched. Use the Source button on the remote.'};
const attempt=i=>{let done=false;let ws;
const next=()=>{if(done)return;done=true;if(i+1<urls.length)attempt(i+1);else fail()};
try{ws=new WebSocket(urls[i])}catch(e){next();return}
ws.onerror=next;ws.onclose=next;
ws.onmessage=e=>{let m={};try{m=JSON.parse(e.data)}catch(x){}
if(m.event==='ms.channel.connect'){done=true;
if(m.data&&m.data.token){try{localStorage.setItem('remoteToken',m.data.token)}catch(x){}}
ws.send(JSON.stringify({method:'ms.remote.control',params:{Cmd:'Click',DataOfCmd:key,Option:'false',TypeOfRemote:'SendRemoteKey'}}));
msg.textContent='';setTimeout(()=>ws.close(),1000)}
else if(m.event==='ms.channel.unauthorized'){done=true;ws.close();fail()}}};
attempt(0)}
// TizenBrew opens a module by navigating to it, so its own UI is the previous history entry.
function exitToBrew(){
if(PREVIEW){msg.textContent='Preview: Back would return to TizenBrew.';return}
if(history.length>1)history.back();else tizen.application.getCurrentApplication().exit()}
// Samsung remotes report keyCode reliably; 10009 is Back, Escape and Backspace stand in for it in a browser.
document.addEventListener('keydown',e=>{const c=e.keyCode,k={37:[-1,0],39:[1,0],38:[0,-1],40:[0,1]}[c];
if(k){e.preventDefault();go(k[0],k[1])}
else if(c===13){e.preventDefault();hop()}
else if(c===10009||(PREVIEW&&(c===27||c===8))){e.preventDefault();exitToBrew()}});
// The 700x394 design (stage plus its original padding) is scaled to fill the screen.
function fit(){const s=Math.min(innerWidth/700,innerHeight/394),tv=document.getElementById('tv');
tv.style.transform='translate('+((innerWidth-700*s)/2)+'px,'+((innerHeight-394*s)/2)+'px) scale('+s+')'}
fit();window.addEventListener('resize',()=>{fit();place()});
useInstalledApps();
if(PREVIEW)msg.textContent='Preview: arrows move, Enter opens, Esc is Back.';
