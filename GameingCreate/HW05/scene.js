/*
function sceneDesign() {

  // add obstacles to the scene
  scene.obstacles = [];
  scene.obstacles.push ( new Obstacle (new THREE.Vector3(150,0,150), 50) )
  scene.obstacles.push ( new Obstacle (new THREE.Vector3(-100,0,200), 30) )
  scene.obstacles.push ( new Obstacle (new THREE.Vector3(0,0,-100), 60) )
    
  scene.targets = [];
  scene.targets.push (new Target (1, new THREE.Vector3 (300,0,300) ));
  scene.targets.push (new Target (2, new THREE.Vector3 (-200,0,150) ));
  scene.targets.push (new Target (3, new THREE.Vector3 (250,0,-200) ));
  scene.targets.push (new Target (4, new THREE.Vector3 (0,0,-200) ));

}
*/

function sceneFromJSON () {
  const JSONStr = '{"obstacles":[{"center":{"x":3.9594796502145093,"y":5.5165438176416846e-14,"z":263.55695318495896},"size":20},{"center":{"x":5.42098955335508,"y":3.5646388308083605e-14,"z":-160.53706110138933},"size":95},{"center":{"x":-208.14531121285557,"y":-1.780298028666322e-14,"z":80.17749538510077},"size":70}],"targets":[{"id":0,"pos":{"x":-170.96098270075498,"y":1.4072922348060594e-13,"z":-121.78807842739616}}]}';
  
  let myScene = JSON.parse (JSONStr);
  
  scene.obstacles = []
  myScene.obstacles.forEach (function (obs) {
  	scene.obstacles.push (new Obstacle (new THREE.Vector3 (obs.center.x, obs.center.y, obs.center.z), obs.size))
  })
  
  scene.targets = []
  myScene.targets.forEach (function (tt) {
  	scene.targets.push (new Target (tt.id, new THREE.Vector3 (tt.pos.x, tt.pos.y, tt.pos.z) ))
  })

}