define(['underscore', './dynamic_actor', 'utils', './driver'],
function(_, DynamicActor, Utils, Driver) {

var DUMMY_DRIVER = new Driver();

var Player =  DynamicActor.extend({
    max_life: 100,
    life: 0,
    max_shoot_cooldown: 1,
    shoot_cooldown: 0,


    control: null,
    /*  {
    *       dir: {x: 0, y: 0},
    *       ang: 0
    *   },
    */

    driver: DUMMY_DRIVER,

    init: function(game) {
        this._super(game);

        this.life = this.max_life;
        this.shoot_cooldown = this.max_shoot_cooldown;

        this.width = 0.5;
        this.height = 0.5;

        this.reset_control();
    },

    update: function(delta_time) {
        var dSec = delta_time / 1000,
            dir = this.control.dir,
            ang = this.control.ang,
            forward_x = Math.sin(ang),
            forward_y = Math.cos(ang),
            right_x   = Math.cos(ang),
            right_y   = -Math.sin(ang);

        this.x += 6 * dSec * (dir.y * forward_x + dir.x * right_x);
        this.y += 6 * dSec * (dir.y * forward_y + dir.x * right_y);

        this.shoot_cooldown += dSec;
    },

    get_state: function(user) {
        return _.extend(
            this._super(user),
            {
                'life': this.life,
                'control': this.control,
                'driver': this.driver.get_state(user),
                'shoot_cooldown': this.shoot_cooldown
            });
    },

    set_state: function(state) {
        this._super(state);

        Utils.setIfHas(this, state, 'life');
        Utils.setIfHas(this, state, 'control');
        Utils.setIfHas(this, state, 'shoot_cooldown');
    },

    move: function(ang, dir) {
        this.ang = ang;
        this.control.dir = dir;
    },

    shoot: function() {
        if(this.shoot_cooldown > this.max_shoot_cooldown) {
            this.shoot_cooldown = 0;
            return true;
        }
        return false;
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