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