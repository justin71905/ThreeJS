function agentMesh (size, colorName='red') {
	// mesh facing +x
	let geometry = new THREE.Geometry();
	  geometry.vertices.push (new THREE.Vector3(3*size,0,0))
	  geometry.vertices.push (new THREE.Vector3(0,0,-size))
	  geometry.vertices.push (new THREE.Vector3(0,0,size))
	  geometry.vertices.push (new THREE.Vector3(0,size,0))
  
	  geometry.faces.push(new THREE.Face3(0, 3, 2));
	  geometry.faces.push(new THREE.Face3(0, 2, 1));
	  geometry.faces.push(new THREE.Face3(1, 3, 0));
	  geometry.faces.push(new THREE.Face3(1, 2, 3));
	  geometry.computeFaceNormals()
	
	return new THREE.Mesh (geometry, 
	     new THREE.MeshBasicMaterial({color:colorName}))  
}

class Agent {
  constructor(pos, halfSize, index) {
    if(index == 0){
        this.name = "agent_cyan";
    }
    else if(index == 1){
        this.name = "agent_red";
    }
    this.pos = pos.clone();
    this.vel = new THREE.Vector3();
    this.force = new THREE.Vector3();
    this.target = null;
    this.halfSize = halfSize;  // half width
    if(index == 0)
      this.mesh = agentMesh (this.halfSize, 'cyan');
    else if(index == 1)
      this.mesh = agentMesh (this.halfSize, 'red');
    this.MAXSPEED = 50;
    this.ARRIVAL_R = 30;
    
    this.score = 0;
    
    // for orientable agent
    this.angle = 0;
    scene.add (this.mesh);
  }
  
  update(dt) {
  
  	// about target ...
  	if (this.target === null || this.target.found === true) {  // no more target OR target found by other agent
  	  console.log ('find target')
  		this.findTarget();
  		return;  // wait for next turn ...
  	}
  	
    this.accumulateForce();
    
    // collision
    // for all obstacles in the scene
    let obs = scene.obstacles;
    //console.log(obs.length);
    // pick the most threatening one
    // apply the repulsive force
    // (write your code here)
    var projMin = -1,minDistance = 100000;
    for(let i = 0;i < obs.length; i++){
      let ob = obs[i];
      let vhat = this.vel.clone().normalize();
      let point = ob.center.clone().sub (this.pos) // c-p
      let proj  = point.dot(vhat);
      const REACH = 50
      const K = 5
      if(proj > 0 && proj < REACH && proj < minDistance){
        projMin = i;
        minDistance = proj;
      }
    }
    if (projMin > -1 && minDistance > 0) {
      let ob = obs[projMin];
      let vhat = this.vel.clone().normalize();
      let point = ob.center.clone().sub (this.pos) // c-p
      let proj  = point.dot(vhat);
      const REACH = 50
      const K = 5
      let perp = new THREE.Vector3();
      perp.subVectors (point, vhat.clone().setLength(proj));
      let overlap = ob.size + this.halfSize - perp.length()
      if (overlap > 0) {
        perp.setLength (K*overlap);
        perp.negate()
        this.force.add (perp);
        console.log ("hit:", perp);
      }
    }
    
	// Euler's method       
    this.vel.add(this.force.clone().multiplyScalar(dt));


    // velocity modulation
    let diff = this.target.pos.clone().sub(this.pos)
    let dst = diff.length();
    if (dst < this.ARRIVAL_R) {
      this.vel.setLength(dst)
      const REACH_TARGET = 5;
      if (dst < REACH_TARGET) {// target reached
      	console.log ('target reached');
         this.target.setFound (this);
         this.target = null;
      }
    }
    
    // Euler
    this.pos.add(this.vel.clone().multiplyScalar(dt))
    this.mesh.position.copy(this.pos)
    
    // for orientable agent
    // non PD version
    if (this.vel.length() > 0.1) {
	    	this.angle = Math.atan2 (-this.vel.z, this.vel.x)
    		this.mesh.rotation.y = this.angle
   	}
  }

  findTarget () {
  	console.log ('total: ' + scene.targets.length)
  	let allTargets = scene.targets;
  	let minD = 1e10;
  	let d;
  	for (let i = 0; i < allTargets.length; i++) {
  		d = this.pos.distanceTo (allTargets[i].pos)
  		if (d < minD) {
  			minD = d;
  			this.setTarget (allTargets[i])
  		}
  	}
  }
  
  setTarget(target) {
    this.target = target;
  }
  targetInducedForce(targetPos) {
    return targetPos.clone().sub(this.pos).normalize().multiplyScalar(this.MAXSPEED).sub(this.vel)
  }

  accumulateForce() {
    // seek
    this.force.copy(this.targetInducedForce(this.target.pos));
  }

}
