define(['underscore', 'game/fw/player', 'game/fw/basic_ia_driver'],
function(_, Player, BasicIADriver) {

var Matus = Player.extend({

    init: function(game) {
        this._super(game);
        this.speed = 3;
        this.driver = new BasicIADriver(game, this);

        this.team = 2;
    },

    get_state: function(user) {
        return _.extend(
            this._super(user),
            {
                'player': 'matus'
            });
    }
});

return Matus;

});