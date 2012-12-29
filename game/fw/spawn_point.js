define(['underscore','./actor', 'utils'],
function(_, Actor, Utils) {

var SpawnPoint =  Actor.extend({

    init: function(game) {
        this._super(game);
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

return SpawnPoint;

});