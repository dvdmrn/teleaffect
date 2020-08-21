var canvas = $('#ball').get(0);
canvas.width  = 640;
canvas.height = 480;
var ctx = canvas.getContext('2d');
fps = 15;

var speed = 1;
var _PADDING = 10;

class Circle{
	constructor(x,y,initX,initY,speed,rad,color,mouthDistance){
	    this.x = x;
	    this.y = y;
	    this.initY = initY;
	    this.initX = initX;
	    this.rad = rad;
	    var minRad = rad;
	    var maxRad = (rad * 2);
	    this.color = color;
	    this.amp = 0;
	    this.speed = speed;
	    this.mouthDistance = mouthDistance;
	    this.localX = 0
	    this.localY = 0
	}
    // Draw circle function
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, Math.PI *2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    };
    
    // Update circle position for animation
    
    update() {


    	// sinusoidal movement ====================================================================
    	let t = new Date().getTime()
    	this.amp = 0.95*this.amp + 0.05*this.mouthDistance
	    // let sinMovement = (Math.cos((t * this.speed) - Math.PI)*this.amp)+(this.initY-this.amp-_PADDING)

	    let sinMovement = (Math.cos((t * this.speed) - Math.PI)*this.amp)+(-this.amp-_PADDING)

	    // local movement =========================================================================

	    // TODO: smooth this shit out

        this.draw();
        let localXMovement = this.initX+((this.localX-250)/2);
        let localYMovement = this.initY+((this.localY-150)/2)-100;
        this.x = 0.80*this.x + 0.20*localXMovement
        this.y = (0.80*this.y + 0.20*(localYMovement))+sinMovement

    };
}


// #f7a5f5
let circle = new Circle(canvas.width/2,0,canvas.width/2,canvas.height,0.005,10,"#f7a5f5",1)
function draw() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	circle.update()
    // singleIcon.update()

    // for(var i = 0; i < circles.length; i++) {
    //     circles[i].update();
    // }

    setTimeout(requestAnimationFrame(draw), 1000/fps);
}

draw()



socket.on('pos',(data)=>{
	circle.mouthDistance = Math.max(mapRange(data.dist, 1200, 2000, 1,30),0);
	// circle.speed = mapRange(data.dist, 800, 2000, 0,0.01);
	if(data.globalPos._x){
		circle.localX = data.globalPos._x;
		circle.localY = data.globalPos._y;
	}
	// console.log(circle.localX)
	// console.log(data.globalPos);
	// console.log(data.dist-1000);
})