define(['underscore', './dynamic_actor', 'utils', './driver'],
function(_, DynamicActor, Utils, Driver) {

var DUMMY_DRIVER = new Driver();

var Player =  DynamicActor.extend({
    life: 100,

    control: null,
    /*  {
    *       dir: {x: 0, y: 0},
    *       ang: 0
    *   },
    */

    driver: DUMMY_DRIVER,

    init: function(game) {
        this._super(game);

        this.width = 0.5;
        this.height = 0.5;

        this.reset_control();
    },

    update: function(delta_time) {
        var dSec = delta_time / 1000;
        this.x += 6 * dSec * this.control.dir.x;
        this.y += 6 * dSec * this.control.dir.y;
    },

    get_state: function(user) {
        return _.extend(
            this._super(user),
            {
                'life': this.life,
                'control': this.control,
                'driver': this.driver.get_state(user)
            });
    },

    set_state: function(state) {
        this._super(state);

        Utils.setIfHas(this, state, 'life');
        Utils.setIfHas(this, state, 'control');
    },

    move: function(ang, dir) {
        this.ang = ang;
        this.control.dir = dir;
    },

    isAlive: function() { return this.life > 0; },

    //Driver:
    reset_driver: function() {
        this.driver = DUMMY_DRIVER;
    },

    //Controls:
    reset_control: function(){ this.control = { dir: {x: 0, y: 0}, ang: 0 }; },
    add_dir: function(vec2) {
        this.control.dir.x += vec2.x;
        this.control.dir.y += vec2.y;
    },
    set_dir: function(vec2) {
        this.control.dir.x = vec2.x;
        this.control.dir.y = vec2.y;
    },
    set_ang: function(ang) { this.control.ang = ang; },

    toString: function() {
        return "[Player <"+this.id+">]";
    }
});

return Player;

});