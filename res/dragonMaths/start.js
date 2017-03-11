var W,H;
var ctx,canvas;
var n = 200;
var rA = 400;
var rB = 400;
var ela = 400;
var g = 2;
var x = 0;
var y = 0;
var ll = [[1,0,0,0,0.16,0,0],[85,0.85,0.04,-0.04,0.85,0,1.6],[7,0.2,-0.26,0.23,0.22,0,1.6],[7,-0.15,0.28,0.26,0.24,0,0.44]];

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
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(0,0,W,H);

    var f = function(t) {
        paint(t);
        window.requestAnimationFrame(f);
    };
    window.requestAnimationFrame(f);
}

function paint(t){
	ctx.fillStyle = "rgb(200,200,200)";
	for(var i = 0;i < n;i++){
		var tirage = rnd(100);
		if (tirage < ll[0][0]){
			xx = ll[0][1]*x + ll[0][2]*y + ll[0][5];
			yy = ll[0][3]*x + ll[0][4]*y + ll[0][6];
		}
		else if (tirage < ll[0][0] + ll[1][0]){
			xx = ll[1][1]*x + ll[1][2]*y + ll[1][5];
			yy = ll[1][3]*x + ll[1][4]*y + ll[1][6];
		}
		else if (tirage < ll[0][0] + ll[1][0] + ll[2][0]){
			xx = ll[2][1]*x + ll[2][2]*y + ll[1][5];
			yy = ll[2][3]*x + ll[2][4]*y + ll[1][6];
		}
		else{
			xx = ll[3][1]*x + ll[3][2]*y + ll[3][5];
			yy = ll[3][3]*x + ll[3][4]*y + ll[3][6];
		}
		ctx.fillRect(W/3+xx*50,40+yy*50,1,1);
		x = xx;
		y = yy;
	}	

}
