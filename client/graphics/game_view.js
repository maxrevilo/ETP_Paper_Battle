define(['class', 'three'],
function(Class, THREE) {

    var GameView = Class.extend({
        game: null,
        scene: null,
        root: null,

        init: function(game, scene) {
            this.game = game;
            this.scene = scene;

            this.root = new THREE.Object3D();

            /*
            //Setting graphics
            var beg = -20,
                space = 1.2,
                mesh_mat = new THREE.MeshPhongMaterial({ color: 0x000055, specular: 0xFFFFFF, shininess: 8 }),
                geom = new THREE.CylinderGeometry(0.6, 0.6, 0.0, 6, 0, false),
                mesh, odd;
            for(var x = 0; x < 40; x++) {
                for(var y = 0; y < 40; y++) {
                    odd = y % 2;
                    mesh = new THREE.Mesh(geom, mesh_mat);
                    mesh.position = new THREE.Vector3(x*space + beg + odd*space/2, 0, y*space + beg);
                    this.root.add(mesh);
                }
            }*/
        },

        loadContent: function() {
            var self = this;
            PB.loader.loadOBJ(
                'assets/models/scenes/scene0.obj',
                function(obj3d) {
                    self.root.add(obj3d);
                    var scale = 0.5;
                    obj3d.scale.x = scale;
                    obj3d.scale.y = scale;
                    obj3d.scale.z = scale;

                    self._update_mesh();
                }
            );
        },

        draw: function(delta_time) {

        },

        _update_mesh: function() {
            this.root.traverse(function(o) {
                o.castShadow = true;
                o.receiveShadow = true;
                if(_(o).has("material")) {
                    o.material = new THREE.MeshLambertMaterial({'color': 0x333333});
                }
            });
        }
    });

    return GameView;
});