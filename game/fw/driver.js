define(['underscore', 'class', 'utils'],
function(_, Class, Utils) {

var Driver = Class.extend({
    init: function() {
    },

    get_state: function(user) {
        return {
            'type': 'none'
        };
    }
});

return Driver;

});