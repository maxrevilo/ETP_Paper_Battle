define(['game/fw/game', 'utils', './zone_1', './hero', './matus'],
function(Game, Utils, Zone1, Hero, Matus) {

var PaperBattle = Game.extend({
    heros: {},
    matus: {},

    init: function(game) {
        this._super(game);

        this.heros   = Utils.clone(this.heros);
        this.matus   = Utils.clone(this.matus);

        //Level specifics:
        var zone1 = new Zone1();
        this.add_zone(zone1);

        var matus, hero;
        _(2).times(function(i) {

            this.add_hero(hero = new Hero(this));
            hero.y = -10;
            hero.x = i*2 - 20;

        }, this);

        _(10).times(function(i) {

            this.add_matus(matus = new Matus(this));
            matus.x = i*2 - 20;

        }, this);

        this.start();
    },

    //HEROs
    add_hero: function(hero) {
        this.add_player(hero);
        return this.heros[hero.id] = hero;
    },

    get_hero: function(id) { return this.heros[id]; },

    //MATUSs
    add_matus: function(matus) {
        this.add_player(matus);
        return this.matus[matus.id] = matus;
    },

    get_matus: function(id) { return this.matus[id]; },

    //LOGIC:
    update: function(delta_time) {
        this._super(delta_time);
    }
    
});

return PaperBattle;

});