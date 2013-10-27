var Ca315Articl=new Object();

Ca315Articl={
	$:function(v){return document.getElementById(v)},
	getEles:function(id,ele){return this.$(id).getElementsByTagName(ele);},
	tabId:"sildPicBar",
	tabDot:"dot",
	tabBox:"cnt-wrap",
	tabSilder:"cnt",
	tabSilderSon:"li",
	comtList:"ComList",
	rightBorder:"silidBarBorder",
	Count:function(){return this.getEles(this.tabSilder,this.tabSilderSon).length},
	Now:0,
	isCmt:true,
	isSild:true,
	timer:null,
	site:'news',
	cmtId:'21572303',
	cmtBase:'comment5',
	sideTab:{heads:'tabTit',heads_ele:'span',bodys:'tabBody',bodys_ele:'ol'},
	SildTab:function(now){
		this.Now=Number(now);
		if(this.Now>Math.ceil(this.Count()/4)-1){
			this.Now=0;
		}else if(this.Now<0){
			this.Now=Math.ceil(this.Count()/4)-1;
		}
		if(parseInt(this.$(this.tabSilder).style.left)>-149*parseInt(this.Now*2)){
			this.moveR();}else{this.moveL();
		}
		for(var i=0;i<Math.ceil(this.Count()/4);i++){
				if(i==this.Now){
					this.getEles(this.tabId,"li")[this.Now].className="select";
				}else{
					this.getEles(this.tabId,"li")[i].className="";
				}
			}
		},
	moveR:function(setp){
		var _curLeft=parseInt(this.$(this.tabSilder).style.left);
		var _distance=50;if(_curLeft>-149*parseInt(this.Now*2)){
			this.$(this.tabSilder).style.left=(_curLeft-_distance)+"px";
			window.setTimeout("Ca315Articl.moveR()",1);
		}
	},
	moveL:function(setp){
		var _curLeft=parseInt(this.$(this.tabSilder).style.left);
		var _distance=50;
		if(_curLeft<-149*parseInt(this.Now*2)){
			this.$(this.tabSilder).style.left=(_curLeft+_distance)+"px";
			window.setTimeout("Ca315Articl.moveL()",1);
		}
	},
	pagePe:function(way){
		if(way=="next"){
			this.Now+=1;this.SildTab(this.Now);
		}else{
			this.Now-=1;this.SildTab(this.Now);
		}
	},
	smallCk:function(){
		for(var i=0;i<Math.ceil(this.Count()/4);i++){
			if(i==0){
				this.$(this.tabDot).innerHTML+="<li class='select' onclick='Ca315Articl.SildTab("+i+")'></li>";
			}else{
				this.$(this.tabDot).innerHTML+="<li onclick='Ca315Articl.SildTab("+i+")'></li>";
			}
		}
	},
	TabChang:function(){
		var eles=this.getEles(this.sideTab.heads,this.sideTab.heads_ele);
		var body=this.getEles(this.sideTab.bodys,this.sideTab.bodys_ele);
		for(var i=0;i<eles.length;i++){
			(function(){
					  var p=i;eles[p].onmouseover=function(){
						  Ca315Articl._TabChang(p,body,eles);
					  }
			})();
		}
	},
	_TabChang:function(n,body,obj){
		for(var i=0;i<body.length;i++){
			if(i==n){body[n].className="block";
				obj[n].className="select";
			}else{
				body[i].className="none";
				obj[i].className="";
			}
		}
	},
	ComList:function(){
		/*TencntART.JsLoader.load('http://sum.comment.gtimg.com.cn/php_qqcom/gsum.php?site='+Ca315Articl.site+'&c_id='+Ca315Articl.cmtId+'',
								function(){
									setTimeout("_cbSum",0);
								});*/
	},
	setFont:function(n){
		this.$("Main-Article").style.fontSize=n+"px";},
		onload:function(){
			if(TencntART.Browser.moz){
				document.addEventListener("DOMContentLoaded",function(){
																	  Ca315Articl.ints()
															},null);
				}else{
				if(document.readyState=="complete"){
					Ca315Articl.ints();
				}else{
					document.onreadystatechange=function(){
						if(document.readyState=="complete"){
							Ca315Articl.ints();
						}
					}
				
			}
		}
	},
	ints:function(){
		if(this.isCmt){this.ComList();}
		if(this.isSild){
			this.$(this.tabBox).style.position="relative";
			this.$(this.tabSilder).style.position="absolute";
			this.$(this.tabSilder).style.left=0+"px";
			this.getEles(this.tabId,"span")[1].onclick=function(){
				Ca315Articl.pagePe("next");
			}
			this.getEles(this.tabId,"span")[0].onclick=function(){Ca315Articl.pagePe("pre");}
			this.smallCk();
		}
		Ca315Articl.$("fontCenter").style.color="#0B3B8C";
		
		this.$("fontBig").onclick=function(){
			Ca315Articl.$("fontSmall").style.color="#666";
			Ca315Articl.$("fontCenter").style.color="#666";
			Ca315Articl.$("fontBig").style.color="#0B3B8C";
			Ca315Articl.setFont(18);
		}
		
		this.$("fontCenter").onclick=function(){
			Ca315Articl.$("fontBig").style.color="#666";
			Ca315Articl.$("fontSmall").style.color="#666";
			Ca315Articl.$("fontCenter").style.color="#0B3B8C";
			
			Ca315Articl.setFont(14);
		}
		
		this.$("fontSmall").onclick=function(){
			Ca315Articl.$("fontBig").style.color="#666";
			Ca315Articl.$("fontCenter").style.color="#666";
			Ca315Articl.$("fontSmall").style.color="#0B3B8C";
			Ca315Articl.setFont(12);
		}
	}
}
Object.beget=function(o){
	var F=function(){};
	F.prototype=o;
	return new F();
}

function copyLink(){
	try{
		var cText=document.location.toString();
		if(window.clipboardData){
			window.clipboardData.setData("Text",cText);
			alert("复制完成!");
		}else if(window.netscape){
			try{
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			}
			catch(e){
				alert("您的浏览器设置为不允许复制！\n如果需要此操作，请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true',再重试复制操作!");
				return false;
			}
			var clip=Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
			if(!clip)return;var trans=Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
			if(!trans){return;}
			trans.addDataFlavor('text/unicode');
			var str=new Object();
			var len=new Object();
			var str=Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		str.data=cText;trans.setTransferData("text/unicode",str,cText.length*2);
			var clipid=Components.interfaces.nsIClipboard;
			if(!clip)return false;clip.setData(trans,null,clipid.kGlobalClipboard);
			alert("复制完成!");
		}
	}
	catch(e){}
}