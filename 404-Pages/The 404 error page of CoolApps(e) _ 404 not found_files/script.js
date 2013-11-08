/*
 * Author: Axel BELUJON
 */

var offset;
var path = "http://www.404notfound.fr/";

$(function(){
	// IE targetting
	var ie, version;
	if($.browser.msie){
		ie = true;
		version = $.browser.version;
		if(version.substr(0, 1) == "7"){
			//$('.overlike').css("margin-left", "-225px");
		}
	}else{
		ie = false;	
	}
		   
    // Show the pages

    $('.pages').animate({"opacity":"1"}, 400);
	if(ie){
		$('.pages').css("display", "block");
		$('.page').children("a").children('.overlike').hide();
	}

    
    // Highlight the menu element

    var bodyID = $("body").attr("id");
	
    switch(bodyID){
        case "bodysubmit":
            $("#submitLink").addClass("selected");
            break;
        case "bodytags":
            $("#tagsLink").addClass("selected");
            break;
        case "bodysaloon":
            $("#saloonLink").addClass("selected");
            break;
        default:
            break;
    }

    $('.page').live("mouseover", function(){
        $(this).children("a").children(".overlike").stop().animate({"opacity": ".9"}, 300);
		if(ie){$(this).children("a").children('.overlike').stop().show();}
    }).live("mouseout", function(){
        $(this).children("a").children(".overlike").stop().animate({"opacity": "0"}, 300);
		if(ie){$(this).children("a").children('.overlike').stop().hide();}
    })

    //Tag open on click
    var opened = false;

    $('.tagOpen').click(function(){
        if(!opened){
            $('header').stop().animate({"margin-top": "0"}, 500);
            opened = true;
            $('#menu nav li.tagOpen').addClass("selected");
        }else{
            $('header').stop().animate({"margin-top": "-388px"}, 500);
            opened = false;
            $('#menu nav li.tagOpen').removeClass("selected");
        }
        return false;
    });

    // Back to top button
    $('#back-top').click(function(){
        $('html,body').stop().animate({scrollTop: "0px"}, 1000);
        return false;
    });

    var exSource = "";

    // Hover on buttons
    $('.hover').mouseover(function(){
       var source = $(this).attr("src");
       exSource = source;
       var pos = source.lastIndexOf(".");
       var newSource = source.substr(0, pos) + "-hover" + source.substr(pos);
       $(this).attr("src", newSource);
    }).mouseout(function(){
       $(this).attr("src", exSource);
    });

    // Tags
    $('.pagetag').click(function(){
       var link = $(this).children("a").attr("href");
       document.location = link;
    });

    // Notif
    $('#notifclose #closebtn').click(function(){
       $("#notif").stop().animate({"margin-top": "-44px"}, 300);
    });


    // Menu change
    $('#menu nav li').click(function(){
       var link = $(this).children("a").attr("href");
       document.location = link;
    });

    $('#menu nav li').mouseover(function(){
       $(this).children('a').css("color", "#be5327 !important");
    }).mouseout(function(){
       if(!$(this).hasClass("selected"))
            $(this).children('a').css("color", "#fff !important");
    });

    //if(window.location.host == "www.404notfound.fr"){
        $('.pages').masonry({
            singleMode: true,
            columnWidth: 240,
            itemSelector: '.page',
            resizeable: true,
            animate: true,
            easing: 'swing',
            cornerMaskSelector: '.add'
        }, function(){
            offset = $('#scrollreper').offset();
        });
    //}
	
	// Pagination on bottom
	
	if($("body").attr("id") == "bodyhp"){
    	var pagination = $("#pagination-bottom");
    	pagination.slideUp(0);
    	
    	var windowHeight = $(window).height();
    	var bodyHeight   = $("body").height();
		console.log($("body").height());
    	
    	if(windowHeight >= bodyHeight){ // Everything's visible
    	    pagination.slideDown(500);
    	}
		
		$(window).resize(function(){
	    	if($(window).height() >= bodyHeight){ // Everything's visible
				pagination.slideDown(500);
			}
		});
    	
    	$(window).scroll(function(){
    	    //console.log($(window).scrollTop());
    	    if($(window).scrollTop() > 100){
    	        pagination.slideDown(500);
    	    }else{
    	        pagination.slideUp(500);
    	    }
    	});
    }

    // Search bar
    $('#searchfield').focus(function(){
       if($(this).val() == "Search"){
           $(this).val("");
       }
    }).blur(function(){
        if($(this).val() == ""){
           $(this).val("Search");
       }
    }).keyup(function(){
        // AJAX auto completion
        var link = $("#searchform").attr("action") + "/autocompletion";
        var txt = $("#searchfield").val();

        $.ajax({
            url: link,
            data: "string="+txt,
            type: "POST",
            success: function(resp){
                // resp is the current search
                var respTab = resp.split("#");

                $("#searchfield").autocomplete({
                    source: respTab
				});
            }
        });
    });

    // Badges GET IT
    $('.getit-btn').click(function(){
        var link = $(this).attr("href");
        $('.getit-link').attr("href", link);
        $("#getit-window").show(300);
        setTimeout(function(){ $('#getit-int').animate({"opacity": "1"}); }, 400);

        return false;
    });

    $('#getit-close').click(function(){
        $('#getit-int').animate({"opacity": "0"}, 300);
        setTimeout(function(){ $("#getit-window").hide(300); }, 200);
    });

    // Slider on the bottle

    $("#slider").slider({
        animate: 1500,
        stop: function(event, ui) {
            var value = $("#slider").slider("value");
			
            if(value == "100"){
                var addr = $('#page-to-submit').val();

                $.ajax({
                    url: document.location + "/sendmail",
                    data: "pagesub="+addr,
                    type: "POST",
                    success: function(resp){
                        var txt = resp;
                        $('#notiftxt').empty().append(resp);
                        $("#notif").stop().animate({"margin-top": "0"}, 300).delay(5000).animate({"margin-top": "-44px"}, 300);
						
                        if(resp == "Your 404 was successfully submitted, let’s see if the staff likes it! Thanks!"){
                            setTimeout(function(){ document.location = "/"; }, 4000 );
                        }else{
                            $("#slider").slider( "value", 60, true );
                        }
                    }
                });
            }
        }
    });

    // Like a page

    $('#ctl').click(function(){
        var idPage = $(this).children('#nbLike').children('a').attr('id');
        var likeurl = path + "like/" + idPage;

        $.ajax({
            url: likeurl,
            success: function(resp){
                if(resp == "Already liked"){
                    $('#notiftxt').empty().append("You've already liked this page. But thanks for trying ;)");
                    $("#notif").stop().animate({"margin-top": "0"}, 300).delay(5000).animate({"margin-top": "-44px"}, 300);
                }else{
                    $('#nbLike a').empty().css("opacity", "0").append(resp).animate({"opacity": "1"}, 500);
                }
            }
        });

        return false;
    });

    // Tags selection
    $('#tag-list li').click(function(){
       $(this).toggleClass("selected");
    });



    $('#cancel-btn').click(function(){
       $('#tag-list li').each(function(){
          $(this).removeClass("selected");
       });
	   
       $('header').stop().animate({"margin-top": "-388px"}, 500);
       opened = false;
       $('#menu nav li.tagOpen').removeClass("selected");
       return false;
    });

    $("#searchtag").submit(function(){
       var tab = "";

       // Get a tab of all the selected tags
       $("#tag-list li.selected").each(function(){
            tab += $(this).children(".tagname").html() + "|";
       });

       $(this).children("#tagsinput").val(tab);

       if(tab == ""){
           $('#notiftxt').empty().append("You have to select at least one tag!");
           $("#notif").stop().animate({"margin-top": "0"}, 300).delay(5000).animate({"margin-top": "-44px"}, 300);
           return false;
       }
    });
    
});

