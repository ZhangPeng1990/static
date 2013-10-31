var mimo = window.mimo || {};

/**
 * 事件机制
 * @author masa
 * @namespace mimo.Event
 * @description 事件通知和派发模块
 */
mimo.Event = {
    _eventList: {},//已注册的事件列表
    _callbackList: {},//已监听的回调函数列表
    _checkEvent: function (eventLabel) {
        var el = mimo.Event._eventList;
        if (!el[eventLabel]) {
            return false;
        }
        return true;
    },
    /**
	 * 事件注册接口，用来判断你要注册的时间会不会跟其他事件存在冲突
	 * @author masa
	 * @param {String} eventLabel，唯一的事件标识，为了尽量避免冲突，必须采用命名空间的方式，这里的命名空间用下划线隔开，全部字符大写
	 * @return {Boolean}当你要注册的事件不存在冲突，系统会返回成功信息true
	 * 		   如果要注册的事件名字已经存在，会返回false
	 * @example mimo.Event.reigister("MIMO_BOOK_SHOW_COLOR_PICKER","显示颜色选择器");
	 */
    _register: function (eventLabel) {
        var el = mimo.Event._eventList;
        if (el[eventLabel]) {
            return false;
        }
        el[eventLabel] = eventLabel;
        return true;
    },
    /**
	 * 事件派发接口
	 * @author masa
	 * @param {String} eventLabel，唯一的事件标识
	 * @param {Object} 是一个对象，里面包含该事件所需要的各种数据
	 * @example 
	 * 		mimo.Event.dispatch("MIMO_BOOK_SHOW_COLOR_PICKER",
	 *		   	{'from':'view'}//假设这个事件在用户点击“退出”按钮的时候被触发，而且会传递一个用户停留时间的数据stayTime
	 * 		
	 * 传给callback的参数是一个对象，里面第一个参数是一个对象，里面会放跟事件相关的各自系统配置，这个后续会根据具体情况扩展
	 * {
	 * 		type:eventLabel//是触发这个监听器的事件名字，方便一个监听器监听不同事件的时候做不同的处理
	 * }
	 * 第二个参数是跟事件相关的数据对象，是一个json对象，里面存放了跟该事件相关的各种数据
	 */
    dispatch: function (eventLabel, dataObj) {
        setTimeout(function () {
            var p = mimo.Event, o = {
                type: eventLabel
            };
            if (p._checkEvent(eventLabel)) {
                var l = p._callbackList[eventLabel];
                if (l) {
                    for (var i = 0, len = l.length; i < len; i++) {
                        if (typeof (l[i]) == "function") {
                            l[i](o, dataObj);
                        }
                    }
                }
            }
        }, 0);
    },
    /**
	 * 事件监听接口
	 * @author masa
	 * @param {String} eventLabel，唯一的事件标识
	 * @param {Function} 回调函数，当时间被触发的时候会执行该回调函数，并将该时间的dataObj传给这个回调函数
	 * @return {Boolean} 是否监听成功
	 * @example 
	 * mimo.Event.addEventListener("MIMO_BOOK_SHOW_COLOR_PICKER",mimo.Edtior.showColorPicker);
	 */
    addEventListener: function (eventLabel, callback) {
        mimo.Event._register(eventLabel);
        var p = mimo.Event._callbackList;
        if (typeof (callback) != "function") {
            return false;
        }
        if (!p[eventLabel]) {
            p[eventLabel] = [];
        }
        p[eventLabel].push(callback);
        return true;
    },
    /**
	 * 取消事件监听接口
	 * @author masa
	 * @param {String} eventLabel，唯一的事件标识
	 * @param {Function} 回调函数，前面用addEventListener接口所注册的回调函数
	 * @return {Boolean} 是否删除监听成功
	 * @example mimo.Event.removeEventListener("MIMO_BOOK_SHOW_COLOR_PICKER",mimo.Edtior.showColorPicker);
	 */
    removeEventListener: function (eventLabel, callback) {
        var p = mimo.Event._callbackList;
        if (typeof (callback) != "function") {
            return false;
        }
        if (!p[eventLabel]) {
            return true;
        }
        var l = p[eventLabel];
        for (var i = 0, len = l.length; i < len; i++) {
            if (l[i] == callback) {
                l.splice(i, 1);
            }
        }
        return true;
    }
};

/**
 * 模版相关方法
 * @author masa
 * @namespace mimo.Template
 * @description 模版辅助
 */
mimo.Template = {
    regFormat: /\{([\d\w\.]+)\}/g,
    format: function (str) {
        var args = Array.prototype.slice.call(arguments), v;
        str = String(args.shift());
        if (args.length == 1 && typeof (args[0]) == 'object') {
            args = args[0];
        }
        mimo.Template.regFormat.lastIndex = 0;
        return str.replace(mimo.Template.regFormat, function (m, n) {
            v = mimo.Template.route(args, n);
            return v === undefined ? m : v;
        });
    },
    regRoute: /([\d\w_]+)/g,
    route: function (obj, path) {
        obj = obj || {};
        path = String(path);
        var r = mimo.Template.regRoute, m;
        r.lastIndex = 0;
        while ((m = r.exec(path)) !== null) {
            obj = obj[m[0]];
            if (obj === undefined || obj === null) {
                break;
            }
        }
        return obj;
    }
};

/**
 * 气泡提示
 * @author masa
 * @namespace mimo.Bubble
 * @description 气泡提示
 */
mimo.Bubble = {
    counter:0,
    show: function (opts) {
        opts.arrow = opts.arrow || "up";
        var tpl = '\
        <div>\
            <div class="pop-inner">\
                <span id="arrow_out" class="pop-arrow-down"></span><span class="pop-arrow-down-in"></span><a href="javascript:void(0);" class="close j-close"><i class="icon i-pop-close"></i></a>\
                <div class="pop-bd">\
                </div>\
            </div>\
        </div>';
    }
};

mimo.UI = {

    //设置居中
    setCenter: function (obj) {
        var topPx = ($(window).height() / 2 - obj.height() / 2) + $(document).scrollTop();
        obj.css({
            "position": "absolute",
            "left":"50%",
            "top": topPx + "px",
            "margin-left": "-" + obj.width() / 2 + "px"
        });
    },
    showMaskLayout: function (opacity, index) {
        
        index = index || 1000;
        if ($(".mask_layout").length == 0) {
            $(document.body).append("<div class=\"mask_layout\" style=\"display: none;\"></div>");
        }
        var maskLayout = $(".mask_layout");
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
        }
    },
    hideMaskLayout: function () {
        var maskLayout = $(".mask_layout");
        if (maskLayout.css("display") == "none") {
            return;
        }
        maskLayout.hide();
    }
};

/**
 * 异步资源加载
 * @author masa
 * @namespace mimo.Loader
 * @description 异步资源加载
 */

mimo.Loader = {
    //异步引入资源
    importScript: function (url, callback) {
        $.getScript(url, callback);
    },
    //异步引入样式
    importStyle: function (url, name) {
        if ($("link[name="+name+"]").length == 0) {
            var s = document.createElement("link");
            s.setAttribute('type', 'text/css');
            s.setAttribute('rel', 'stylesheet');
            s.setAttribute('href', url);
            s.setAttribute('name', name);
            $("head")[0].appendChild(s);
        }
    }
};

