define(['underscore', './driver', 'utils'],
function(_, Driver, Utils) {

var BasicIADriver = Driver.extend({
    init: function(game, player) {
        this._super(game, player);
    },

    update: function(delta_time) {
        var i, player, ddx, ddy, dist,
            x = this.player.x,
            y = this.player.y,
            nearest = {p: null, d: Number.MAX_VALUE};

        for(i in this.game.players) {
            player = this.game.players[i];
            if(!player.isAlive() || !this.is_enemy(player)) continue;

            ddx = x - player.x; ddy = y - player.y;
            dist = ddx*ddx + ddy*ddy;

            if(dist < nearest.d) {
                nearest.p = player;
                nearest.d = dist;
            }
        }

        var control = this.player.control;
        control.dir.x = 0;
        if(nearest.p) {
            control.ang =
                Math.atan2(nearest.p.x-this.player.x, nearest.p.y-this.player.y);

            control.dir.y = 1;
        } else {
            control.dir.y = 0;
        }
    },

    is_enemy: function(player) {
        return  player.id != this.player.id &&
                player.team != this.player.team;
    },

    get_state: function(user) {
        var s_state = _.extend(
            this._super(user),
            {
            });

        s_state['type'] = 'basic_ia';
        return s_state;
    }
});

return BasicIADriver;

});