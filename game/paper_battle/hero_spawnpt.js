define(['underscore','game/fw/spawn_point', 'utils'],
function(_, SpawnPoint, Utils) {

var HeroSpawnPT = SpawnPoint.extend({
    active: false,
    activator: null,

    init: function(game, vec2) {
        this._super(game);
        this.x = vec2.x;
        this.y = vec2.y;
    },

    activate: function(player) {
        this.activator = player;
        this.active = true;
    },

    deactivate: function() {
        this.active = false;
    },

    update: function(delta_time) {

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

return HeroSpawnPT;

});