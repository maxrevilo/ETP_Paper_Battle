define(['underscore', 'utils', './dynamic_actor'],
function(_, Utils, DynamicActor) {

var Bullet =  DynamicActor.extend({
    owner: null,
    max_life: 200,
    life: 0,

    damage: 500,

    init: function(game) {
        this._super(game);

        this.width = 0.1;
        this.height = 0.1;
    },

    get_state: function(user) {
        var state = this._super(user);
        if(this.enabled) {
            state['owner_id'] = this.owner.id;
            state['life'] = this.life;
        }
        return state;
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
        if(!this.enabled) return;

        var dSec = delta_time * 0.001;
            self = this;

        this.life -= 100 * dSec;

        //Checking life:
        if(this.life < 0) {
            this.enabled = false;
            return;
        }

        var player = _(this.game.players).find(function(p){
            return  p.enabled &&
                    self.owner.id != p.id &&
                    Utils.intersect(self, p);
        });
        if(player) {
            this.life -= this.damage * dSec;
            player.hit(this, delta_time);
        }

        this.x += this.vx * dSec;
        this.y += this.vy * dSec;
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