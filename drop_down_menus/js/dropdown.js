$(document).ready(function(){
	$('ul.one').hide();
	
	//Open Menu
	$('.nav li').hover(
	function(){
		var openMenu= $(this).children('ul.one');
		$(openMenu).show();
	},
	function(){
		var openMenu= $(this).children('ul.one');
		$(openMenu).hide();
	});
	
	//Open Sub Menu
	$('.one#sub-menu').css({
		'left':'80%',
		'top':'0'
	});
	$('.one li').hover(
	function(){
		var subMenu=$(this).children('.one#sub-menu');
		$(subMenu).css({
			'left':'100%',
			'top':'-20%'
		})
	});
	
	//Links - Pading left
	$('#links .link-block li').hover(
	function(){
		var aTag= $(this).children('a');
		$(aTag).animate({paddingLeft:'14px'},100);
	},
	function(){
		var aTag= $(this).children('a');
		$(aTag).animate({paddingLeft:'6px'},150);
	});
});