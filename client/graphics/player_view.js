define(['class', 'three'],
function(Class, THREE) {

    var PLAYER_MATERIAL = new THREE.MeshPhongMaterial({
        color: 0xCC0000,
        specular: 0xFFFFFF,
        shininess: 8
    });

    var PlayerView = Class.extend({
        component: null,
        mesh: null,

        init: function(component) {
            this.component = component;

            var self = this;
            //TODO Encapsulate to allow override:
            PB.loader.loadGeom('assets/models/Male02_bin.js',
                function(geom) {
                    if(self.mesh) {
                        //TODO work on a mesh.setGeometry
                        //self.mesh.geometry = geom;
                        PB.graphics.scene.remove(self.mesh);
                        self.mesh = new THREE.Mesh(geom, PLAYER_MATERIAL);
                        self.mesh.scale = new THREE.Vector3(0.01,0.01,0.01);
                        PB.graphics.scene.add(self.mesh);
                    } else {
                        self.mesh = new THREE.Mesh(geom, PLAYER_MATERIAL);
                    }
                }
            );
            
        },

        draw: function(delta_time) {
            var player = this.component;

            this.mesh.position.x = player.x;
            this.mesh.position.z = player.y;

            this.mesh.rotation.y = player.control.ang;
        }

    });

    return PlayerView;
});