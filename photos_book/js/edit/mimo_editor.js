"use strict"
/*
事件列表
    
    底部预览图被点击
        MIMO_PAGE_PREVIEW_THUMBNAIL_CLICK_EVENT
    文本框点击
        MIMO_TEXT_BOX_CLICK_EVENT
    背景颜色点击
        MIMO_BACKGROUND_COLOR_PICKER_EVENT
    文字颜色选择
        MIMO_TEXT_COLOR_PICKER_EVENT
    页面版式选择
        MIMO_PAGELAYOUT_PICKER_EVENT
    编辑书衣事件
     MIMO_EDIT_SPINE_EVENT
    编辑折页事件
    MIMO_EDIT_AUTHORINFO_EVENT
*/
var TRIM_LINE_HTML = '<div class="trim_line_top"></div><div class="trim_line_left"></div><div class="trim_line_bottom"></div><div class="trim_line_right"></div>';
var AUTHORINFO_TRIM_LINE_HTML = '<div class="trim_line_top"></div><div class="trim_line_bottom"></div><div class="trim_line_right"></div>';

// 书籍数据
var BOOK_DATA = null;

//毫米转化为像素
function mmToPx(mm) {
    var scale = 1;
    if (window.isView) {
        scale = 0.78;
    } else if (window.isWide) {
        scale = 0.56;
    } else if (window.isMpad) {
        scale = 0.86;
    }
    return Math.round((mm * 72 * (1 / 25.4)) * scale);
}


function mmToPxByDPI(mm, dpi) {
    if (!dpi) {
        dpi = 250;
    }
    return Math.round(mm * dpi * (1 / 25.4));
}
var isSpine = false;
/**
 * 编辑器
 * @author masa
 * @namespace mimo.Editor
 * @description 编辑器
 */
mimo.Editor = {
    //用户id
    userId: 0,
    //作品id
    worksId: 0,
    totalPage: 0,
    //最低页数
    minPage: 21,
    maxPage: 93,
    bootstrap: function () {
        mimo.Editor.initSubType();
        mimo.Editor.Common.init();
        mimo.Editor.showCreateGuide();
        mimo.Editor.initData();
        mimo.Editor.BackgroundPicker.init();
        mimo.Editor.PagelayoutPicker.init();
        mimo.Editor.PageEdit.init();
        mimo.Editor.ThumbnailList.init();
        mimo.Editor.TextEditor.init();
        mimo.Editor.PreviewList.init();
        mimo.Editor.ToolsBar.init();
        mimo.Editor.Preview.init();
        mimo.Editor.Checker.init();
        mimo.Editor.PageManager.init();
        mimo.Editor.ShowEndDate();
        mimo.Editor.addEvent();

        mimo.Editor.Tutorial.bootstrap();
        mimo.Editor.setBookName();

        if (window.location.href.indexOf("publish") > -1) {
            mimo.Editor.Checker.showStep1();
        }

    },
    //类型转换
    initSubType: function () {
        //类型识别
        if (window.ProductId == '1000') {
            window.isMini = true;
            window.create_guide_id = "step_create_mini";
            window.pagecount_selector = "#step_create_mini input[name=page_count_mini]";
            $("body").addClass("minibook");
        }
        else if (window.ProductId == '1001') {
            window.isView = true;
            window.create_guide_id = "step_create_view";
            window.pagecount_selector = "#step_create_view input[name=page_count_view]";
            $("body").addClass("viewbook");
        }
        else if (window.ProductId == '1004') {
            window.isWide = true;
            window.isSpine = true;
            window.create_guide_id = "step_create_wide";
            window.pagecount_selector = "#step_create_wide input[name=page_count_wide]";
            $("body").addClass("widebook");
        }
        else if (window.ProductId == '1005') {
            window.isMpad = true;
            window.isSpine = true;
            window.create_guide_id = "step_create_mpad";
            window.pagecount_selector = "#step_create_mpad input[name=page_count_mpad]";
            $("body").addClass("mpadbook");
            $("#inwrap").children(".sections").eq(0).css({ "padding": "30px 0px" });
        }
    },
    initData: function () {

        window.BOOK_DATA = window.JSONBookInfo

        // 把list转成hashmap
        BOOK_DATA.list = {};
        var item;
        for (var i = 0, len = BOOK_DATA.page_list.length; i < len; i++) {
            item = BOOK_DATA.page_list[i];
            BOOK_DATA.list[item.num] = item;
        }
        BOOK_DATA.list["author_info"] = BOOK_DATA.author_info;
        BOOK_DATA.list["copyright_info"] = BOOK_DATA.copyright_info;

        // 预览图
        window.JSONBookPreview.list = {};
        var item;
        for (var i = 0, len = JSONBookPreview.preview_list.length; i < len; i++) {
            item = JSONBookPreview.preview_list[i];
            JSONBookPreview.list[item.num] = item;
        }
    },
    showMaskLayout: function (opacity) {
        var maskLayout = $(".mask_layout")||$(document.body).append("<div class=\"mask_layout\" style=\"display: none;\"></div>");
        if (maskLayout.css("display") == "none") {
            maskLayout.css({
                "position": "absolute",
                "top": "0px",
                "left": "0px",
                "margin-left": "0px",
                "margin-top": "0px",
                "background-color": "#000000",
                "height": function () { return $(document).height(); },
                "filter": "alpha(opacity=80)",
                "opacity": opacity ? opacity : "0.8",
                "overflow": "hidden",
                "width": function () { return $(document).width(); },
                "z-index": "1000"
            });
            maskLayout.show();
            //maskLayout.fadeIn(200);
        }
    },

    hideMaskLayout: function () {
        var maskLayout = $(".mask_layout");
        if (maskLayout.css("display") == "none") {
            return;
        }
        maskLayout.hide();
        //$(".mask_layout").fadeOut(200);
    },

    // 显示上传器
    showUploader: function () {
        if (window.Uploader) {
            Uploader.show(window.UserId, window.BookId, window.WorksId);
        }
    },

    //显示提示
    showAlert: function (timeout, content) {
        var item = $("#action_success");
        //var topPx = ($(window).height() / 2 - item.height() / 2) + $(document).scrollTop();
        //item.css({
        //    "top": topPx + "px",
        //    "margin-left": "-" + item.width() / 2 + "px"
        //});
        //content = content || "保存成功";
        item.html(content);
        item.fadeIn('slow');
        if (timeout) {
            setTimeout(function () {
                item.fadeOut('slow');
            }, timeout);
        }
    },

    // 设置标题
    setBookName: function (name) {
        var l;
        name = name || window.BookName;
        if (name) {
            l = name.length < 20 ? name.len : 20;
            $("#works_title").html("《" + name.substr(0, l) + (name.length > 20 ? "..." : "") + "》");
        }
    },

    // 显示P数向导
    showCreateGuide: function () {
        if (window.IsFirst == 1) {
            mimo.Editor.Guider.bootstrap(window.ProductId);
        }
    },
    // 显示设置
    showSettting: function (e) {
        var pop = $("#pop_setting");
        var btn = $(e.currentTarget);
        var pos = btn.offset();
        
        if (pop.css("display") == "none") {
            pop.css({
                "left": pos.left + btn.width() / 2 - pop.width() / 2 + "px",
                "top": pos.top + btn.height() + 10 + "px"
            });
            pop.show();
        } else {
            pop.hide();
        }
        var sel = $("#select_page_p");
        var isInit = pop.attr("init");
        if (!isInit) {
            if (window.isMini) {
                sel.html('<option value="24">24P</option>\
                          <option value="36">36P</option>\
                          <option value="48">48P</option>');
            } else if(window.isView) {
                sel.html('<option value="24">24P</option>\
                          <option value="32">32P</option>\
                          <option value="48">48P</option>\
                          <option value="64">64P</option>\
                          <option value="80">80P</option>\
                          <option value="96">96P</option>');

            } else if (window.isWide) {
                sel.html('<option value="20">20P</option>\
                          <option value="28">28P</option>\
                          <option value="36">36P</option>\
                          <option value="48">48P</option>\
                          <option value="56">56P</option>\
                          <option value="64">64P</option>\
                          <option value="72">72P</option>\
                          <option value="96">96P</option>');
            }else if (window.isMpad) {
                sel.html('<option value="36">36P</option>\
                          <option value="48">48P</option>\
                          <option value="56">56P</option>\
                          <option value="64">64P</option>\
                          <option value="72">72P</option>\
                          <option value="80">80P</option>\
                          <option value="96">96P</option>');
            }
            $("#pop_setting .confirm").click(function (e) {
                e.preventDefault();
                mimo.Editor.PreviewList.changePage(sel.val());
                pop.hide()
            });

            $("#pop_setting .cancel").click(function (e) {
                e.preventDefault();
                pop.hide();
            });

            sel.bind("change", function (e) {
                var t = $(this);
                var p = t.val();
                $("#total_p_count").html(p);
                $("#edit_p_count").html(p - 3);

            });

            pop.attr("init", true);
        }

        // bind data
        var op = window.BOOK_DATA.page-0 + 3 ;
        $("#total_p_count").html(op);
        $("#edit_p_count").html(op - 3);
        sel.val(op);

    },

    // 显示截稿日期
    ShowEndDate: function () {
        var isFromPagemanger = location.search.indexOf("from_pagemanager") > -1;
        if (isFromPagemanger) {
            return;
        }
        if (window.EndDate) {
            $("#end_date").html('您的作品的截稿日期已经延长到 <b>' + window.EndDate + '</b>, 请抓紧时间完成作品出版哦!').show("slow");
            setTimeout(function () { $("#end_date").hide("slow") }, 5000);
        }
    },

    //添加事件
    addEvent: function () {
        var p = mimo.Editor;

        // 预览按钮事件
        $("#btn_preview").click(function (e) {
            e.preventDefault();
            p.Preview.show();
        });

        // 保存按钮事件
        $("#btn_save").click(function (e) {
            e.preventDefault();
            p.PageEdit.saveCurrentPage("toolsbar");
        });

        // 上传按钮
        $("#btn_upload").click(function (e) {
            e.preventDefault();
            p.showUploader();
        });

        // 设置
        $("#btn_setting").click(function (e) {
            e.preventDefault();
            mimo.Editor.showSettting(e);
            //window.location = "/order/step1?workId=" + window.WorksId;
        });

        // 印刷
        $("#btn_print").click(function (e) {
            e.preventDefault();
            mimo.Editor.Checker.showStep1();
            //window.location = "/order/step1?workId=" + window.WorksId;
        });

        // 检查
        $("#btn_check").click(function (e) {
            e.preventDefault();
            mimo.Editor.Checker.check();
            //window.location = "/order/step1?workId=" + window.WorksId;
        });

        //$("body").click(function (e) {
        //    e.preventDefault();
        //    if ($(e.srcElement).parent(".pop_texteditor")[0]) {
        //        return;
        //    }
        //    //mimo.Editor.TextEditor.hide();

        //});
    }
}

/**
 * 公用方法
 * @author masa
 * @namespace mimo.Editor.Common
 * @description 公用方法
 */
mimo.Editor.Common = {
    layoutData: null,

    //初始化
    init: function () {
        var p = mimo.Editor.Common;
        if (window.isMini) {
            p.layoutData = window["MINI_PAGELAYOUT_DATA"];
        } else if (window.isView) {
            p.layoutData = window["VIEW_PAGELAYOUT_DATA"];
        } else if (window.isWide) {
            p.layoutData = window["WIDE_PAGELAYOUT_DATA"];
        }else if (window.isMpad) {
            p.layoutData = window["MPAD_PAGELAYOUT_DATA"];
        }
    },

    getLayoutData: function () {
        return mimo.Editor.Common.layoutData;
    },
    //获取版式数据
    getLayoutInfo: function (num, template_name) {
        var p = mimo.Editor.Common;
        var pageType = num == "cover" ? "COVER" : "PAGE";
        var side = (pageType == "cover" || num == "0" ) ? "R" : ((num % 2 == 1) ? "R" : "L");
        return p.layoutData[pageType][side][template_name.toUpperCase()];
    }
};

/**
 * 页面内容编辑区
 * @author masa
 * @namespace mimo.Editor.PageEdit
 * @description 页面内容编辑区
 */
