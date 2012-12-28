define(['class', 'three'],
function(Class, THREE) {
    var PlayerView = Class.extend({
        component: null,
        root: null,
        
        init: function(component) {
            this.component = component;

            this.root = new THREE.Object3D();
            this.loadContent();
        },

        loadContent: function() {
            var self = this;
            PB.loader.loadOBJ(
                'assets/models/cubee/cubee.obj',
                function(obj3d) {
                    self.root.add(obj3d);
                    var scale = 0.5;
                    obj3d.scale.x = scale;
                    obj3d.scale.y = scale;
                    obj3d.scale.z = scale;
                }
            );
        },

        draw: function(delta_time) {
            var player = this.component;

            if(this.root.visible !== this.component.enabled) {
                var visible = this.component.enabled;
                this.root.traverse(function(n){n.visible=visible;});
            }

            if(this.root.visible) {
                this.root.position.x = player.x;
                this.root.position.z = player.y;

                this.root.rotation.y = player.control.ang;
            }
        }

    });

    return PlayerView;
});