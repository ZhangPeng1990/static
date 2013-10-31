/**
 * 书本配置
 * @author masa
 * @namespace mimo.Upgrade
 * @description 书本配置
 */
mimo.Config = {
    //P数目
    book_page: {
        "1000": [36, 48],
        "1001": [32, 48, 64, 80, 96],
        "1004": [20, 28, 36, 48, 56, 64, 72, 96],
        "1005": [36, 48, 56,64,72,80,96]
    },
    //
    book_color: {
        "1000": [4, 6],
        "1001": [4, 6],
        "1004": [4, 6],
        "1005": [4, 6]
    }
};

/**
 * 规格选择
 * @author masa
 * @namespace mimo.Editor.Guider
 * @description 规格选择
 */
mimo.Editor.Guider = {

    //P数
    book_page: {
        "1000": [24, 36, 48],
        "1001": [24, 32, 48, 64, 80, 96],
        "1004": [20, 28, 36, 48, 56, 64, 72, 96],
        "1005": [36, 48, 56, 64, 72, 80, 96]
    },
    remm_page: {
        "1000": 36,
        "1001": 48,
        "1004": 36,
        "1005": 48
    },
    cur_page: null,
    cur_productId:null,

    bootstrap: function (productId) {

        var p = mimo.Editor.Guider;
        $("body").append(p.html);
        p.addEvent();
        p.show();
        p.init(productId);
    },

    init: function (productId) {
        var p = mimo.Editor.Guider;
        p.cur_productId = productId;
        p.setPageCount(productId);
        p.changePrice(productId);
        $('.dialog_selector .c_img').attr("src", '/static/images/upgrade/' + productId + '.jpg');

        var m = {
            '1000': 'MINI',
            '1001': 'VIEW',
            '1003': 'mCard',
            '1004': 'WIDE',
            '1005': 'mPad'
        };

        $('.dialog_selector .product_name').html("| "+m[productId] + '照片书');
    },

    setPageCount: function (productId) {
        if (productId == 1003) {
            $(".dialog_selector .pagecount").html("").hide();
            return;
        }
        var p = mimo.Editor.Guider;
        var t = p.book_page[productId];
        var h = [];
        for (var i = 0; i < t.length; i++) {
            h.push('<li><a href="#" page_count="' + t[i] + '" class="j_page_count_' + t[i] + '">' + t[i] + 'P</a></li>');
        }
        $(".dialog_selector ul.j_page_count").html(h.join(""));
        $(".dialog_selector ul.j_page_count a.j_page_count_" + p.remm_page[productId]).addClass("cur");
        p.cur_page = p.remm_page[productId];

        $(".dialog_selector ul.j_page_count li a").each(function (i, v) {
            $(this).click(function (e) {
                e.preventDefault();
                $(".dialog_selector ul.j_page_count li a").removeClass("cur");
                $(this).addClass("cur");
                p.cur_page = $(this).attr("page_count");
                p.changePrice(productId);
            });
        });
    },

    changePrice: function (productId) {
        var p = mimo.Editor.Guider;
        if (productId == 1003) {
            $(".dialog_selector .info .info_title").html("您选择的是mCard产品，8张/套，编辑中可增加套数");
            $(".dialog_selector .info .info_tips").hide();
            return;
        }
        //您选择的是:60P(可编辑57P) 四色<span>128</span>元 / 六色<span>138</span>元
        var tpl = '您选择的是:{p}P（可编辑{r_p}P） 四色<span>{price_4}</span>元 / 六色<span>{price_6}</span>元';
        var t = window.JSONPrice;
        var obj = {
            "p": p.cur_page,
            "r_p": p.cur_page - 3,
            "price_4": t[p.cur_productId + "_" + p.cur_page + "_" + 4],
            "price_6": t[p.cur_productId + "_" + p.cur_page + "_" + 6]
        };

        $(".info_title").html(
            mimo.Template.format(tpl, obj)
            );

        //推荐文本
        $('.info_tips').hide();
        if (p.cur_page == p.remm_page[p.cur_productId]) {
            $('.info_tips').fadeIn(500);
        }
    },

    show: function () {
//        $("#dialog_selector").show();
        mimo.UI.setCenter($("#dialog_selector"));
        mimo.Editor.showMaskLayout();
    },
    hide: function () {
        $("#dialog_selector").hide();
        mimo.Editor.hideMaskLayout();
    },

    selectView: function (n) {
        $(".dialog_selector .tab_view").hide();
        $(".dialog_selector .tab_view").eq(n).fadeIn(200);
    },

    addEvent: function () {
        var p = mimo.Editor.Guider;
        //兑换
        $(".dialog_selector .btn_to_exchange").click(function (e) {
            e.preventDefault();
            p.selectView(1);
        });

        //返回
        $(".dialog_selector .btn_back").click(function (e) {
            e.preventDefault();
            p.selectView(0);
        });

        //开始创作
        $('.dialog_selector .btn_go').click(function (e) {
            e.preventDefault();
            if (window.ProductId == 1003) {
                p.hide();
                return;
            }
            var pc = p.cur_page;

            if ((window.isMini && pc == 36) || (window.isView && pc == 48) || (window.isWide && pc == 36)) {
                p.hide();
                return;
            }
            var data = {
                "count": 48 - 3,
                "works_id": window.WorksId,
                "book_id": window.BookId
            };
            data.count = pc - 3;

            $.ajax({
                type: "POST",
                url: "/editor/changepage",
                data: data,
                dataType: "json",
                success: function (response) {
                    if (response && response.ret == 1) {
                        p.hide();
                        window.BOOK_DATA.page = data.count;
                        mimo.Editor.ToolsBar.setCompleteCount();
                        mimo.Editor.PreviewList.rebuildBookInfo(response);
                    }
                }
            });
        });

        //兑换
        $('.dialog_selector .btn_exchange').click(function (e) {
            e.preventDefault();

            var code = $(".exchange_input input").val();
            if (code.length == 0) {
                alert("别捣乱了啊,乖乖输入兑换券编码吧!");
                return;
            }

            var works_id = window.WorksId || 0;
            var user_id = window.UserId || 0;

            //后台请求
            $.ajax({
                type: "POST",
                url: "/editor/exchange",
                data: { "code": code, "works_id": works_id, "user_id":user_id, "product_id":window.ProductId },
                dataType: "json",
                success: function (response) {
                    //验证通过,开启推荐系统
                    if (response.ret == 0) {
                        p.hide();
                        mimo.Upgrade.bootstrap(code, response.product_code);
                    } else {
                        alert(response.msg);
                    }
                },
                error: function () {
                    alert("网络或者系统异常");
                }
            });
            
        });
    }
};
mimo.Editor.Guider.html = '\
<div id="dialog_selector" class="dialog_selector" style="display: none;">\
    <div class="title">\
        <h2>开始创作</h2>\
    </div>\
    <div class="content">\
        <div class="tab_view" id="tab1">\
            <div class="bookdetail">\
                <div class="product">\
                    <h2 class="product_name">|MINI照片书</h2>\
                    <div class="detail">\
                        <img class="c_img" src="/static/images/widebook_mid_03.jpg" width="272" height="198" />\
                    </div>\
                </div>\
                <div class="pagecount">\
                    <h2>选择页数:</h2>\
                    <ul class="j_page_count">\
                        <li><a href="#">32P</a></li>\
                        <li><a href="#">48P</a></li>\
                        <li><a href="#">52P</a></li>\
                        <li><a href="#">60P</a></li>\
                        <li><a href="#">96P</a></li>\
                        <li><a href="#" class="cur">40P</a></li>\
                    </ul>\
                </div>\
                <div class="info">\
                    <h2 class="info_title">您选择的是:60P(可编辑57P) 四色<span>128</span>元 / 六色<span>138</span>元</h2>\
                    <h2 class="info_tips">推荐！厚度、翻阅手感好，性价比高！</h2>\
                </div>\
            </div>\
            <div class="operator_bar">\
                <h2>如果您有兑换券，请 <a class="btn_to_exchange" href="#">点击这里</a></h2>\
                <a class="btn_go" href="#">开始创作</a>\
            </div>\
        </div>\
        <div class="tab_view" id="tab2" style="display:none;">\
            <div class="exchange">\
                <h2>请输入兑换券编码：</h2>\
                <div class="exchange_input">\
                    <a class="btn_exchange" href="#"></a>\
                    <input />\
                </div>\
            </div>\
            <div class="exchange_bar">\
                <a class="btn_second btn_back" href="#">返回</a>\
            </div>\
        </div>\
    </div>\
</div>\
';


