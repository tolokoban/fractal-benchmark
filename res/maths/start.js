var W,H;
var ctx,canvas;
var n = 300;
var rA = 400;
var rB = 400;
var ela = 400;
var g = 2;

// programme

function rnd(max){
    return Math.floor(Math.floor(Math.random()*max));
}

function fonc(a,t){
	//if (a == 0) a = 0.0001;
	return a*(t/3000);
}

function rndSpecial(){
    if (rnd(2) == 0) return -1;
    else return 1;
}

function resize(){
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.setAttribute("width",W);
    canvas.setAttribute("height",H);
}

function start(){
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    W = canvas.width;
    H = canvas.height;
    resize();
    animation();
}

function animation(){
    var f = function(t) {
        paint(t);
        window.requestAnimationFrame(f);
    };
    window.requestAnimationFrame(f);
}

function paint(t){
	//ela += 0.5;
	//rB = Math.sin(t/300)*100+400; 
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(0,0,W,H);
	/*
	ctx.beginPath();
	ctx.arc(W/4,H/2,rA,-Math.PI,Math.PI);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(W/4*3,H/2,rB,-Math.PI,Math.PI);
	ctx.stroke();
	*/
	//ctx.globalAlpha = 0.3; 
	ctx.fillStyle="rgb(230,230,250)";
	ctx.fillText(t/3000,0,0);
	ctx.strokeStyle="rgb(230,230,250)";
	for (var i = 0; i<n;i++){
		var x = fonc(i,t);
		ctx.beginPath();
		ctx.moveTo(Math.cos((2*Math.PI)/n*i)*rA + W/2,Math.sin((2*Math.PI)/n*i)*rA + H/2);
		ctx.lineTo(Math.cos((2*Math.PI)/n*x)*rB + W/2,Math.sin((2*Math.PI)/n*x)*rB + H/2);
		ctx.stroke();
	}
	ctx.globalAlpha = 1;
}
