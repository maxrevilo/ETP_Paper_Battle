define(['underscore', './component', 'utils'],
function(_, Component, Utils) {

var Actor =  Component.extend({
    x: 0, y: 0,
    width: 0, height: 0,

    init: function(game) {
        this._super(game);
    },

    intersects: function(actor) {
        return Utils.intersect(this, actor);
    },

    set_area: function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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
        var dif = 1;

        if(state.x) this.x = this.x * (1-dif) + state.x * dif;
        if(state.y) this.y = this.y * (1-dif) + state.y * dif;

        Utils.setIfHas(this, state, 'width');
        Utils.setIfHas(this, state, 'height');
    },

    toString: function() {
        return "[Actor <"+this.id+">]";
    }
});

return Actor;

});