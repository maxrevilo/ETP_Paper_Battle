define(['class', 'three'],
function(Class, THREE) {

    /*var PLAYER_MATERIAL = new THREE.MeshPhongMaterial({
        color: 0xCC0000,
        specular: 0xFFFFFF,
        shininess: 8
    });*/

    var PLAYER_MATERIAL = new THREE.MeshNormalMaterial();
    var PLAYER_MATERIAL2 = new THREE.MeshPhongMaterial({
        color: 0xCC0000,
        specular: 0xFFFFFF,
        shininess: 8
    });

    var PlayerView = Class.extend({
        component: null,
        root: null,
        size: 1,

        init: function(component) {
            this.component = component;

            var self = this;

            this.root = new THREE.Object3D();
            //TODO Encapsulate to allow override:
            PB.loader.loadGeom('assets/models/Male02_bin.js',
                function(geom) {
                    //If is not the first geom update:
                    if(self.root.children.length !== 0) {
                        self.root.remove(self.root.children[0]);
                    }

                    //Adding a mesh with the new geom:
                    var mesh = new THREE.Mesh(geom, PLAYER_MATERIAL);
                    self.root.add(mesh);
                    self.fit_to_scale({x: 1, y: null, z: 1}, mesh);
                }
            );
            
        },

        draw: function(delta_time) {
            var player = this.component;

            this.root.position.x = player.x;
            this.root.position.z = player.y;

            this.root.rotation.y = player.control.ang;
        },

        fit_to_scale: function(bounds, mesh) {
            //TODO: should be of the whole root, not only of a mesh.

            if(!mesh.geometry.boundingBox)
                mesh.geometry.computeBoundingBox();

            var bb = mesh.geometry.boundingBox,
                max = {'dist': 0, 'axe': null}, dist;
            for(var axe in bounds) {
                if(bounds[axe]) {
                    dist = bb.max[axe] - bb.min[axe];
                    if(dist > max.dist) {
                        max.dist = dist;
                        max.axe = axe;
                    }
                }
            }
            var scale = bounds[max.axe] / max.dist;
            mesh.scale.x = scale;
            mesh.scale.y = scale;
            mesh.scale.z = scale;
        }

    });

    return PlayerView;
});