/**
 * 推荐系统
 * @author masa
 * @namespace mimo.Upgrade
 * @description 推荐系统
 */
mimo.Upgrade = {
    //产品信息
    product_info: {
        "1000": {
            "id": 1000,
            "name": "MINI",
            "size": "14.2 × 14.2cm",
            "spine_type": "软皮精装",
            "cover_type": "铜版纸覆哑膜",
            "page_type": "温暖手感特种纸 欧洲进口纸",
            "advantage": "CD尺寸大小，轻便小巧",
            "link": "/product/minibook",
            "recom": [36, 4]
        },
        "1001": {
            "id": 1001,
            "name": "VIEW",
            "size": "20 × 14.2cm",
            "spine_type": "软皮精装",
            "cover_type": "铜版纸覆哑膜",
            "page_type": "温暖手感特种纸 欧洲进口纸",
            "advantage": "经典横版设计，更好地呈现照片",
            "link": "/product/viewbook",
            "recom": [48, 4]
        },
        "1003": {
            "id": 1003,
            "name": "mCard",
            "size": "14.5cm × 10.5cm",
            "spine_type": "无",
            "cover_type": "单张卡片，双面彩色印刷",
            "page_type": "温暖手感特种纸",
            "advantage": "横竖两款 随想随做",
            "link": "/product/mcard",
            "recom": [8, 4]
        },
        "1004": {
            "id": 1004,
            "name": "WIDE",
            "size": "28 × 21cm（12 × 8 英寸）",
            "spine_type": "硬壳精装",
            "cover_type": "铜版纸覆哑膜",
            "page_type": "美国全景纸 欧洲进口纸",
            "advantage": "180度平摊，大视觉享受",
            "link": "/product/widebook",
            "recom": [36, 4]
        },
        "1005": {
            "id": 1005,
            "name": "mPad",
            "size": "18 × 25cm（7 × 10英寸）",
            "spine_type": "软皮书籍精装",
            "cover_type": "铜版纸覆哑膜",
            "page_type": "轻柔特种纸",
            "advantage": "轻薄、清新、轻柔",
            "link": "/product/mpadbook",
            "recom": [36, 4]
        }
    },

    //原产品
    cur_origin: {
        id: null,
        page: null,
        color: null
    },

    //升级产品
    cur_new: {
        id: null,
        page: null,
        color: null
    },
    //当前兑换券编码
    cur_code: null,
    //当前兑换产品编码
    cur_product_code: null,
    offset_price: 0,

    bootstrap: function (code, product_code) {
        var p = mimo.Upgrade;
        $("body").append(p.html);
        p.cur_code = code;
        p.cur_product_code = product_code;
        p.parseProductCode(product_code);
        p.show();
        p.addEvent();
        p.initProduct();

    },
    // 解析产品编码
    parseProductCode: function (product_code) {
        var p = mimo.Upgrade;
        var a = product_code.split("_");
        p.cur_origin.id = a[0];
        p.cur_origin.page = a[1];
        p.cur_origin.color = a[2];

    },

    initProduct: function () {
        var p = mimo.Upgrade;
        var c_id = window.ProductId == 1003 ? 1000 : window.ProductId;

        p.setProductDetail(p.cur_origin.id, "origin");
        p.setProductDetail(c_id, "new");
        p.setPageCount(c_id);
        p.setPageColor(c_id);
        p.cur_new.id = c_id;
        p.setOriginPrice();
        p.changePrice();
    },

    show: function () {
        $("#dialog_upgrade").show();
        mimo.UI.setCenter($("#dialog_upgrade"));
        mimo.Editor.showMaskLayout();
    },

    hide: function () {
        $("#dialog_upgrade").hide();
        mimo.Editor.hideMaskLayout();
    },

    setProductDetail: function (productId, type) {
        var t = mimo.Upgrade.product_info[productId];
        var a = type == "origin" ? ".upgrade_origin" : ".upgrade_new";
        $(a + " .c_img").attr("src", "/static/images/upgrade/" + t.id + ".jpg");
        $(a + " .c_size").html(t.size);
        $(a + " .c_spine_type").html(t.spine_type);
        $(a + " .c_cover_type").html(t.cover_type);
        $(a + " .c_page_type").html(t.page_type);
        $(a + " .c_advantage").html(t.advantage);
        $(a + " .c_link").attr("href", t.link);
    },


    setPageCount: function (productId) {
        var p = mimo.Upgrade;
        var t = mimo.Config.book_page[productId];
        var c = mimo.Upgrade.product_info[productId];
        var h = [];
        for (var i = 0; i < t.length; i++) {
            h.push('<li><a href="#" page_count="' + t[i] + '" class="j_page_count_' + t[i] + '">' + t[i] + 'P</a></li>');
        }
        $(".upgrade_pagecount ul.j_page_count").html(h.join(""));
        $(".upgrade_pagecount ul.j_page_count a.j_page_count_" + c.recom[0]).addClass("cur");
        p.cur_new.page = c.recom[0];

        $(".upgrade_pagecount ul.j_page_count li a").each(function (i, v) {
            $(this).click(function (e) {
                e.preventDefault();
                $(".upgrade_pagecount ul.j_page_count li a").removeClass("cur");
                $(this).addClass("cur");
                p.cur_new.page = $(this).attr("page_count");
                p.changePrice();
            });
        });
    },

    setPageColor: function (productId) {
        var p = mimo.Upgrade;
        var t = mimo.Config.book_color[productId];
        var c = mimo.Upgrade.product_info[productId];
        var h = [];
        for (var i = 0; i < t.length; i++) {
            h.push('<li><a href="#" color="' + t[i] + '" class="j_page_color_' + t[i] + '">' + (t[i] == "4" ? "四色" : "六色") + '</a></li>');
        }
        $(".upgrade_pagecount ul.j_page_color").html(h.join(""));
        $(".upgrade_pagecount ul.j_page_color a.j_page_color_" + c.recom[1]).addClass("cur");
        p.cur_new.color = c.recom[1]
        $(".upgrade_pagecount ul.j_page_color li a").each(function (
            i, v) {
            $(this).click(function (e) {
                e.preventDefault();
                $(".upgrade_pagecount ul.j_page_color li a").removeClass("cur");
                $(this).addClass("cur");
                p.cur_new.color = $(this).attr("color");
                p.changePrice();
            });
        });
    },
    setOriginPrice: function () {
        var p = mimo.Upgrade;
        var d = window.JSONPrice;
        var t = p.cur_product_code.split('_');
        var c = mimo.Upgrade.product_info[t[0]];
        var price = d[p.cur_product_code];
        p.cur_o_price = price;

        //产品区域
        $(".upgrade_origin .c_detail").html(c.name + " " + (t[2] == 4 ? "四色" : "六色") + " " + t[1] + "P");
        $(".upgrade_origin .c_price").html(price + "元");

        p.cur_origin = {
            id: t[0],
            page: t[1],
            color: t[2]
        }
    },
    changePrice: function () {
        var t = window.JSONPrice;
        var p = mimo.Upgrade;
        var c = mimo.Upgrade.product_info[p.cur_new.id];
        var o_price = p.cur_o_price;

        var new_price = t[[p.cur_new.id, p.cur_new.page, p.cur_new.color].join("_")];
        var offset_price = new_price - o_price;
        p.offset_price = offset_price;
        //显示价格

        //产品区域
        $(".upgrade_new .c_detail").html(c.name + " " + (p.cur_new.color == 4 ? "四色" : "六色") + " " + p.cur_new.page + "P");
        $(".upgrade_new .c_price").html(new_price + "元");

        //中间区域
        $(".c_offset_money").html(offset_price);

        //底部区域
        $(".c_hl_price").html(new_price);
        $(".c_hl_offset_money").html(offset_price);



    },

    upgrade: function () {
        var p = mimo.Upgrade;

        if (p.offset_price < 0) {
            alert("哎呀,我们不支持产品降级哦");
            return;
        }

        //升级成不同的产品
        if (p.cur_origin.id != p.cur_new.id) {
            $.ajax({
                type: "POST",
                url: "/editor/upgrade",
                data: { product_id: p.cur_new.id, page: p.cur_new.page, code: p.cur_code },
                dataType: "json",
                success: function (response) {
                    if (response.ret == 0) {
                        alert("升级成功,点击后跳转");
                        window.location.href = '/editor/exchangeredirect?product_id=' + p.cur_new.id + '&page=' + p.cur_new.page + '&code=' + p.cur_code;
                    } else {
                        alert("一定是哪里出问题了");
                    }
                }
            });


        } else if (p.cur_origin.id == p.cur_new.id) {//升级成同类产品
            //页数不同
            if (p.cur_origin.page != p.cur_new.page) {
                mimo.Editor.PreviewList.changePage(p.cur_new.page);
                p.hide();
            } else {
                p.hide();
            }
        }

    },
    // 暂时不升级
    unUpgrade: function () {
        var p = mimo.Upgrade;
        if (p.cur_origin.page != p.cur_new.page) {
            mimo.Editor.PreviewList.changePage(p.cur_origin.page);
        }
    },

    addEvent: function () {

        var p = mimo.Upgrade;
        $(".dialog_upgrade .upgrade_selector ul li a").click(function (e) {
            e.preventDefault();
            var n = $(this).attr("product_id");
            p.cur_new.id = n - 0;
            p.setProductDetail(n, "new");
            p.setPageCount(n);
            p.setPageColor(n);
            p.changePrice();
        });

        $(".upgrade_oprator .btn_upgrade").click(function (e) {
            e.preventDefault();
            p.upgrade();
        });

        $(".upgrade_oprator .btn_go_on").click(function (e) {
            e.preventDefault();
            p.unUpgrade();
            p.hide();
            
        });
    }
};

