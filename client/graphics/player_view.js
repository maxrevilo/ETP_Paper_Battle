define(['class', 'three', 'MTLLoader', 'OBJMTLLoader'],
function(Class, THREE) {

    var PlayerView = Class.extend({
        component: null,
        root: null,
        size: 1,

        init: function(component) {
            this.component = component;

            var self = this;

            this.root = new THREE.Object3D();
            this.loadContent();
        },

        loadContent: function() {
            var loader = new THREE.OBJMTLLoader(),
                self = this;
            loader.addEventListener( 'load', function ( event ) {
                var model = event.content;
                self.root.add(model);
                var scale = 0.01;
                model.scale.x = scale;
                model.scale.y = scale;
                model.scale.z = scale;
            });
            loader.load( 'assets/models/male02.obj', 'assets/models/male02.mtl' );
        },

        draw: function(delta_time) {
            var player = this.component;

            this.root.position.x = player.x;
            this.root.position.z = player.y;

            this.root.rotation.y = player.control.ang;
        }

    });

    return PlayerView;
});