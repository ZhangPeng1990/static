var mimo = window.mimo || {};

/**
 * �¼�����
 * @author masa
 * @namespace mimo.Event
 * @description �¼�֪ͨ���ɷ�ģ��
 */
mimo.Event = {
    _eventList: {},//��ע����¼��б�
    _callbackList: {},//�Ѽ����Ļص������б�
    _checkEvent: function (eventLabel) {
        var el = mimo.Event._eventList;
        if (!el[eventLabel]) {
            return false;
        }
        return true;
    },
    /**
	 * �¼�ע��ӿڣ������ж���Ҫע���ʱ��᲻��������¼����ڳ�ͻ
	 * @author masa
	 * @param {String} eventLabel��Ψһ���¼���ʶ��Ϊ�˾��������ͻ��������������ռ�ķ�ʽ������������ռ����»��߸�����ȫ���ַ���д
	 * @return {Boolean}����Ҫע����¼������ڳ�ͻ��ϵͳ�᷵�سɹ���Ϣtrue
	 * 		   ���Ҫע����¼������Ѿ����ڣ��᷵��false
	 * @example mimo.Event.reigister("MIMO_BOOK_SHOW_COLOR_PICKER","��ʾ��ɫѡ����");
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
	 * �¼��ɷ��ӿ�
	 * @author masa
	 * @param {String} eventLabel��Ψһ���¼���ʶ
	 * @param {Object} ��һ����������������¼�����Ҫ�ĸ�������
	 * @example 
	 * 		mimo.Event.dispatch("MIMO_BOOK_SHOW_COLOR_PICKER",
	 *		   	{'from':'view'}//��������¼����û�������˳�����ť��ʱ�򱻴��������һᴫ��һ���û�ͣ��ʱ�������stayTime
	 * 		
	 * ����callback�Ĳ�����һ�����������һ��������һ�����������Ÿ��¼���صĸ���ϵͳ���ã������������ݾ��������չ
	 * {
	 * 		type:eventLabel//�Ǵ���������������¼����֣�����һ��������������ͬ�¼���ʱ������ͬ�Ĵ���
	 * }
	 * �ڶ��������Ǹ��¼���ص����ݶ�����һ��json�����������˸����¼���صĸ�������
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
	 * �¼������ӿ�
	 * @author masa
	 * @param {String} eventLabel��Ψһ���¼���ʶ
	 * @param {Function} �ص���������ʱ�䱻������ʱ���ִ�иûص�������������ʱ���dataObj��������ص�����
	 * @return {Boolean} �Ƿ�����ɹ�
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
	 * ȡ���¼������ӿ�
	 * @author masa
	 * @param {String} eventLabel��Ψһ���¼���ʶ
	 * @param {Function} �ص�������ǰ����addEventListener�ӿ���ע��Ļص�����
	 * @return {Boolean} �Ƿ�ɾ�������ɹ�
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
 * ģ����ط���
 * @author masa
 * @namespace mimo.Template
 * @description ģ�渨��
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
 * ������ʾ
 * @author masa
 * @namespace mimo.Bubble
 * @description ������ʾ
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

    //���þ���
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
 * �첽��Դ����
 * @author masa
 * @namespace mimo.Loader
 * @description �첽��Դ����
 */

mimo.Loader = {
    //�첽������Դ
    importScript: function (url, callback) {
        $.getScript(url, callback);
    },
    //�첽������ʽ
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

