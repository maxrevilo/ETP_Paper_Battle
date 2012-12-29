define(['class', 'three', 'paper_battle/hero'],
function(Class, THREE, Hero) {
    var PlayerView = Class.extend({
        component: null,
        root: null,
        dress: null,
        dress_name: null,

        _visible: true,
        
        init: function(component) {
            this.component = component;

            this.root = new THREE.Object3D();
            if(component instanceof Hero) this.dress_name = 'Snake';
            else this.dress_name = 'Zombie';
        },

        loadContent: function() {
            var self = this;
            PB.loader.loadTexture(
                'assets/dresses/'+self.dress_name+'.png',
                function(tex) {
                    self.dress = tex;
                    //self._update_dress();

                    PB.loader.loadOBJ(
                        'assets/models/cubee/cubee.obj',
                        function(obj3d) {
                            self.root.add(obj3d);
                            var scale = 0.5;
                            obj3d.scale.x = scale;
                            obj3d.scale.y = scale;
                            obj3d.scale.z = scale;

                            self._update_dress();
                            //Updating childs visibility:
                            self.setVisibility(undefined);
                        }
                    );
                }
            );
        },

        draw: function(delta_time) {
            var player = this.component;

            if(this._visible !== this.component.enabled) {
                this.setVisibility(this.component.enabled);
            }

            if(this._visible) {
                this.root.position.x = player.x;
                this.root.position.z = player.y;

                this.root.rotation.y = player.control.ang;
            }
        },

        _update_dress: function() {
            var dress = this.dress, length, mats;
            if(dress) {
                this.root.traverse(
                    function(o) {
                        if(_(o).has("material")) {
                            //o.material.setValues({'map': dress});//{color: 0xff0000});
                            o.material = new THREE.MeshLambertMaterial({'map': dress});
                        }
                    }
                );
            }
        },

        setVisibility: function(toggle) {
            if(toggle !== undefined) this._visible = toggle;
            var self = this;
            this.root.traverse(function(n){n.visible=self._visible;});
        }

    });

    return PlayerView;
});