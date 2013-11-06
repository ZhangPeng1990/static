function $$(id)
{
	return document.getElementById(id);
}

function spn1_click()
{
	var cnv = $$("cnvMain");
	var cxt = cnv.getContext("2d");

	cxt.clearRect(0,0,280,190);

	cxt.beginPath();
	cxt.arc(100,100,50,0,Math.PI*2,true);
	cxt.closePath();
	cxt.fillStyle="#eee";
	cxt.fill();

}

function spn2_click()
{
	var cnv = $$("cnvMain");
	var cxt = cnv.getContext("2d");

	cxt.clearRect(0,0,280,190);

	cxt.beginPath();
	cxt.arc(100,100,50,0,Math.PI*2,true);
	cxt.closePath();
	cxt.fillStyle="#666";
	cxt.lineWidth=2;
	cxt.stroke();
}

function spn3_click()
{
	var cnv = $$("cnvMain");
	var cxt = cnv.getContext("2d");

	cxt.clearRect(0,0,280,190);

	cxt.beginPath();
	cxt.arc(100,100,50,0,Math.PI*2,true);
	cxt.closePath();
	cxt.fillStyle="#eee";
	cxt.fill();

	cxt.strokeStyle="#666";
	cxt.lineWidth=2;
	cxt.stroke();

	cxt.beginPath();
	cxt.arc(170,100,50,0,Math.PI*2,true);
	cxt.closePath();
	cxt.fillStyle="#666";
	cxt.lineWidth=2;
	cxt.fill();
}