mimo.Editor.PageEdit = {
    currentEditSide: "right",
    currentEditPage: null,

    init: function () {
        var p = mimo.Editor.PageEdit;
        p.initSpine();
        p.addEvent();
        p.lisentEvent();
    },
    // 初始化书脊位置
    initSpine: function () {
        var p = mimo.Editor.PageEdit;
        if (window.isSpine) {
            p.bindTextEvent($(".spine"));
            if (BOOK_DATA.spine_info != null) {
                var s = $(".spine");
                if (BOOK_DATA.spine_info.txt1 != null) {
                    $(".txt1", s).html(mimo.Editor.TextEditor.toBr(BOOK_DATA.spine_info.txt1)).removeClass("text_box_background");
                }
                if (BOOK_DATA.spine_info.txt2 != null) {
                    $(".txt2", s).html(mimo.Editor.TextEditor.toBr(BOOK_DATA.spine_info.txt2)).removeClass("text_box_background");
                }
            }
        }
    },
    //设置书脊信息
    setSpineData: function () {
        var s = $(".spine");
        var t1 = $(".txt1", s).html();
        var t2 = $(".txt2", s).html();
        var r;
        r = {
            "txt1": unescape(escape(mimo.Editor.TextEditor.toRn(t1)).replace(/%A0/g, " ")),
            "txt2": unescape(escape(mimo.Editor.TextEditor.toRn(t2)).replace(/%A0/g, " "))
        }
        BOOK_DATA.spine_info = r;
    },

    setAuthorInfo: function () {
        var d = mimo.Editor.PageEdit.genPageData("author_info");
        BOOK_DATA.list["author_info"] = d;
    },

    cacheCurrentPage: function (from) {
        var list = [];
        // 取出左版页面数据
        var left_page = $("#pagelayout_left_side_edit");
        if (typeof (left_page.attr("num")) != "undefined" && (from == "toolsbar" || left_page.attr("has_edited") == "true")) {
            list.push(left_page.attr("num"));
        }

        // 取出右版页面数据
        var right_page = $("#pagelayout_right_side_edit");
        if (typeof (right_page.attr("num")) != "undefined" && (from == "toolsbar" || right_page.attr("has_edited") == "true")) {
            list.push(right_page.attr("num"));
        }

        //折页信息
        var author_page = $("#author_info");
        if (typeof (author_page.attr("num")) != "undefined" && (from == "toolsbar" || author_page.attr("has_edited") == "true")) {
            list.push(author_page.attr("num"));
        }

        // 没有需要保存的数据
        if (list.length == 0) {
            return;
        }
        mimo.Editor.DataCenter.cachePageData(list);
    },

    //保存当前编辑页面
    saveCurrentPage: function (from) {

        var list = [];
        // 取出左版页面数据
        var left_page = $("#pagelayout_left_side_edit");
        if (typeof (left_page.attr("num")) != "undefined" && (from == "toolsbar" || left_page.attr("has_edited") == "true")) {
            list.push(left_page.attr("num"));
        }

        // 取出右版页面数据
        var right_page = $("#pagelayout_right_side_edit");
        if (typeof (right_page.attr("num")) != "undefined" && (from == "toolsbar" || right_page.attr("has_edited") == "true")) {
            list.push(right_page.attr("num"));
        }

        if (window.isSpine) {
            // 书脊信息
            var spine_page = $(".spine");
            if (typeof (spine_page.attr("num")) != "undefined" && (from == "toolsbar" || spine_page.attr("has_edited") == "true")) {
                list.push(spine_page.attr("num"));
            }

            // 折页信息
            var author_page = $("#author_info");
            if (typeof (author_page.attr("num")) != "undefined" && (from == "toolsbar" || author_page.attr("has_edited") == "true")) {
                list.push(author_page.attr("num"));
            }
        }

        // 没有需要保存的数据
        if (list.length == 0) {
            return;
        }
        mimo.Editor.DataCenter.savePageData(list, function (response) {
            if (response.ret == 1) {
                mimo.Editor.showAlert(2000);
                mimo.Editor.ThumbnailList.computeUsedNum();
                mimo.Editor.ToolsBar.setCompleteCount();
            }
        });

    },

    // 清空页面信息
    emptyPage: function (page) {
        var layout = page;
        layout.attr("class", "pagelayout_edit");
        layout.removeAttr("style");
        layout.removeAttr("num");
        layout.removeAttr("name");
        layout.removeAttr("width");
        layout.removeAttr("height");
        layout.removeAttr("page_type");
        layout.removeAttr("product_type");
        layout.removeAttr("space_type");
        layout.removeAttr("margin_type");
        layout.removeAttr("side_type");
        layout.removeAttr("cross_type");
        layout.removeAttr("has_edited");
        layout.css("background-color", "#ffffff");
        $("#spine").removeAttr("has_edited");
    },

    // 把页面布局转化成json
    genPageData: function (num) {
        var page = $(".pageedit_" + num);
        if (num == "author_info") {
            page = $("#author_info");
        }
        var page_num = num;
        var template_name = page.attr("name");
        var background_color = page.attr("background_color");
        var text_color = page.attr("color");
        var page_side = page.attr("page_side");

        //找出图象列表
        var imageBoxList = [];
        var imageBoxCount = $(".image_box", page).length;
        var imageBoxDataCount = 0;
        $(".image_box", page).each(
            function () {
                var item = $(this);
                var name = item.attr("name");
                var imageItem = item.children("img");

                if (imageItem.length == 0) {
                    return;
                }

                var imageid = imageItem.attr("imageid");
                var src = imageItem.attr("src");
                var width = imageItem.attr("width");
                var height = imageItem.attr("height");
                var owidth = imageItem.attr("owidth");
                var oheight = imageItem.attr("oheight");
                var x = parseInt(imageItem.css("left"));
                var y = parseInt(imageItem.css("top"));
                var scale = 0.00;
                if (owidth) {
                    scale = width / owidth;
                }


                //src存在代表有图
                if (src) {
                    var imgObj = {
                        "name": name,
                        "imageid": imageid,
                        "src": src,
                        "width": width,
                        "height": height,
                        "x": !x ? 0 : x,
                        "y": !y ? 0 : y,
                        "scale":scale
                    };
                    imageBoxList.push(imgObj);
                    imageBoxDataCount++;
                }

            }
        );

        //找出文本列表
        var textBoxList = [];
        var textBoxCount = $(".text_box", page).length;
        var textBoxDataCount = 0;
        $(".text_box", page).each(
            function () {
                var item = $(this);
                var name = item.attr("name");
                var align = item.attr("align");
                //var content = item[0].innerText || item[0].textContent || "";
                var content = item.html();

                //src存在代表有图
                if (content && content != "在此输入文字~") {
                    var textObj = {
                        "name": name,
                        "align": align,
                        "content": unescape(escape(mimo.Editor.TextEditor.toRn(content)).replace(/%A0/g, " ")).replace(/&lt;br&gt;/ig,"").replace(/&lt;br\/&gt;/ig,"").replace(/<br>/ig,"").replace(/<br\/>/ig,"").replace(/<br \/>/ig,"")
                    };
                    textBoxList.push(textObj);
                    textBoxDataCount++;
                }
            }
        );
        // 只要图片填充,就算完成
        var finish = (imageBoxCount == imageBoxDataCount) || (imageBoxCount == 0 && textBoxCount == textBoxDataCount);
        var pageObj = {
            "num": num,
            "template_name": template_name,
            "finish": finish ? "true" : "false",
            "page_side": page_side,
            "page_data": {
                "background_color": background_color,
                "text_color": text_color,
                "imagebox_list": imageBoxList,
                "textbox_list": textBoxList
            }
        };
        return pageObj;
    },
    //把版式json转化成页面布局
    renderPage: function (pageObj, page, num, from) {
        var p = mimo.Editor.PageEdit;
        var page = $(page);
        var name = pageObj.name;
        var width = pageObj.width;
        var height = pageObj.height;
        var pageType = pageObj.page_type;
        var productType = pageObj.product_type;
        var spaceType = pageObj.space_type;
        var marginType = pageObj.margin_type;
        var sideType = pageObj.side_type;
        var crossType = pageObj.cross_type;

        if (typeof (num) == "undefined") {
            num = page.attr("num");
        }

        //清空原来的布局
        //$("#layout").empty();
        //$("#layout").append('<div id="layout_content" ></div>');

        //var layout = $("#layout_content");
        var layout = page;
        if (from == "layout") {
            // 从版式选择器过来的,说明有改变咯
            layout.attr("has_edited", true);
        } else {
            layout.attr("has_edited", false);
        }

        if (num != "author_info") {
            layout.attr("class", "pagelayout_edit pageedit_" + num);
            layout.html(TRIM_LINE_HTML);
        }
        layout.attr("num", num);
        layout.attr("name", name);
        layout.attr("width", width);
        layout.attr("height", height);
        layout.attr("page_type", pageType);
        layout.attr("product_type", productType);
        layout.attr("space_type", spaceType);
        layout.attr("margin_type", marginType);
        layout.attr("side_type", sideType);
        
        if (crossType) {
            layout.attr("cross_type", crossType);
        } else {
            layout.removeAttr("cross_type");
        }
        layout.attr("background_color", "#ffffff");
        layout.attr("color", "#000000");

        layout.css("background-color", "#ffffff");
        layout.css("color", "#000000");

        layout.css("width", mmToPx(width) + "px");
        layout.css("height", mmToPx(height) + "px");
        //layout.css("border", "1px solid #808080");
        var list;
        //渲染图片框
        if (pageObj.imageBoxList.length && num !="copyright") {
            list = pageObj.imageBoxList;
            for (var i = 0, len = list.length; i < len; i++) {
                var data = list[i];
                var box;
                if (productType == "MINI" && name == "C1") {
                    //MINI的C1版式是圆角的
                    layout.append('<div class="image_box rouned10 {name}"><div class="drag_here"></div></div>'.replace("{name}", data.name));
                }else{
                    layout.append('<div class="image_box {name}"><div class="drag_here"></div></div>'.replace("{name}", data.name));
                }
                box = $("." + data.name, layout);
                box.attr("id", data.name);
                box.attr("name", data.name);
                box.attr("x", data.x);
                box.attr("y", data.y);
                box.attr("width", data.width);
                box.attr("height", data.height);

                box.css("left", mmToPx(data.x) + "px");
                box.css("top", mmToPx(data.y) + "px");
                box.css("width", mmToPx(data.width) + "px");
                box.css("height", mmToPx(data.height) + "px");

                box.append('<div class="dpi_info">' + parseInt(mmToPxByDPI(data.width), 10) + 'x' + parseInt(mmToPxByDPI(data.height), 10) + '</div>');

            }

        }
     

        //渲染文本框
        if (pageObj.textBoxList.length) {
            list = pageObj.textBoxList;
            for (var i = 0, len = list.length; i < len; i++) {
                var data = list[i];
                var box;
                if (num == "copyright") {
                    layout.append('<div class="text_box {name}"></div>'.replace("{name}", data.name));
                } else {
                    layout.append('<div class="text_box text_box_background {name}"></div>'.replace("{name}", data.name));
                }
                box = $("." + data.name, layout);
                box.attr("id", data.name);
                box.attr("name", data.name);
                box.attr("x", data.x);
                box.attr("y", data.y);
                box.attr("width", data.width);
                box.attr("height", data.height);
                box.attr("align", data.align);
                box.attr("space", data.space);
                box.attr("leading", data.leading);
                box.attr("max_line", data.max_line);
                box.attr("max_length", data.max_length);
                box.attr("pt", data.pt);
                box.attr("px", data.px);
                box.attr("direction", data.direction);

                //这里做一下转换哦,如果太小,放大一点啦~
                var px = data.px < 9 ? 9 : data.px;
                var h = mmToPx(data.height) < 12 ? 12 : mmToPx(data.height);
                box.css("left", mmToPx(data.x) + "px");
                box.css("top", mmToPx(data.y) + "px");
                box.css("width", (mmToPx(data.width) < 12 ? 12 : mmToPx(data.width) )+ "px");
                box.css("height", h + "px");
                box.css("font-size", px + "px");

                // 100 字间距大概是2px
                if (!window.isWide &&  data.space) {
                    if (data.pt == 20 && data.space == 100) {
                        box.css("letter-spacing", "3px");
                    } else if (data.pt == 8 && data.space == 100) {
                        box.css("letter-spacing", "2px");
                    }
                }
                //debugger;
                //竖排处理
                if (data.direction == "vertical") {
                    box.css({ "width": 9, "letter-spacing":"4px" });

                }
                if (num != "copyright") {
                    box.html("在此输入文字~");
                }
                
                if (window.isMpad) {
                    if (num == "copyright" && data.name == "txt4") {
                        box.html("版权声明：本书创作及内容，由作者保留其独家著作权。");
                        box.attr("title", "版权声明：本书创作及内容，由作者保留其独家著作权。");
                        box.removeClass("text_box_background");
                    }
                } else {
                    if (num == "copyright" && data.name == "txt3") {
                        box.html("版权声明：本书之创作及内容，由作者保留其独家著作权。");
                        box.attr("title", "版权声明：本书之创作及内容，由作者保留其独家著作权。");
                        box.removeClass("text_box_background");
                    }
                }
            }
        }

        //绑定事件
        p.bindDropEvent(page);
        p.bindTextEvent(page);

        //
        if (num == "copyright") {
            if (window.isView) {
                layout.append('<div class="img1 " id="img1" name="img1" x="15.5" y="113" width="42" height="9.5" style="left: 34px; top: 250px; width: 93px; height: 21px;position: absolute;"><img src="/tushuWeb/styles/images/edit/m_logo.png" imageid="249" width="93" height="21" style="position: relative; left: 0px; top: 0px;" class="ui-draggable"></div>');
            }
            else if (window.isMini) {
                layout.append('<div class="img1 " id="img1" name="img1" x="15.5" y="113" width="42" height="9.5" style="left: 51px; top: 290px; width: 93px; height: 21px;position: absolute;"><img src="/tushuWeb/styles/images/edit/m_logo.png" imageid="249" width="93" height="21" style="position: relative; left: 0px; top: 0px;" class="ui-draggable"></div>');
            }
            else if (window.isWide) {
                layout.append('<div class="img1 " id="img1" name="img1" x="15.5" y="113" width="42" height="9.5" style="left: 51px; top: 290px; width: 93px; height: 21px;position: absolute;"><img src="/tushuWeb/styles/images/edit/m_logo.png" imageid="249" width="93" height="21" style="position: relative; left: 0px; top: 0px;" class="ui-draggable"></div>');
            }
            else if (window.isMpad) {
                layout.append('<div class="img1 " id="img1" name="img1" x="15.5" y="113" width="42" height="9.5" style="left: 51px; top: 560px; width: 93px; height: 21px;position: absolute;"><img src="/tushuWeb/styles/images/edit/m_logo.png" imageid="249" width="93" height="21" style="position: relative; left: 0px; top: 0px;" class="ui-draggable"></div>');
            }
        }
        //debugger
        //绑定数据
        var pageData;
        if (num == "copyright") {
            // 扉页用的是封面的数据
            pageData = BOOK_DATA.list["cover"] && BOOK_DATA.list["cover"].page_data;
            //pageData.background_color = "#ffffff";
            //pageData.text_color = "#000000";
            //if (num == "copyright") {
            //    pageData = p.getStaticPagedata(pageData, num);
            //}
        } else if (num == "0") {
            // 如果扉页没编辑过
            if (!BOOK_DATA.list[num] || !BOOK_DATA.list[num].page_data) {
                if (BOOK_DATA.list["cover"] && BOOK_DATA.list["cover"].page_data) {
                    pageData = p.getStaticPagedata(BOOK_DATA.list["cover"].page_data, num);
                    layout.attr("has_edited", true);
                }
            } else {
                pageData = BOOK_DATA.list[num] && BOOK_DATA.list[num].page_data;
            }
        } else {
            pageData = BOOK_DATA.list[num] && BOOK_DATA.list[num].page_data;
        }

        if (pageData) {
            var isSameTemplateName = BOOK_DATA.list[num] && (BOOK_DATA.list[num].template_name == name);
            p.bindPageData(pageData, page, num, isSameTemplateName, from);
        }

        //派发事件
        //if (isSpine) {
        //    mimo.Event.dispatch("MIMO_EDIT_AUTHORINFO_EVENT");
        //}
    },

    // 编辑数据置入
    bindPageData: function (pageData, page, num, isSameTemplateName, from) {
        var p = mimo.Editor.PageEdit;

        var b_color = num == "copyright" ? "#ffffff" : pageData.background_color;
        var t_color = num == "copyright" ? "#000000" : pageData.text_color;

        // 设置页面属性
        page.css("background-color", b_color)
        page.css("color", t_color);

        page.attr("background_color", b_color)
        page.attr("color", t_color);

        var item;
        var box;
        //设置图片数据
        var imageBoxList = pageData.imagebox_list;
        if (imageBoxList.length && num != "copyright") {
            for (var i = 0, len = imageBoxList.length; i < len; i++) {
                item = imageBoxList[i];
                box = $("." + item.name, page);
                if (box) {
                    p.bindDragEvent(box, item.src, item.imageid, item, isSameTemplateName, from);
                }
            }
        }

        //设置文本数据
        var textBoxList = pageData.textbox_list;
        for (var i = 0, len = textBoxList.length; i < len; i++) {
            item = textBoxList[i];
            box = $("." + item.name, page);
            if (box) {
                if (item.content) {
                    box.removeClass("text_box_background");
                    //box.html(mimo.Editor.TextEditor.toBr(mimo.Editor.TextEditor.encode(item.content)));
                    box.html(mimo.Editor.TextEditor.toBr(item.content));
                }
                if (num != "copyright" && item.align) {
                    box.attr("align", item.align);
                    box.css("text-align", item.align);
                }
            }
        }

        if (num == "copyright") {
            if (BOOK_DATA["copyright_info"] && BOOK_DATA["copyright_info"].page_data) {
                var pd = BOOK_DATA["copyright_info"].page_data;
                var bcolor = pd.background_color;
                var tcolor = pd.text_color;
                // 设置页面属性
                page.css("background-color", bcolor)
                page.css("color", tcolor);

                page.attr("background_color", bcolor)
                page.attr("color", tcolor);

                if (bcolor == "#ffffff") {
                    $(".img1", page).children('img').attr("src", '/images/edit/m_logo.png');
                } else {
                    $(".img1", page).children('img').attr("src", '/images/edit/m_logo_b.png');
                }
               
            }
        }
    },
    // 获取Hardcode版式
    getStaticPagedata: function (srcPageData, num) {
        if (num == "0") {
            var pageObj = {
                "num": num,
                "template_name": "",
                "finish": "true",
                "page_side": "",
                "page_data": {
                    "background_color": "#ffffff",
                    "text_color": "#000000",
                    "imagebox_list": [],
                    "textbox_list": srcPageData.textbox_list
                }
            };
            return pageObj.page_data;
        }
    },

    //增加loading显示
    addImageLoading: function (imageBox) {
        imageBox = $(imageBox);
        imageBox.append('<img class="loading" src="http://membookstatic.b0.upaiyun.com/staticcontent/images/neweditor/loading.gif" />');
        imageBox.children(".loading").css({
            "position": "relative",
            "left": imageBox.width() / 2 - 32,
            "top": imageBox.height() / 2 - 32
        });
    },
    //隐藏loading
    removeImageLoading: function (imageBox) {
        $(imageBox).children(".loading").remove();
    },
    setSide: function (side) {
        var p = mimo.Editor.PageEdit;
        var warp = $("#edit_area_warp");
        if (side == "left") {
            warp.removeClass("edit_area_warp_right")
            warp.addClass("edit_area_warp_left")
            p.currentEditSide = "left";
            p.currentEditPage = $("#pagelayout_left_side_edit");
        } else {
            warp.removeClass("edit_area_warp_left")
            warp.addClass("edit_area_warp_right")
            p.currentEditSide = "right";
            p.currentEditPage = $("#pagelayout_right_side_edit");
        }
    },
    addEvent: function () {
        var p = mimo.Editor.PageEdit;
        //监听左右版面点击事件,选定当前编辑版面
        $(".pagelayout_right_side_warp, .pagelayout_left_side_warp").click(function (e) {
            e.preventDefault();
            var item = $(this);
            if (item.hasClass("pagelayout_left_side_warp") && item.children(".pagelayout_edit").attr("num")) {

                    p.setSide("left");
            } else if (item.children(".pagelayout_edit").attr("num")) {
                p.setSide("right");
            }
        });

        //绑定接受图片事件
        //p.bindDropEvent();
        //p.bindTextEvent();

    },
    //绑定被拖入图片的事件
    bindDropEvent: function (page) {
        var p = mimo.Editor.PageEdit;
        $(".image_box", $(page)).droppable({
            accept: "img.j_thumbnail",
            activeClass: "ui-state-hover",
            drop: function (event, ui) {

                //图片框
                var imgBox = $(this);
                var imgBoxHeight = imgBox.height();
                var imgBoxWidth = imgBox.width();

                imgBox.parent(".pagelayout_edit, .author_info").attr("has_edited", true);

                //debugger;
                mimo.Editor.PageEdit.addImageLoading(imgBox);
                //默认横向滚动
                var axis = "x";
                var editImage = new Image();
                //图片加载完的事件
                editImage.onload = function () {
                    var wScale = editImage.width / imgBoxWidth;
                    var hScale = editImage.height / imgBoxHeight;
                    var x, y;

                    $(editImage).attr("owidth",editImage.width);
                    $(editImage).attr("oheight",editImage.height);

                    if (wScale > hScale) {
                        editImage.height = imgBoxHeight;
                        editImage.width = editImage.width / hScale;
                        x = (imgBoxWidth / 2) - (editImage.width / 2);
                        y = 0;
                    } else {
                        editImage.width = imgBoxWidth;
                        editImage.height = editImage.height / wScale;
                        x = 0;
                        y = (imgBoxHeight / 2) - (editImage.height / 2);
                    }

                    //置入图片
                    imgBox.empty().append(editImage);
                    $(editImage).css({ "left": x, "top": y });
                    mimo.Editor.PageEdit.cacheCurrentPage();

                    //绑定图片拖动事件
                    mimo.Editor.ImageTools.setDraggable(editImage.width, editImage.height, imgBox.width(), imgBox.height(), imgBox, $(editImage));

                    mimo.Editor.ImageTools.hide();
                    imgBox.children("img").click(function () {
                        mimo.Editor.ImageTools.fire($(this));
                    });
                    p.checkDPI(imgBox, ui.draggable.data("imageid"));
                }
                //end editImage onload
                editImage.src = ui.draggable.attr("data-url") + "_edit.jpg";
                $(editImage).attr("imageid", ui.draggable.data("imageid"));
                $(editImage).attr("path", ui.draggable.data("path"));


            }//end drop
        });
    },
    //绑定图片在img_box内的拖动事件
    bindDragEvent: function (imageBox, url, imageid, imageBoxData, isSameTemplateName, from) {
        if (url == 'null' || !url ) {
            return;
        }
        var p = mimo.Editor.PageEdit;
        //图片框
        var imgBox = $(imageBox);
        if (!imgBox[0]) {
            return;
        }
        var imgBoxHeight = imgBox.height();
        var imgBoxWidth = imgBox.width();

        mimo.Editor.PageEdit.addImageLoading(imgBox);
        //默认横向滚动
        var axis = "x";
        var editImage = new Image();
        //图片加载完的事件
        editImage.onload = function () {
            var wScale = editImage.width / imgBoxWidth;
            var hScale = editImage.height / imgBoxHeight;
            var x, y;

            $(editImage).attr("owidth", editImage.width);
            $(editImage).attr("oheight", editImage.height);

            if (wScale > hScale) {
                editImage.height = imgBoxHeight;
                editImage.width = editImage.width / hScale;
                x = (imgBoxWidth / 2) - (editImage.width / 2);
                y = 0;
            } else {
                editImage.width = imgBoxWidth;
                editImage.height = editImage.height / wScale;
                x = 0;
                y = (imgBoxHeight / 2) - (editImage.height / 2);
            }

            //置入图片
            imgBox.empty().append(editImage);
            $(editImage).css({ "left": x, "top": y });
            
            //绑定图片拖动事件
            mimo.Editor.ImageTools.setDraggable(editImage.width, editImage.height, imgBox.width(), imgBox.height(), imgBox, $(editImage));
            if (imageBoxData) {
                var img = imgBox.children("img");
                if (from == "preview" || from == "layout" && isSameTemplateName) {
                    img.css("left", imageBoxData.x + "px");
                    img.css("top", imageBoxData.y + "px");
                    img.attr("width", imageBoxData.width);
                    img.attr("height", imageBoxData.height);
                }
                //绑定图片拖动事件
                mimo.Editor.ImageTools.setDraggable(editImage.width, editImage.height, imgBox.width(), imgBox.height(), imgBox, $(editImage));
                imgBox.children("img").click(function () {
                    mimo.Editor.ImageTools.fire($(this));
                });
            }
            p.checkDPI(imgBox, imageid, true);
        }
        //end editImage onload
        editImage.src = url;
        $(editImage).attr("imageid", imageid);
    },

    bindTextEvent: function (page) {
        //hover事件
        var isFlybeaf = $(page).attr("num") == "copyright";
        $(".text_box", $(page)).hover(
            function () {
                // over
                if (isFlybeaf) {
                    return;
                }
                $(this).addClass("text_box_hover");
            },
            function () {
                // out
                if (isFlybeaf) {
                    return;
                }
                $(this).removeClass("text_box_hover");
            }
        ).click(function () {
            if (isFlybeaf) {
                return;
            }
            mimo.Event.dispatch("MIMO_TEXT_BOX_CLICK_EVENT", { textBox: $(this) });
        });
    },

    checkDPIStatus: function (width, height, imageid) {
   
        //判断像素是否符合
        var boxWidth = width;
        var boxHeight = height;
        var size = mimo.Editor.ThumbnailList.getOriginalSize(imageid);

        //如果没有数据,撤退
        if(!size || (size && !size.width)){
            return true;
        }
        if (size.width < mmToPxByDPI(boxWidth) - 200 || size.height < mmToPxByDPI(boxHeight) - 200) {
            return false;
        }
        return true;
    },

    // 检查清晰读
    checkDPI: function (imgBox, imageid, isBindData) {
        //判断像素是否符合
        var boxWidth = imgBox.attr("width");
        var boxHeight = imgBox.attr("height");
        var size = mimo.Editor.ThumbnailList.getOriginalSize(imageid);

        //如果没有数据,撤退
        if(!size || (size && !size.width)){
            return;
        }
        if (size.width < mmToPxByDPI(boxWidth) - 200 || size.height < mmToPxByDPI(boxHeight) - 200) {
            var cn = imgBox.parent(".pagelayout_edit").attr("id").indexOf("left") > -1 ? "warning warning_left" : "warning";
            var pxinfo = parseInt(mmToPxByDPI(boxWidth),10) + "*" + parseInt(mmToPxByDPI(boxHeight),10) + "px";
            imgBox.append('<a class="' + cn + '" href="javascript:;"></a>');

            imgBox.append('<div class="warning_tips" style="display:none;"><p>该相片可能会导致印刷效果不够清晰，请更换更高像素的相片或者切换为小版式。<br /><br />该版式建议相片精度大于:<br />' + pxinfo + '</p></div>');
            var tips = $(".warning_tips", imgBox);
            if (!isBindData) {
                
                tips.show();
                setTimeout(function () {
                    tips.hide();
                }, 3000);
            }


            // 绑定事件
            $(".warning", imgBox).hover(
                function () {
                    // over
                   tips.show();
                },
                function () {
                    // out
                    tips.hide();
                }
            );

        }
    },


    //监听事件
    lisentEvent: function () {
        var p = mimo.Editor.PageEdit;

        //监听编辑书衣事件
        mimo.Event.addEventListener("MIMO_EDIT_SPINE_EVENT", function (eventObj, dataObj) {
            var t = BOOK_DATA.list["cover"];

            //封面折页
            $("#author_info").empty();
            var layout_info = mimo.Editor.Common.getLayoutInfo("99", "AUTHORINFO2");
            mimo.Editor.PageEdit.renderPage(layout_info, $("#author_info"), "author_info", "preview");
            $("#author_info").append(AUTHORINFO_TRIM_LINE_HTML);

            if (t && t.page_data) {
                var color = t.page_data.background_color;
                var t_color = t.page_data.text_color;
                // 设置书衣,折页背景
                $("#pagelayout_left_side_edit, #style_info, #author_info").css("background-color", color).attr("background_color", color);
                if (window.isWide) {
                    $(".spine").css("background-color", color).attr("background_color", color);
                }

                //设置字体颜色
                if (window.isWide) {
                    if (color == "#000000") {
                        $("#style_info, #author_info, .spine").css("color", "#ffffff");
                    } else {
                        $("#style_info, #author_info, .spine").css("color", "#000000");
                    }
                }

                if (window.isMpad) {
                    $("#author_info").css("color", "#000000");
                }
            }
            

            //设置logo
            var s = "";
            if (window.isMpad) {
                s = '<div class="img1 " name="img1" x="15.5" y="113" width="42" height="9.5" style="left: 181px; top: 309px; width: 93px; height: 21px;position: absolute;"><img id="bottom_img1" src="/images/edit/m_logo.png" width="110" style="position: relative; left: 0px; top: 0px;" class="ui-draggable"></div>';

            } else {
                s = '<div class="img1 " name="img1" x="15.5" y="113" width="42" height="9.5" style="left: 181px; top: 166px; width: 93px; height: 21px;position: absolute;"><img id="bottom_img1" src="/images/edit/m_logo.png" width="110" style="position: relative; left: 0px; top: 0px;" class="ui-draggable"></div>';
            }
            var b = $("#pagelayout_left_side_edit");
            var l = $("#bottom_img1", b);
            if (l.length == 0) {
                b.append(s);
            }
            //
            if (color == "#000000") {
                $("#bottom_img1", b).attr("src", '/styles/images/edit/m_logo_b.png');
                $("#page_bottom").removeClass("pagelayout_bg").removeClass("blank").css("background-color", "#000000");
            } else {
                $("#bottom_img1", b).attr("src", '/styles/images/edit/m_logo_b.png');
                $("#page_bottom").addClass("pagelayout_bg").addClass("blank").css("background-color", "#ffffff");
            }

            
            
        });

        //监听编辑扉页和书衣
        mimo.Event.addEventListener("MIMO_EDIT_AUTHORINFO_EVENT", function (eventObj, dataObj) {
            var t = BOOK_DATA.list["cover"];
            if (t && t.page_data) {
                var color = t.page_data.background_color;
                var t_color = t.page_data.text_color;
                $("#pagelayout_left_side_edit").css("background-color", color).attr("background_color", color).css("color", t_color).attr("color", t_color);
            }
        });

        //  监听底色被选中事件
        mimo.Event.addEventListener("MIMO_BACKGROUND_COLOR_PICKER_EVENT", function (eventObj, dataObj) {
            var item = p.currentEditPage;
            item.attr("has_edited", true);
            item.css("background-color", dataObj.color);
            item.attr("background_color", dataObj.color);

            // 如果是有书衣的
            if (isSpine && item.attr("num") == "cover") {
                $("#pagelayout_left_side_edit, .spine, #style_info, #author_info").css("background-color", dataObj.color).attr("background_color", dataObj.color).attr("color", dataObj.color);
                if (dataObj.color == "#000000") {
                    //处理logo
                    $("#bottom_img1").attr("src", '/static/images/m_logo_b.png');
                    $("#page_bottom").removeClass("pagelayout_bg").removeClass("blank").css("background-color", "#000000");

                    //处理折页和书脊字体颜色
                    $(".spine, #author_info").css("color", "#ffffff").attr("color", "#ffffff");
                } else {
                    $("#bottom_img1").attr("src", '/static/images/m_logo.png');
                    $("#page_bottom").addClass("pagelayout_bg").addClass("blank").css("background-color", "#ffffff");
                    //处理折页和书脊字体颜色
                    $(".spine, #author_info").css("color", "#000000").attr("color", "#000000")
                }
            }

            //这里特殊处理下扉页
            if (item.attr("num") == "0" || item.attr("num") == "copyright") {
                var color = dataObj.color;
                var n_color;
                if (color == "#ffffff") {
                    n_color = "#000000";
                } else {
                    n_color = "#ffffff";
                }
                item.css("color", n_color).attr("color", n_color);
                //这里处理logo
                if (color == "#ffffff") {
                    $(".img1", item).children('img').attr("src", '/static/images/m_logo.png');
                } else {
                    $(".img1", item).children('img').attr("src", '/static/images/m_logo_b.png');
                }
            }
        });

        // 监听字体颜色事件
        mimo.Event.addEventListener("MIMO_TEXT_COLOR_PICKER_EVENT", function (eventObj, dataObj) {
            var item = p.currentEditPage
            if (item.attr("num") == "0" || item.attr("num") == "copyright") {
                alert("扉页字体根据底色自动调整，无需手动调整。");
                return;
            }
            item.attr("has_edited", true);
            var color = item.attr("color");
            var n_color;
            if (color == "#ffffff") {
                n_color = "#000000";
            } else {
                n_color = "#ffffff";
            }
            item.css("color", n_color).attr("color", n_color);

            // 如果是有书衣的
            if (isSpine && item.attr("num") == "cover") {
                //$("#pagelayout_left_side_edit, .spine").css("color", n_color).attr("color", n_color);
                //if (window.isWide) {
                //    $("#pagelayout_left_side_edit, .author_info").css("color", n_color).attr("color", n_color);
                //}
            }
            
        });

        //监听缩略图被点击事件
        mimo.Event.addEventListener("MIMO_PAGE_PREVIEW_THUMBNAIL_CLICK_EVENT", function (eventObj, dataObj) {
            var side = dataObj.side;
            var num = dataObj.num;
            var template = dataObj.template_name;
            var page_type = dataObj.page_type;
            var cross_type = dataObj.cross_type;
            var layout_info;
            
            
            p.setSide(side);
            //然后这里开始渲染页面咯 gogogo 
            layout_info = mimo.Editor.Common.getLayoutInfo(num, template);

            //如果是跨页版式
            if (layout_info.cross_type == "T") {
                mimo.Editor.PreviewList.addCrossStyle();
            }

            p.renderPage(layout_info, mimo.Editor.PageEdit.currentEditPage, num, "preview");

            // 这里开始渲染关联页面
            var selectPage = $("#page_" + num);
            var relatePage;
            var relateEditPage;
            var relateSide;

            if (side == "right") {
                relatePage = selectPage.parent("li").children("a").eq(0);
                relateSide = "left";
                relateEditPage = $("#pagelayout_left_side_edit")
            } else {
                relatePage = selectPage.parent("li").children("a").eq(1);
                relateSide = "right";
                relateEditPage = $("#pagelayout_right_side_edit")
            }

            var relateNum = relatePage.attr("id").split("_")[1];
            var r_page_type = relatePage.attr("page_type");
            var r_template = relatePage.attr("template_name");
            if (r_template) {
                layout_info = mimo.Editor.Common.getLayoutInfo(relateNum, r_template);
                p.renderPage(layout_info, relateEditPage, relateNum, "preview");
            }
        });

        //监听版式点击事件
        mimo.Event.addEventListener("MIMO_PAGELAYOUT_PICKER_EVENT", function (eventObj, dataObj) {
            var curEditPage = mimo.Editor.PageEdit.currentEditPage;
            var name = dataObj.name;
            var type = dataObj.type;
            var num = curEditPage.attr("num");
            var crossType = curEditPage.attr("cross_type");
            var layout_info = mimo.Editor.Common.getLayoutInfo(num, name);

            if (crossType != layout_info.cross_type) {
                if (layout_info.cross_type == "T") {
                    mimo.Editor.PreviewList.addCrossStyle();
                } else {
                    mimo.Editor.PreviewList.removeCrossStyle();
                }
            }

            p.renderPage(layout_info, mimo.Editor.PageEdit.currentEditPage, num, "layout");
        });
    }

}

