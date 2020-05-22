/////////////////////////////////////////////////////////
// global variables
var camera, renderer;
var agent;
var agent1;
// program starts here ...
init();
animate();
var i = 1;
function init() {

  initThree();
  
  //scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.z = 500;
  camera.position.y = 400;


  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x888888);

  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  document.body.appendChild(renderer.domElement);

  /////////////////////////////////////////////////////////////////////

  
  // scene grid [-400,400]x[-400,400]
  var gridXZ = new THREE.GridHelper(800, 80, 'red', 'white');
  scene.add(gridXZ);

  // in scene.js
  sceneFromJSON ( );  // using LevelDesigner
  
  //////////////////////////////////////////////////////////////////////////	
  	let size = 10; // halfsize of agent
//    agent = new Agent(new THREE.Vector3(-400 + 400 * Math.random(), 0, -400 + 400 * Math.random()), mesh);
    agent = new Agent(new THREE.Vector3(50,0,-50), size, 0);
    agent1 = new Agent(new THREE.Vector3(-100,0,-50), size, 1);

}



function animate() {

  agent.update(0.01);
  agent1.update(0.01);
  // check agent crossing obstacles ...
  scene.obstacles.forEach ( function (obs) { obs.checkCollision (agent)} );
  scene.obstacles.forEach ( function (obs) { obs.checkCollision (agent1)} );
  if (scene.targets.length > 0)
  	requestAnimationFrame(animate);
  else{
    var posx,posy,posz;
    var flag = true;
    while(flag){
      posx = Math.random()*(400-(-400))+(-400);
      //console.log("x = ",x);
      posy = (Math.random()*(400-(-400))+(-400))*Math.pow(10,-13);
      posz = Math.random()*(400-(-400))+(-400);
      //console.log("posx1 = "+posx,"posy1 = "+posy,"posz1 = "+posz);
      for(let i = 0;i < scene.obstacles.length; i++){
        var tmpx = Math.abs(posx - scene.obstacles[i].x);
        var tmpy = Math.abs(posy - scene.obstacles[i].y);
        var tmpz = Math.abs(posz - scene.obstacles[i].z);
        if(tmpx <= 20 || tmpy <= 20 || tmpz <= 20){
          continue;
        }
        else{
          flag = false;
          break;
        }
      }
      //console.log("x = "+posx,"y = "+posy,"z = "+posz);
    }
    console.log("posx = "+posx,"posy = "+posy,"posz = "+posz);
    scene.targets.push (new Target (0, new THREE.Vector3 (posx, posy, posz) ))
  	//alert ('game over')
    //i += 1;
    //console.log("v = ",agent.vel);
    requestAnimationFrame(animate);
  }
  render();
}

function render() {
  renderer.render(scene, camera);
}

