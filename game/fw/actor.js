define(['underscore', './component', 'utils'],
function(_, Component, Utils) {

var Actor =  Component.extend({
    x: 0, y: 0,
    width: 0, height: 0,

    init: function(game) {
        this._super(game);
    },

    get_state: function(user) {
        return _.extend(
            this._super(user),
            {
                'x': this.x,
                'y': this.y,
                'width': this.width,
                'height': this.height
            });
    },

    set_state: function(state) {
        this._super(state);

        Utils.setIfHas(this, state, 'x');
        Utils.setIfHas(this, state, 'y');
        Utils.setIfHas(this, state, 'width');
        Utils.setIfHas(this, state, 'height');
    },

    toString: function() {
        return "[Actor <"+this.id+">]";
    }
});

return Actor;

});