define(['underscore', './driver', 'utils'],
function(_, Driver, Utils) {

var UserDriver = Driver.extend({
    user: null,
    player: null,


    init: function(user, player) {
        this.user = user;
        this.player = player;

        player.driver = this;
        user.session.driver = this;
    },

    destroy: function() {
        this.player.reset_driver();
        this.user.session.driver = null;
    },

    get_state: function(user) {
        var s_state = _.extend(
            this._super(user),
            {
                'username': this.user.profile.username,
                'player_id': this.player.id
            });

        s_state['type'] = 'user';
        return s_state;
    }
});

return UserDriver;

});