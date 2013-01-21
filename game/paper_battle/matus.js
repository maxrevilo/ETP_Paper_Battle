define(['underscore', 'game/fw/player', './matus_ai_driver'],
function(_, Player, MatusAIDriver) {

var Matus = Player.extend({
    life_time: 0,

    init: function(game) {
        this._super(game);
        this.speed = 6;
        this.driver = new MatusAIDriver(game, this);

        this.team = 2;

    },

    initialize: function(spawn_point) {
        this._super(spawn_point);
        if(this.game.isServer) this.life_time = 30;
    },

    update: function(delta_time) {
        this._super(delta_time);

        if(this.game.isServer) {
            this.life_time -= delta_time/1000;
            if(this.life_time < 0) this.kill();
        }
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