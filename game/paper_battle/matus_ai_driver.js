define(['underscore', 'game/fw/basic_ai_driver', 'utils'],
function(_, BasicAIDriver, Utils) {

var MatusAIDriver = BasicAIDriver.extend({
    on_range: function(player) {
        var ddx, ddy, dist,
            x = this.player.x,
            y = this.player.y;

        var RANGE = 3;
        ddx = x - player.x; ddy = y - player.y;
        dist = ddx*ddx + ddy*ddy;

        return dist < RANGE*RANGE;
    }
});

return MatusAIDriver;

});