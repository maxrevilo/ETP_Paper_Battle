define(['class', 'three'],
function(Class, THREE) {

    var PLAYER_MATERIAL = new THREE.MeshPhongMaterial({
        color: 0xCC0000,
        specular: 0xFFFFFF,
        shininess: 8
    });

    var PLAYER_GEOM = new THREE.CubeGeometry(1, 1, 1);

    var PlayerView = Class.extend({
        //STATIC:
        PLAYER_GEOM: PLAYER_GEOM,
        PLAYER_MATERIAL: PLAYER_MATERIAL,

        //Object to draw:
        component: null,
        mesh: null,

        init: function(component) {
            this.component = component;

            //TODO Encapsulate to allow override:
            this.mesh = new THREE.Mesh(PLAYER_GEOM, PLAYER_MATERIAL);
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