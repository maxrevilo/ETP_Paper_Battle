define(['underscore', './driver', 'utils'],
function(_, Driver, Utils) {

var UserDriver = Driver.extend({
    user: null,


    init: function(game, user, player) {
        this._super(game, player);
        this.user = user;
        user.session.driver = this;
    },

    destroy: function() {
        this._super();
        this.user.session.driver = null;
    },

    get_state: function(user) {
        var s_state = _.extend(
            this._super(user),
            {
                'username': this.user.profile.username
            });

        s_state['type'] = 'user';
        return s_state;
    }
});

return UserDriver;

});