define(['./dynamic_actor'],
function(DynamicActor) {

var Bullet =  DynamicActor.extend({
    owner: null,

    init: function(game) {
        this._super(game);
    }
});

return Bullet;

});