/**
 * 缩略图组件
 * @author masa
 * @namespace mimo.Editor.ThumbnailList
 * @description 缩略图组件
 */
mimo.Editor.ThumbnailList = {
    // 正在旋转
    isRoating:false,
    //当前页码
    curIndex: 0,
    //总图片数
    totalCount: 32,
    //每一页的像素偏移
    pagePx: 688,
    //每页显示缩略图数目
    count: 8,
    data: [],
    hash: {},
    init: function () {
        mimo.Editor.ThumbnailList.getData();
        mimo.Editor.ThumbnailList.addEvent();

        

    },
    initData: function (data) {
        var hash = mimo.Editor.ThumbnailList.hash;
        for (var i = 0, len = data.length; i < len; i++) {
            hash[data[i].id] = data[i];
        }
    },

    //计算宽度
    computeWidth: function () {
        $("#mod_thumbnail_list").css("width", ($("#mod_thumbnail_list li").length) * 86);
    },
    // 获取原图尺寸
    getOriginalSize: function (imageid) {
        var t = mimo.Editor.ThumbnailList.hash[imageid];
        if (t) {
            return {
                "width": t.original_width,
                "height": t.original_height,
                "name":t.name
            };
        }
        return null;
    },
    // 设置属性
    setProperty: function (obj) {
        var p = mimo.Editor.ThumbnailList;
        for (var k in obj) {
            p[k] = obj[k];
        }
    },
    //拉取缩略图数据
    getData: function (order) {
        order = order || "filename";
        $.ajax({
            type: "GET",
            url: "/userimage/getimagelistbyworksid",
            data: { works_id: window.WorksId, order:order, masa: Math.random() },
            dataType: "json",
            success: function (response) {
                if (response && response.ret == 1) {
                    var p = mimo.Editor.ThumbnailList;
                    var data = response.data;
                    p.initData(data);
                    p.setProperty({ data: data, totalCount: data.length });
                    p.present(data);

                    var usedCount = 0;
                    for (var i = 0, len = data.length; i < len; i++) {
                        if (data[i].used_num != 0) {
                            usedCount++;
                        }
                    }
                    $("#thumbnail_count").html(data.length);
                    //$("#thumbnail_used_count").html(usedCount);
                }
            }
        });
    },
    getImageUrl: function (obj) {
        //本地图像
        if (obj.storage_type == 1 || obj.storage_type == 4 || obj.storage_type == 5) {
            obj.file_path = obj.file_path.replace(/\\/g, "/");
            obj.url = "/" + obj.file_path;
            obj.src = obj.url + "_thumb.jpg";
        }
        return obj;
    },
    //获取html
    getItemHTML: function (list) {
        var tpl = '\
            <li>\
                <img class="j_thumbnail" title="点击查看大图" id="imageid_{id}" data-imageid="{id}" data-path="{file_path}" data-original_height={original_height} data-original_width="{original_width}" src="{src}" data-url="{url}" used_num="{used_num}" />\
                <span class="counter" id="counter_{id}" title="图像被使用次数">{used_num}</span><span class="thumbnail_operats"><a title="旋转" href="javascript:;" class="btn_rotate_left" data-imageid="{id}"></a><a title="旋转" href="javascript:;" class="btn_rotate_right" data-imageid="{id}"></a><a title="删除" href="javascript:;" class="btn_delete" data-imageid="{id}"></a></span>\
            </li>';

        var arrHTML = [];
        var obj;
        for (var i = 0, len = list.length; i < len; i++) {
            obj = mimo.Editor.ThumbnailList.getImageUrl(list[i]);
            arrHTML.push(mimo.Template.format(tpl, obj));
        }
        return arrHTML.join("");
    },
    //显示
    present: function (list) {
        var p = mimo.Editor.ThumbnailList;
        var html = p.getItemHTML(list);
        var item = $("#mod_thumbnail_list");
        item.html(html);
        item.css("left", "0px");
        p.curIndex = 0;
        p.totalCount = list.length;

        //删除按钮
        p.bindDelete(item);

        //拖动
        p.bindDraggable();
        //计算使用次数
        p.computeUsedNum();

        p.computeWidth();
    },
    //上一页
    prePage: function () {
        var p = mimo.Editor.ThumbnailList;
        $(".thumbnail_warp").scrollLeft($(".thumbnail_warp").scrollLeft() - (8 * 86));
        return;
        //if (p.curIndex == 0) {
        //    return;
        //}
        //p.curIndex--;
        //var offsetLeft = p.curIndex * p.pagePx;
        //$("#mod_thumbnail_list").stop(true, false).animate({ left: -offsetLeft }, 200);

    },
    //下一页
    nextPage: function () {
        //debugger
        var p = mimo.Editor.ThumbnailList;
        $(".thumbnail_warp").scrollLeft($(".thumbnail_warp").scrollLeft()+(8 * 86));
        return;
        //if (p.curIndex == Math.ceil(p.totalCount / p.count) - 1) {
        //    return;
        //}
        //p.curIndex++;
        //var offsetLeft = p.curIndex * p.pagePx;
        //$("#mod_thumbnail_list").stop(true, false).animate({ left: -offsetLeft }, 200);
    },
    //添加一个新的缩略图
    addThumbnail: function (obj) {
        
        var p = mimo.Editor.ThumbnailList;
        if (obj.ret == 1) {
            //新增对象
            p.hash[obj.data.id] = obj.data;
            var html = p.getItemHTML([obj.data]);
            if (!$("#mod_thumbnail_list li")[0]) {
                $("#mod_thumbnail_list").html(html);
            } else {
                $(html).insertBefore($("#mod_thumbnail_list li")[0]);
            }
            p.bindDraggable($("img", $("#mod_thumbnail_list li")[0]));
            p.bindDelete($("#mod_thumbnail_list li")[0], true);
        }
        p.computeWidth();
    },
    //删除一张缩略图
    deleteThumbnail: function () {
        //var p = mimo.Editor.ThumbnailList;
    },
    showBigThumbnail: function (e) {
        var pop = $("#thumbnail_big");
        var item = $(e.currentTarget);
        var pos = item.offset();
        var size = mimo.Editor.ThumbnailList.getOriginalSize(item.data("imageid"));

        $("img", pop).attr("src", item.data("url")+"_edit.jpg");
        pop.css({
            "left": pos.left - 150 + "px",
            "top":pos.top + 90 + "px"
        });
        if (!size.name) {
            size.name = "";
        }
        $(".info", pop).html(size.name + "<br />图片尺寸（精度）"+size.width + "*" + size.height + "px");
        pop.show();
    },
    //隐藏已使用图片
    hideUsed: function () {
        $("#mod_thumbnail_list li img").each(function () {
            var item = $(this);
            if (item.attr("used_num") && item.attr("used_num") > 0) {
                item.addClass("opacity3");
            }
        });
    },
    //显示所有图片
    unHideUsed: function () {

        $("#mod_thumbnail_list li img").removeClass("opacity3");
    },

    //计算图像的使用次数
    computeUsedNum: function () {
        var data = window.BOOK_DATA.list;
        var t, n, count = 0;
        var hash = {};

        //先复位所有图像使用次数信息
        $("#mod_thumbnail_list li img").attr("used_num", 0);
        $("#mod_thumbnail_list .counter").html(0);

        for (var k in data) {
            if (data[k] && data[k].page_data) {
                t = data[k].page_data.imagebox_list
                if (t) {
                    for (var i = 0, len = t.length; i < len; i++) {
                        if (t[i].imageid) {
                            n = $("#imageid_" + t[i].imageid).attr("used_num") - 0;
                            $("#imageid_" + t[i].imageid).attr("used_num", n + 1);
                            $("#counter_" + t[i].imageid).html(n + 1);
                            if (!hash[t[i].imageid]) {
                                count++;
                                hash[t[i].imageid] = 1;
                            }
                        }
                    }
                }
            }
        }
        //设置用过的照片数目
        $("#thumbnail_used_count").html(count);
        //判断是否隐藏的照片
        var chk = $("#chk_hide_used");
        if (chk.attr("checked") == "checked") {
            mimo.Editor.ThumbnailList.hideUsed();
        }
    },

    // 缩略图拖动事件
    bindDraggable: function (item) {
        item = item || $("#mod_thumbnail_list img");

        //绑定可以拖动事件
        item.draggable(
            {
                cursor: "move",
                helper: function (event) {
                    return $("<img width=\"40\" height=\"40\" src=\"" + $(this).attr("src") + "\" />");
                },
                appendTo: "body",
                start: function (event, ui) {
                    //todo 
                }
            });
        // 大图预览
        item.click(function (e) {
            e.preventDefault();
            mimo.Editor.ThumbnailList.showBigThumbnail(e);
        });
    },
    // 删除事件
    bindDelete: function (item, isLi) {
        var p = mimo.Editor.ThumbnailList;
        var li = isLi ? item : $("li", item);
        $(li).hover(
            function () {
                // over
                $(this).addClass("hover");

            },
            function () {
                // out
                $(this).removeClass("hover");
            }
        );
        //删除按钮
        $(".btn_delete", item).click(function (e) {
            e.preventDefault();
            var item = $(this);
            var imageId = item.data("imageid");

            if (!confirm("确认删除照片吗?")) {
                return;
            }

            if ($("#imageid_" + imageId).attr("used_num") > 0) {
                alert("该相片已被使用,无法删除");
                return;
            }

            $.ajax({
                type: "POST",
                url: "/userimage/delete",
                data: { image_id: imageId },
                dataType: "json",
                success: function (response) {
                    if (response && response.ret == 1) {
                        item.parent().parent().remove();
                        p.computeWidth();
                    }
                }
            });
        });

        //左按钮
        $(".btn_rotate_left, .btn_rotate_right", item).click(function (e) {
            e.preventDefault();
            var item = $(this);
            var imageId = item.data("imageid");

            mimo.Editor.ThumbnailList.computeUsedNum();

            if ($("#imageid_" + imageId).attr("used_num") > 0) {
                alert("该相片已被使用,进行修改");
                return;
            }

            if (p.isRoating) {
                alert("有图片旋转中,请稍后再试一试");
                return;
            }

            var orientation = item.attr("class") == "btn_rotate_left" ? -90 : 90;
            p.isRoating = true;
            $.ajax({
                type: "POST",
                url: "/userimage/rotate",
                data: { image_id: imageId, orientation:  orientation},
                dataType: "json",
                success: function (response) {
                    if (response && response.ret == 1) {
                        
                        var img = $("#imageid_" + imageId);
                        img.attr("data-path",response.path);
                        img.attr("data-url", "/"+response.path);
                        img.attr("src", "/" + response.path + "_thumb.jpg");


                        var imgObj = p.hash[imageId];
                        if (imgObj) {
                            var oh = imgObj.original_height;
                            var ow = imgObj.original_width;
                            imgObj.src = "/" + response.path + "_thumb.jpg";
                            imgObj.url = response.path;
                            imgObj.file_path = response.path;
                            imgObj.original_height = ow;
                            imgObj.original_width = oh;

                        }
                        alert("旋转成功");
                    }
                    p.isRoating = false;
                },
                error: function () {
                    alert("旋转失败");
                    p.isRoating = false;
                }
            });
        });

    },
    //绑定事件
    addEvent: function () {
        var p = mimo.Editor.ThumbnailList;
        //上一页
        $("#mod_thumbnail_btn_prev").click(function (e) {
            e.preventDefault();
            p.prePage();
        });

        //下一页
        $("#mod_thumbnail_btn_next").click(function (e) {
            e.preventDefault();
            p.nextPage();
        });

        //隐藏已使用按钮
        $("#chk_hide_used").click(function (e) {
            //e.preventDefault();
            var item = $(this);
            if (item.attr("checked") == "checked") {
                p.hideUsed();
            } else {
                p.unHideUsed();
            }
        });

        //
        $("#thumbnail_big").click(function (e) {
            e.preventDefault();
            $("#thumbnail_big").hide();

        });

        // 设置每次滚动长度，单位 px
        var scroll_width = 100;
        var scroll_events = "mousewheel DOMMouseScroll MozMousePixelScroll";
        $(".thumbnail_warp").on(scroll_events, function (e) {
            var delta = e.originalEvent.wheelDelta || e.originalEvent.detail;
            // 滑轮向下滚动，滚动条向右移动，scrollleft+
            if (delta < 0) {
                $(".thumbnail_warp").scrollLeft($(".thumbnail_warp").scrollLeft() - delta);
            }
                // 滑轮向上滚动，滚动条向座移动，scrollleft-
            else {
                $(".thumbnail_warp").scrollLeft($(".thumbnail_warp").scrollLeft() - delta);
            }
        });

        //排序事件
        $(".thumbnail_order a").click(function (e) {
            e.preventDefault();
            var t = $(this);
            t.parent().children("a").removeClass("cur");
            t.addClass("cur");
            var action = t.attr("action");
            if (action) {
                mimo.Editor.ThumbnailList.getData(action);
            }
        });
    }
};

