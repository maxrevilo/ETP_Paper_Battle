define(['underscore', 'game/fw/player'],
function(_, Player) {

var Hero = Player.extend({

    init: function(game) {
        this._super(game);

        this.team = 1;
    },

    get_state: function(user) {
        return _.extend(
            this._super(user),
            {
                'player': 'hero'
            });
    }
});

return Hero;

});