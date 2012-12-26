define(['underscore', 'utils', './dynamic_actor'],
function(_, Utils, DynamicActor) {

var Bullet =  DynamicActor.extend({
    owner: null,
    max_life: 2,
    life: 0,

    init: function(game) {
        this._super(game);
    },

    get_state: function(user) {
        return _.extend(
            this._super(user),
            {
                'owner_id': this.owner.id,
                'life': this.life
            });
    },

    set_state: function(state) {
        this._super(state);

        if(_(state).has('owner_id')) {
            if(!this.owner || this.owner.id != state.owner_id) {
                this.owner = this.game.get_player(state.owner_id);
            }
        }

        Utils.setIfHas(this, state, 'life');
    },

    update: function(delta_time) {
        var dSec = delta_time / 1000;
        this.life -= dSec;

        if(this.life < 0) {
            this.enabled = false;
        } else {
            this.x += this.vx * dSec;
            this.y += this.vy * dSec;
        }
    },

    trigger: function(player) {
        this.enabled = true;
        this.life = this.max_life;
        this.owner = player;
        this._spawn_pos({x:0, y:1});
        this._spawn_dir(0);
    },

    _spawn_pos: function(pos_on_owner) {
        var ang = this.owner.control.ang,
            forward_x = Math.sin(ang),
            forward_y = Math.cos(ang),
            right_x   = forward_y,
            right_y   = -forward_x;
        this.x = this.owner.x + pos_on_owner.y * forward_x + pos_on_owner.x * right_x;
        this.y = this.owner.y + pos_on_owner.y * forward_y + pos_on_owner.x * right_y;
    },

    _spawn_dir: function(ang_on_owner) {
        var ang = this.owner.control.ang + ang_on_owner,
            speed = 10;
        this.vx = speed * Math.sin(ang);
        this.vy = speed * Math.cos(ang);
    },

    toString: function() {
        return "[Bullet <"+this.id+">]";
    }
});

return Bullet;

});