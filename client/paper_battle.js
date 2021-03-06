requirejs.config({
    //baseUrl: '/',

    paths: {
        //'backbone':         'libs/backbone-0.9.2',
        'game/fw':          'fw',
        'underscore':       'libs/underscore-1.4.2',
        'text':             'libs/require_text-2.0.3',
        'jquery':           'libs/jquery-1.8.2',
        'three':            'libs/three',
        'MTLLoader':        'libs/threejs/loaders/MTLLoader',
        'OBJLoader':        'libs/threejs/loaders/OBJLoader',
        'OBJMTLLoader':     'libs/threejs/loaders/OBJMTLLoader',
        'class':            'libs/class',
        'utils':            'libs/utils',
        'sockets':          '/socket.io/socket.io.js'
    },

    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {
        "underscore": {exports: "_"},
        "three": {exports: "THREE"},
        "sockets": {exports: "io"},

        "MTLLoader": {deps: ["three"], exports: "THREE"},
        "OBJLoader": {deps: ["three"], exports: "THREE"},
        "OBJMTLLoader": {deps: ["three"], exports: "THREE"}

        /*"backbone": {
            "deps": ["underscore", "jquery"],
            "exports": "Backbone"  //attaches "Backbone" to the window object
        },*/
    } // end Shim Configuration
});

require(
['require', 'jquery', 'sockets', 'three', 'input_manager',
    'paper_battle/paper_battle', 'graphics/graphics_manager', 'user', 'graphics/loader_manager'],
function(require, $, io, THREE, InputManager, PaperBattle, GraphicsManager, User, LoaderManager) {

    PB = {
        socket: null,
        game: null,
        graphics: null,
        user: null,
        loader: null
    };

    PB.socket = io.connect('/game');

    InputManager.init(window);

    PB.loader = new LoaderManager();

    PB.game = new PaperBattle(60, false);

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
        PB.user.shooted = function() {
            PB.socket.emit('shoot');
        };


        PB.graphics = new GraphicsManager(PB.game, PB.user, $('#screen'));
        $('#screen').append(PB.graphics.renderer.domElement);
        $('#screen .name').html(""+PB.user.name());

    });

    PB.socket.on('kick', function(data) {
        alert("You have been kicked from the server\nMessage: "+data.message);
    });

    PB.socket.on('plSt', function(player_state) {
        PB.game.get_player(player_state.id).set_state(player_state);
    });

    PB.socket.on('plAng', function(str) {
        var parts = str.split("=");
        PB.game.get_player(Number(parts[0])).control.ang = parts[1];
    });

    PB.socket.on('blSt', function(bullet_state) {
        PB.game.get_bullet(bullet_state.id).set_state(bullet_state);
    });

    PB.socket.on('gmSt', function(game_state) {
        PB.game.set_state(game_state);
    });

});