mimo.Upgrade.html = '\
    <div id="dialog_upgrade" class="dialog_upgrade" style="display: none;">\
        <div class="upgrade_title">\
            <h2>补差价，即可升级成其它规格产品</h2>\
        </div>\
        <div class="upgrade_content">\
            <div class="upgrade_bookdetail">\
                <div class="upgrade_product upgrade_origin">\
                    <h2>| 兑换券原产品</h2>\
                    <div class="upgrade_detail">\
                        <img class="c_img" src="/static/images/widebook_mid_03.jpg" width="210" height="150" />\
                        <div class="price_info"><span class="price c_price">48元</span><span class="detail c_detail">mini 四色 24P</span></div>\
                    </div>\
                    <p>\
                        产品尺寸： <span class="c_size">343</span><br />\
                        装订方式： <span class="c_spine_type">硬壳金装</span><br />\
                        封面制材： <span class="c_cover_type">同班</span><br />\
                        内页制材： <span class="c_page_type">放大 大幅度</span><br />\
                        特　　点： <span class="c_advantage">打发打发大幅度</span><br />\
                        <a class="c_link" href="#" target="_blank">查看更多详细信息>></a>\
                    </p>\
                </div>\
                <div class="upgrade_up">\
                    <img src="/static/images/upgrade/upgrade_up.png" />\
                    <p><span>★只需加<span class="c_offset_money">10</span>元</span></p>\
                </div>\
                <div class="upgrade_product upgrade_new">\
                    <h2>|升级产品</h2>\
                    <div class="upgrade_detail">\
                        <img class="c_img" src="/static/images/widebook_mid_03.jpg" width="210" height="150" />\
                        <div class="price_info"><span class="price c_price">48元</span><span class="detail c_detail">mini 四色 24P</span></div>\
                    </div>\
                    <p>\
                        产品尺寸： <span class="c_size">343</span><br />\
                        装订方式： <span class="c_spine_type">硬壳金装</span><br />\
                        封面制材： <span class="c_cover_type">同班</span><br />\
                        内页制材： <span class="c_page_type">放大 大幅度</span><br />\
                        特　　点： <span class="c_advantage">打发打发大幅度</span><br />\
                        <a class="c_link" href="#" target="_blank">查看更多详细信息>></a>\
                    </p>\
                </div>\
                <div class="upgrade_pagecount">\
                    <h2>选择页数：</h2>\
                    <ul class="j_page_count">\
                        <li><a href="#">32P</a></li>\
                        <li><a href="#">48P</a></li>\
                        <li><a href="#">52P</a></li>\
                        <li><a href="#">60P</a></li>\
                        <li><a href="#">96P</a></li>\
                        <li><a href="#" class="cur">40P</a></li>\
                    </ul>\
                    <h2>印刷色彩：</h2>\
                    <ul class="j_page_color">\
                        <li><a href="#">四色</a></li>\
                        <li><a href="#">六色</a></li>\
                    </ul>\
                </div>\
            </div>\
            <div class="upgrade_selector">\
                <div class="upgrade_selector_title">\
                    <h2>您还可以选择升级成以下其它作品：</h2>\
                </div>\
                <ul>\
                    <li><a href="#" product_id="1000">\
                        <img src="/static/images/upgrade/upgrade_mini.png" /></a></li>\
                    <li><a href="#" product_id="1001">\
                        <img src="/static/images/upgrade/upgrade_view.png" /></a></li>\
                    <li><a href="#" product_id="1004">\
                        <img src="/static/images/upgrade/upgrade_wide.png" /></a></li>\
                    <li><a href="#" product_id="1005">\
                        <img src="/static/images/upgrade/upgrade_mpad.png" /></a></li>\
                </ul>\
                <div class="upgrade_oprator">\
                    <a class="btn_upgrade" href="#">马上升级</a><a href="#" class="btn_go_on">暂时不升级,继续创作</a>\
                    <p><span>原价<span class="hl_price c_hl_price">58</span>元，现只要<span class="hl_price c_hl_offset_money">10</span>元，即可拥有！</span></p>\
                </div>\
            </div>\
        </div>\
    </div>\
';
