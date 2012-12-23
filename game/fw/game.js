define(['underscore', 'utils', 'class', './player', './user_driver'],
function(_, Utils, Class, Player, UserDriver) {

var get_state_arr = function(components) {
    return _(components)
        .filter(function(c){ return c.enabled; })
        .map(function(c){ return c.get_state(); });
};

var Game = Class.extend({
    time: {
        total: function() { return Date.now() - start; },
        started: 0,
        last_update: 0,
        last_delta: 0
    },
    updates_per_second: 0,
    started: false,

    //Components
    zones : [],
    actors: [],
    players: [],

    //Persistibles:
    users : [],

    //Events functions:
    beforeUpdate: function(){},

    init: function(updates_per_second) {
        this.time.started = Date.now();
        this.updates_per_second = updates_per_second;

        this.time    = Utils.clone(this.time);
        this.zones   = Utils.clone(this.zones);
        this.players = Utils.clone(this.players);
        this.actors  = Utils.clone(this.actors);
        this.users   = Utils.clone(this.users);
    },

    start: function() {
        this.started = true;
        this._begin_updates(1000 / this.updates_per_second);
    },

    update: function(delta_time) {
        this.beforeUpdate(delta_time);

        var i, zones = this.zones, actors = this.actors;
        for(i in this.zones) zones[i].update(delta_time);
        for(i in this.actors) actors[i].update(delta_time);
    },


    //ZONEs
    add_zone: function(zone) {
        return this.zones.push(zone);
    },

    //ACTORs
    add_actor: function(actor) {
        return this.actors.push(actor);
    },

    get_actor: function(id) {
        return _(this.actors).find(function(a){ return a.id === id; });
    },

    //PLAYERs
    add_player: function(player) {
        this.add_actor(player);
        return this.players.push(player);
    },

    get_player: function(id) {
        return _(this.players).find(function(p){ return p.id === id; });
    },


    //USERs
    add_user:function(user) {
        var player = _(this.players).find(function(player){
            return !_(player.driver).has('player');
        });
        if(player) {
            var driver = new UserDriver(user, player);
            this.users.push(user);
            return user;
        } else {
            return null;
        }
    },

    rem_user:function(user) {
        var ind = this.users.indexOf(user);
        if(ind >= 0) {
            this.users.splice(ind, 1);
            user.session.driver.destroy();
            return true;
        }
        return false;
    },

    //STATE
    get_state: function(user) {
        var state = {
            'time'   : this.time,
            'players': get_state_arr(this.players),
            //'actors' : get_state_arr(this.actors),
            'zones'  : get_state_arr(this.zones),
            'users'  : get_state_arr(this.users)
        };
        return state;
    },

    set_state: function(state) {
        //Time
        Utils.setIfHas(this, state, 'time');

        //Actors: ???

        //Players
        if(_(state).has('players')) {
            _(state.players).each(function(p) {
                var player = this.get_player(p.id);
                if(!player) { //If the player is new:
                    player = new Player(this);
                    this.add_player(player);
                }
                player.set_state(p);
            }, this);
        }

        //Zones: ???

        //Users: ???
    },

    //Privates:
    /**
     *  params:
     *      delta_time- milliseconds to the next update.
     */
    _begin_updates: function(delta_time) {
        var self = this;
        this.time.last_update = Date.now();
        setTimeout(
            function() {
                self.time.last_delta = Date.now() - self.time.last_update;

                self._begin_updates(delta_time);
                self.update(self.time.last_delta);
            },
            delta_time
        );
    }
});

return Game;

});