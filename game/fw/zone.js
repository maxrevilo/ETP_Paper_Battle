define(['./component'],
function(Component) {

var Zone = Component.extend({

    init: function(game) {
        this._super(game);
    },

    update: function(delta_time) {
    },

    toString: function() {
        return "[Zone <"+this.id+">]";
    }
});

return Zone;

});