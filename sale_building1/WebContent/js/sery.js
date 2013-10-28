suspendcode="<DIV id=lovexin1 style='Z-INDEX: 10; LEFT: 10px; POSITION: absolute; TOP: 50px; width: 110; height: 600px;'><img src='http://www.yandaco.com/zzjs/close.gif' onClick='javascript:window.hide()' width='100' height='14' border='0' vspace='3' alt='点击关闭广告'><br /><a href='http://www.yandajituan.com/shownews.asp?id=145' target='_blank'><img src='zzjs/2.jpg' width='110' height='600' border='0'></a></DIV>"
document.write(suspendcode);

suspendcode="<DIV id=lovexin2 style='Z-INDEX: 10; POSITION: absolute; TOP: 108px; width: 110; height: 600px;'></DIV>"
document.write(suspendcode);

lastScrollY=0;
function heartBeat(){
diffY=document.body.scrollTop;
percent=.3*(diffY-lastScrollY);
if(percent>0)percent=Math.ceil(percent);
else percent=Math.floor(percent);
document.all.lovexin1.style.pixelTop+=percent;
document.all.lovexin2.style.pixelTop+=percent;
lastScrollY=lastScrollY+percent;
}
function hide()  
{   
lovexin1.style.visibility="hidden"; 
lovexin2.style.visibility="hidden";
}
window.setInterval("heartBeat()",1);
