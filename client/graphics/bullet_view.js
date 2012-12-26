define(['class', 'three'],
function(Class, THREE) {

    var BULLET_GEOM = new THREE.CubeGeometry(0.2, 0.2, 0.5),
        BULLET_MAT = new THREE.MeshLambertMaterial({ color: 0xff0000, emissive: 0xff0000});

    var BulletView = Class.extend({
        component: null,
        root: null,
        
        init: function(component) {
            this.component = component;

            var self = this;

            this.root = new THREE.Object3D();
            this.loadContent();
        },

        loadContent: function() {
            var self = this;
            self.root.add(new THREE.Mesh(BULLET_GEOM, BULLET_MAT));
        },

        draw: function(delta_time) {
            if(this.root.visible !== this.component.enabled) {
                var visible = this.component.enabled;
                this.root.traverse(function(n){n.visible=visible;});
            }
            
            if(this.root.visible) {
                var bullet = this.component,
                    ang = Math.atan2(bullet.vx, bullet.vy);

                this.root.position.x = bullet.x;
                this.root.position.z = bullet.y;
                this.root.position.y = 1;

                this.root.rotation.y = ang;
            }
        }

    });

    return BulletView;
});