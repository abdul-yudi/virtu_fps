// Bullet
AFRAME.registerComponent('projectile', {
  tick: function () {
    this.el.object3D.translateZ(-0.8);
  }
});

// Spawner
AFRAME.registerComponent('spawner', {
  schema: {
    mixin: { default: '' },
  },
  update: function (oldData) {
    this.el.addEventListener('click', this.spawn.bind(this));
  },
  spawn: function () {
    var scene = document.querySelector('a-scene');
    var camera = document.getElementById('camera');
    var mouthGun = document.getElementById('mouth-gun');
    var entity = document.createElement('a-sphere');
    var cameraRotation = camera.getAttribute('rotation');
    var pos = new THREE.Vector3(0, 0, 0);
    mouthGun.object3D.getWorldPosition(pos);

    entity.setAttribute('rotation', cameraRotation);
    entity.setAttribute('position', pos);
    entity.setAttribute('mixin', this.data.mixin);
    scene.appendChild(entity);
  }
});

// Make target look at camera
AFRAME.registerComponent('look-at', {
  schema: { type: 'selector' },
  tick: function(){
    this.el.object3D.lookAt(this.data.object3D.position)
  }
});