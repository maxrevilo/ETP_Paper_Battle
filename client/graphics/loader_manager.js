define(['game/fw/event_listener', 'utils', 'three'],
function(EventListener, Utils, THREE) {

    var EVENTS = ['LOADED'];

    var LoaderManager = EventListener.extend({
        events: EVENTS,

        _base_geom: null,
        _geom_loaded: {},
        _geom_loader: null,

        init: function() {
            this._super();
            this._geom_loaded = Utils.clone(this._geom_loaded);
            this._geom_loader = new THREE.BinaryLoader();
            this._base_geom = new THREE.CubeGeometry(1, 1, 1);
        },

        loadGeom: function(url, callback) {
            var geom_quest = this._geom_loaded[url];
            if(!geom_quest) {
                geom_quest = {geom: null, listeners: []};
                this._geom_loaded[url] = geom_quest;
            }

            //TODO must be a way to delete the awaithing callback
            geom_quest.listeners.push(callback);

            if(geom_quest.geom) {
                callback(geom_quest.geom);
            } else {
                callback(this._base_geom);

                this._geom_loader.load(
                    url,
                    function(geom) {
                        geom_quest.geom = geom;
                        _(geom_quest.listeners).each(function(fn) { fn(geom); });
                    }
                );
            }
        }
    });

    return LoaderManager;
});