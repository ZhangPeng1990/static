/*!
 * 博爱首页 jQuery 交互定义文件
 * URL: http://www.boai.com/
 *
 * Name:    
 * Version: 1.0
 * Author:  wang Liangliang
 * QQ:      254555778
 * Home:    www.boai.com
 * Pubdate: 2011-11-28
 * Update : 2011-12-02 23:23:34
 * Copyright 2011, DEC 12
 * 注意：该文件为博爱首页专用 jQuery 互动效果定义集合，未经同意请勿修改！
*/
$(function(){
	//关注博爱 下拉框定义
	$(".atten").mouseover(function(){$(this).children("ul").show()}).mouseout(function(){$(this).children("ul").hide()});
	//导航下拉菜单定义
	$(".subnav ul li").mouseenter(function(){$(this).children(".demo").show();}).mouseleave(function(){$(this).children(".demo").hide()});
	$(".subnav ul > li > a").addClass("tb3");
	$(".subnav ul li").mouseenter(function(){$(this).addClass("tb1");$(this).children("a").removeClass("tb3").addClass("tb2");}).mouseleave(function(){$(this).removeClass("tb1");$(this).children("a").addClass("tb3").removeClass("tb2");});
	//关于博爱切换定义
	$(".jiuz li:eq(0)").show().siblings().hide();
	$(".boai li:eq(0)").addClass("bg1");
	$(".boai li:eq(0)").mouseover(function(){$(this).addClass("bg1").siblings().removeClass("bg2")});
	$(".boai li:eq(1)").mouseover(function(){$(this).addClass("bg2").siblings().removeClass("bg1")});
	$(".boai li").hover(function(){var $index=$(".boai li").index(this);$(".jiuz li").eq($index).show().siblings().hide()});
	//医院动态、媒体报道切换
	$(".dyna_d > li:eq(0)").show().siblings().hide();
	$(".dyna_t > li:eq(0)").addClass("bg3").siblings().addClass("bg4");
	$(".dyna_t > li").hover(function(){$(this).addClass("bg3").removeClass("bg4").siblings().addClass("bg4").removeClass("bg3");
		var $index=$(".dyna_t > li").index(this);$(".dyna_d > li").eq($index).show().siblings().hide();
	});
	//党员示范岗切换/疾病和症状查询
	$(".model_d").find("li:eq(0)").show().siblings().hide();
	$(".model_t").find("li:eq(0)").addClass("bg5");
	$(".model_t").find("li:eq(0)").hover(function(){$(this).addClass("bg5").siblings().removeClass("bg6")});
	$(".model_t").find("li:eq(1)").hover(function(){$(this).addClass("bg6").siblings().removeClass("bg5")});
	$(".model_t > li").hover(function(){var $index=$(".model_t > li").index(this);$(".model_d > li").eq($index).show().siblings().hide()});
	//新浪微博、腾讯微博切换
	$(".wb_d > li:eq(0)").show().siblings().hide();
	$(".wb_t > li:eq(0)").addClass("bg11").siblings().addClass("bg12");
	/*
	$(".wb_t > li").hover(function(){$(this).addClass("bg11").removeClass("bg12").siblings().addClass("bg12").removeClass("bg11");
		var $index=$(".wb_t > li").index(this);$(".wb_d > li").eq($index).show().siblings().hide();
	});
	*/
	//专家推荐、科室介绍、最新动态
	$(".d1").find("li:eq(1)").css("text-indent","2em");
	$(".d1").find("li:eq(0)").show().siblings().hide();
	$(".t1").find("li:eq(0)").addClass("bg13").siblings().addClass("bg14");
	$(".t1 > li").hover(function(){$(this).addClass("bg13").removeClass("bg14").siblings().addClass("bg14").removeClass("bg13");
		var $index=$(".t1 > li").index(this);$(".d1 > li").eq($index).show().siblings().hide();
	});
	//精品项目类切换
	$(".pd").find("li:eq(0)").show().siblings().hide();
	$(".pt").find("li:eq(0)").addClass("bg15").siblings().addClass("bg16");
	$(".pt li").hover(function(){$(this).addClass("bg15").removeClass("bg16").siblings().addClass("bg16").removeClass("bg15");
		var $index=$(".pt li").index(this);$(".pd li").eq($index).show().siblings().hide();
	});
	//变美丽、变健康切换
	$(".ch_d > li:eq(0)").show().css({"border":"1px solid #B9D6DF","border-left":"none"}).siblings().hide().css({"border":"1px solid #B9D6DF","border-left":"none"});
	$(".ch_t > li:eq(0)").addClass("bg7");$(".ch_t > li:eq(1)").addClass("bg10");
	$(".ch_t > li:eq(0)").mouseover(function(){$(this).addClass("bg7").removeClass("bg8");$(".ch_t > li:eq(1)").removeClass("bg9").addClass("bg10");});
	$(".ch_t > li:eq(0)").mouseout(function(){$(".ch_t > li:eq(1)").addClass("bg10").removeClass("bg9")});
	$(".ch_t > li:eq(1)").mouseover(function(){$(this).addClass("bg9").removeClass("bg10");$(".ch_t > li:eq(0)").removeClass("bg7").addClass("bg8");});
	$(".ch_t > li:eq(1)").mouseout(function(){$(".ch_t > li:eq(0)").addClass("bg8").removeClass("bg7")});
	//定义切换
	$(".ch_t > li").hover(function(){var $index=$(".ch_t > li").index(this);$(".ch_d > li").eq($index).show().siblings().hide();});
	//修改列表某行颜色
	$(".prefer li a:eq(0)").css("color","#E70000");
	$(".video li a:even").css("color","#f60");
	//外科、内科、耳鼻喉科、乳腺科、中医肝科上下切换
	$(".item").hide();$(".item:first").show();
	$("#accordion .hd:eq(0)").addClass("s1").siblings(".hd").addClass("s2");
	$("#accordion .hd").hover(function(){
		$(this).addClass("s1").removeClass("s2").siblings(".hd").addClass("s2").removeClass("s1");
		if($(this).next().is(":hidden")){$(".item").hide();$(this).next().show();}
		return false;
	});
	//友情链接切换
	$(".ft li:eq(0)").addClass("cft1");
	$(".fd li:eq(0)").show().siblings().hide();
	$(".ft li").hover(function(){$(this).addClass("cft1").siblings().removeClass("cft1");
		var $index=$(".ft li").index(this);$(".fd li").eq($index).show().siblings().hide();
	});
	//底部切换
	$(".fthd li:eq(0)").addClass("c11");
	$(".ftbd li:eq(0)").show().siblings().hide();
	$(".fthd li").hover(function(){$(this).addClass("c11").siblings().removeClass("c11");
		var $index=$(".fthd li").index(this);$(".ftbd li").eq($index).show().siblings().hide();
	});
});