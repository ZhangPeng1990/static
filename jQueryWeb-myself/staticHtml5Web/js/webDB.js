function $$(id)
{
	return document.getElementById(id);
}

var db;

function btnCreateDb_Click()
{
	db = openDatabase('Student','1.0','StuManage',2*1024*1024,
		function()
		{
			$$("pState").style.display = "block";
			$$("pState").innerHTML = "数据库创建成功";
		});
}

function btnTestConn_Click()
{
	if(db)
	{
			$$("pState").style.display = "block";
			$$("pState").innerHTML = "数据库创建成功";
	}
}

function Status_Handle(message)
{
	$$("pState").style.display = "block";
	$$("pState").innerHTML = message;
}

function btnCreateTrans_Click()
{
	db = openDatabase('Student','1.0','StuManage',2*1024*1024);
	if(db)
	{
		var strSQL = "create table if not exists StuInfo";
		strSQL += "(StuID unique,Name text,Sex text,Score int)";
		db.transaction(function(tx)
		{
			tx.executeSql(strSQL)
		},
		function()
		{
			Status_Handle("事务执行出错！");
		},
		function()
		{
			Status_Handle("事务执行成功！");
		})
	}
}

function btnInsert_Click()
{
	db = openDatabase('Student','1.0','StuManage',2 * 1024 * 1024);
	if(db)
	{
		var strSQL = "insert into StuInfo values";
		strSQL += "(?,?,?,?)";
		db.transaction(function(tx){
			tx.executeSql(strSQL,[
				$$("txtStuID").value,$$("txtName").value,
				$$("selSex").value,$$("txtScore").value
				],
				function()
				{
					$$("txtName").value = "";
					$$("txtScore").value = "";
					Status_Handle("1条记录添加成功！")
				},
				function(tx,ex)
				{
					Status_Handle(ex.message)
				})
		})
	}
}

function RetRndNum(n)
{
	var strRnd = "";
	for(var intI = 0; intI < n; intI++)
	{
		strRnd += Math.floor(Math.random() * 10);
	}
	return strRnd;
}

function Init_Data()
{
	$$("txtStuID").value = RetRndNum(6);
}

function btnUpdate_Click()
{
	db = openDatabase('Student','1.0','StuManage',2 * 1024 * 1024);
	if(db)
	{
		var strSQL = "update StuInfo set Name=?,Sex=?Score=? where StuID=?";
		db.transaction(function(tx){
			tx.executeSql(strSQL,[
				$$("txtStuID").value,$$("txtName").value,
				$$("selSex").value,$$("txtScore").value
				],
				function()
				{
					$$("txtName").value = "";
					$$("txtScore").value = "";
					Status_Handle("1条记录添加成功！")
				},
				function(tx,ex)
				{
					Status_Handle(ex.message)
				})
		})
	}
}

function getWebSqlData(s)
{
	db = openDatabase('Student','1.0','StuManage',2 * 1024 * 1024);
	if(db)
	{
		var strSQL = "select * from StuInfo where StuID<>?";
		if(s > 0)
		{
			strSQL = "select * from StuInfo where StuID=?";
		}
		db.transaction(function(tx){
			tx.executeSql(strSQL,[s],
				function(tx,rs)
				{
					var strHTML += "<li>";
					strHTML += "请输入学号：";
					strHTML += "<input type='text' id='txtSearch' size='14'>";
					strHTML += "<input type='button' id='btnSearch' value='查询' onClick='btnSearch_Click'>";
					strHTML += "</li>";
					strHTML += "<li><span>学号</span><span>姓名</span><span>性别</span><span>总分</span><span>操作</span></li>";

					for(var intI = 0; intI < rs.rows.length; intI++)
					{
						var intId = rs.rows.item(intI).StuID;
						strHTML += "<li>";
						strHTML += "<span>" + intI + "</span>";
						strHTML += "<span>";
						strHTML += rs.rows.item(intI).Name;
						strHTML +="</span>";
						strHTML += "<span>";
						strHTML += rs.rows.item(intI).Sex;
						strHTML +="</span>";
						strHTML += "<span>";
						strHTML += rs.rows.item(intI).Score;
						strHTML +="</span>";
						strHTML += "<span>";
						strHTML += "<a href='#' onClick=btnEditData('";
						strHTML += intId;
						strHTML += "')编辑</a>";
						strHTML += "<span>";
						strHTML += "<a href='#' onClick=btnDelData('";
						strHTML += intId;
						strHTML += "')删除</a>";
						strHTML +="</span>";
						strHTML += "</span></li>";
					}
					$$("ulMessage").style.display = "block";
					$$("fstInput").style.display = "none";
					$$("ulMessage").innerHTML = strHTML;
				},
				function(tx,ex)
				{
					Status_Handle(ex.message);
				})
		})
	}
}

function btnDelData(StuID)
{
	db = openDatabase('Student','1.0','StuManage',2 * 1024 * 1024);
	if(db)
	{
		var strSQL = "delete from StuInfo where StuID=?";
		db.transaction(function(tx){
			tx.executeSql(strSQL,[StuID],
				function()
				{
					getWebSqlData(0);
				},
				function(tx,ex)
				{
					Status_Handle(ex.message)
				})
		})
	}

}

function btnSearch_Click()
{
	var strStuID = $$("txtSearch").value;
	getWebSqlData(strStuID);
}