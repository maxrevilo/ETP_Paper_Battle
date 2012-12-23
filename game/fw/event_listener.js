define(['underscore', 'class', 'utils'],
function(_, Class, Utils) {

    var EventManager = Class.extend({
        _ev_funcs: {},
        events: null,

        init: function() {
            this._ev_funcs = Utils.clone(this._ev_funcs);

            if(this.events) {
                _(this.events).each(function(ev_name) {
                    this._ev_funcs[ev_name] = [];
                }, this);
            }
        },

        on: function(event_name, func) {
            return this._ev_funcs[event_name].push(func);
        },

        off: function(event_name, id) {
            delete this._ev_funcs[event_name][id];
        }

    });

    return EventManager;
});