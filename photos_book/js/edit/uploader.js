///上传完成了多少张图片
var upload_num = 0;
//Flash快速上传控件
Uploader = {
    id: 'zip_uploader',
    userId: 0,
    bookId: 0,
    uploading: false,
    swfUrl: '../../flash/swf/uploader_file.swf?ver=20130524',
    uploadUrl: '/userimage/uploadfile',
    needRerfesh: false,
    contentHeight:528,
    fixMacSafari: function () {
        if ((window.navigator.userAgent.indexOf("Macintosh") > -1 && window.navigator.userAgent.indexOf("Safari") > -1)) {
            Uploader.swfUrl = '../../flash/swf/uploadimage_unzip.swf?ver=20130524';
            Uploader.contentHeight = 602;
            Uploader.uploadUrl = '/userimage/upload';
        }
    },
    show: function (userId, bookId, worksId) {
        Uploader.uploadingBar.hide();
        Uploader.needRerfesh = false;
        $("#uploader_dialog").show();
        window.onCompeled = function (objStr) {
            if (!objStr) {
                var obj = $.parseJSON(objStr.replace(/\\/g, "\\\\"));
                Uploader.onUploaded(obj);
            }
            Uploader.uploadingBar.hide(3000);
            Uploader.uploading = false;
        }
        window.onUploaded = function (objStr)
        {
            //alert(objStr);
            var obj = $.parseJSON(objStr.replace(/\\/g, "\\\\"));
            Uploader.onUploaded(obj);
        }
        window.onStartEdit = function () {
            Uploader.close();
            Uploader.min();
        }
        window.goEdit = function () {
            Uploader.close();
        }
        window.onStartUpload = function () {
            Uploader.uploading = true;
        }
        window.onProgress = function (p) {
            Uploader.onProgress(p);
        };
        Uploader.userId = userId || window.UserId;
        Uploader.bookId = bookId || window.BookId;
        Uploader.worksId = worksId || window.WorksId;
        Uploader.createContent();
        Uploader.addEvent();
    },
    onUploaded: function (obj) {
        upload_num++;
        //if (window.IsFirst == 1 && upload_num == 1) {
        //    EditorTips.firstUploaded.show();
        //}
        
        if (mimo.Editor && mimo.Editor.ThumbnailList) {
            mimo.Editor.ThumbnailList.addThumbnail(obj);
            Uploader.uploadingBar.updatePage();
        }

        if (window.FL_addThumbnail) {
            FL_addThumbnail(obj);
            Uploader.uploadingBar.updatePage();
        }
    },
    close: function () {
        Uploader.refreshImage();
        $("#uploader_dialog").css("margin-top", "-10000px");
        if (Uploader.uploading == true) {
            Uploader.uploadingBar.show();
        }
    },
    //上传进度条
    uploadingBar: {
        show: function () {
            $("#upload_bar_holder").fadeIn();
        },
        hide: function (time) {
            if (time) {
                setTimeout(function () {
                    $("#upload_bar_holder").fadeOut();
                }, time);
            }
            else {
                $("#upload_bar_holder").fadeOut();
            }
        },
        updatePage: function () {
            var p = parseInt($("#upload_totalPage").text()) + 1;
            $("#upload_totalPage").text(p);
        }
    },
    min: function () {
        $(".uploader_dialog_min").show();
        Uploader.close();
    },
    //正在上传（返回当前进度百分比）
    onProgress: function (p) {
        $("#bar_percent").text(p);
        $("#upload_curr_bar").css("width", (p * 2) + "px");
        if (p == 100) { Uploader.uploading = false; $("#upload_curr_bar").css("width", "200px"); Uploader.uploadingBar.hide(5000); }
    },
    refreshImage: function () {
        if (!Uploader.needRerfesh) {
            return;
        }
        if (window.loadPhotoList) {
            loadPhotoList();
            return;
        }
        if (window.Editor && Editor.Tool.imageViewPanel) {
            Editor.Tool.imageViewPanel.emptyPanel();
            Editor.Tool.imageViewPanel.getPhotoView();
        }
    },
    createContent: function () {
        //设置位置
        var item = $("#uploader_dialog");
        var topPx = ($(window).height() / 2 - item.height() / 2) + $(document).scrollTop();
        if (topPx < 10) {
            topPx = 10;
        }
        item.css({
            "top": topPx + "px"
        });
        var isInit = item.attr("is_init");
        item.css("margin-top", "");
        if (!isInit) {
            Uploader.insertFlash();
            item.attr("is_init", "true");
        }
    },
    addEvent: function () {
        $("#uploader_dialog .uploader_close").click(function (e) {
            e.preventDefault();
            Uploader.close();
        });

        $("#uploader_dialog .uploader_min, #uploader_dialog .go_edit").click(function (e) {
            e.preventDefault();
            Uploader.min();
        });

        $(".uploader_dialog_min,#bar_outer").click(function (e) {
            e.preventDefault();
            $(".uploader_dialog_min").hide();
            Uploader.show();
        });
    },
    insertFlash: function () {
        // For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection. 
        var swfVersionStr = "10.2.0";
        // To use express install, set to playerProductInstall.swf, otherwise the empty string. 
        var xiSwfUrlStr = "playerProductInstall.swf";

        var flashvars = {};
        if (window.location.host.indexOf("mimoprint.com") > -1) {
            flashvars.uploadUrl = "http://upload.mimoprint.com" + Uploader.uploadUrl;
        } else {
            flashvars.uploadUrl = "http://" + window.location.host + Uploader.uploadUrl;
        }
        flashvars.userId = Uploader.userId;
        flashvars.worksId = Uploader.worksId;
        flashvars.bookId = Uploader.bookId;
        flashvars.maxCount = 200;

        var params = {};
        params.quality = "high";
        params.bgcolor = "#ffffff";
        params.allowfullscreen = "true";
        params.allowScriptAccess = 'always';
        params.wmode = "transparent";
        params.movie = Uploader.swfUrl;
        params.hasPriority = "true";

        var attributes = {};
        attributes.id = Uploader.id;
        attributes.name = Uploader.id;
        attributes.align = "middle";

        swfobject.embedSWF(
            Uploader.swfUrl, Uploader.id,
            "900", "536",
            swfVersionStr, xiSwfUrlStr,
            flashvars, params, attributes);
        // JavaScript enabled so display the flashContent div in case it is not replaced with a swf object.
        //swfobject.createCSS("#flashContent", "display:block;text-align:left;");   
    },
    extend: {
        data: {
            uploader_dialog_Id: '#uploader_dialog', //上传框容器
            uploader_dialog_nav: 'div.upload_type_list .nav', //弹出框顶部分类标签
            nav_qq_Id: '#qqupload',   //QQ上传nav
            tip_pos_Id: '#mod_thumbnail_btn_prev', //上传完成弹出提示位置
            tip_Id: '#upload_tips',  //弹出提示id
            IS_UPLOADING: false //是否正在上传
        },
        initDialog: function (role, opentype, filename) {
            Uploader.fixMacSafari();
            mimo.Loader.importStyle("../../styles/css/edit/upload.css", "");
            //上传弹出框html
            var uploader_dialog_html = '<!--图像上传-->'
            + '<div id="uploader_dialog" class="uploader_dialog" style="margin-top: -10000px;display: none; position:absolute;">'
                + '<div class="uploader_dialog_title">'
                       + '<a class="uploader_close" href="javascript:;"></a>'
                    + '<h2 style="width: 500px;">1.您正在制作的是照片书产品，最多可上传500张相片。2.单次最多可选择80张相片</h2>'
                + '</div>'
                + '<div class="uploader_dialog_content" style="position:relative;height:' + Uploader.contentHeight + 'px;">'
                    + '<p style="position:absolute;left:217px;top:20px; font-size:12px;">如果您普通上传看不到东西,可能是由于Flash插件太旧或者没安装导致,请点击<a style="color:blue;" href="http://www.adobe.com/go/getflash" targer="_blank">这里</a>安装或升级，安装完成后重新打开本页面即可。</p>'
                    + '<div class="upload_type_list">'
                        + ''
                     + '</div>'
                     + '<div class="upload_item_list">'
                    + '<div class="upload_item_show" id="upload_flash">'
                        + '<div class="zip_uploader">'
                            + '<div id="zip_uploader"><h1 style="font-size:20px;">您还没有安装Flash播放器,请点击<a style="color:blue;" href="http://www.adobe.com/go/getflash" targer="_blank">这里</a>安装，安装完成后重新打开本页面即可。</h1></div>'
                        + '</div>'
                    + '</div>'
                   + '</div>'
             + '</div>'
        + '</div>'
        + '<!--图像上传最小化-->'
        + '<div class="uploader_dialog_min" style="display: none;">'
            + '<span>上传图像中...<span id="uploader_dialog_min_progress">30</span>%</span>'
        + '</div>';

            //QQ上传头部导航
            var nav_qq = '<div class="nav" ref="#upload_qq" id="qqupload" title="QQ传送">QQ传送</div>';
            var nav_qq_content = '\
                <div class="upload_item_show" style="top: -523px; display: none;overflow-y:scroll;" id="upload_qq">\
                    <div class="upload_item_content">\
                        <ul class="upload_qq_tab">\
                            <li><a id="zip" class="cur" href="#">以压缩文件方式</a></li>\
                            <li><a id="floder" href="#">以文件夹方式</a></li>\
                        </ul>\
                        <div class="upload_item_tips tab_floder" style="display:none;">\
                            <h2>文件夹方式:</h2>\
                            <p>实时看到上传的图片,传送一张系统自动拉取一张,支持<b>边编辑边上传</b>。<br />\
                               开始传送后，可以关闭本弹出框。每当一张图片传送成功后，在编辑器顶部可以看到成功上传的图片。<br />\
                              【PS:推荐着急编辑的用户使用】\
                            </p>\
                        </div>\
                        <div class="upload_item_tips tab_zip">\
                            <h2></h2>\
                            <p>推荐加QQ：1204055612 为好友，用离线文件方式传送，压缩包最大不能超过2G。过大请分批传送。\
                                <br />【PS:必须加QQ好友，才能发送离线文件哦。】\
                            </p>\
                        </div>\
                        <div class="upload_item_filename">\
                            <span class="action_name">压缩包名称：</span><input style="font-size:24px;letter-spacing:2px;" /><a href="#" class="btn_copy"></a><a href="tencent://message?uin=1204055612" class="btn_send"></a><span>(上传的文件或者文件夹名称必须和左边的数字一样才可以!!)</span>\
                        </div>\
                        <div class="upload_item_guide tab_zip">\
                            <h2>以下是"以压缩文件方式传送"示例</h2>\
                            <div class="upload_item_section">\
                                <h2><i class="upload_item_section_step1"></i><b>新建文件夹</b>,并以上面提供的名称命名</h2>\
                                <img  src="/static/images/upload/upload_qq_zip_1.jpg"/>\
                            </div>\
                            <div class="upload_item_section">\
                                <h2><i class="upload_item_section_step2"></i>将要上传的图片，<b>复制到</b>刚才创建的文件夹内</h2>\
                                <img  src="/static/images/upload/upload_qq_zip_2.jpg"/>\
                            </div>\
                            <div class="upload_item_section">\
                                <h2><i class="upload_item_section_step3"></i>在文件夹点击鼠标右边，选择添加到“xxx.rar”，<b>压缩文件夹</b>（支持rar、zip等格式）。</h2>\
                                <img  src="/static/images/upload/upload_qq_zip_3.jpg"/>\
                            </div>\
                            <div class="upload_item_section">\
                                <h2><i class="upload_item_section_step4"></i><b>发送到QQ号码</b>：1204055612 <a href="tencent://message?uin=1204055612">[点击发送]</a></h2>\
                                <img  src="/static/images/upload/upload_qq_zip_4_2.jpg"/>\
                            </div>\
                        </div>\
                        <div class="upload_item_guide tab_floder" style="display:none;">\
                            <h2>以下是"以文件夹方式传送"示例</h2>\
                            <div class="upload_item_section">\
                                <h2><i class="upload_item_section_step1"></i><b>新建文件夹</b>,并以上面提供的名称命名</h2>\
                                <img  src="/static/images/upload/upload_qq_zip_1.jpg"/>\
                            </div>\
                            <div class="upload_item_section">\
                                <h2><i class="upload_item_section_step2"></i>将要上传的图片，<b>复制到</b>刚才创建的文件夹内</h2>\
                                <img  src="/static/images/upload/upload_qq_zip_2.jpg"/>\
                            </div>\
                            <div class="upload_item_section">\
                                <h2><i class="upload_item_section_step3"></i><b>发送到QQ号码</b>：1204055612 <a href="tencent://message?uin=1204055612">[点击发送]</a></h2>\
                                <img  src="/static/images/upload/upload_qq_floder_3_2.jpg"/>\
                            </div>\
                        </div>\
                    </div>\
                </div>';

            //email上传头部导航
            var nav_email = '<div class="nav" ref="#upload_email" id="emailupload" title="邮件传送">邮件传送</div>';
            var nav_email_content = '\
                <div class="upload_item_show" style="top: -523px; display: none;overflow-y:scroll;" id="upload_email">\
                    <div class="upload_item_content">\
                        <div class="upload_item_tips">\
                            <h2>邮件传送:</h2>\
                            <p>利用QQ邮箱大附件稳定，速度快等优点，可以帮您节省上传时间，减少上传出错概率，推荐作品图片多，普通上传不稳定的用户使用。<br />\
            我们每天定时10:00, 15:00, 18:00, 21:00, 23:00会定时处理邮件上传<br />\
            处理完会邮件通知您，您就可以开始编辑作品。\
                             </p>\
                         </div>\
                         <div class="upload_item_filename">\
                             <span>压缩包名称：</span><input style="font-size:24px;letter-spacing:2px;" /><a href="#" class="btn_copy"></a><a target="_blank" href="http://mail.qq.com" class="btn_send"></a><span>涉恶大幅度</span>\
                         </div>\
                         <div class="upload_item_emailtitle">\
                            <span class="tips1">温馨提醒，邮件标题请用：</span><span class="tips2" id="file_name">米莫印品-邮件传送-2222</span>\
                        </div>\
                         <div class="upload_item_guide">\
                             <h2>以下是"以邮件传送"示例</h2>\
                             <div class="upload_item_section">\
                                 <h2><i class="upload_item_section_step1"></i><b>新建文件夹</b>,并以上面提供的名称命名</h2>\
                                 <img  src="/static/images/upload/upload_qq_zip_1.jpg"/>\
                             </div>\
                             <div class="upload_item_section">\
                                 <h2><i class="upload_item_section_step2"></i>将要上传的图片，<b>复制到</b>刚才创建的文件夹内</h2>\
                                <img  src="/static/images/upload/upload_qq_zip_2.jpg"/>\
                            </div>\
                            <div class="upload_item_section">\
                                <h2><i class="upload_item_section_step3"></i>在文件夹点击鼠标右边，选择添加到“xxx.rar”，<b>压缩文件夹</b>（支持rar、zip等格式）。</h2>\
                                <img  src="/static/images/upload/upload_qq_zip_3.jpg"/>\
                            </div>\
                            <div class="upload_item_section">\
                                <h2><i class="upload_item_section_step4"></i><b>发送到QQ邮箱</b>：<a target="_blank" href="http://mail.qq.com">1204055612@qq.com</a> <a target="_blank" href="http://mail.qq.com">[点击跳转到QQ邮箱]</a></h2>\
                                <img  src="/static/images/upload/upload_qq_mail_3.jpg"/>\
                            </div>\
                        </div>\
                    </div>\
                </div>';

            var nav_flash = '<div class="nav on" ref="#upload_flash" title="flash 上传">普通上传</div>';

            var $dialog = $(uploader_dialog_html);
            $dialog.find(".upload_type_list").append(nav_flash);
            $dialog.find(".upload_type_list").append(nav_qq);
            $dialog.find(".upload_item_list").append(nav_qq_content);
            //$dialog.find(".upload_type_list").append(nav_email);
            //$dialog.find(".upload_item_list").append(nav_email_content);

            if ($("body").find(this.data.uploader_dialog_Id).length == 0) {
                $("body").append($dialog);
            }

            $(".upload_item_filename input").val(filename);
            $("#file_name").text("米莫印品-邮件传送-" + filename);
            //绑定事件
            //QQ上传
            $("#zip, #floder").click(function (e) {
                e.preventDefault();
                $("#zip, #floder").removeClass("cur");
                var btn = $(this);
                btn.addClass("cur");
                if (btn.attr("id") == "zip") {
                    $("#upload_qq .tab_floder").hide();
                    $("#upload_qq .tab_zip").show();
                    $("#upload_qq .upload_item_filename span.action_name").text("压缩包名称：");
                } else {
                    $("#upload_qq .tab_floder").show();
                    $("#upload_qq .tab_zip").hide();
                    $("#upload_qq .upload_item_filename span.action_name").text("文件夹名称：");
                }
            });

            //复制名称按钮
            $(".upload_item_filename .btn_copy").click(function (e) {
                e.preventDefault();
                prompt("请按 Ctrl+C 复制文本", filename);
            });
            
        },
        //上传完成弹出提示
        tip: function (num) {
            var that = this;
            var pos = $(that.data.tip_pos_Id).offset();
            $(that.data.tip_Id).text("+" + num + "张").show()
                                .css('z-index', 9999)
                                .css('left', pos.left + 40)
                                .css('top', pos.top)
                                .css('opacity', 0)
                                .animate({ opacity: 1, top: pos.top - 50 }, 1000)
                                .animate({ opacity: 0, top: pos.top - 100 }, 1000);
        },
        //实时获取最新上传数据
        getNewUpload: function (timer) {

            //实时调用手柄
            var handler = null;
            var that = this;
            var works_Id = window.WorksId;
            if (works_Id <= 0 || that.data.IS_UPLOADING == true) return false;

            clearInterval(handler);

            that.data.IS_UPLOADING = true;
            var data = {};
            var num = 0;
            data.works_Id = works_Id;
            data.time = (new Date()).valueOf();
            handler = setInterval(function () {
                $.ajax({
                    url: '/works/getupload',
                    type: 'GET',
                    dataType: 'json',
                    data: data,
                    success: function (Json) {
                        if (Json.ret == 1) {
                            num = Json.data.length;
                            that.tip(num);
                            $.each(Json.data, function (i, item) {
                                mimo.Editor.ThumbnailList.addThumbnail({ "ret": "1", "msg": "上传成功", "data": item });
                                Uploader.uploadingBar.updatePage();
                            });
                        }
                        if (Json.ret < 0) {
                            clearInterval(handler);
                            that.data.IS_UPLOADING = false;
                        }
                    },
                    error: function () {
                        that.data.IS_UPLOADING = false;
                    }
                });
            }, timer);
        },
        //上传显示
        uploadItemShow: function () {
            $("#upload_flash").css("top", "-10000px");
            $("#upload_qq,#upload_email").hide();
        },
        //操作事件
        event: function (role, opentype, filename) {
            var that = this;
            //初始化上传框
            that.initDialog(role, opentype, filename);
            // 上传框可以拖动
            $(that.data.uploader_dialog_Id).draggable({ handle: "div.uploader_dialog_title" });

            //分类栏目点击切换
            $(that.data.uploader_dialog_nav).click(function () {
                $(that.data.uploader_dialog_nav).removeClass("on");
                $(this).addClass("on");
                var id = $(this).attr("ref");
                that.uploadItemShow();
                if (id == "#upload_flash") {
                    $(id).css("top", "0px");
                } else {
                    $(id).css("top", "-472px").show();
                }
            });

            //QQ上传栏目实时更新最新上传图片
            $(that.data.nav_qq_Id).click(function () {
                that.getNewUpload(30000);
            });

            //默认显示QQ栏目
           // $("#qqupload").click();
        }
    }
}