/**
 * 底色选择组件
 * @author masa
 * @namespace mimo.Editor.BackgroundPicker
 * @description 底色选择组件
 */
mimo.Editor.BackgroundPicker = {
    closeTimer: null,
    init: function () {
        var p = mimo.Editor.BackgroundPicker;
        p.addEvent();
    },
    addEvent: function () {
        var p = mimo.Editor.BackgroundPicker;
        //添加底色按钮事件
        //$("#background_color_picker_btn").click(function () {
        //    var item = $("#background_color_picker");
        //    if (item.css("display") == "none") {
        //        item.show();
        //        return;
        //    }
        //    item.hide();
        //    return false;
        //}); 

        //添加关闭按钮事件
        $("#background_color_picker_close_btn").click(function (e) {
            e.preventDefault();
            $("#background_color_picker").hide();
        });

        ////添加底色按钮事件
        //$("#background_color_picker_btn").click(function () {
        //    var item = $("#background_color_bar");
        //    if (item.css("display") == "none") {
        //        item.show();
        //        return;
        //    }
        //    item.hide();
        //    return false;
        //});

        var bar = $("#background_color_bar");
        $("#background_color_picker_btn").hover(
            function () {
                // over
                // 封面和内页的颜色不一样
                var isCover = mimo.Editor.PageEdit.currentEditPage.attr("num") == "cover";
                if (isCover) {
                    $("li", bar).show();
                    if (window.isWide) {
                        $("li", bar).hide();
                        $("li.color_page", bar).show();
                    }
                    if (window.isMpad) {
                        $("li", bar).hide();
                        //$("#background_color_bar").children("li").eq(0).show();
                    }
                } else {
                    $("li", bar).hide();
                    $("li.color_page", bar).show();
                    if (window.isMpad) {
                        $("li.color_page", bar).hide();
                    }
                }
                bar.show();
                clearTimeout(p.closeTimer);


            },
            function () {
                // out
                p.closeTimer = setTimeout(function () {
                    bar.hide();
                }, 600);
            }
        );

        bar.hover(
            function () {
                // over
                clearTimeout(p.closeTimer);

            },
            function () {
                // out
                p.closeTimer = setTimeout(function () {
                    bar.hide();
                }, 600);
            }
        );

        //添加颜色被点击事件
        $("#background_color_picker .color_list li,.color_bar li").each(
            function () {
                var item = $(this);
                //添加点击事件
                item.click(function (e) {
                    e.preventDefault();
                    var color = $(this).data("color");
                    //派发颜色选中事件
                    mimo.Event.dispatch("MIMO_BACKGROUND_COLOR_PICKER_EVENT", { color: color });
                });
            }
        );

        // 文字颜色按钮
        $("#text_color_picker_btn").click(function (e) {
            e.preventDefault();
            //派发字体颜色事件
            mimo.Event.dispatch("MIMO_TEXT_COLOR_PICKER_EVENT", {});
        });
    }

};

/**
 * 版式选择组件
 * @author masa
 * @namespace mimo.Editor.PagelayoutPicker
 * @description 版式选择组件
 */
mimo.Editor.PagelayoutPicker = {
    closeTimer:null,
    init: function () {
        var p = mimo.Editor.PagelayoutPicker;
        p.filterBySubType();
        p.addEvent();
    },
    // 更具图片过滤版式
    filterBySubType: function () {
        if (window.isMini) {
            $(".pagelayout_minibook").show();
        } else if (window.isView) {
            $(".pagelayout_viewbook").show();
        } else if (window.isWide) {
            $(".pagelayout_widebook").show();
        } else if (window.isMpad) {
            $(".pagelayout_mpadbook").show();
        }
    },
    // 设置位置
    setPosition: function () {
        var pop = $("#pop_layout");
        var btn = $("#pagelayout_picker_btn");
        var y = btn.offset().top + 45;
        var x = $("#section_layout_edit").offset().left;
        pop.css({ "left": x, "top": y });
        $("#layout_arrow_out").attr("class", "pop-arrow-up");
        $("#layout_arrow_in").attr("class", "pop-arrow-up-in");
        if (window.isMpad) {
            pop.css({ "top": y - $("#pop_layout").height() - 45 })
            $("#layout_arrow_out").attr("class", "pop-arrow-down");
            $("#layout_arrow_in").attr("class", "pop-arrow-down-in");
        }
        return;
        //
        var side = mimo.Editor.PageEdit.currentEditSide;
        var pos = mimo.Editor.PageEdit.currentEditPage.offset();
        if (side == "left") {
            pop.css(
                {
                    "left": pos.left + mimo.Editor.PageEdit.currentEditPage.width() + 10 + "px",
                    "top": pos.top + "px"
                }
                );
            $("#layout_arrow_out").attr("class", "pop-arrow-left");
            $("#layout_arrow_in").attr("class", "pop-arrow-left-in");
        } else {
            pop.css(
                {
                    "left": pos.left - pop.width() - 10 + "px",
                    "top": pos.top + "px"
                }
                );
            $("#layout_arrow_out").attr("class", "pop-arrow-right");
            $("#layout_arrow_in").attr("class", "pop-arrow-right-in");
        }
    },
    addEvent: function () {
        var p = mimo.Editor.PagelayoutPicker;

        //添加按钮事件
        $("#pagelayout_picker_btn").click(function (e) {
            e.preventDefault();


            var item = $("#pop_layout");
            if (item.css("display") == "none") {
                //处理下封面和内页版式的筛选
                var curPage = $(mimo.Editor.PageEdit.currentEditPage);
                var pageType = curPage.attr("page_type");

                //处理下扉页的选择
                if (curPage.attr("num") == "0") {
                    alert("扉页不支持更换版式");
                    return;
                }

                // 处理下版式的选中状态
                $("#pop_layout_bd li").removeClass("hl_border");
                $("." + curPage.attr("name"), item).addClass("hl_border");

                //当前选择的是封面
                if (pageType == "C") {
                    $(".pagelayout_C", item).show();
                    $(".pagelayout_P", item).hide();
                } else {
                    $(".pagelayout_C", item).hide();
                    $(".pagelayout_P", item).show();
                }
                p.setPosition();
                item.show();
                return;
            }
            item.hide();
            return false;
        })
            .hover(
            function () {
        clearTimeout(p.closeTimer);
            },
            function () {
                // out
                p.closeTimer = setTimeout(function () {
                    pop.hide();
                }, 3000);
            }
        );
        var pop = $("#pop_layout");
        pop.hover(
            function () {
                // over
                clearTimeout(p.closeTimer);

            },
            function () {
                // out
                p.closeTimer = setTimeout(function () {
                    pop.hide();
                }, 800);
            }
        );

        //添加关闭按钮事件
        $("#pagelayout_picker_close_btn").click(function (e) {
            e.preventDefault();
            $("#pagelayout_picker").hide();
        });

        //添加颜色被点击事件
        $("#pagelayout_picker li a,#pop_layout_bd li a").each(
            function () {
                var item = $(this);
                //添加点击事件
                item.click(function (e) {
                    e.preventDefault();
                    $("#pop_layout_bd li").removeClass("hl_border");
                    item.parent("li").addClass("hl_border");
                    var name = $(this).attr("name");
                    var type = $(this).attr("type");

                    //右边版式
                    if (mimo.Editor.PageEdit.currentEditSide == "right") {
                        if (name.length > 3) {
                            alert("右边页面不支持跨页版式哦,请选择左边页面");
                            return;
                        }
                    }

                    //最后一页
                    var t = mimo.Editor.PageEdit.currentEditPage;
                    if(t && (t.attr("num") == BOOK_DATA.page - 1)){
                        if (name.length > 3) {
                            alert("最后一页只有单面,不支持跨页版式");
                            return;
                        }
                    }
                    //派发颜色选中事件
                    mimo.Event.dispatch("MIMO_PAGELAYOUT_PICKER_EVENT", { name: name, type: type });
                });
            }
        );
    }

};

/**
 * 作品工具栏
 * @author masa
 * @namespace mimo.Editor.ToolsBar
 * @description 作品工具栏
 */
mimo.Editor.ToolsBar = {
    init: function () {
        var p = mimo.Editor.ToolsBar;
        p.setCompleteCount(p.getCompleteCount());
        p.addEvent();
    },
    //设置完成率
    setCompleteCount: function (count) {
        window.BOOK_DATA.complete_page = count;
        $("#complete_count").html(window.BOOK_DATA.complete_page);
        $("#edit_count").html(window.BOOK_DATA.page);
        $("#total_count").html(window.BOOK_DATA.page - 0 + 3);
    },
    //获取完成数目
    getCompleteCount: function () {
        var data = window.BOOK_DATA.list;
        var count = 0;
        var t;
        for (var k in data) {
            if (k == "author_info") {
                continue;
            }
            if (!isNaN(k)) {
                //右版
                if (k != 0 && k != 1 && k % 2 == 1) {
                    if (t = data[k - 1]) {
                        if (t.template_name.length > 3) {
                            count++;
                            continue;
                        }
                    }
                }
            }

            // 扉页不算编辑页面
            if (k != "0" && data[k] && data[k].finish === "true") {
                count++;
            }
        }
        return count;
    },
    addEvent: function () {

        $("#btn_add_page").click(function (e) {
            e.preventDefault();
            mimo.Editor.PreviewList.addPage();
        });

        $("#btn_minus_page").click(function (e) {
            e.preventDefault();
            mimo.Editor.PreviewList.minusPage();
        });

        $("#btn_page_manager").click(function (e) {
            e.preventDefault();
            mimo.Editor.PageManager.show();
        });
        

    }
};

/**
 * 预览列表
 * @author masa
 * @namespace mimo.Editor.PreviewList
 * @description 预览列表
 */
