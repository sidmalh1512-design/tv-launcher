const COL={H:"#1A120C",h:"#3B2B1F",S:"#B07A52",s:"#94623F",E:"#1A120C",W:"#F1EFE8",M:"#7A4434",m:"#9A5A44",P:"#4A4D55",p:"#5E616B",q:"#C9CCD3",R:"#6B3E1F",k:"#3E4148",L:"#2B3A55",l:"#22304A",K:"#F1EFE8",G:"#B4B2A9"};
function E(px,py,cx,cy,rx,ry){const a=(px-cx)/rx,b=(py-cy)/ry;return a*a+b*b<=1}
function Cc(px,py,cx,cy,r){return (px-cx)*(px-cx)+(py-cy)*(py-cy)<=r*r}
function Rr(px,py,x0,y0,x1,y1){return px>=x0&&px<x1&&py>=y0&&py<y1}
function seg(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay;let t=((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy);t=Math.max(0,Math.min(1,t));const ex=ax+t*dx-px,ey=ay+t*dy-py;return {d:Math.sqrt(ex*ex+ey*ey),t}}
const back=(px,q)=>E(px,q,16,6.5,10.5,6)||Cc(px,q,9,4,3.5)||Cc(px,q,13,1.6,3.8)||Cc(px,q,18.5,1.3,3.8)||Cc(px,q,23,3.5,3.5)||Cc(px,q,6.5,6.5,2.5)||Cc(px,q,25.5,6.5,2.5)||Cc(px,q,16,0.8,3)||E(px,q,7.5,11,2.6,5)||E(px,q,24.5,11,2.6,5);
const front=(px,q)=>E(px,q,16,5.5,9,3)||Cc(px,q,10.5,8.5,1.3)||Cc(px,q,13.5,8.8,1)||Cc(px,q,18,8.6,1.2)||Cc(px,q,21.5,8.2,1)||seg(px,q,15,6.5,11,11.5).d<=0.7||seg(px,q,17,6.5,19,9).d<=0.7||E(px,q,8,12,1.5,3.6)||E(px,q,24,12,1.5,3.6);
function pix(x,y,pose){const px=x+.5,q=y+.5-2;const dy={crouch:6,tuck:16}[pose]||0;const u=q-dy,r=Math.floor(u);let c=null;
if(back(px,u))c='H';
if(E(px,u,7.3,16,1.5,2.6)||E(px,u,24.7,16,1.5,2.6))c=(x===7||x===24)?'s':'S';
if(Rr(px,u,13,22,19,29))c='S';
if(Rr(px,u,6,28,26,pose==='tuck'?46:52)||E(px,u,16,30,10.5,3))c='P';
if(pose==='idle'||pose==='blink'||pose==='crouch'){if(Rr(px,u,3,29,7,36)||Rr(px,u,25,29,29,36)||Rr(px,u,3.5,36,6,48)||Rr(px,u,26,36,28.5,48))c='P';if(Rr(px,u,3.5,48,6,50.5)||Rr(px,u,26,48,28.5,50.5))c='S'}
if(pose==='jump'){const a=seg(px,u,5,31,2.5,17),b=seg(px,u,27,31,29.5,17);if(a.d<=1.7)c=a.t<0.85?'P':'S';if(b.d<=1.7)c=b.t<0.85?'P':'S'}
if(pose==='fall'){const a=seg(px,u,5,31,0.5,34),b=seg(px,u,27,31,31.5,34);if(a.d<=1.7)c=a.t<0.85?'P':'S';if(b.d<=1.7)c=b.t<0.85?'P':'S'}
if(c==='P'&&u>=50&&u<52&&px>=6&&px<26)c='k';
if(c==='P'&&u>=42&&u<48&&px>=10&&px<22&&(u<43||px<11||px>=21))c='k';
const inT=(ax,ay,bx,by,cx,cy)=>{const d1=(px-bx)*(ay-by)-(ax-bx)*(u-by),d2=(px-cx)*(by-cy)-(bx-cx)*(u-cy),d3=(px-ax)*(cy-ay)-(cx-ax)*(u-ay);return !((d1<0||d2<0||d3<0)&&(d1>0||d2>0||d3>0))};
if(E(px,u,16,27.8,8,3)&&!E(px,u,16,27.2,4,2))c='p';
if((x===13||x===18)&&u>=30&&u<37)c='q';
if(pose==='idle'||pose==='blink'){if(Rr(px,q,8,52,24,56))c='L';if(Rr(px,q,8,56,15.5,74)||Rr(px,q,16.5,56,24,74))c=(x===14||x===17)?'l':'L';if(Rr(px,q,7,73,15.5,76)||Rr(px,q,16.5,73,25,76))c=(q>=75)?'G':'K'}
if(pose==='jump'||pose==='fall'){if(Rr(px,q,8,52,24,57))c='L';if(seg(px,q,11.5,54,10,72).d<=3.4||seg(px,q,20.5,54,22,72).d<=3.4)c='L';if(Rr(px,q,6.5,72,14,75)||Rr(px,q,18,72,25.5,75))c=(q>=74)?'G':'K'}
if(pose==='crouch'){if(Rr(px,q,8,58,24,61))c='L';if(seg(px,q,10.5,60,8.5,66).d<=3.4||seg(px,q,21.5,60,23.5,66).d<=3.4)c='L';if(seg(px,q,8.5,66,11,73).d<=3.1||seg(px,q,23.5,66,21,73).d<=3.1)c='L';if(Rr(px,q,7,73,15.5,76)||Rr(px,q,16.5,73,25,76))c=(q>=75)?'G':'K'}
if(pose==='tuck'){if(Rr(px,q,8,60,24,63))c='L';if(Rr(px,q,8,61,15,70)||Rr(px,q,17,61,24,70))c='L';if(E(px,q,11.5,60,3.8,3.4)||E(px,q,20.5,60,3.8,3.4))c='L';if(Rr(px,q,7.5,69,15.5,72)||Rr(px,q,16.5,69,24.5,72))c=(q>=71)?'G':'K';
const a=seg(px,u,5,30,6.5,34),b=seg(px,u,27,30,25.5,34);if(a.d<=1.8||b.d<=1.8)c='P';const fa=seg(px,u,6.5,34,10.5,44),fb=seg(px,u,25.5,34,21.5,44);if(fa.d<=1.4||fb.d<=1.4)c=(fa.d<=1.4?fa.t:fb.t)>0.8?'S':'P'}
if(E(px,u,16,15.5,8.5,10))c=u>=24?'s':'S';
if(front(px,u))c='H';
if(c==='H'&&u<14&&((x*2+y*3)%6===0))c='h';
if(c==='S'||c==='s'){const bl=pose==='blink';
if(r===13&&((x>=10&&x<=13)||(x>=18&&x<=21)))c='H';
if(r===12&&((x>=11&&x<=13)||(x>=18&&x<=20)))c='H';
if(r===14&&((x>=10&&x<=13)||(x>=18&&x<=21)))c='s';
if(r===15){if(bl){if((x>=10&&x<=13)||(x>=18&&x<=21))c='s'}else{if(x===10||x===13||x===18||x===21)c='W';if(x===11||x===12||x===19||x===20)c='E'}}
if(r===16&&!bl&&(x===11||x===12||x===19||x===20))c='E';
if((r===17||r===18)&&x===17)c='s';
if(r===20&&(x===14||x===17))c='s';
if(r===21&&(x===12||x===19))c='M';
if(r===22&&x>=13&&x<=18)c='M';
if(r===23&&x>=14&&x<=17)c='m'}
return c}
function render(p){let o='';for(let y=0;y<78;y++){let x=0;while(x<32){const c=pix(x,y,p);let n=1;while(x+n<32&&pix(x+n,y,p)===c)n++;if(c)o+='<rect x="'+x+'" y="'+y+'" width="'+n+'" height="1.02" fill="'+COL[c]+'"/>';x+=n}}return '<svg viewBox="0 0 32 78" width="36" height="88" preserveAspectRatio="none" aria-hidden="true">'+o+'</svg>'}
const SP={};['idle','blink','jump','crouch','tuck','fall'].forEach(p=>SP[p]=render(p));