/*
* 提示框
* @author yaobo
* @description 提示框
*/
var EditorTips = {
    tpl: {
        firstUploaded_tpl: '<div style="width: 535px; height: 290px; z-index: 10002; background: url(\'/static/images/pop_tips/editor_tip_03.png\')  no-repeat; position: absolute; ">'
                      + '<a href="javascript:;" title="关闭" id="colse" style="position: absolute; width: 34px; height: 34px;  right: 0px;"></a>'
                      + '<a href="javascript:;" title="下一步" id="btn_next" style="position: absolute; width: 93px; height: 34px;  right: 41px; bottom: 50px;"></a>'
                    + '</div>',
        maskLayer_tpl: '<div id="J_mask_layer" class="ui-mask-layer"></div>'
    },
    /*
* 定位
* @author yaobo
* @description 定位
*/
    setPosition: function (object, position, reference) {
        var refer = reference || document,
                isGlobal = (refer == document || refer == window) ? 1 : 0;
        var objWidth = object.outerWidth(),
                objHeight = object.outerHeight();
        var pos = position.split(","),
                xPos = pos[0],
                yPos = pos[1] || pos[0],
                x = isGlobal ? 0 : $(refer).offset().left,
                y = isGlobal ? 0 : $(refer).offset().top;
        switch (xPos) {
            case "center":
                object.css({
                    left: ($(refer).width() - objWidth) / 2 + x,
                    right: "auto"
                });
                break;
            case "left":
                object.css({
                    left: x,
                    right: "auto"
                });
                break;
            case "right":
                if (isGlobal) {
                    object.css({
                        left: "auto",
                        right: 0
                    });
                } else {
                    object.css({
                        left: x + $(refer).outerWidth() - objWidth,
                        right: "auto"
                    });
                }
                break;
            default:
                break;
        }
        switch (yPos) {
            case "center":
                var n = isGlobal ? 2.5 : 2;
                var top = refer == document ? (($(window).height() - objHeight) / n + $(document).scrollTop()) : (($(refer).height() - objHeight) / n + y);
                top = (refer == document && top < 0) ? 0 : top;
                object.css({
                    top: top,
                    bottom: "auto"
                });
                break;
            case "top":
                object.css({
                    top: y - objHeight,
                    bottom: "auto"
                });
                break;
            case "bottom":
                if (isGlobal) {
                    object.css({
                        top: "auto",
                        bottom: 0
                    });
                } else {
                    object.css({
                        top: y + $(refer).outerHeight(),
                        bottom: "auto"
                    });
                }
                break;
            default:
                break;
        }

        if (refer == window) {
            object.css({
                position: "fixed"
            });
        } else {
            object.css({
                position: "absolute"
            });
        }
    },
    /*
* 显示效果
* @author yaobo
* @description  显示效果
*/
    showEffect: function (panel, effect) {
        //设置弹出样式
        var speed = 300;
        switch (effect) {
            case "fade":
                panel.hide().fadeIn(speed);
                break;
            case "fadeDown":
                var top = parseInt(panel.css("top"));
                panel.css({
                    opacity: 0.5,
                    top: top - 20
                });
                panel.stop().show().animate({
                    opacity: 1,
                    top: top
                }, speed);
                break;
            case "slide":
                var height = panel.height();
                var top = parseInt(panel.css("top"));
                var over = panel.css("overflow");
                panel.css({
                    display: "none",
                    height: 0,
                    overflow: "hidden",
                    top: top + height
                });
                panel.stop().show().animate({
                    height: height,
                    top: top
                }, speed, function () {
                    panel.css({
                        overflow: over
                    });
                });
                break;
            case "sacle":
                var percent = 0.8;
                var height = panel.height();
                var width = panel.width();
                var top = parseInt(panel.css("top"));
                var left = parseInt(panel.css("left"));
                var over = panel.css("overflow");
                panel.css({
                    display: "none",
                    height: height * percent,
                    width: width * percent,
                    opacity: 0,
                    overflow: "hidden",
                    top: top + height * (1 - percent) / 2,
                    left: left + width * (1 - percent) / 2
                });
                panel.show().animate({
                    opacity: 1,
                    height: height,
                    left: left,
                    top: top,
                    width: width
                }, speed, function () {
                    panel.css({
                        overflow: over
                    });
                });
                break;
            default:
                panel.css({
                    opacity: 1
                }).show();
                break;
        }
    },
    /*
* 隐藏效果
* @author yaobo
* @description  隐藏效果
*/
    hideEffect: function (panel, effect) {
        //设置弹出样式
        var speed = 300;
        switch (effect) {
            case "fade":
                panel.fadeOut(speed);
                break;
            case "fadeDown":
                var top = parseInt(panel.css("top"));
                panel.stop().animate({
                    opacity: 0.5,
                    top: top + 20
                }, speed, function () {
                    panel.hide();
                });
                break;
            case "slide":
                var height = panel.height();
                var top = parseInt(panel.css("top"));
                panel.stop().animate({
                    height: 0,
                    top: top + height
                }, speed, function () {
                    panel.hide();
                    panel.css({
                        height: height,
                        top: top
                    })
                });
                break;
            default:
                panel.hide();
                break;
        }
    },
    /*
    * 获取遮罩层
* @author yaobo
* @description  获取遮罩层
*/
    showMask: function () {
        $("#J_mask_layer").remove();
        var height = Math.max($(document).height(), $(window).height());
        var $mask = $(EditorTips.tpl.maskLayer_tpl).css({
            position: 'absolute',
            left: 0,
            top: 0,
            display: 'none',
            height: height,
            background: '#000000',
            opacity: 0.5,
            zIndex: 10001,
            width: '100%'
        });
        $("body").append($mask);
        $mask.fadeIn();
    },
    /*
  * 隐藏遮罩层
  * @author yaobo
  * @description  隐藏遮罩层
  */
    hideMask: function () {
        $("#J_mask_layer").remove();
    },
    /*
    * 获取弹窗
    * @author yaobo
    * @description  获取遮罩层
    */
    getPopup: function (html, id) {
        if (id) {
            if ($("#" + id).length > 0) {
                return $("#" + id).eq(0);
            }
        }
        var $Popup = $(html).attr("id", id).hide();
        $("body").append($Popup);
        return $Popup;
    },

    //第一次上传成功
    firstUploaded: {
        show: function () {
            Uploader.close();
            var $pop = EditorTips.getPopup(EditorTips.tpl.firstUploaded_tpl, "firstUploaded");
            EditorTips.setPosition($pop, "center,center");
            EditorTips.showMask();
            EditorTips.showEffect($pop, "fade");
        },
        hide: function () {
            var $pop = $("#firstUploaded");
            EditorTips.hideMask();
            EditorTips.hideEffect($pop, "fade");
        },
        event: function () {
            var that = this;
            $("#firstUploaded").find("#colse").live("click", function () {
                that.hide();
            });
            $("#firstUploaded").find("#btn_next").live("click", function () {
                that.hide();
                Uploader.close();
            });
        }
    },
    event: function () {
        this.firstUploaded.event();
    }
};
//弹出提示注册事件
EditorTips.event();