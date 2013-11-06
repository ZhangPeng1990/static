function $$(id)
{
	return document.getElementById(id);
}

var intNum = 0;

function pageLoad()
{
	var strNmae = localStorage.getItem("keyName");
	var strPass = localStorage.getItem("keyPass");

	if(strNmae)
	{
		$$("txtName").value = strNmae;
	}
	if(strPass)
	{
		$$("txtPass").value = strPass;
	}
}

function btnLogin_click()
	{
		var strNmae = $$("txtName").value;
		var strPass = $$("txtPass").value;
		localStorage.setItem("keyName",strNmae);
		if ($$("chkSave").checked)
		 {
		 	localStorage.setItem("keyPass",txtPass);
		 }
		 else
		 {
		 	localStorage.removeItem("keyPass");
		 }
		 $$("spnStatus").className = "status";
		 $$("spnStatus").innerHTML = "登录成功";
	}

	function btnAdd_Click()
	{
		for(var intI = 0; intI < 5; intI++)
		{
			var strKeyName = "strKeyName" + intI;
			var strKeyValue = "strKeyValue" + intI;
			localStorage.setItem(strKeyName,strKeyValue);
			intNum++;
		}
		$$("pState").style.display = "block";
		$$("pState").innerHTML = "已经成功保存<b>" + intNum + "</b>条数据";
	}

	function btnDel_Click()
	{
		localStorage.clear();
		$$("pState").style.display = "block";
		$$("pState").innerHTML = "已经清空全部数据";
	}