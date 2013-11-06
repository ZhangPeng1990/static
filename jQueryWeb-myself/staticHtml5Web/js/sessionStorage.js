function $$(id)
{
	return document.getElementById(id);
}

function txtName_change(e)
{
	var strName = e.value;
	sessionStorage.setItem("strName",strName);
	$$("pStade").style.display = "block";
	$$("pStade").innerHTML = sessionStorage.getItem("strName");
}

function btnGetValue_click()
{
	$$("pStade").style.display = "block";
	$$("pStade").innerHTML = sessionStorage.getItem("strName");
}