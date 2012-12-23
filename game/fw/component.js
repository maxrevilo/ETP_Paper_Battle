define(['class', 'utils'],
function(Class, Utils) {

var ID_COUNT = 0;

var Component = Class.extend({
    id: null,
    game: null,
    enabled: true,

    init: function(game) {
        this.id = ID_COUNT++;
        this.game = game;
        console.log(this+" created");
    },

    update: function(delta_time) {},

    get_state: function(user) {
        return {
            'id': this.id,
            'enabled': this.enabled
        };
    },

    set_state: function(state) {
        Utils.setIfHas(this, state, 'id');
        Utils.setIfHas(this, state, 'enabled');
    },

    toString: function() {
        return "[Component <"+this.id+">]";
    }
});

return Component;

});