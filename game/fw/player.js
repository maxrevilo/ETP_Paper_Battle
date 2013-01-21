define(['underscore', './dynamic_actor', 'utils', './driver'],
function(_, DynamicActor, Utils, Driver) {

var Player =  DynamicActor.extend({
    max_life: 100,
    life: 0,
    max_shoot_cooldown: 0.5,
    shoot_cooldown: 0,
    speed: 6,

    hit_list: {},

    control: null,
    /*  {
    *       dir: {x: 0, y: 0},
    *       ang: 0
    *   },
    */

    driver: null,

    // 0 is free for all
    team: 0,

    shoot_handlers: null, //[]

    //Private:
    _DUMMY_DRIVER: null,

    init: function(game) {
        this._super(game);

        this.width = 1;
        this.height = 1;

        this.shoot_handlers = [];

        this.reset_driver();
        this.reset_control();
    },

    update: function(delta_time) {
        if(!this.isAlive()) {
            this.enabled = false;
            return;
        }

        if(this.driver) this.driver.update(delta_time);

        var dSec = delta_time * 0.001;
            dir = this.control.dir,
            ang = this.control.ang,
            forward_x = Math.sin(ang),
            forward_y = Math.cos(ang),
            right_x   = Math.cos(ang),
            right_y   = -Math.sin(ang);

        this.x += this.speed * dSec * (dir.y * forward_x + dir.x * right_x);
        this.y += this.speed * dSec * (dir.y * forward_y + dir.x * right_y);

        var players = this.game.players,
            i = players.length,
            esc_ang,
            esc_str = 0.07;
        while(i--) {
            if(players[i].isAlive() && players[i].id != this.id && this.intersects(players[i])) {
                esc_ang = Math.atan2(this.y - players[i].y, this.x - players[i].x);
                this.x += esc_str * Math.cos(esc_ang);
                this.y += esc_str * Math.sin(esc_ang);
            }
        }

        this.shoot_cooldown -= dSec;
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

    //TODO Rename atack.
    shoot: function() {
        if(this.isAlive() && this.shoot_cooldown <= 0) {
            this.shoot_cooldown = this.max_shoot_cooldown;

            var i = this.shoot_handlers.length;
            while(i--) this.shoot_handlers[i](this);

            return true;
        }
        return false;
    },

    hit: function(bullet, delta_time) {
        var dmg = bullet.damage * delta_time * 0.001;
        this.life -= dmg;
        if(!this.hit_list[bullet.owner.id]) {
            this.hit_list[bullet.owner.id] = dmg;
        } else {
            this.hit_list[bullet.owner.id] += dmg;
        }
    },

    isAlive: function() { return this.enabled && this.life > 0; },

    initialize: function(spawn_point) {
        this.x = spawn_point.x + spawn_point.width * (Math.random() - 0.5);
        this.y = spawn_point.y + spawn_point.height * (Math.random() - 0.5);
        this.life = this.max_life;
        this.hit_list = {};
        this.enabled = true;
    },

    kill: function() {
        this.life = 0;
        this.enabled = false;
    },

    //Driver:
    reset_driver: function() {
        if(!this._DUMMY_DRIVER)
            this._DUMMY_DRIVER = new Driver(this.game, this);
        this.driver = this._DUMMY_DRIVER;
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