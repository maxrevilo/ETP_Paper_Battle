define(['underscore', 'class', 'three', 'game/fw/player', './player_view'],
function(_, Class, THREE, Player, PlayerView) {

var GraphicsManager = Class.extend({
    //Logic
    game: null,
    user:null,
    paused: false,

    //Graphics
    scene: null,
    container: null,
    renderer: null,
    camera: null,

    init: function(game, user, container) {
        this.game = game;
        this.user = user;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.innerWidth()/container.innerHeight(),
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(container.innerWidth(), container.innerHeight());
        console.log(container.innerWidth(), container.innerHeight());



        //Point Lights:
        var pointLight = new THREE.PointLight(0xFFFFFF);
        // set its position
        pointLight.position.set(100, 1000, 1300);
        // add to the scene
        this.scene.add(pointLight);
        
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
                this.scene.add(mesh);
            }
        }



        this._draw_cycle(Date.now());
    },

    draw: function(delta_time) {
        var player  = this.user.player,
            ang     = player.control.ang,
            camBase = new THREE.Vector3(Math.sin(ang), 2, Math.cos(ang)),
            camLookOffset = new THREE.Vector3(0, 1, 0);

        var player_vec3 = new THREE.Vector3(player.x, 0, player.y);

        this.camera.position = camBase.addSelf(player_vec3);
        this.camera.lookAt(camLookOffset.addSelf(player_vec3));

        _(this.game.players).each(function(player) {
            if(!player._view) {
                player._view = new PlayerView(player);
                this.scene.add(player._view.mesh);
            }

            player._view.draw(delta_time);
        }, this);

        this.renderer.render(this.scene, this.camera);
    },

    //Private:
    _draw_cycle: function(before) {
        window.requestAnimationFrame(this._draw_cycle.bind(this));

        this.draw(1000/60);
    }
});

return GraphicsManager;

});