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

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(container.innerWidth(), container.innerHeight());

        var self = this,
            addView = function(component) {
                component._view = new this.Class(component);
                self.scene.add(component._view.root);
            };

        //Game:
        this.game._view = new GameView(this.game, this.scene);
        this.scene.add(this.game._view.root);

        //Players
        _(this.game.players).each(addView.bind({Class: PlayerView}), this);
        //Bullets
        _(this.game.bullets).each(addView.bind({Class: BulletView}), this);


        this._draw_cycle(Date.now());
    },

    draw: function(delta_time) {
        var player  = this.user.player,
            ang     = player.control.ang,
            camBase = new THREE.Vector3(-Math.sin(ang)*2, 2, -Math.cos(ang)*2),
            camLookOffset = new THREE.Vector3(0, 1.8, 0);

        var player_vec3 = new THREE.Vector3(player.x, 0, player.y);

        this.camera.position = camBase.addSelf(player_vec3);
        this.camera.lookAt(camLookOffset.addSelf(player_vec3));

        //Game
        this.game._view.draw(delta_time);
        var i;
        //Players
        for(i in this.game.players) {
            this.game.players[i]._view.draw(delta_time);
        }
        //Bullets
        for(i in this.game.bullets) {
            this.game.bullets[i]._view.draw(delta_time);
        }

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