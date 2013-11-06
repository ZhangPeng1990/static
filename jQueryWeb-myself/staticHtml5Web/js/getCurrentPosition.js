function $$(id)
{
	return document.getElementById(id);
}

var objNav = null;
var strHTML = "";

function Init_Data()
{
	if(objNav == null)
	{
		objNav = window.navigator;
	}
	if(objNav != null)
	{
		var objGeoLoc = objNav.geolocation;
		if(objGeoLoc != null)
		{
			objGeoLoc.getCurrentPosition(
				function(objPos)
				{
					var objCrd = objPos.coords;
					strHTML += "纬度值：<b>" + objCrd.latitude + "</b><br>";
					strHTML += "精准度：<b>" + objCrd.accuracy + "</b><br>";
					strHTML += "精度值：<b>" + objCrd.longitude + "</b><br>";
					strHTML += "时间戳：<b>" + objCrd.timestamp + "</b><br>";
					var objAdd = objPos.address;
					strHTML += "----------------------------------------------------<br>";
					strHTML += "国家：<br>" + objAdd.country + "</b><br>";
					strHTML += "省份：<br>" + objAdd.region + "</b><br>";
					strHTML += "城市：<br>" + objAdd.city + "</b><br>";
					Status_Handle(strHTML);
				},
				function(objError)
				{
					Status_Handle(objError.code + ":" + objError.message);
				},
				{
					maximumAge : 3 * 1000 * 60,
					timeout: 3000
				});
		}
	}
}

function Status_Handle(message)
{
	$$("pState").style.display = "block";
	$$("pState").innerHTML = message;
}