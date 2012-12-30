define(['underscore', 'game/fw/actor', 'utils', 'game/fw/spawn_point'],
function(_, Actor, Utils, SpawnPoint) {

var MatusTrap = Actor.extend({
    spawn_points: [],
    heros_trapped: [],
    matus_cap: 0,

    init: function(pb_game, matus_cap) {
        this._super(pb_game);
        this.spawn_points = [];
        this.heros_trapped= [];
        this.matus_cap = matus_cap;
    },

    update: function(delta_time) {

        _(this.game.heros).each(function(hero) {

            if(this.heros_trapped.indexOf(hero.id) === -1 && this.intersects(hero)) {
                this._maddness();
                this.heros_trapped.push(hero.id);
            }

        }, this);
        

    },

    add_spawn_pt: function(x, y, w, h) {
        var spt = new SpawnPoint(this.game);
        spt.set_area(x, y, w, h);
        this.spawn_points.push(spt);
    },


    _maddness: function() {
        var matus_per_spt = Math.floor(this.matus_cap / this.spawn_points.length);

        var i = this.spawn_points.length, j, k, matus;
        while(i--) {
            j = matus_per_spt;
            for(k in this.game.matus) {
                matus = this.game.matus[k];
                if(!matus.isAlive()) {
                    matus.initialize(this.spawn_points[i]);
                    if(!j--) break;
                }
            }
        }
    }

    /*get_state: function(user) {
        return _.extend(
            this._super(user)
        );
    },

    set_state: function(state) {
        this._super(state);
    }*/
});

return MatusTrap;

});