define(['underscore', 'utils', 'class'],
function(_, Utils, Class) {

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

    //Persistibles:
    users : [],

    isServer: false,

    //Events functions:
    beforeUpdate: function(){},

    init: function(updates_per_second, isServer) {
        this.time.started = Date.now();
        this.updates_per_second = updates_per_second;
        this.isServer = isServer;

        this.time    = Utils.clone(this.time);
        this.zones   = [];
        this.actors  = [];
        this.users   = [];
    },

    start: function() {
        this.started = true;
        this._begin_updates(1000 / this.updates_per_second);
    },

    update: function(delta_time) {
        this.beforeUpdate(delta_time);

        var i, zones = this.zones, actors = this.actors;
        for(i in this.zones) zones[i].update(delta_time);
        for(i in this.actors)
            if(actors[i].enabled)
                actors[i].update(delta_time);
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

    //USERs
    add_user:function(user) {
        this.users.push(user);
        return user;
    },

    rem_user:function(user) {
        var ind = this.users.indexOf(user);
        if(ind >= 0) {
            this.users.splice(ind, 1);
            return true;
        }
        return false;
    },

    //STATE
    get_state: function(user) {
        var state = {
            'time'   : this.time,
            //'actors' : get_state_arr(this.actors),
            'zones'  : _(this.zones).map(function(z){ return z.get_state(user); })
            //'users'  : get_state_arr(this.users)
        };
        return state;
    },

    set_state: function(state) {
        //Time
        Utils.setIfHas(this, state, 'time');
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