function $$(id)
{
	return document.getElementById(id);
}

function getCurTime()
{
	var dt = new Date();
	var strHtml = "当前时间是:";
	strHtml += RuleTime(dt.getHours(),2) + ":" + 
				RuleTime(dt.getMinutes(),2) + ":" +
				RuleTime(dt.getSeconds(),2);
	$$("time").value = strHtml;
}

function RuleTime(num,n)
{
	var len = num.toString().length;
	while(len < n)
	{
		num = "0" + num;
		len++;
	}
	return num;
}

//定时执行
setInterval(getCurTime,1000);