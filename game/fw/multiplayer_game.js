define(['underscore', 'utils', './game', './user_driver'],
function(_, Utils, Game, UserDriver) {

var MultiplayerGame = Game.extend({

    //Components
    players: [],
    bullets: [],
    spawn_points: [],

    //Events functions:
    beforeUpdate: function(){},

    init: function(updates_per_second, isServer) {
        this._super(updates_per_second, isServer);

        this.players = [];
        this.bullets = [];
        this.spawn_points = [];
    },

    update: function(delta_time) {
        this._super(delta_time);
    },

    //PLAYERs
    add_player: function(player) {
        this.add_actor(player);
        return this.players.push(player);
    },

    get_player: function(id) {
        return _(this.players).find(function(p){ return p.id === id; });
    },

    get_free_player: function() {
        return _(this.players).find(function(player){
            return !player.enabled && !_(player.driver).has('user');
        });
    },

    //BULLETSs
    add_bullet: function(bullet) {
        this.add_actor(bullet);
        return this.bullets.push(bullet);
    },

    get_bullet: function(id) {
        return _(this.bullets).find(function(b){ return b.id === id; });
    },

    activate_bullet: function(player) {
        var bullet = _(this.bullets).find(function(bullet){
            return !bullet.enabled;
        });
        if(!bullet) throw new Error("Not enough bullets instances");
        bullet.trigger(player);
        return bullet;
    },

    //SPAWN_POINTs
    add_spawn_point: function(spawn_point) {
        this.add_actor(spawn_point);
        return this.spawn_points.push(spawn_point);
    },

    //USERs
    add_user:function(user) {
        var player = this.get_free_player();
        if(player) {
            var driver = new UserDriver(this, user, player);
            player.initialize(this.spawn_points[
                Math.floor(Math.random() * this.spawn_points.length)
            ]);
            return this._super(user);
        } else {
            return null;
        }
    },

    rem_user:function(user) {
        var rem = this._super(user);
        if(rem) {
            user.session.driver.player.kill();
            user.session.driver.destroy();
        }
        return rem;
    },


    //STATE
    get_state: function(user) {
        var state = this._super(user);

        state['players'] = _(this.players).map(function(p){ return p.get_state(user); });
        state['bullets'] = _(this.bullets).map(function(b){ return b.get_state(user); });

        return state;
    },

    set_state: function(state) {
        this._super(state);

        //Actors: ???

        //Players
        if(_(state).has('players')) {
            _(state.players).each(function(p) {
                var player = this.get_player(p.id);
                if(!player) throw new Error("Player not found");
                player.set_state(p);
            }, this);
        }

        //Bullets
        if(_(state).has('bullets')) {
            _(state.bullets).each(function(b) {
                var bullet = this.get_bullet(b.id);
                if(!bullet) throw new Error("Bullet not found");
                bullet.set_state(b);
            }, this);
        }

        //Zones: ???

        //Users: ???
    }
});

return MultiplayerGame;

});