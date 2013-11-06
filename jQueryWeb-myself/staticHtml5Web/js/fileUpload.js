function $$(id)
{
	return document.getElementById(id);
}

function fileUpload_GetFileList(f)
{
	var strLi = "<li class='li'>";
	strLi = strLi + "<span>文件名称</span>";
	strLi = strLi + "<span>文件类型</span>";
	strLi = strLi + "<span>文件大小</sapn>";
	strLi = strLi + "</li>";

	for (var i = 0; i < f.length; i++) 
	{
		var temFile = f[i];
		strLi = strLi + "<li>";
		strLi = strLi + "<span>" + temFile.name + "</span>";
		strLi = strLi + "<span>" + temFile.type + "</span>";
		strLi = strLi + "<span>" + temFile.size + "KB</span>";
		strLi = strLi + "</li>";
	}
	$$("ulUpLoad").innerHTML = strLi;
}