mimo.Editor.PreviewList = {
    //当前页码
    curIndex: 0,
    //总页数
    totalCount: 32,
    //每一页的像素偏移
    pagePx: 865,
    //每页显示跨页数目
    count: 10,
    data: [],
    // 当前选中的页面缩略图
    curPreview: null,
    init: function () {
        var p = mimo.Editor.PreviewList;
        p.present();
        p.addEvent();
        p.lisentEvent();
        mimo.Editor.PreviewList.selectPage("cover", "init");
    },
    //显示
    present: function () {
        var p = mimo.Editor.PreviewList;
        var data = window.BOOK_DATA;
        //总页数
        var pageCount = data.page;
        var previewHash = JSONBookPreview.list;
        p.totalCount = pageCount - 0;

        //开始布局页面缩略图
        var html = [];
        var tmp;

        // push 封面封底
        tmp = '\
        <li index="0">\
            <a class="pagelayout_bg blank" id="page_bottom" href="javascript:;" num="bottom" page_side="left" page_type="none">\
            </a>\
             <em class="img_page">封底</em>\
            <a class="pagelayout_bg {layout_class}" id="page_cover" class="right" href="javascript:;" num="cover" page_side="right" page_type="COVER" template_name="{template_name}">\
                {preview_img}\
            </a>\
            <em class="img_page_right">封面</em>\
        </li>';
        tmp = mimo.Template.format(tmp, {
            "template_name": data.list["cover"].template_name,
            "layout_class": (window.isWide || window.isMpad ? "p" : "")+data.list["cover"].template_name.toLowerCase() + "_r",
            "preview_img": previewHash["cover"] && previewHash["cover"]["path"] ? '<img src="/' + previewHash["cover"]["path"] + '_preview.jpg" />' : ""
        });
        html.push(tmp);

        // push 扉页
        tmp = '\
        <li index="1">\
            <a class="pagelayout_bg blank" id="page_0left" href="javascript:;" num="0left" page_side="left" _template_name="AUTHORINFO">\
            </a>\
            <em class="img_page">封面折页</em>\
            <a class="pagelayout_bg {layout_class}t1_r"  id="page_0" class="right" href="javascript:;" num="0" page_side="right" template_name="T1">\
                {preview_img2}\
            </a>\
            <em class="img_page_right">扉页</em>\
        </li>';
        tmp = mimo.Template.format(tmp, {
            "preview_img2": previewHash["0"] && previewHash["0"]["path"] ? '<img src="/' + previewHash["0"]["path"] + '_preview.jpg" />' : "",
            "layout_class": (window.isWide || window.isMpad ? "p" : "")
        });
        html.push(tmp);

        // push 第一页
        tmp = '\
        <li index="2">\
            <a class="pagelayout_bg blank" id="page_1_left" href="javascript:;" num="1_left" page_side="left">\
            </a>\
            <em class="img_page">扉页对页</em>\
            <a class="pagelayout_bg {layout_class}"  id="page_1" class="right" href="javascript:;" num="1" page_side="right" template_name="{template_name}">\
                {preview_img}\
            </a>\
            <em class="img_page_right">1</em>\
        </li>';
        tmp = mimo.Template.format(tmp,
            {
                "template_name": data.list["1"].template_name,
                "layout_class": (window.isWide || window.isMpad ? "p" : "") + data.list["1"].template_name.toLowerCase() + "_r",
                "preview_img": previewHash["1"] && previewHash["1"]["path"] ? '<img src="/' + previewHash["1"]["path"] + '_preview.jpg" />' : ""
            });
        html.push(tmp);

        //其它页面
        var p1;
        var p2;
        var template_name1;
        var template_name2;
        var layout_class1;
        var layout_class2;
        var preview_img1;
        var preview_img2;
        var index = 2;
        for (var i = 2, len = pageCount; i < len; i = i + 2) {
            index++;
            if (i != len && i != len - 1) {
                p1 = i;
                p2 = i + 1;
                template_name1 = data.list[p1]["template_name"];
                template_name2 =  data.list[p2]["template_name"];
                layout_class1 = (window.isWide || window.isMpad ? "p" : "") + template_name1.toLowerCase() + "_" + (p1 % 2 == 1 ? "r" : "l");
                layout_class2 = (window.isWide || window.isMpad ? "p" : "") + template_name2.toLowerCase() + "_" + (p2 % 2 == 1 ? "r" : "l");


                tmp = '\
                <li index="{index}">\
                    <a class="pagelayout_bg {layout_class1}"  id="page_{p1}" href="javascript:;" num="{p1}" page_side="left" template_name="{template_name1}">\
                        {preview_img1}\
                    </a>\
                    <em class="img_page">{p_num1}</em>\
                    <a class="pagelayout_bg {layout_class2}"  id="page_{p2}" class="right" href="javascript:;" num="{p2}" page_side="right" template_name="{template_name2}">\
                        {preview_img2}\
                    </a>\
                    <em class="img_page_right">{p_num2}</em>\
                </li>';
                tmp = mimo.Template.format(tmp,
                    {
                        index:index,
                        p1: p1,
                        p_num1: p1,
                        template_name1: template_name1,
                        layout_class1: layout_class1,
                        preview_img1: (previewHash[p1] && previewHash[p1]["path"]) ? '<img src="/' + previewHash[p1]["path"] + '_preview.jpg" />' : "",
                        p2: p2,
                        p_num2: p2,
                        template_name2: template_name2,
                        layout_class2: layout_class2,
                        preview_img2: previewHash[p2] && previewHash[p2]["path"] ? '<img src="/' + previewHash[p2]["path"] + '_preview.jpg" />' : ""
                    });
            } else {
                p1 = i;
                template_name1 = data.list[p1]["template_name"];
                layout_class1 = (window.isWide || window.isMpad ? "p" : "") + template_name1.toLowerCase() + "_" + (p1 % 2 == 1 ? "r" : "l");
                tmp = '\
                <li index="{index}">\
                    <a class="pagelayout_bg {layout_class1}"  id="page_{p1}" href="javascript:;" num="{p1}" page_side="left" template_name="{template_name1}">\
                        {preview_img1}\
                    </a>\
                    <em class="img_page">{p_num1}</em>\
                    <a  class="pagelayout_bg blank"  id="page_blank" class="right" href="javascript:;" num="last" data-side="right">\
                    </a>\
                    <em class="img_page_right"></em>\
                </li>';
                tmp = mimo.Template.format(tmp,
                    {
                        index: index,
                        p1: p1,
                        p_num1: p1,
                        p_num2: p1 + 1,
                        template_name1: template_name1,
                        layout_class1: layout_class1,
                        preview_img1: previewHash[p1] && previewHash[p1]["path"] ? '<img src="/' + previewHash[p1]["path"] + '_preview.jpg" />' : ""
                    });
            }
            html.push(tmp);
        }

        tmp = '\
                <li index="{index}">\
                    <a class="pagelayout_bg {layout_class1}copyright"  id="page_{p1}" href="javascript:;" num="{p1}" page_side="left" template_name="{template_name1}">\
                        {preview_img1}\
                    </a>\
                    <em class="img_page">{p_num1}</em>\
                    <a  class="pagelayout_bg blank"  id="page_blank" class="right" href="javascript:;" num="last_bottom" data-side="right">\
                    </a>\
                    <em class="img_page_right">{p_num2}</em>\
                </li>';
        tmp = mimo.Template.format(tmp,
        {
            index: index + 1,
            p1: "copyright",
            p_num1: "版权",
            p_num2:"封底",
            template_name1: "COPYRIGHT",
            layout_class1: (window.isWide || window.isMpad ? "p" : ""),
            preview_img1: ""
        });
        html.push(tmp);

        $("#mod_preview_thumnail_list").html(html.join(""));

        //
        p.presentCross();

        //图片点击
        $("#mod_preview_thumnail_list a").click(function (e) {
            e.preventDefault();
            var num = $(e.currentTarget).attr("num");
            //传递点击page事件
            p.selectPage(num, "previewlist");
        });
    },
    //处理跨页缩略图
    presentCross: function () {
        var layout_info;
        var num;
        var template_name;
        $("#mod_preview_thumnail_list a").each(function (i, v) {
            num = $(v).attr("num");
            if (!isNaN(num)) {
                template_name = $(v).attr("template_name")
                layout_info = mimo.Editor.Common.getLayoutInfo(num, template_name);
                if (layout_info && layout_info.cross_type == "T") {
                    mimo.Editor.PreviewList.setCrossStyle(num, true);
                }
            }
        });
    },
    // 获取新的bookinfo
    rebuildBookInfo: function (response) {
        var p = mimo.Editor.PreviewList;
        window.JSONBookInfo = response.book_info;
        window.JSONBookPreview = response.book_preview;
        mimo.Editor.initData();
        p.present();
    },
    //改变P数
    changePage: function (count) {
        count = count - 3;
        var data = {
            "count": count,
            "works_id": window.WorksId,
            "book_id": window.BookId
        };

        $.ajax({
            type: "POST",
            url: "/editor/changepage",
            data: data,
            dataType: "json",
            success: function (response) {
                if (response && response.ret == 1) {
                    window.BOOK_DATA.page = count;
                    mimo.Editor.showAlert(1000, "设置成功");
                    mimo.Editor.ToolsBar.setCompleteCount();
                    mimo.Editor.PreviewList.rebuildBookInfo(response);
                }
            }
        });
    },
    // 滚动到某页
    rollToPage: function (index) {
        var item = $("#mod_preview_thumnail_list li");
        var pos = $($("#mod_preview_thumnail_list li").get(index)).position();
        var offsetLeft;
        if (index > 1 && index < item.length) {
            offsetLeft = item.eq(index - 2).position().left;
            $("#mod_preview_thumnail_list").stop(true, false).animate({ left: -offsetLeft }, 200);
        }
        if (index == 1 && $("#mod_preview_thumnail_list").position().left < 0) {
            $("#mod_preview_thumnail_list").stop(true, false).animate({ left: 0 }, 200);
        }
        var curIndex = Math.ceil((index-0 + 1) / 5) - 1;
        mimo.Editor.PreviewList.curIndex = curIndex;
    },
    //上一页
    prePage: function () {
        var p = mimo.Editor.PreviewList;
        if (p.curIndex == 0) {
            // 如果是第一页,且有偏移,复位下
            if ($("#mod_preview_thumnail_list").position().left < 0) {
                $("#mod_preview_thumnail_list").stop(true, false).animate({ left: 0 }, 200);
            }
            return;
        }
        p.curIndex--;
        var offsetLeft = p.curIndex * p.pagePx;
        $("#mod_preview_thumnail_list").stop(true, false).animate({ left: -offsetLeft }, 200);

    },
    //下一页
    nextPage: function () {
        
        var p = mimo.Editor.PreviewList;
        if (p.curIndex == Math.ceil((p.totalCount + 6) / p.count) - 1) {
            return;
        }
        p.curIndex++;
        var offsetLeft = p.curIndex * p.pagePx;
        $("#mod_preview_thumnail_list").stop(true, false).animate({ left: -offsetLeft }, 200);

    },

    //变成跨页
    addCrossStyle: function () {
        $('.edit_area_warp .pagelayout_left_side_warp').addClass('cross_pagelayout_left_side_warp');
        $('.tool_bot').addClass('cross_tool_bot');
        $('.edit_area_warp .pagelayout_right_side_warp').hide();
    },

    //恢复单页
    removeCrossStyle: function () {
        $('.edit_area_warp .pagelayout_left_side_warp').removeClass('cross_pagelayout_left_side_warp');
        $('.tool_bot').removeClass('cross_tool_bot');
        $('.edit_area_warp .pagelayout_right_side_warp').show();
    },
    //点击页面
    selectPage: function (num, from) {
        var p = mimo.Editor.PreviewList;
        if (num == "bottom") {
            num = "cover";
        }
        if (isSpine) {
            if (num == "cover") {
                mimo.Event.dispatch("MIMO_EDIT_SPINE_EVENT");
                $("#section_layout_edit").addClass("edit_spine");
            } else {
                $("#section_layout_edit").removeClass("edit_spine");
            }
        }
        p.removeCrossStyle();
        //从预览图切换的,要保存一下哦
        if (from == "previewlist") {
            mimo.Editor.PageEdit.saveCurrentPage();
        }

        //取消之前的高亮
        $("#mod_preview_thumnail_list li.active").removeClass("active");

        //左侧不可编辑页面列表
        var blankList = {
            "bottom": ["cover", "left"],
            "0left": ["0", "left"],
            "1_left": ["1", "left"],
            "cover": ["cover", "left"],
            "0": ["0", "left"],
            "1": ["1", "left"],
            "copyright": ["copyright", "right"],
            "last": ["last", "right"]
        };

        var lastPage = BOOK_DATA.page - 1;

        //如果点击的是左侧不可编辑页面,那么可编辑的还是右边
        if (num == lastPage || num in blankList) {
            //清空空白编辑区域
            if (blankList[num] && blankList[num][1] == "left") {
                mimo.Editor.PageEdit.emptyPage($("#pagelayout_left_side_edit"));
                $("#pagelayout_left_side_edit").html(TRIM_LINE_HTML);
            } else if (num == lastPage || num == "last" || num == "copyright") {
                mimo.Editor.PageEdit.emptyPage($("#pagelayout_right_side_edit"));
                $("#pagelayout_right_side_edit").html(TRIM_LINE_HTML);
            }


            //点击的是最后一页
            if (num == "last") {
                num = lastPage;
            } else {
                blankList[num] && (num = blankList[num][0]);
            }
        }

        var page = $("#page_" + num);
        var side = page.attr("page_side");
        var template_name = page.attr("template_name");
        var page_type = page.attr("page_type");
        var cross_type = page.attr("cross_type");
        if (page_type && page_type == "COVER") {
            page_type = "COVER";
        } else {
            page_type = "PAGE";
        }
        //添加高亮
        page.parent().addClass("active");

        mimo.Editor.PreviewList.rollToPage(page.parent().attr("index"));

        //派发某个页面被点击事件
        mimo.Event.dispatch("MIMO_PAGE_PREVIEW_THUMBNAIL_CLICK_EVENT",
            {
                "num": num,
                "side": side,
                "template_name": template_name,
                "page_type": page_type,
                "cross_type":cross_type
            }
        );
        mimo.Editor.TextEditor.hide();
        mimo.Editor.ImageTools.hide();
    },
    //设置预览图
    setPreviewImg: function (num) {
        
        var path;
        var item;
        var img;
        if (JSONBookPreview.list[num] && JSONBookPreview.list[num].path != undefined) {
            path = JSONBookPreview.list[num].path;
            item = $("#page_" + num);
            if (item[0]) {
                img = item.children("img");
                if (img[0]) {
                    if (path.length == 0) {
                        img.remove();
                    } else {
                        img.attr("src", "/" + path + "_preview.jpg");
                    }
                } else {
                    $('<img src="/' + path + '_preview.jpg"' + '/>').appendTo($("#page_" + num ));
                }
            }
        }
    },
    setCrossStyle: function (num, isCross) {
        if (isCross) {
            $('#page_' + num).parent('li').addClass('cross_li');
            $('#page_' + num).parent('li').children('a').eq(1).hide();

        } else {
            $('#page_' + num).parent('li').removeClass('cross_li');
            $('#page_' + num).parent('li').children('a').show();
        }
    },
    //绑定事件
    addEvent: function () {
        var p = mimo.Editor.PreviewList;
        //上一页
        $("#mod_preview_thumnail_btn_pre").click(function (e) {
            e.preventDefault();
            p.prePage();
        });

        //下一页
        $("#mod_preview_thumnail_btn_next").click(function (e) {
            e.preventDefault();
            p.nextPage();
        });
    },
    lisentEvent: function () {
        //监听版式点击事件
        mimo.Event.addEventListener("MIMO_PAGELAYOUT_PICKER_EVENT", function (eventObj, dataObj) {
            var curEditPage = mimo.Editor.PageEdit.currentEditPage;
            var name = dataObj.name;
            var type = dataObj.type;
            var num = curEditPage.attr("num");
            var crossType = curEditPage.attr("cross_type");
            var layout_info = mimo.Editor.Common.getLayoutInfo(num, name);

            //if (crossType != layout_info.cross_type) {
                if (layout_info.cross_type == "T") {
                    mimo.Editor.PreviewList.setCrossStyle(num, true);
                } else {
                    mimo.Editor.PreviewList.setCrossStyle(num, false);
                }
            //}
            $("#page_" + num).attr("template_name", name);
        });
    }
};

/**
 * 大图预览
 * @author masa
 * @namespace mimo.Editor.Preview
 * @description 大图预览
 */
mimo.Editor.Preview = {
    curLeftPage: null,
    curRightPage: null,
    curIndex:0,
    list: null,
    init: function () {
        var p = mimo.Editor.Preview;
        p.addEvent();
    },
    // 初始化预览序列
    initList: function () {
        var tmp = ["bottom", "cover", "0left", "0", "1_left", "1"];
        var pageCount = BOOK_DATA.page - 0;

        for (var i = 2; i < pageCount; i++) {
            tmp.push(i);
        }
        tmp.push(pageCount + "_last");
        tmp.push("copyright");
        tmp.push("last_bottom");

        var list = [];
        var aryTmp = [];
        var count = 0;
        for (var i = 0; i < tmp.length; i++) {
            aryTmp.push(tmp[i]);
            count++;
            if (count == 2 || i == tmp.length - 1) {
                list.push(aryTmp);
                aryTmp = [];
                count = 0;
            }
        }
        mimo.Editor.Preview.list = list;
    },

    show: function (isFromFirst) {

        mimo.Editor.ImageTools.hide();

        var p = mimo.Editor.Preview;
        p.initList();

        var dialog = $("#preview_dialog");
        mimo.Editor.showMaskLayout();

        dialog.show();
        //设置文本编辑器位置
        var topPx = ($(window).height() / 2 - dialog.height() / 2) + $(document).scrollTop();
        dialog.css({
            "top": topPx + "px"
        });

        if (isFromFirst) {
            p.setContent(null, "cover");
        } else {
            p.curIndex = p.getIndex();
            var obj = p.list[p.getIndex()];
            p.setContent(obj[0], obj[1]);
        }
    },
    hide: function () {
        var dialog = $("#preview_dialog");
        dialog.hide();
        mimo.Editor.hideMaskLayout();

    },
    getIndex: function () {
        var num = $("#pagelayout_right_side_edit").attr("num");
        if (!num) {
            num = $("#pagelayout_left_side_edit").attr("num");
        }
        var index = $("#page_" + num).parent("li").attr("index");
        return index;
    },
    adjustWide: function (num) {
        if (!window.isWide && !window.isMpad) {
            return;
        }
        if (window.isMpad) { //如果是mpad
            if (num == "cover") {
                $(".preview_dialog .page").css("height", 483);
                $(".preview_dialog .box .backbone").css("height", 483);
                $(".preview_dialog").css("margin-left", -540);
            } else {
                $(".preview_dialog .page").css("height", 709);
                $(".preview_dialog .box .backbone").css("height", 709);
                $(".preview_dialog").css("margin-left",-511);
                
            }
            return;
        }
        if (window.isWide) {
            if (num == "cover") {
                $(".preview_dialog .page").css("height", 281);
                $(".preview_dialog .box .backbone").css("height", 281);
                $(".preview_dialog .box").css("height", 283);
            } else {
                $(".preview_dialog .page").css("height", 403);
                $(".preview_dialog .box .backbone").css("height", 403);
            }
        }
    },
    setContent: function (leftNum, rightNum) {
        var p = mimo.Editor.Preview;
        var left = $("#preview_dialog .left_page");
        var right = $("#preview_dialog .right_page");

        leftNum = leftNum || $("#pagelayout_left_side_edit").attr("num");
        rightNum = rightNum || $("#pagelayout_right_side_edit").attr("num");

        //兼容逻辑
        p.adjustWide(rightNum);

        var data = JSONBookPreview.list;
        //data["0"] = { "num": "0", path: data["cover"].path };
        //data["0"].path = data["cover"].path ? data["cover"].path + "_flybeaf" : "";

        data["copyright"] = { "num": "copyright", path: data["cover"].path };
        data["copyright"].path = data["cover"].path ? data["cover"].path + "_copyright" : "";
        //复位
        $("#preview_dialog .backbone").show();
        left.empty();
        left.removeAttr("num");
        left.attr("num", leftNum);
        left.children("img").removeClass("cross_preview");
        right.show();
        right.empty();
        right.attr("num", rightNum);
        right.attr("num");
        $(".big_left,.big_right").hide();
        $(".tools .edit").hide();

        //设置
        if (data[leftNum] && data[leftNum].path) {
            left.append('<img src="/' + data[leftNum].path + '_1x.jpg" />');
            left.attr("path", data[leftNum].path);
            if (data[leftNum].type == 1) {
                $("img", left).addClass("cross_preview");
                right.hide();
                $("#preview_dialog .backbone").hide();
            }
            if (window.isWide || window.isMpad) {
                $(".big_left").attr("href", "/" + data[leftNum].path + "_1x.jpg").attr("rel", "lightbox").show();
            } else {
                $(".big_left").attr("href", "/" + data[leftNum].path + "_2x.jpg").attr("rel", "lightbox").show();
                //$(".big_left").click(function (e) {
                //    e.preventDefault();
                //    p.showBig(data[leftNum].path);
                //}).show();
            }

            if (leftNum != "cover" || leftNum != "copyright") {
                $(".edit_left").show();
            }

        }

        if (data[leftNum]) {
            $(".edit_left").show();
        }

        if (data[rightNum] && data[rightNum].path) {
            right.append('<img src="/' + data[rightNum].path + '_1x.jpg" />');
            right.attr("path", data[rightNum].path);
            if (window.isWide || window.isMpad) {
                if (data[leftNum] && data[leftNum].type == 1) {
                } else {
                    if ((window.isMpad || window.isWide) && rightNum == "cover") {
                        left.append('<img src="/' + data[rightNum].path + '_integral_cover.jpg" width="1080" />');
                        left.attr("path", data[rightNum].path);
                        $("img", left).addClass("cross_preview");
                        right.hide();
                        $("#preview_dialog .backbone").hide();
                        if (window.isMpad || window.isWide) {
                            $(".big_left").attr("href", "/" + data[rightNum].path + "_integral_cover.jpg").attr("rel", "lightbox").show();
                        } else {
                            $(".big_left").attr("href", "/" + data[rightNum].path + "_1x.jpg").attr("rel", "lightbox").show();
                        }
                        
                    } else {
                        
                        $(".big_right").attr("href", "/" + data[rightNum].path + "_1x.jpg").attr("rel", "lightbox").show();
                    }
                }
            } else {
                $(".big_right").attr("href", "/" + data[rightNum].path + "_2x.jpg").attr("rel", "lightbox").show();
                //$(".big_right").click(function (e) {
                //    e.preventDefault();
                //    p.showBig(data[rightNum].path);
                //}).show();
            }
        }

        if (data[rightNum]) {
            if (data[leftNum] && data[leftNum].type == 1) {
            } else {
                if ((window.isMpad || window.isWide) && rightNum == "cover") {
                    $(".edit_right").hide();
                } else {
                    $(".edit_right").show();
                }
            }
        }

    },
    prev: function () {
        var p = mimo.Editor.Preview;
        var obj = p.getPageListNum("prev");
        if (obj) {
            p.setContent(obj[0], obj[1]);
        }

    },
    next: function () {
        
        var p = mimo.Editor.Preview;
        var obj = p.getPageListNum("next");
        if (obj) {
            p.setContent(obj[0], obj[1]);
        }
    },
    edit: function () {
        var p = mimo.Editor.Preview
        var num = mimo.Editor.Preview.getRightPageNum();
        mimo.Editor.PreviewList.selectPage(num)
        p.hide();
    },
    // 显示大图
    showBig: function (path) {
        var p = mimo.Editor.Preview
        var item = $("#preview_2x");
        var height = 640;
        //设置位置
        var topPx = ($(window).height() / 2 - 640 / 2) + $(document).scrollTop();
        item.css({
            "top": topPx + "px"
        });
        item.show();
        $("#preview_dialog").hide();

        if (item.attr("has_init") != "true") {
            item.click(function (e) {
                e.preventDefault();
                p.hideBig();

            });
            item.attr("has_init", true);
        }

        if (path) {
            $("#preview_2x img").attr("src", "/" + path + "_2x.jpg");
        }
    },
    // 隐藏小图
    hideBig: function (obj) {
        $("#preview_2x img").removeAttr("src");
        $("#preview_2x").hide();
        $("#preview_dialog").show();
    },
    // 获取右边页面的num
    getRightPageNum: function () {
        var right = $("#preview_dialog .right_page").attr("num");
        var left = $("#preview_dialog .left_page").attr("num");

        //判断是否跨页
        var isCross;
        var layout_info;
        if (typeof left != "undefined") {
            var t = BOOK_DATA.list[left].template_name;
            layout_info = mimo.Editor.Common.getLayoutInfo(left, t);
            if (layout_info.cross_type == "T") {
                return left;
            }
        }
        var num = right;
        if( typeof(num) != "undefined"){
            if(num.indexOf("_last") > -1){
                num = left;
            }
        }
        return num;
    },
    getPageListNum: function (direcion) {
        var p = mimo.Editor.Preview;
        var pageCount = BOOK_DATA.page - 0;
        // 向下翻页
        if (direcion == "next") {
            if (p.curIndex == p.list.length) {
                return null;
            } else {
                p.curIndex++;
                return p.list[p.curIndex];
            }
        }

        //向上
        if (direcion == "prev") {
            if (p.curIndex == 0) {
                return null;
            } else {
                p.curIndex--;
                return p.list[p.curIndex];
            }
        }
    },
    addEvent: function () {
        var p = mimo.Editor.Preview;
        // 关闭按钮
        $("#preview_dialog .close").click(function (e) {
            e.preventDefault();
            p.hide();
        });

        // 上一页
        $("#preview_dialog .prev").click(function (e) {
            e.preventDefault();
            p.prev();
        });

        // 下一页
        $("#preview_dialog .next").click(function (e) {
            e.preventDefault();
            p.next();
        });

        // 编辑
        $("#preview_dialog .edit").click(function (e) {
            e.preventDefault();
            p.edit();
        });
    }

};

