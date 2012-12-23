requirejs.config({
    //baseUrl: '/',

    paths: {
        //'backbone':         'libs/backbone-0.9.2',
        'game/fw':          'fw',
        'underscore':       'libs/underscore-1.4.2',
        'text':             'libs/require_text-2.0.3',
        'jquery':           'libs/jquery-1.8.2',
        'three':            'libs/three',
        'class':            'libs/class',
        'utils':            'libs/utils',
        'sockets':          '/socket.io/socket.io.js'
    },

    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {
        "underscore": {exports: "_"},
        "three": {exports: "THREE"},
        "sockets": {exports: "io"}

        /*"backbone": {
            "deps": ["underscore", "jquery"],
            "exports": "Backbone"  //attaches "Backbone" to the window object
        },*/
    } // end Shim Configuration
});

require(
['require', 'jquery', 'sockets', 'three', 'input_manager',
    'paper_battle/paper_battle', 'graphics/graphics_manager', 'user'],
function(require, $, io, THREE, InputManager, PaperBattle, GraphicsManager, User) {

    PB = {
        socket: null,
        game: null,
        graphics: null,
        user: null
    };

    PB.socket = io.connect('/game');

    InputManager.init(window);

    PB.game = new PaperBattle(60);

    PB.socket.on('init_data', function (data) {
        var state = data.state,
            driver = data.driver;

        PB.game.set_state(state);

        PB.user = new User(PB.game, driver);
        PB.game.beforeUpdate = function(delta_time) {
            PB.user.update_input(delta_time);
        };
        PB.user.dirUpdated = function(old_dir, new_dir) {
            PB.socket.emit('setDir', {'id': 1, 'dir': new_dir});
        };
        PB.user.angUpdated = function(old_ang, new_ang) {
            PB.socket.emit('setAng', {'id': 1, 'ang': new_ang});
        };


        PB.graphics = new GraphicsManager(PB.game, PB.user, $('#screen'));
        $('#screen').append(PB.graphics.renderer.domElement);
        $('#screen .name').html(""+PB.user.name());

    });

    PB.socket.on('player_state', function(player_state) {
        PB.game.get_player(player_state.id).set_state(player_state);
    });

    /*PB.world = new World();
    $('#screen').append(PB.world.renderer.domElement);*/


    /*
    function update() {
        PB.world.update(1/60);
    }

    function render() {
        update();
        PB.world.draw(1/60);

        $('.ping .value').html(PB.ping);
    }

    function game_loop() {
        requestAnimationFrame(game_loop);
        render();
    }

    init();
    game_loop();*/

});