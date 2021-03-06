define(['game/fw/multiplayer_game', 'utils', './zone_1', './hero', './matus',
    'game/fw/bullet', './hero_spawnpt', './matus_trap'],
function(MultiplayerGame, Utils, Zone1, Hero, Matus, Bullet, HeroSpawnPT, MatusTrap) {


var MAX_PLAYERS = 4;

var PaperBattle = MultiplayerGame.extend({
    heros: {},
    matus: {},

    matus_traps: [],

    init: function(game, isServer) {
        this._super(game, isServer);

        this.heros   = {};
        this.matus   = {};
        this.matus_traps = [];

        //Level specifics:
        var zone1 = new Zone1();
        this.add_zone(zone1);

        var matus, hero, bullet;
        //HEROs
        _(MAX_PLAYERS).times(function(i) {

            this.add_hero(hero = new Hero(this));
            hero.enabled = false;

        }, this);

        //MATUs
        _(10*MAX_PLAYERS).times(function(i) {

            this.add_matus(matus = new Matus(this));
            matus.enabled = false;

        }, this);

        //BULLETs
        _(10*MAX_PLAYERS).times(function(i) {

            this.add_bullet(bullet = new Bullet(this));
            bullet.enabled = false;

        }, this);

        if(this.isServer) {
            //SPAWN_PTs
            this.add_spawn_point(
                new HeroSpawnPT(this, {x:0, y:0})
            );

            this.add_spawn_point(
                new HeroSpawnPT(this, {x:-80, y:-36})
            );

            //MATUS_TRAPs:
            this.matus_traps[0] = new MatusTrap(this, 4, 20);
            this.matus_traps[0].set_area(0.1, -19, 6.8, 15);
            this.matus_traps[0].add_spawn_pt(2.3, -8.5, 5, 5);
            this.matus_traps[0].add_spawn_pt(-19.3, -14, 5, 5);
            this.add_actor(this.matus_traps[0]);
        }

        this.start();
    },

    //PLAYERs:
    get_free_player: function() {
        return _(this.heros).find(function(hero){
            return !hero.enabled && !_(hero.driver).has('user');
        });
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

        matus.shoot_handlers.push(this.matus_shoot);

        return this.matus[matus.id] = matus;
    },

    matus_shoot: function(matus) {
        game = matus.game;
        game.activate_bullet(matus);
    },

    get_matus: function(id) { return this.matus[id]; },

    //LOGIC:
    update: function(delta_time) {
        this._super(delta_time);
    }
    
});

return PaperBattle;

});