$(function(){
	//ª√µ∆∆¨
	$(".tabs").tabs(".images > div", {
		effect: 'horizontal',//slide
		fadeInSpeed: 700,
		fadeOutSpeed: 700,
		rotate: true,
		autoplay : true,
		interval:7000
	}).slideshow();
	$(".tabs").data('slideshow').play();
	//—”≥Ÿº”‘ÿ
	var $container = $('#listBox');
	$(".scrollLoading").scrollLoading({
		callback: function() {
			$container.imagesLoaded(function(){
				$container.masonry('reload');
			});
		}
	});
	$(".firend_blogroll").mouseover(function(){
		$(".friend_title a").removeClass('friend_default');
		$(this).addClass("friend_default");
		$(".fFlist").show();
		$(".fNewlist,.fSeach").hide();
	});
	$(".firend_newlist").mouseover(function(){
		$(".friend_title a").removeClass('friend_default');
		$(this).addClass("friend_default");
		$(".fNewlist").show();
		$(".fFlist,.fSeach").hide();
	});
	$(".firend_seach").mouseover(function(){
		$(".friend_title a").removeClass('friend_default');
		$(this).addClass("friend_default");
		$(".fSeach").show();
		$(".fNewlist,.fFlist").hide();
	});
	$(".rank_yuanchuang").mouseover(function(){
		$(".index_rank_title a").removeClass("rank_defult")	;
		$(this).addClass("rank_defult");
		$(".yc_rank").show();
		$(".sc_rank").hide();
	})
	$(".rank_shangchuan").mouseover(function(){
		$(".index_rank_title a").removeClass("rank_defult")	;
		$(this).addClass("rank_defult");
		$(".sc_rank").show();
		$(".yc_rank").hide();
	})
		
	$(".flow-box").mouseover(function(){
		$(this).css({'-moz-box-shadow':'0px 0px 2px #ddd','-webkit-box-shadow':'0px 0px 2px #ddd','box-shadow':'0px 0px 2px #ddd'});	
	}).mouseout(function(){
		$(this).css({'-moz-box-shadow':'0px 0px 2px #f4f4f4','-webkit-box-shadow':'0px 0px 2px #f4f4f4','box-shadow':'0px 0px 2px #f4f4f4'});		
	});
	$(".vipgaosu").click(function(){
		$.getJSON("http://www.58pic.com/test.php?m=index&a=vipcount",  function(ret) {});
	})
	//Ωªª•
	$(".index_rank_content,.newest-block").mouseover(function(){
		$(this).css({"background":"#f6f6f6"});
	}).mouseout(function(){
		$(this).css({"background":"#fff"});
	})
	$(".index_rank_right").click(function(){
		var url = $(this).attr('data');
		window.open(url,"_blank");
	})
	$(".newest-right").click(function(){
		var url = $(this).attr('data');
		window.open(url,"_blank");	
	})
});