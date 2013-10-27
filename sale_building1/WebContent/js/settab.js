function setTab(m,n){
	
 var tli=document.getElementById("menu"+m).getElementsByTagName("dt");
 var mli=document.getElementById("menu"+m).getElementsByTagName("dd");
 
 for(i=0;i<mli.length;i++){
  tli[i].className=i==n?"selct02":"";
  mli[i].style.display=i==n?"block":"none";
 }
}
function set(m,n){
 var tli=document.getElementById("me"+m).getElementsByTagName("span");
 var mli=document.getElementById("me"+m).getElementsByTagName("ul");
 for(i=0;i<tli.length;i++){
  tli[i].className=i==n?"selct03":"";
  mli[i].style.display=i==n?"block":"none";
 }
}