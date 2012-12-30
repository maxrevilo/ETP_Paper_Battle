define(['underscore', './component', 'utils'],
function(_, Component, Utils) {

var Driver = Component.extend({
    player: null,

    init: function(game, player) {
        this._super(game);
        
        this.player = player;
        player.driver = this;
    },

    destroy: function() {
        this.player.reset_driver();
    },

    get_state: function(user) {
        return _.extend(
            this._super(user),
            {
                'type': 'none',
                'player_id': this.player.id
            });
    }
});

return Driver;

});