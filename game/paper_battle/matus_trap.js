define(['underscore', 'game/fw/actor', 'utils', 'game/fw/spawn_point'],
function(_, Actor, Utils, SpawnPoint) {

var MatusTrap = Actor.extend({
    spawn_points: [],
    
    heros_trapped: [],
    time_to_release: [],

    matus_cap: 0,
    release_time: 0,


    init: function(pb_game, matus_cap, release_time) {
        this._super(pb_game);
        this.spawn_points = [];
        this.heros_trapped= [];
        this.matus_cap = matus_cap;
        this.release_time = release_time;
    },

    update: function(delta_time) {
        var i;

        _(this.game.heros).each(function(hero) {

            if(this.heros_trapped.indexOf(hero.id) === -1 && this.intersects(hero)) {
                this._maddness();

                this.heros_trapped.push(hero.id);
                this.time_to_release.push(this.release_time);
            }

        }, this);
        
        i = this.heros_trapped.length;
        while(i--) {
            this.time_to_release[i] -= delta_time/1000;
            if(this.time_to_release[i] <= 0) {
                this.time_to_release.pop(i);
                this.heros_trapped.pop(i);
            }
        }
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
            j = matus_per_spt-1;
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