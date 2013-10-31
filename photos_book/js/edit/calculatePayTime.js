//计算类 -- 根据收货时间计算下单时间
var CalculatPayTime = {
    //根据收货时间计算下单时间
    CalculattePayTimeByOrderTime: function (type) {
        var calculationDate;
        switch (type) {
            case "mini":
            case "view":
            case "invitationcard":
            case "mcard":
            case "usercenterindex":
                calculationDate = $("#calculation_date").val()
                break;
            default:
                return;
        }
        if (calculationDate == "") {
            alert("请输入日期！");
            return;
        }
        var splitInputData = calculationDate.split("-");
        var arrHoliday = ['1-1', '1-2', '1-3', '4-4', '4-5', '4-6', '4-27', '4-28', '4-29', '4-30', '5-1', '6-10', '6-11', '6-12', '9-19', '9-20', '9-21', '10-1', '10-2', '10-3', '10-4', '10-5', '10-6', '10-7'];
        var tempDate = new Date(splitInputData[0], splitInputData[1], splitInputData[2]);
        var receviceDate = new Date(splitInputData[0], splitInputData[1], splitInputData[2]);
        var addTwoDate = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);
        if (tempDate.getTime() <= addTwoDate) {
            alert("无法在此日期前寄出，下单后印刷最少需要2个工作日！");
            return;
        }
        var timespan = 24 * 60 * 60 * 1000;
        //首先减去七天的工作日然后再判断
        var newtimems = tempDate.getTime() - (7 * timespan);
        tempDate.setTime(newtimems);

        for (var i = arrHoliday.length - 1; i >= 0; i--) {
            var splitDate = arrHoliday[i].split("-");
            if (tempDate.getMonth().toString() == splitDate[0] && tempDate.getDate().toString() == splitDate[1]) {
                newtimems = tempDate.getTime() - (1 * timespan);
                tempDate.setTime(newtimems);
            }
        }
        if (tempDate.getDay() == 0) {
            newtimems = tempDate.getTime() - (2 * timespan);
            tempDate.setTime(newtimems);
        } else if (tempDate.getDay() == 6) {
            newtimems = tempDate.getTime() - (1 * timespan);
            tempDate.setTime(newtimems);
        }
        var recevice_date = receviceDate.getFullYear() + "-" + receviceDate.getMonth() + "-" + receviceDate.getDate();
        var order_date = tempDate.getFullYear() + "-" + tempDate.getMonth() + "-" + tempDate.getDate();
        var tip = "<h5 style='color:red;'>温馨提示：国家法定节日和周六日暂停服务</h5>";
        switch (type) {
            case "mini":
            case "view":
            case "invitationcard":
            case "mcard":
                $("#source_caculate").hide();
                var tipCaculate = $("#tip_caculate");
                tipCaculate.show();
                tipCaculate.find(".goxz").html("如果您需要在：<span class=\"order_date\">" + recevice_date + "</span> 前收到<br />最迟下单时间：<span class=\"order_date\">" + order_date + "</span>" + tip);
                break;
            case "usercenterindex":
                $("#receive_time").hide();
                $("#caculate_tip").hide();
                var tipCaculate = $("#caculate_result");
                tipCaculate.show();
                tipCaculate.find("div").html("如果您需要在：<span class=\"order_date\">" + recevice_date + "</span> 前收到<br />最迟下单时间：<span class=\"order_date\">" + order_date + "</span>" + tip);
                break;
        }

    },
    AddDate: function (tempDate, addDayCount) {
        //放假的时间
        var arrHoliday = ['1-1', '1-2', '1-3', '4-4', '4-5', '4-6', '4-27', '4-28', '4-29', '4-30', '5-1', '6-10', '6-11', '6-12', '9-19', '9-20', '9-21', '9-30', '10-1', '10-2', '10-3', '10-4', '10-5', '10-6', '10-7'];
        var timespan = 24 * 60 * 60 * 1000;
        var teshuDate = Date.parse("2013-09-29 23:59:59".replace(/-/g, "/"));
        for (var j = 0; j < addDayCount; j++) {
            var newtimems = tempDate.getTime() + (1 * timespan);
            tempDate.setTime(newtimems);
            //如果是9月30号之前就都为工作日
            if (tempDate >= teshuDate) {
                if (tempDate.getDay() == 0) {
                    newtimems = tempDate.getTime() + (1 * timespan);
                    tempDate.setTime(newtimems);
                }
                //星期六为工作日
                //else if (tempDate.getDay() == 6) {
                //    newtimems = tempDate.getTime() + (2 * timespan);
                //    tempDate.setTime(newtimems);
                //}
                for (var i = 0; i < arrHoliday.length; i++) {
                    var splitDate = arrHoliday[i].split("-");
                    if ((parseInt(tempDate.getMonth()) + 1).toString() == splitDate[0] && tempDate.getDate() == splitDate[1]) {
                        newtimems = tempDate.getTime() + (1 * timespan);
                        tempDate.setTime(newtimems);
                    }
                }
                if (tempDate.getDay() == 0) {
                    newtimems = tempDate.getTime() + (1 * timespan);
                    tempDate.setTime(newtimems);
                }
                //星期六为工作日
                //else if (tempDate.getDay() == 6) {
                //    newtimems = tempDate.getTime() + (2 * timespan);
                //    tempDate.setTime(newtimems);
                //}
            }
        }
        return tempDate;
    },//AddDate根据增加的天数获取变化后的日期
    ReceiveDate: function (witchPage) {
        var tempDate = this.AddDate(new Date(), 3); //右上角的日期显示暂时设置为4天
        switch (witchPage) {
            case "mini":
            case "view":
            case "invitationcard":
            case "mcard":
                $("#default_receive_date").html((tempDate.getMonth() + 1) + "月" + tempDate.getDate() + "日");
                break;
            case "usercenterindex":
                $("#usercenter_index_receive").html((tempDate.getMonth() + 1) + "月" + tempDate.getDate() + "日");
                break;
            case "usercenterheader":
                $("#header_receive_date").html((tempDate.getMonth() + 1) + "月" + tempDate.getDate() + "日");
                break;
        }

    },//计算当天下单预计收货时间
    ReceiveDateByProAndPrintType: function (productType, printType) {
        var addDayCount = this.CalculateDateByProType(productType, printType);
        return this.AddDate(new Date(), addDayCount);

    },
    ReceiveDateByProAndPrintWithTime: function (orderTime,productType, printType) {
        var addDayCount = this.CalculateDateByProType(productType, printType);
        return this.AddDate(new Date(orderTime), addDayCount);

    },//ReceiveDateByProAndPrintType根据产品类型和印刷工艺获取日期
    CalculateDateByProType: function (productType, printType) {
        var dayCount = 5+1;
        switch (productType) {
            case 1000:
            case 1001:
                switch (printType) {
                    case 4:
                        dayCount = 3+1;
                        break;
                    case 6:
                        dayCount = 3 + 1;
                        break;
                }
                break;
            case 1002:
                switch (printType) {
                    case 4:
                        dayCount = 3;
                        break;
                }
                break;
            case 1003:
                switch (printType) {
                    case 4:
                        dayCount = 3;
                        break;
                }
                break;
            case 1004:
                switch (printType) {
                    case 4:
                        dayCount = 3 + 1;
                        break;
                    case 6:
                        dayCount = 3 + 1;
                        break;
                }
                break;
            case 1005:
                switch (printType) {
                    case 4:
                        dayCount = 3 + 1;
                        break;
                    case 6:
                        dayCount = 3 + 1;
                        break;
                }
                break;
            case 1006:
                switch (printType) {
                    case 4:
                        dayCount = 3 + 1;
                        break;
                    case 6:
                        dayCount = 3 + 1;
                        break;
                }
                break;
        }
        return dayCount;
    }
}

/*
* 照片书封面加载失败 默认图
* @author yaobo
* @description 每个页面都用到这个方法。
*/
function imgOnerror(img, type) {
    var o = $(this);
    if (type == undefined) return false;
    switch (type) {
        case 1000:
            img.src = "/static/images/default/mini_cover_error.png";
            break;
        case 1001:
            img.src = "/static/images/default/view_cover_error.png";
            break;
        case 1002:
            img.src = "/static/images/default/romace_cover_error.png";
            break;
        case 1003:
            img.src = "/static/images/default/mini_cover_error.png";
            break;
        case 1004:
            img.src = "/static/images/default/wide_book_error.jpg";
            break;
        case 1006:
            img.src = "/static/img/cal_img/calendar_edit_default.png";
            break;
    }
}