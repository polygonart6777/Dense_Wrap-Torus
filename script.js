
//Using three.js library
var scene = new THREE.Scene();
//Canvas width and height can be adjusted if you want to include the animation as a part of a webpage.
var CANVAS_WIDTH = 300;
var CANVAS_HEIGHT = 300;

//Camera perspective and set up
var camera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 1000);
camera.up.set(0, 0, 1);

// Displays three dimensional graphics using WebGL Javascript API.
var renderer = new THREE.WebGLRenderer({antialias: true});
//Using WebGLRenderer we can resize the canvas and this automaticlly resets the viewpoint and pixel ratio.
renderer.setSize( CANVAS_WIDTH , CANVAS_WIDTH  );

//This makes it so the object created here corresponds to the densewrap div element in the html document.
var divRender = document.getElementById("densewrap");
// A canvas where the renderer draws its output, this is automatically created by the renderer in the constructor, it is added it to your page like so:
divRender.appendChild(renderer.domElement);

//This is how we get the camera to be able to orbit around an object, allowing some interactivity here.
var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

//Creates a nice lighting effect.  This is adopted straight from Yuri.
var light = new THREE.AmbientLight( 0x404040 );
scene.add(light);
var lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 0 ].position.set( 0, 100, 0 );
lights[ 1 ].position.set( 50, 100, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );
scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );


{//A class for generating torus geometries
	const geometry = new THREE.TorusGeometry( 1, .4, 32, 32);
//Gives a nice shiny surface.
	const material = new THREE.MeshPhongMaterial( { color: 0x00ff00, side: THREE.DoubleSide} );
//Displays a polygonal mesh using the geometry and material provided. 
	const torus = new THREE.Mesh( geometry, material );
	scene.add( torus );
}

camera.position.z = 5;

//A parameterized torus path using the irrational golden angle.  If we were to use a rational angle, we would not get a dense wrapping.
//Stable direction
function torus(R, r, theta, phi) {
  let gamma= (1+Math.sqrt(5))/2
  return [
    (R + r * Math.cos(gamma*gamma*phi)) * Math.cos(theta),
    (R + r * Math.cos(gamma*gamma*phi)) * Math.sin(theta),
    r * Math.sin(gamma*gamma*phi)
  ];
}

//Path on the surface over time parameter t.
var curve = new THREE.Curve();
curve.getPoint = t => {
  const [x, y, z] = torus(1.01, .41, 2*Math.PI*t, 2*Math.PI*t);
  return new THREE.Vector3(x, y, z);
};



//The path turned into a tube using TubeGeometry, reminder Mesh puts together a geometry and material.
var geometry = new THREE.TubeGeometry(curve, 150, 0.02, 20);
var material = new THREE.MeshPhongMaterial({color: 0x0000FF});
var circle = new THREE.Mesh(geometry, material);
scene.add(circle);


//Now we animate the path.
function animate(time) 
{ 
	//stop after some amount of time.
	if (time < 80000){
	//Use the curve function with a time step.	
	var curve = new THREE.Curve();
	curve.getPoint = t => 
	{
		t *= time / 7000;
		const [x, y, z] = torus(1.01, .41, 10*Math.PI*t, 10*Math.PI*t);
		return new THREE.Vector3(x, y, z);
	};
	//render after each time step
	circle.geometry = new THREE.TubeGeometry(curve, Math.ceil(150 * time / 3000), 0.02, 20);
	renderer.render( scene, camera );
	requestAnimationFrame( animate );}
	else {
	//If you've reached the max time, just render the max time configuration.
		renderer.render( scene, camera );
		requestAnimationFrame( animate );}
}
requestAnimationFrame(animate);


