var canvas = $('#ball').get(0);
canvas.width  = 640;
canvas.height = 480;
var ctx = canvas.getContext('2d');
fps = 15;

var speed = 1;
var _PADDING = 20;
var _SINPAD = 10;
var _RADIUS = 10;
let circles = [];
let circleIds = []; // inefficient code for efficient execution


class Circle{
	constructor(x,y,initX,initY,speed,rad,color, mouthDistance, id){
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
	    this.eyeDist = 1
	    this.radGain = 0.7;
	    this.id = id;
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

	    let sinMovement = (Math.cos((t * this.speed) - Math.PI)*this.amp)+(-this.amp-_SINPAD)

	    // local movement =========================================================================

	    // TODO: smooth this shit out

        this.draw();
        let localXMovement = this.initX+((this.localX-250)/2);
        let localYMovement = this.initY+((this.localY-150)/2)-100;
        this.x = 0.80*this.x + 0.20*localXMovement
        this.y = (0.80*this.y + 0.20*(localYMovement))+sinMovement

        this.rad = 0.90*this.rad + 0.10*(this.eyeDist*this.radGain)

    };
}
// var circle = new Circle(canvas.width/2,0,canvas.width/2,canvas.height,0.005,10,"#f7a5f5",1,"69");


function draw() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// circle.update()

    for(var i = 0; i < circles.length; i++) {
        circles[i].update();
    }

    setTimeout(requestAnimationFrame(draw), 1000/fps);
}


function updateCircleInitPos(){
	for(i=0;i<circles.length;i++){
		circles[i].initX = canvas.width-((i+1)*(_RADIUS+_PADDING));
	}
}

function parameterizeCircle(indx,data){
	circles[indx].mouthDistance = Math.max(mapRange(data.dist, 1200, 2000, 1,30),0);
	// circle.speed = mapRange(data.dist, 800, 2000, 0,0.01);
	if(data.globalPos._x){
		circles[indx].localX = data.globalPos._x;
		circles[indx].localY = data.globalPos._y;
	}
	circles[indx].eyeDist = data.eyeDist;
	// console.log(circle.localX)
	// console.log(data.globalPos);
	// console.log(data.dist-1000);
}

// TODO: emit to all clients or the viewer only. Assume this is the viewer? See notebook for more info
socket.on('addClient',(client)=>{
	console.log(`user ${client} just joined!`,circles);
	
	let circle = new Circle(canvas.width/2,0,canvas.width/2,canvas.height,0.005,10,"#f7a5f5",1,client);
	circles.push(circle);
	updateCircleInitPos();
})

socket.on('removeClient',(client)=>{
	// let circle = new Circle(canvas.width/2,0,canvas.width/2,canvas.height,0.005,10,"#f7a5f5",1,client.id);
	// circles.push(circle);
      console.log(`client ${client} left!`)
      for(i=0;i<circles.length;i++){
      	if(circles[i].id==client){
			console.log(`user ${client} just left! Goodbye!`,circles);
      		circles.splice(i, 1);
			updateCircleInitPos();
      		return
      	}
      }


})
socket.on('pos',(data)=>{
	console.log('posEvent',data.id);
	if(circles.length>=1){
		let indx = circles.map(e=>e.id).indexOf(data.id);
		parameterizeCircle(indx,data);
	}
	

})


draw()