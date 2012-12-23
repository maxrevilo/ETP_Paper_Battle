define(['underscore','./actor', 'utils'],
function(_, Actor, Utils) {

var DynamicActor =  Actor.extend({
    vx: 0, vy: 0,

    init: function(game) {
        this._super(game);
    },

    get_state: function(user) {
        return _.extend(
            this._super(user),
            {
                'vx': this.vx,
                'vy': this.vy
            });
    },

    set_state: function(state) {
        this._super(state);

        Utils.setIfHas(this, state, 'vx');
        Utils.setIfHas(this, state, 'vy');
    }
});

return DynamicActor;

});