/**
 * 文本编辑
 * @author masa
 * @namespace mimo.Editor.TextEditor
 * @description 文本编辑
 */
mimo.Editor.TextEditor = {
    //当前编辑文本框
    curTextBox: null,
    //当前文本框参数
    curConfig: {},
    textArea: null,
    textEditor: null,
    curVal:null,
    init: function () {
        var p = mimo.Editor.TextEditor;
        //先绑定一些元件先
        p.textArea = $("#text_area");
        p.textEditor = $("#pop_texteditor");

        p.addEvent();
        p.lisentEvent();
    },
    //显示文本框
    show: function (textBox) {
        mimo.Editor.showMaskLayout(0.1);
        var p = mimo.Editor.TextEditor
        var item = $(textBox);
        var line = item.attr("max_line");
        var length = item.attr("max_length");
        var align = item.attr("align");
        var tips_info = item.attr("tips_info");
        var content = item.html();
        p.curTextBox = item;
        if (content == "在此输入文字~" || content == tips_info) {
            content = "";
        }
        p.curVal = p.decode(content);

        var textarea = $("#pop_texteditor .edit_area input");
        var input = $("#pop_texteditor .edit_area textarea");
        textarea.show();
        input.show();
        if (line == 1) {
            p.textArea = textarea;
            input.hide();
        } else {
            p.textArea = input;
            textarea.hide();
        }

        //保存文本配置
        p.curConfig = {
            "max_line": line,
            "max_length": length,
            "align": align,
            "content": content
        };

        var textArea = p.textArea;
        textArea.css("height", (line * 25) > 400 ? 400 : (line * 25) + "px");
        textArea.css("text-align", align);
        textArea.val(p.toRn(p.curVal));
        p.setAlignBtn(align);

        //检查长度
        p.calculateInput(p.textArea);


        //显示masklayout
        //mimo.Editor.showMaskLayout();
        p.textEditor.show();
        textArea[0].focus();
        if ($.browser.webkit) {
            textArea[0].select();
            window.getSelection().collapseToEnd();
        } else if ($.browser.ie) {
            var rng = textArea[0].createTextRange();
            rng.text = textArea[0].value;
            rng.select();
            rng.collapse(false);
        }

        p.setPosition(line);
        //设置文本编辑器位置
        //var topPx = ($(window).height() / 2 - p.textEditor.height() / 2) + $(document).scrollTop();
        //p.textEditor.css({
        //    "top": topPx + "px"
        //});
    },
    selectRange: function (start, end) {
        var p = mimo.Editor.TextEditor;
        var textarea = p.textArea[0];
        if (textarea.setSelectionRange) {
            textarea.setSelectionRange(start, end);
        } else {
            var range = textarea.createTextRange();
            range.collapse(true);
            range.moveStart('character', start);
            range.moveEnd('character', end);
            range.select();
        }
        textarea.focus();
    },
    hide: function () {
        var p = mimo.Editor.TextEditor;
        p.textEditor.hide();
        mimo.Editor.hideMaskLayout();
    },
    // 设置对齐按钮
    setAlignBtn: function (align) {
        var str = "a." + align;
        $("#pop_texteditor .tools_bar a").removeClass("active");
        $("#pop_texteditor " + str).addClass("active");
    },
    setContent: function (isCancel, content) {

        var p = mimo.Editor.TextEditor
        var val = isCancel ? content : p.textArea.val();
        if (val.length == 0) {
            //没有内容,要把底色加上
            $(p.curTextBox[0]).addClass("text_box_background");
            $(p.curTextBox[0]).html("在此输入文字~");
        } else {
            //去掉底色
            $(p.curTextBox[0]).removeClass("text_box_background");
            if (isCancel) {
                $(p.curTextBox[0]).html(p.toBr(p.encode(val.replace(/<br>/g,"\n"))));
            } else {
                $(p.curTextBox[0]).html(p.toBr(p.encode(val)));
                
            }
        }


        // 设置编辑状态
        p.curTextBox.parent(".pagelayout_edit, .spine, .author_info").attr("has_edited", true);
        //p.curTextBox.parent(".spine").attr("has_edited", true);
        //p.curTextBox.parent(".author_info").attr("has_edited", true);
        mimo.Editor.PageEdit.cacheCurrentPage();
    },
    setPosition: function (line) {
        var p = mimo.Editor.TextEditor;
        var pos = $(p.curTextBox).offset();

        // 单行文本
        if (line == 1) {
            $("#pop_texteditor").css({
                "left": pos.left + p.curTextBox.width() / 2 - $("#pop_texteditor").width() / 2 + "px",
                "top": pos.top - 150 + "px"
            });

            $("#arrow_out").attr("class", "pop-arrow-down");
            $("#arrow_in").attr("class", "pop-arrow-down-in");
        } else {
            var side = mimo.Editor.PageEdit.currentEditSide;
            var left;
            var top;
            if (side == "left") {
                left = pos.left + p.curTextBox.width() + 10;
                $("#arrow_out").attr("class", "pop-arrow-left");
                $("#arrow_in").attr("class", "pop-arrow-left-in");
            } else {
                left = pos.left - $("#pop_texteditor").width() - 10;
                $("#arrow_out").attr("class", "pop-arrow-right");
                $("#arrow_in").attr("class", "pop-arrow-right-in");
            }

            $("#pop_texteditor").css({
                "left": left + "px",
                //"top": pos.top + p.curTextBox.height() / 2 + "px"
                "top": pos.top + p.curTextBox.height() / 2 - $("#pop_texteditor").height() / 2 + "px"
            });
        }
    },
    confirm: function () {
        var p = mimo.Editor.TextEditor
        p.checkContent(function (data) {
            if (data.index == 0) {
                p.setContent();
                p.hide();
            } else if(data.index){
                var val = p.textArea.val();
                p.selectRange(data.index, val.length);
                alert("你输入的文字超出最大限制,请修改");
            }
        });
        
    },
    checkContent: function (callback) {
        var p = mimo.Editor.TextEditor;
        var t = p.curTextBox;
        
        var name = t.attr("name");
        var align = t.attr("align");
        var x = t.attr("x");
        var y = t.attr("y");
        var width = t.attr("width");
        var height = t.attr("height");
        var pt = t.attr("pt");
        var max_line = t.attr("max_line");
        var max_length = t.attr("max_length");
        var direction = t.attr("direction");
        var space = t.attr("space");
        // 如果是单行 直接走前端校验
        if (max_line == 1 && direction == "vertival") {
            callback({ index: 0 });
            return;
        }
        $.ajax({
            type: "POST",
            url: "/editor/checktextboxcontent",
            data: {
                name: name,
                align: align,
                x: x,
                y: y,
                width: width,
                height: height,
                pt: pt,
                max_line: max_line,
                max_length: max_length,
                direction: direction,
                space:space,
                content: p.textArea.val()
            },
            dataType: "json",
            success: function (response) {
                if (response.ret == 0) {
                    callback({ index: 0 });
                } else if(response.ret == 1){
                    callback({ index: response.index });
                }
            },
            error: function () {
                alert("出错啦!\n" + p.textArea.val());
            }
        });

    },
    toBr: function (content) {
        content = content || "";
        content = content.replace(/\r/ig, "").replace(/\t/g, "");
        return content.replace(/\n/gi, "<br>").replace(/ /g, "&nbsp;");
        //if ($.browser.msie || $.browser.mozilla) {
        //    return content.replace(/\n/gi, "<br>").replace(/ /g, "&nbsp;");
        //} else {
        //    return content.replace(/\n/gi, "<br>").replace(/ /g, "&nbsp;");
        //}
    },
    toRn: function (content) {
        content = content || "";
        return content.replace(/\<br\>/gi, "\n").replace(/\&nbsp;/g, " ");
        //if ($.browser.msie || $.browser.mozilla) {
        //    return content.replace(/\<br\>/gi, "\n").replace(/\&nbsp;/g, " ");
        //} else {
        //    return content.replace(/\<br\>/gi, "\n").replace(/\&nbsp;/g, " ");
        //}
    },
    encode: function (content) {
        //< &lt;
        //> &gt;
        //' &#39;
        //" &quot;
        //& &amp;
        //空格 &nbsp;
        content = content || "";
        return content.replace(/\&/g, "&amp;")
                        .replace(/\</g, "&lt;")
                        .replace(/\>/g, "&gt;")
                        .replace(/'/g, "&#39;")
                        .replace(/"/g, "&quot;")
                        .replace(/ /g, "&nbsp;");
    },
    decode: function (content) {
        content = content || "";
        return content.replace(/&amp;/g,"&")
                        .replace(/&lt;/g, "<")
                        .replace(/&gt;/g, ">")
                        .replace(/&#39;/g, "\'")
                        .replace(/&quot/g, "\"")
                        .replace(/&nbsp;/g, " ");
    },
    // 获取指定长度字符
    getByteVal: function (val, max) {
        var returnValue = '';
        var byteValLen = 0;
        for (var i = 0; i < val.length; i++) {
            if (val.charAt(i).match(/[^\x00-\xff]/ig) != null)
                byteValLen += 2;
            else
                byteValLen += 1;
            if (byteValLen > max)
                break;
            returnValue += val.charAt(i);
        }
        return returnValue;
    },

    // 获取字符实际长度
    getByteCount: function (val) {
        var byteValLen = 0;
        for (var i = 0; i < val.length; i++) {
            if (val.charAt(i).match(/[^\x00-\xff]/ig) != null)
                byteValLen += 2;
            else
                byteValLen += 1;
        }
        return byteValLen;
    },

    checkInput: function (e) {
        var input = $(e.currentTarget);
        mimo.Editor.TextEditor.calculateInput(input);
    },
    // 检查输入的长度
    calculateInput: function (input) {
        var p = mimo.Editor.TextEditor;
        var texbox = mimo.Editor.TextEditor.curTextBox;
        var max_line = texbox.attr("max_line");
        var max_length = texbox.attr("max_length");
        var tips;

        if (max_line == 1) {
            var count = p.getByteCount(input.val());
            if (count > max_length * 2) {
                input.val(p.getByteVal(input.val(), max_length * 2));
                tips = mimo.Template.format('你还可以输入{0}/{1}个字符(共{2}个中文)', max_length * 2 - count, max_length * 2, max_length);
            } else {
                tips = mimo.Template.format('你还可以输入{0}/{1}个字符(共{2}个中文)', max_length * 2 - count, max_length * 2, max_length);
            }
        } else if (max_line > 1) {
            tips = mimo.Template.format('您最多可以输入{0}行文字', max_line);
            //return;
            //var count = p.getByteCount(input.val());
            //var linecount = 0;
            //if (count > max_length * 2) {
            //    input.val(p.getByteVal(input.val(), max_length * 2));
            //    tips = mimo.Template.format('你还可以输入{0}/{1}个字符或{3}/{4}行文字(共{2}个中文)', max_length * 2 - count, max_length * 2, max_length, max_line, max_line);
            //} else {
            //    tips = mimo.Template.format('你还可以输入{0}/{1}个字符或{3}/{4}行文字(共{2}个中文)', max_length * 2 - count, max_length * 2, max_length, max_line, max_line);
            //}
        }
        $("#pop_texteditor_tips").html(tips);
    
    },
    addEvent: function () {
        var p = mimo.Editor.TextEditor;
        //取消
        $("#pop_texteditor .cancel").click(function (e) {
            e.preventDefault();
            p.setContent(true, p.curVal);
            p.hide();
        });
        //确定
        $("#pop_texteditor .confirm").click(function (e) {
            e.preventDefault();
            p.confirm();
        });

        //左对齐
        $("#pop_texteditor a.left").click(function (e) {
            e.preventDefault();
            p.setAlignBtn("left");
            p.curTextBox.css("text-align", "left");
            p.textArea.css("text-align", "left");
            p.curTextBox.attr("align", "left");
        });

        //居中
        $("#pop_texteditor a.center").click(function (e) {
            e.preventDefault();
            p.setAlignBtn("center");
            p.curTextBox.css("text-align", "center");
            p.textArea.css("text-align", "center");
            p.curTextBox.attr("align", "center");
        });

        //右对齐
        $("#pop_texteditor a.right").click(function (e) {
            e.preventDefault();
            p.setAlignBtn("right");
            p.curTextBox.css("text-align", "right");
            p.textArea.css("text-align", "right");
            p.curTextBox.attr("align", "right");
        });

        //输入框事件
        $("#pop_texteditor .edit_area input,#pop_texteditor .edit_area textarea").bind("keyup", function (e) {
            p.checkInput(e);
            p.setContent()
        });
    },
    lisentEvent: function () {
        var p = mimo.Editor.TextEditor;
        //监听文本框点击
        mimo.Event.addEventListener("MIMO_TEXT_BOX_CLICK_EVENT", function (eventObj, dataObj) {
            p.show(dataObj.textBox);
        });
    }
};

/**
 * 数据交互模块
 * @author masa
 * @namespace mimo.Editor.DataCenter
 * @description 数据交互模块
 */
mimo.Editor.DataCenter = {

    // 更新缓存中的数据
    cachePageData: function (list, callback) {
        var pageEdit = mimo.Editor.PageEdit;
        var obj;
        for (var i = 0, len = list.length; i < len; i++) {
            obj = pageEdit.genPageData(list[i]);
            window.BOOK_DATA.list[list[i]] = obj;
        }
    },
    // 保存页面数据
    savePageData: function (list, callback) {
        var pageEdit = mimo.Editor.PageEdit;
        var data = {};

        data.user_id = window.UserId;
        data.book_id = window.BookId;
        data.works_id = window.WorksId;
        //首先确定有多少页要 save
        data.count = list.length;
        var s = [];
        var obj;
        for (var i = 0, len = list.length; i < len; i++) {
            //书脊
            if (list[i] == "spine") {
                mimo.Editor.PageEdit.setSpineData();
                data.spine_info = JSON.stringify(BOOK_DATA.spine_info);
                s.push(list[i]);
                continue;
            }
            obj = pageEdit.genPageData(list[i]);
            data["page_" + list[i]] = JSON.stringify(obj);
            window.BOOK_DATA.list[list[i]] = obj;
            s.push(list[i]);

            //这里取出标题
            if (list[i] == "cover") {
                if (obj.page_data.textbox_list && obj.page_data.textbox_list[0] && obj.page_data.textbox_list[0].content) {
                    data.name = obj.page_data.textbox_list[0].content;
                    //$("#works_title").html("《" + mimo.Editor.TextEditor.encode(data.name) + "》");
                    mimo.Editor.setBookName(mimo.Editor.TextEditor.encode(data.name));
                }
            } else if (list[i] == "author_info") {
                // 作者信息
                window.BOOK_DATA.list["author_info"] = window.BOOK_DATA["author_info"] = obj;
                //debugger;
            } else if (list[i] == "copyright") {
                // 版权信息
                window.BOOK_DATA.list["copyright_info"] = window.BOOK_DATA["copyright_info"] = obj;
            }

        }
        data.page_list = s.join(";");
        data.complete_count = mimo.Editor.ToolsBar.getCompleteCount();

        $.ajax({
            type: "POST",
            url: "/Editor/SavePageData",
            data: data,
            dataType: "json",
            success: function (response) {
                if (response && response.ret == 1) {
                    // 设置完成率
                    window.BOOK_DATA.complete_page = data.complete_count;
                    mimo.Editor.ToolsBar.setCompleteCount(data.complete_count);

                    // 更新缩略图信息
                    if (response.preview_list && response.preview_list.length) {
                        
                        var item;
                        for (var i = 0; i < response.preview_list.length; i++) {
                            
                            //debugger
                            item = response.preview_list[i];

                            JSONBookPreview.list[item.num] = item;
                            if (item.num == "author_info" || item.num == "spine") {
                                JSONBookPreview.list["cover"] = item;
                            }
                            mimo.Editor.PreviewList.setPreviewImg(item.num);
                        }
                    }

                }
                if (callback) {
                    callback(response);
                }
            }
        });
    },

    // 拉取某一页的数据
    getPageData: function (num, callback) {

    },

    // 改变P数目
    changeCount: function (num, callback) {

    }
};

/**
 * 书籍检查模块
 * @author masa
 * @namespace mimo.Editor.Checker
 * @description 书籍检查模块
 */
mimo.Editor.Checker = {
    init: function () {
        var p = mimo.Editor.Checker;
        p.addStep1Event()
        p.addStep2Event()
    },
    // 触发检查
    check: function () {
        var info = {};
        //空白页面
        info.blank = [];
        //缺少图片
        info.image = [];
        //精度
        info.dpi = [];
        //缺少文本
        info.text = [];

        var list = window.BOOK_DATA.list;
        var pageObj;
        var pageInfo;
        var t;
        for (var k in list) {
            if (!isNaN(k)) {
                //右版
                if (k != 0 && k != 1 && k % 2 == 1) {
                    if (t = list[k - 1]) {
                        if (t.template_name.length > 3) {
                            continue;
                        }
                    }
                }
            }

            pageInfo = list[k];
            if (!pageInfo) {
                continue;
            }
            if (pageInfo.page_data == null) {
                info.blank.push(k);
            } else {
                pageObj = mimo.Editor.Checker.getTemplateByName(pageInfo);
                if (pageObj) {
                    //缺少文字
                    if (pageObj.textBoxList) {
                        if (pageObj.textBoxList.length > pageInfo.page_data.textbox_list.length) {
                            info.text.push(k);
                        }
                    }

                    //缺少图像
                    if (pageObj.imageBoxList) {
                        if (pageObj.imageBoxList.length > pageInfo.page_data.imagebox_list.length) {
                            info.image.push(k);
                        }
                    }

                    //精度不够
                    if (pageObj.imageBoxList) {
                        
                        var imgDataHash = {};
                        var item;

                        // 先把图片数据筛选出来
                        for (var i = 0; i < pageInfo.page_data.imagebox_list.length; i++) {
                            item = pageInfo.page_data.imagebox_list[i];
                            imgDataHash[item.name] = item;
                        }

                        // 循环判断每个DPI是否满足
                        for (var i = 0; i < pageObj.imageBoxList.length; i++) {
                            item = pageObj.imageBoxList[i];
                            if (imgDataHash[item.name] && !mimo.Editor.PageEdit.checkDPIStatus(item.width, item.height, imgDataHash[item.name].imageid)) {
                                info.dpi.push(k);
                                break;
                            }
                        }
                    }
                }
            }
        }
        var isOk = mimo.Editor.Checker.showInfo(info);//返回是否检通过
        mimo.Editor.Checker.showStep2();
        return isOk;
    },
    getTemplateByName: function (pageinfo) {
        var side;
        var pageType;
        if (pageinfo.num == "cover") {
            side = "R";
            pageType = "COVER";
        } else {
            side = (pageinfo.num % 2 == 1 ? "R" : "L");
            pageType = "PAGE";
        }
        var layoutData;
        if (window.isMini) {
            layoutData = window["MINI_PAGELAYOUT_DATA"];
        } else if (window.isView) {
            layoutData = window["VIEW_PAGELAYOUT_DATA"];
        }
        else if (window.isWide) {
            layoutData = window["WIDE_PAGELAYOUT_DATA"];
        } else if (window.isMpad) {
            layoutData = window["MPAD_PAGELAYOUT_DATA"];
        }
        return layoutData[pageType][side][pageinfo.template_name];
    },
    // 显示检查信息
    showInfo: function (info) {
        // 有任何一个告警信息
        var html = [];
        html.push('<tr class="hl">\
                    <th style="width:42px;">序号</th>\
                    <th style="width:90px;">错误级别</th>\
                    <th>信息提示</th>\
                   </tr>');
        if (info.blank.length || info.image.length || info.dpi.length || info.text.length) {
            if (info.blank.length) {
                html.push('<tr>\
                    <td>1</td>\
                    <td>建议修改</td>\
                    <td>第 '+ mimo.Editor.Checker.genClickEvent(info.blank) + ' 页,没有编辑</td>\
                   </tr>');
            }
            if (info.dpi.length) {
                html.push('<tr>\
                    <td>3</td>\
                    <td>建议修改</td>\
                    <td>第 ' + mimo.Editor.Checker.genClickEvent(info.dpi) + ' 页,图像精度不够 <a style="color:blue;" href="/about/help#px" target="_blank">[查看精度说明]</a></td>\
                   </tr>');
            }

            if (info.image.length) {
                html.push('<tr">\
                    <td>2</td>\
                    <td>看着办</td>\
                    <td>第 '+ mimo.Editor.Checker.genClickEvent(info.image) + ' 页,缺少必要图像</td>\
                   </tr>');
            }


            if (info.text.length) {
                html.push('<tr>\
                    <td>3</td>\
                    <td>看着办</td>\
                    <td>第 '+ mimo.Editor.Checker.genClickEvent(info.text) + ' 页,缺少必要文字</td>\
                   </tr>');
            }
            $("#check_step2 .info_table").html(html.join(""));
            return false;
        } else {
            html.push('<tr>\
                    <td>1</td>\
                    <td>完美!</td>\
                    <td>很完美,可以继续预览或者出版</td>\
                   </tr>');
            $("#check_step2 .info_table").html(html.join(""));
        }
        return true;
    },
    genClickEvent: function (list) {
        var html = [];
        var tmp;
        for (var i = 0; i < list.length; i++) {
            tmp = list[i];
            if (list[i] == "cover") {
                tmp = "封面";
            } else if (list[i] == "author_info") {
                tmp = "折页";
            } else if (list[i] == "copyright") {
                continue;
            }

            html.push('<a style="color:blue;" href="javascript:;" onclick="mimo.Editor.Checker.goEdit(&#39;' + list[i] + '&#39;);return false;">' + tmp + '</a>');
        }
        return html.join(" ");
    },
    goEdit: function (num) {
        mimo.Editor.Checker.hideStep2();
        mimo.Editor.PreviewList.selectPage(num);
    },
    // 显示检查信息
    showStep2: function () {
        mimo.Editor.showMaskLayout();
        //设置位置
        var dialog = $("#check_step2");
        dialog.show();
        var topPx = ($(window).height() / 2 - dialog.height() / 2) + $(document).scrollTop();
        dialog.css({
            "top": topPx + "px",
            "margin-left": "-" + dialog.width() / 2 + "px"
        });
    },
    hideStep2: function () {
        mimo.Editor.hideMaskLayout();
        var dialog = $("#check_step2").hide();
    },
    //继续出版
    publish: function () {
        //alert("开始出版啦");
        window.location = "/order/step1?workId=" + window.WorksId;
        //mimo.Editor.Checker.hideStep2();
    },
    // 绑定事件
    addStep2Event: function () {
        var p = mimo.Editor.Checker;
        $("#checker_go_step1").click(function (e) {
            e.preventDefault();
            mimo.Editor.Checker.hideStep2();
            mimo.Editor.Checker.showStep1();
        });
        $("#checker_edit").click(function (e) {
            e.preventDefault();
            mimo.Editor.Checker.hideStep2();
        });
        $("#check_step2 .close").click(function (e) {
            e.preventDefault();
            mimo.Editor.Checker.hideStep2();
        });


    },
    /*以下是Step1逻辑*/
    showStep1: function () {
        mimo.Editor.showMaskLayout();
        //设置位置
        var dialog = $("#check_step1");
        dialog.show();
        var topPx = ($(window).height() / 2 - dialog.height() / 2) + $(document).scrollTop();
        dialog.css({
            "top": topPx + "px",
            "margin-left": "-" + dialog.width() / 2 + "px"
        });
        //mimo.Editor.Checker.addStep1Event();
    },
    hideStep1: function () {
        mimo.Editor.hideMaskLayout();
        var dialog = $("#check_step1").hide();
    },

    addStep1Event: function () {
        var p = mimo.Editor.Checker;
        $("#step1_check").click(function (e) {
            e.preventDefault();
            mimo.Editor.Checker.hideStep1();
            mimo.Editor.Checker.check();
        });

        $("#step1_preview").click(function (e) {
            e.preventDefault();
            mimo.Editor.Checker.hideStep1();
            mimo.Editor.Preview.show(true);
        });

        $("#step1_go").click(function (e) {
            e.preventDefault();
            mimo.Editor.Checker.publish();
        });
        $("#step1_edit").click(function (e) {
            e.preventDefault();
            mimo.Editor.Checker.hideStep1();
        });
        $("#check_step1 .close").click(function (e) {
            e.preventDefault();
            mimo.Editor.Checker.hideStep1();
        });

    }

};

/**
 * 页面管理
 * @author masa
 * @namespace mimo.Editor.PageManager
 * @description 页面管理
 */
mimo.Editor.PageManager = {
    init: function () {
        var p = mimo.Editor.PageManager;
        if (window.isWide) {
            //$(".page_manager_tab").hide();
        }
        if (window.isMpad) {
            $(".page_manager_tab label").eq(1).hide().remove();
        }
        p.addEvent();
    },
    // 显示
    show: function () {
        $("#page_manager_list").css({
            "height": $(window).height() - 300
        });
        mimo.Editor.showMaskLayout();
        var p = mimo.Editor.PageManager;
        var pop = $("#pop_page_manager");
        p.presentCross();
        //设置位置
        pop.show();
        var topPx = ($(window).height() / 2 - pop.height() / 2) + $(document).scrollTop();
        pop.css({
            "top": topPx + "px",
            "margin-left": "-" + pop.width() / 2 + "px"
        });
    },
    //显示
    presentCross: function () {

        $("#page_sort_cross").attr("checked", "checked");
        var p = mimo.Editor.PreviewList;
        var pm = mimo.Editor.PageManager;
        var data = window.BOOK_DATA;
        //总页数
        var pageCount = data.page;
        var previewHash = JSONBookPreview.list;
        p.totalCount = pageCount - 0;

        //开始布局页面缩略图
        var html = [];
        var tmp;

        // push 封面封底
        tmp = '\
        <li class="ui_disable_sortable" style="cursor:not-allowed;" index="0">\
            <a class="pagelayout_bg blank"  style="cursor:not-allowed;" id="page_bottom" href="javascript:;" _num="bottom" page_side="left" page_type="none">\
                <em class="img_page">封底</em>\
            </a>\
            <a style="cursor:not-allowed;" class="pagelayout_bg {layout_class}" id="page_cover" class="right" href="javascript:;" num="cover" page_side="right" page_type="COVER" template_name="{template_name}">\
                {preview_img}\
                <em class="img_page_right">封面</em>\
            </a>\
        </li>';
        tmp = mimo.Template.format(tmp, {
            "template_name": data.list["cover"].template_name,
            "layout_class": (window.isWide ? "p" : "") + data.list["cover"].template_name.toLowerCase() + "_r",
            "preview_img": previewHash["cover"] && previewHash["cover"]["path"] ? '<img src="/' + previewHash["cover"]["path"] + '_preview.jpg" />' : ""
        });
        html.push(tmp);

        // push 
        tmp = '\
        <li class="ui_disable_sortable" style="cursor:not-allowed;" index="1">\
            <a class="pagelayout_bg blank" style="cursor:not-allowed;" id="page_0left" href="javascript:;" _num="0left" page_side="left">\
                <em class="img_page">封面折页</em>\
            </a>\
            <a style="cursor:not-allowed;" class="pagelayout_bg {layout_class}t1_r"  id="page_0" class="right" href="javascript:;" num="0" page_side="right" template_name="T1">\
                {preview_img}\
                <em class="img_page_right">扉页</em>\
            </a>\
        </li>';
        tmp = mimo.Template.format(tmp, {
            "preview_img": previewHash["0"] && previewHash["0"]["path"] ? '<img src="/' + previewHash["0"]["path"] + '_preview.jpg" />' : "",
            layout_class: (window.isWide ? "p" : "")
        });
        html.push(tmp);

        // push 第一页
        tmp = '\
        <li class="ui_disable_sortable" style="cursor:not-allowed;" index="2">\
            <a style="cursor:not-allowed;" id="page_1_left" href="javascript:;" _num="1_left" page_side="left">\
                <em class="img_page">扉页对页</em>\
            </a>\
            <a style="cursor:not-allowed;" class="pagelayout_bg {layout_class}"  id="page_1" class="right" href="javascript:;" num="1" page_side="right" template_name="{template_name}">\
                {preview_img}\
                <em class="img_page_right">1</em>\
            </a>\
        </li>';
        tmp = mimo.Template.format(tmp,
            {
                "template_name": data.list["1"].template_name,
                "layout_class": (window.isWide ? "p" : "") + data.list["1"].template_name.toLowerCase() + "_r",
                "preview_img": previewHash["1"] && previewHash["1"]["path"] ? '<img src="/' + previewHash["1"]["path"] + '_preview.jpg" />' : ""
            });
        html.push(tmp);

        //其它页面
        var p1;
        var p2;
        var template_name1;
        var template_name2;
        var layout_class1;
        var layout_class2;
        var preview_img1;
        var preview_img2;
        var index = 2;
        for (var i = 2, len = pageCount; i < len; i = i + 2) {
            index++;
            if (i != len && i != len - 1) {
                p1 = i;
                p2 = i + 1;
                template_name1 = data.list[p1]["template_name"];
                template_name2 = data.list[p2]["template_name"];
                layout_class1 = (window.isWide ? "p" : "") + template_name1.toLowerCase() + "_" + (p1 % 2 == 1 ? "r" : "l");
                layout_class2 = (window.isWide ? "p" : "") + template_name2.toLowerCase() + "_" + (p2 % 2 == 1 ? "r" : "l");


                tmp = '\
                <li index="{index}">\
                    <a class="pagelayout_bg {layout_class1}"  id="page_{p1}" href="javascript:;" num="{p1}" page_side="left" template_name="{template_name1}">\
                        {preview_img1}\
                        <em class="img_page">{p_num1}</em>\
                    </a>\
                    <a class="pagelayout_bg {layout_class2}"  id="page_{p2}" class="right" href="javascript:;" num="{p2}" page_side="right" template_name="{template_name2}">\
                        {preview_img2}\
                        <em class="img_page_right">{p_num2}</em>\
                    </a>\
                </li>';
                tmp = mimo.Template.format(tmp,
                    {
                        index: index,
                        p1: p1,
                        p_num1: p1,
                        template_name1: template_name1,
                        layout_class1: layout_class1,
                        preview_img1: (previewHash[p1] && previewHash[p1]["path"]) ? '<img src="/' + previewHash[p1]["path"] + '_preview.jpg" />' : "",
                        p2: p2,
                        p_num2: p2,
                        template_name2: template_name2,
                        layout_class2: layout_class2,
                        preview_img2: previewHash[p2] && previewHash[p2]["path"] ? '<img src="/' + previewHash[p2]["path"] + '_preview.jpg" />' : ""
                    });
            } else {
                p1 = i;
                template_name1 = data.list[p1]["template_name"];
                layout_class1 = (window.isWide ? "p" : "") + template_name1.toLowerCase() + "_" + (p1 % 2 == 1 ? "r" : "l");
                tmp = '\
                <li class="ui_disable_sortable" style="cursor:not-allowed;" index="{index}">\
                    <a style="cursor:not-allowed;" class="pagelayout_bg {layout_class1}"  id="page_{p1}" href="javascript:;" num="{p1}" page_side="left" template_name="{template_name1}">\
                        {preview_img1}\
                        <em class="img_page">{p_num1}</em>\
                    </a>\
                    <a style="cursor:not-allowed;" id="page_{p2}" class="right" href="javascript:;" _num="last" data-side="right">\
                        <em class="img_page_right"></em>\
                    </a>\
                </li>';
                tmp = mimo.Template.format(tmp,
                    {
                        index: index,
                        p1: p1,
                        p2: p1 + "_last",
                        p_num1: p1,
                        p_num2: p1 + 1,
                        template_name1: template_name1,
                        layout_class1: layout_class1,
                        preview_img1: previewHash[p1] && previewHash[p1]["path"] ? '<img src="/' + previewHash[p1]["path"] + '_preview.jpg" />' : ""
                    });
            }
            html.push(tmp);
        }
        tmp = '\
                <li class="ui_disable_sortable" style="cursor:not-allowed;" index="{index}">\
                    <a class="pagelayout_bg {layout_class}copyright" style="cursor:not-allowed;" class="pagelayout_bg {layout_class1}"  id="page_{p1}" href="javascript:;" _num="{p1}" page_side="left" template_name="{template_name1}">\
                        {preview_img1}\
                        <em class="img_page">{p_num1}</em>\
                    </a>\
                    <a class="pagelayout_bg blank" style="cursor:not-allowed;" id="page_last_bottom" class="right" href="javascript:;" _num="last_bottom" data-side="right">\
                        <em class="img_page_right">{p_num2}</em>\
                    </a>\
                </li>';
        tmp = mimo.Template.format(tmp,
        {
            index: index + 1,
            p1: "copyright",
            p_num1: "版权",
            p_num2: "封底",
            template_name1: "copyright",
            layout_class1: (window.isWide ? "p" : ""),
            preview_img1: ""
        });
        html.push(tmp);
        $("#page_manager_list").html(html.join(""));
        $("#page_manager_list").addClass("cross");
        pm.setCrossStyle();
        pm.addSortEvent();

    },
    // 单页排序
    changeToSingle: function () {
        var ul = $("#page_manager_list");
        var page = $("li a", ul);
        var newUl = $('<ul>')
        var li;
        var len = page.length - 4;
        page.each(function (index, obj) {
            $(obj).css({ "cursor": "" });
            li = $('<li>').append(obj);
            if (index < 5 || index > len) {
                li.addClass("ui_disable_sortable");
                li.children().css({ "cursor": "not-allowed" });
            }
            newUl.append(li);
        });
        ul.html(newUl.html());
        ul.removeClass("cross");
    },

    // 跨页排序
    changeToCross: function () {
        var ul = $("#page_manager_list");
        var page = $("li a", ul);
        var newUl = $('<ul>')
        var li;
        var len = page.length - 5;
        var counter = 0;
        page.each(function (index, obj) {
            $(obj).css({ "cursor": "" });
            if (counter == 0) {
                li = $('<li>').append(obj);
                if (index < 5 || index > len) {
                    li.addClass("ui_disable_sortable");
                    li.children().css({ "cursor": "not-allowed" });
                }
                counter++;
            } else {
                li.append(obj);
                counter = 0;
                newUl.append(li);
            }
        });
        ul.html(newUl.html());
        ul.addClass("cross");
    },

    //设置跨页页面样式
    setCrossStyle: function () {
        $("#page_manager_list li").each(function (i, v) {
            var l = $(v);
            var t = $(v).children("a").eq(0);
            var n = t.attr("template_name");
            if (n && n.length == 4) {
                if (window.isWide) {
                    l.children("a").eq(0).css("width", 140);
                    l.children("a").eq(0).children("img").eq(0).css("width", 140);
                    l.children("a").eq(1).hide();
                } else if (window.isMpad) {
                    l.children("a").eq(0).css("width", 77);
                    l.children("a").eq(0).children("img").eq(0).css("width", 77);
                    l.children("a").eq(1).hide();
                }
            }

        });
    },
    //添加排序事件
    addSortEvent: function () {
        $(".page_manager_list").sortable({
            items: "li:not(.ui_disable_sortable)",
            revert: true,
            cursor: 'move',
            stop: function () {
                //alert("sort end");
            }
        });
        $("ul, li").disableSelection();
    },
    //拿到新的排序
    getNewSequence: function () {
        var ary = [];
        $("#page_manager_list a").each(function () {
            if ($(this).attr("num") != undefined) {
                ary.push($(this).attr("num"));
            }
        })
        return ary;
    },
    // 提交数据
    submit: function () {
        var p = mimo.Editor.PageManager;
        var sort_list = p.getNewSequence();
        $.ajax({
            type: "POST",
            url: "/editor/sortpage",
            data: { "book_id": window.BookId, "works_id": window.WorksId, "sort_list": sort_list.join(";") },
            dataType: "json",
            success: function (response) {
                if (response.ret == 1) {
                    window.location.href = window.location.href.replace("is_first=1", "") + '&from_pagemanager=1';
                } else {
                    alert("出错啦");
                }
            }
        });
        $("#page_manager_doing").show();
        $("#pop_page_manager .close").hide();
        $("#pop_page_manager .confirm").hide();
        $("#pop_page_manager .cancel").hide();
    },

    // 隐藏
    hide: function () {
        mimo.Editor.hideMaskLayout();
        $("#pop_page_manager").hide();
    },
    addEvent: function () {
        var p = mimo.Editor.PageManager;
        $("#pop_page_manager .cancel,#pop_page_manager .close").click(function (e) {
            e.preventDefault();
            p.hide();
        });

        $("#pop_page_manager .confirm").click(function (e) {
            e.preventDefault();
            //alert(p.getNewSequence().join(";"));
            p.submit();
        })

        $("#page_sort_cross").click(function (e) {
            //e.preventDefault();
            p.changeToCross();
        })

        $("#page_sort_single").click(function (e) {
            //e.preventDefault();
            p.changeToSingle();
        })
    }
};


mimo.Editor.ImageTools = {
    init: false,
    zoomOutTimer: 0,
    zoomInTimer: 0,
    //当前图像数据
    curTarget: {
        image: null,
        imageBox: null
    },

    //触发
    fire: function (el) {
        var p = mimo.Editor.ImageTools;
        if (!p.init) {
            p.addEvent();
            p.init = true;
        }

        p.curTarget.image = el;
        p.curTarget.imageBox = $(el).parent("div.image_box");
        p.show(p.curTarget.imageBox);
    },

    //展示
    show: function (imageBox) {
        var d = $("#image_tools");

        d.hide();

        var bx = $(imageBox).offset().left;
        var by = $(imageBox).offset().top + $(imageBox).height();

        var y = by + 10;
        var x = bx + $(imageBox).width() / 2 - d.width() / 2;

        if (x + d.width() > $(window).width()) {
            x =  x- (x + d.width() - $(window).width()) - 10;
        }

        d.css({
            "position":"absolute",
            "left": x,
            "top": y
        });
        
        d.show();
    },

    //隐藏
    hide: function () {
        var p = mimo.Editor.ImageTools;
        $("#image_tools").hide();

    },

    addEvent: function () {
        var p = mimo.Editor.ImageTools;

        $("#image_tools .btn_close").click(function (e) {
            e.preventDefault();
            p.hide();
        });

        $("#image_tools ul li a").click(function (e) {
            e.preventDefault();
            var action = $(this).attr("action");
            if (action) {
                p[action]();
            }

        }).hover(
            function () {
                var s = $(this).attr("tips");
                $("#image_tools_tips").html(s);
            },
            function () {
                $("#image_tools_tips").html("图像工具");
            }
        );

        $("#image_tools ul li a.zoom_out").bind("mousedown", function () {
            clearInterval(p.zoomOutTimer);
            p._zoomOut();
            p.zoomOutTimer = setInterval(p._zoomOut, 50);
        });

        $("#image_tools ul li a.zoom_out").bind("mouseup", function () {
            p._zoomOut();
            clearInterval(p.zoomOutTimer);
        });

        $("#image_tools ul li a.zoom_in").bind("mousedown", function () {
            clearInterval(p.zoomInTimer);
            p._zoomIn();
            p.zoomInTimer = setInterval(p._zoomIn, 50);
        });

        $("#image_tools ul li a.zoom_in").bind("mouseup", function () {
            p._zoomIn();
            clearInterval(p.zoomInTimer);
        });

        $("#image_tools").draggable();


    },

    zoomOut: function () {

    },
    _zoomOut: function () {
        var p = mimo.Editor.ImageTools;
        var image = $(p.curTarget.image);
        var box = $(p.curTarget.imageBox);

        var oh = image.attr("oheight") - 0;
        var ow = image.attr("owidth") - 0;
        var bh = parseInt(box.css("height"), 10);
        var bw = parseInt(box.css("width"), 10);
        var ch = image.attr("height") - 0;
        var cw = image.attr("width") - 0;
        var cx = parseInt(image.css("left"), 10) || 0;
        var cy = parseInt(image.css("top"), 10) || 0;

        var w, h, wScale, hScale, x, y;



        //缩放到100% 和 10%,不再缩放
        if (ch / oh > 1 || cw / ow > 1) {
            return;
        }

        w = cw + (cw * 0.02);
        h = ch + (ch * 0.02);

        x = cx - (w - cw) / 2;
        y = cy - (h - ch) / 2;


        image.attr("width", w).attr("height", h);
        image.css({
            "left": x,
            "top": y
        });
        p.setIsEdited();
        p.setDraggable(w, h, bw, bh, box, image);
    },

    zoomIn: function () {

    },

    _zoomIn: function () {
        var p = mimo.Editor.ImageTools;
        var image = $(p.curTarget.image);
        var box = $(p.curTarget.imageBox);

        var oh = image.attr("oheight");
        var ow = image.attr("owidth");
        var bh = parseInt(box.css("height"), 10);
        var bw = parseInt(box.css("width"), 10);
        var ch = image.attr("height");
        var cw = image.attr("width");
        var cx = parseInt(image.css("left"), 10) || 0;
        var cy = parseInt(image.css("top"), 10) || 0;

        var w, h, wScale, hScale, x, y;

        
        if ((cw < bw && ch < bh * 1.02) || (ch < bh && cw < bw * 1.02)) {
            return;
        }

        w = cw - (cw * 0.02);
        h = ch - (ch * 0.02);

        x = cx + (cw - w) / 2;
        y = cy + (ch - h) / 2;


        image.attr("width", w).attr("height", h);
        image.css({
            "left": x,
            "top": y
        });
        p.setIsEdited();
        p.setDraggable(w, h, bw, bh, box, image);
        
    },
    
    ajustFrame: function () {
        //debugger;
        var p = mimo.Editor.ImageTools;
        var image = $(p.curTarget.image);
        var box = $(p.curTarget.imageBox);

        var oh = image.attr("oheight");
        var ow = image.attr("owidth");
        var bh = parseInt(box.css("height"), 10);
        var bw = parseInt(box.css("width"), 10);

        var w, h, wScale, hScale, x, y;

        wScale = ow / bw;
        hScale = oh / bh;

        if (wScale > hScale) {
            h = bh;
            w = ow / hScale

            //水平居中
            x = (bw / 2) - (w / 2);
            y = 0;
        } else {
            w = bw;
            h = oh / wScale;

            //垂直居中
            x = 0;
            y = (bh / 2) - (h / 2);
        }
            
        image.attr("width", w).attr("height", h);
        image.css({
            "left": x,
            "top": y
        });
        p.setIsEdited();
        p.setDraggable(w, h, bw, bh, box, image);
    },

    ajustImage: function () {
        //debugger;
        var p = mimo.Editor.ImageTools;
        var image = $(p.curTarget.image);
        var box = $(p.curTarget.imageBox);
        
        var oh = image.attr("oheight");
        var ow = image.attr("owidth");
        var bh = parseInt(box.css("height"), 10);
        var bw = parseInt(box.css("width"), 10);

        var w, h, scale, x, y;

        //高>宽
        if (oh > ow) {
            h = bh;
            scale = h/oh;
            w = ow * scale;

            //位置居中
            x = (bw/2) - (w/2);
            y = 0;

            

        } else if (ow > oh) {
            w = bw;
            scale = w / ow;
            h = oh * scale;

            //位置
            x = 0;
            y = (bh / 2) - (h / 2);

        }else{
            //正方形的情况
            w = bw;
            scale = w / ow;
            h = oh * scale;

            //位置
            x = 0;
            y = (bh / 2) - (h / 2);
        }

        image.attr("width", w).attr("height", h);
        image.css({
            "left": x,
            "top": y
        });
        p.setIsEdited();
        p.setDraggable(w, h, bw, bh, box, image);
    },
    deleteImage: function () {
        //if (!confirm("确定移除该图片吗?")) {
        //    return;
        //}

        var p = mimo.Editor.ImageTools;
        p.curTarget.imageBox.html('<div class="drag_here"></div>');
        p.setIsEdited();
        p.hide();
        
    },
    findImage: function () {
        var p = mimo.Editor.ImageTools;
        var imageid = p.curTarget.image.attr("imageid");
        if (imageid) {
            var t = $("#imageid_" + imageid);
            if (t) {
                var pos = t.parent().position();
                $(".thumbnail_warp").scrollLeft(pos.left);
                t.addClass("cur_thumbnail");
                setTimeout(function () {
                    t.removeClass("cur_thumbnail");
                }, 2000);
            }
        }
    },

    //设置已经编辑状态
    setIsEdited: function () {
        var imageBox = mimo.Editor.ImageTools.curTarget.imageBox;
        $(imageBox).parent(".pagelayout_edit, .author_info").attr("has_edited", true);
    },
    setDraggable: function (w, h, bw, bh, box, image) {
        var x1, x2, y1, y2;
        x1 = box.offset().left;
        x2 = x1 + box.width() - w;
        y1 = box.offset().top;
        y2 = y1 + box.height() - h;


        var v = {};
        if (w < bw) {
            v.v1 = x1;
            v.v3 = x2;
        } else {
            v.v1 = x2;
            v.v3 = x1;
        }

        if (h < bh) {
            v.v2 = y1;
            v.v4 = y2;
        } else {
            v.v2 = y2;
            v.v4 = y1;
        }

        //重新绑定拖动事件
        try {
            //image.draggable("destroy");
        } catch (ign) { }
        image.draggable({
            containment: [v.v1, v.v2, v.v3, v.v4],
            start: function (event, ui) {
                image.parent().parent(".pagelayout_edit, .author_info").attr("has_edited", true);
            },
            stop: function () {
                mimo.Editor.PageEdit.cacheCurrentPage();
            }
        });
    }
};

/**
 * 教程引导
 * @author masa
 * @namespace mimo.Editor.Tutorial
 * @description 教程引导
 */
mimo.Editor.Tutorial = {
    init:false,
    step: 0,
    list: [
        ['upload', '#btn_upload', 130,40 ],
        ['color', '#background_color_picker_btn', -5, -365],
        ['textcolor', '#text_color_picker_btn', -5, -365],
        ['style', '#pagelayout_picker_btn', -521, -270],
        ['pagemanager', '#btn_page_manager', 0, -370],
        ['pagecount', '#btn_setting',-480,30],
        ['thumbnail','#mod_preview_thumnail_list',0, -374]
    ],
    tpl:'\
    <div class="j_guide" id="guide_step_upload" style="display: none; left: 0px; top: 0px; z-index: 9999; position: absolute; width: 531px; height: 363px; background-image: url(/static/images/editor/guide/guide_step_upload.png);">\
        <a class="j_guide_close" style="top: 72px; right: 0px; position: absolute; width: 45px; height: 35px; display: block;" href="#"></a>\
        <a class="j_guide_next" next="color" style="bottom: 33px; right: 32px; position: absolute; width: 95px; height: 35px; display: block;" href="#"></a>\
    </div>\
    <div class="j_guide" id="guide_step_color" style="display: none; left: 0px; top: 0px; z-index: 9999; position: absolute; width: 531px; height: 370px; background-image: url(/static/images/editor/guide/guide_step_color.png);">\
        <a class="j_guide_close" style="top: 0px; right: 0px; position: absolute; width: 45px; height: 35px; display: block;" href="#"></a>\
        <a class="j_guide_next" next="textcolor" style="bottom: 110px; right: 32px; position: absolute; width: 95px; height: 35px; display: block;" href="#"></a>\
    </div>\
    <div class="j_guide" id="guide_step_textcolor" style="display: none; left: 0px; top: 0px; z-index: 9999; position: absolute; width: 531px; height: 370px; background-image: url(/static/images/editor/guide/guide_step_textcolor.png);">\
        <a class="j_guide_close" style="top: 0px; right: 0px; position: absolute; width: 45px; height: 35px; display: block;" href="#"></a>\
        <a class="j_guide_next" next="style" style="bottom: 110px; right: 32px; position: absolute; width: 95px; height: 35px; display: block;" href="#"></a>\
    </div>\
    <div class="j_guide" id="guide_step_style" style="display: none; left: 0px; top: 0px; z-index: 9999; position: absolute; width: 617px; height: 290px; background-image: url(/static/images/editor/guide/guide_step_style.png);">\
        <a class="j_guide_close" style="top: 0px; right: 81px; position: absolute; width: 45px; height: 35px; display: block;" href="#"></a>\
        <a class="j_guide_next" next="pagemanger" style="bottom: 34px; right: 118px; position: absolute; width: 95px; height: 35px; display: block;" href="#"></a>\
    </div>\
    <div class="j_guide" id="guide_step_pagemanager" style="display: none; left: 0px; top: 0px; z-index: 9999; position: absolute; width: 531px; height: 374px; background-image: url(/static/images/editor/guide/guide_step_pagemanager.png);">\
        <a class="j_guide_close" style="top: 0px; right: 0px; position: absolute; width: 45px; height: 35px; display: block;" href="#"></a>\
        <a class="j_guide_next" next="pagecount" style="bottom: 118px; right: 32px; position: absolute; width: 95px; height: 35px; display: block;" href="#"></a>\
    </div>\
    <div class="j_guide" id="guide_step_pagecount" style="display: none; left: 0px; top: 0px; z-index: 9999; position: absolute; width: 531px; height: 354px; background-image: url(/static/images/editor/guide/guide_step_pagecount.png);">\
        <a class="j_guide_close" style="top: 65px; right: 0px; position: absolute; width: 45px; height: 35px; display: block;" href="#"></a>\
        <a class="j_guide_next" next="thumbnail" style="bottom: 32px; right: 32px; position: absolute; width: 95px; height: 35px; display: block;" href="#"></a>\
    </div>\
    <div class="j_guide" id="guide_step_thumbnail" style="display: none; left: 0px; top: 0px; z-index: 9999; position: absolute; width: 531px; height: 374px; background-image: url(/static/images/editor/guide/guide_step_thumbnail.png);">\
        <a class="j_guide_color" style="top: 0px; right: 0px; position: absolute; width: 45px; height: 35px; display: block;" href="#"></a>\
        <a class="j_guide_next" style="bottom: 110px; right: 32px; position: absolute; width: 95px; height: 35px; display: block;" href="#"></a>\
    </div>',
    bootstrap: function () {
        if ($.cookie("IS_FIRST")) {
            return;
        }
        mimo.Editor.Tutorial.show(0);
        $.cookie("IS_FIRST", 1, { "expires": 365 });
    },
    show: function (n) {
        var p = mimo.Editor.Tutorial;
        if (!p.init) {
            $("body").append(p.tpl);
            $(".j_guide_next").click(function (e) {
                e.preventDefault();
                p.next($(this));
            });

            $(".j_guide_close").click(function (e) {
                
                e.preventDefault();
                $(this).parent(".j_guide").hide();
            });
            p.init = true;
        }
        p.step = n;
        var id = p.list[n][0];
        var sel = p.list[n][1];

        var pos = $(sel).offset();
        var x = pos.left;
        var y = pos.top;
        var d = $("#guide_step_"+id);
        d.css({
            "left": x + parseInt(p.list[n][2]),
            "top": y + parseInt(p.list[n][3])
        }).show();
    },
    next: function (el) {
        var p = mimo.Editor.Tutorial;
        var next = el.attr("next");
        el.parent(".j_guide").hide();
        if (next) {
            
            p.step++;
            p.show(p.step);
            return;
        }
        p.step = 0;
        
    }
};
$(mimo.Editor.bootstrap);