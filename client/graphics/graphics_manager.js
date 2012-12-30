define(['underscore', 'class', 'three', 'game/fw/player', './game_view', './player_view', './bullet_view'],
function(_, Class, THREE, Player, GameView, PlayerView, BulletView) {

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

    main_light: null,
    main_light_pos: null,

    //Views:
    component_views: null,

    init: function(game, user, container) {
        this.game = game;
        this.user = user;

        var NEAR = 0.01, FAR = 32;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x505090, 5, FAR);

        this.camera = new THREE.PerspectiveCamera(
            75,
            container.innerWidth()/container.innerHeight(),
            NEAR,
            FAR*100
        );

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(container.innerWidth(), container.innerHeight());
        this.renderer.setClearColor( 0x101080, 1 );
        this.renderer.shadowMapEnabled = true;
        //this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
        //this.renderer.shadowMapType = THREE.BasicShadowMap;

        //Ambient
        var ambient = new THREE.AmbientLight( 0x101030 );
        this.scene.add( ambient );

        //Main Light:
        this.main_light = new THREE.DirectionalLight( 0x9090BB );
        this.main_light_pos = new THREE.Vector3(15, 30, 30);
        this.main_light.castShadow = true;
        this.main_light.shadowDarkness = 0.3;

        this.main_light.shadowCameraNear = 20;
        this.main_light.shadowCameraFar = 100;

        this.main_light.shadowCameraLeft = -30;
        this.main_light.shadowCameraRight = 30;
        this.main_light.shadowCameraTop = 30;
        this.main_light.shadowCameraBottom = -15;
        
        this.main_light.shadowMapWidth = 2*1024;
        this.main_light.shadowMapHeight = 2*1024;
        this.main_light.shadowBias = 0.0015;
        //this.main_light.shadowCameraVisible = true;

        // add to the scene
        this.scene.add(this.main_light);
        


        //Game:
        this.component_views = [new GameView(this.game, this.scene)];
        var i,
            players = this.game.players,
            bullets = this.game.bullets;
        //Players
        i = players.length;
        while (i--) this.component_views.push(new PlayerView(players[i]));
        //Bullets
        i = bullets.length;
        while (i--) this.component_views.push(new BulletView(bullets[i]));

        //Adding to the scene:
        i = this.component_views.length;
        while (i--) this.scene.add(this.component_views[i].root);

        this.loadContent();

        this._draw_cycle(Date.now());
    },

    loadContent: function() {
        var i = this.component_views.length;
        while (i--) this.component_views[i].loadContent();
    },

    draw: function(delta_time) {
        var player  = this.user.player,
            ang     = player.control.ang,
            camBase = new THREE.Vector3(-Math.sin(ang)*2, 2, -Math.cos(ang)*2),
            camLookOffset = new THREE.Vector3(0, 1.8, 0);

        var player_vec3 = new THREE.Vector3(player.x, 0, player.y);

        this.camera.position = camBase.addSelf(player_vec3);
        this.camera.lookAt(camLookOffset.addSelf(player_vec3));

        //Main ligth:
        this.main_light.position.add(this.main_light_pos, player_vec3);
        this.main_light.target.position.set(player.x, 0, player.y);

        //Component Viewss
        var i = this.component_views.length;
        while (i--) this.component_views[i].draw(delta_time);

        this.renderer.render(this.scene, this.camera);

        //GUI:
        $('.life').width(100 * Math.max(0, player.life/player.max_life) );
        $('.cooldown').width(100 - 100 * Math.max(0, player.shoot_cooldown/player.max_shoot_cooldown) );
        $('.pos .x').html(player.x.toFixed(2));
        $('.pos .y').html(player.y.toFixed(2));
    },

    //Private:
    _draw_cycle: function(before) {
        window.requestAnimationFrame(this._draw_cycle.bind(this));

        this.draw(1000/60);
    }
});

return GraphicsManager;

});