define(['game/fw/event_listener', 'utils', 'three', 'OBJLoader'],
function(EventListener, Utils, THREE) {

    var EVENTS = ['LOADED'];

    var MATERIAL;
    THREE.ImageUtils.loadTexture('assets/dresses/Snake.png', null, function (tex) {
        MATERIAL = new THREE.MeshPhongMaterial({ map: tex });
    });
    

    var LoaderManager = EventListener.extend({
        events: EVENTS,

        _base_geom: null,
        _geom_loaded: {},
        _geom_loader: null,

        _obj_loaded: {},

        init: function() {
            this._super();
            this._geom_loaded = Utils.clone(this._geom_loaded);
            this._geom_loader = new THREE.BinaryLoader();
            this._base_geom = new THREE.CubeGeometry(1, 1, 1);

            this._obj_loaded = Utils.clone(this._obj_loaded);
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
        },

        loadOBJ: function(url, callback) {
            var obj_quest = this._obj_loaded[url];
            if(!obj_quest) {
                obj_quest = {obj: null, listeners: []};
                this._obj_loaded[url] = obj_quest;

                var loader = new THREE.OBJLoader();
                loader.addEventListener('load',
                    function(ev) {
                        obj_quest.obj = ev.content;

                        THREE.ImageUtils.loadTexture('assets/dresses/Snake.png', null, function (tex) {
                            ev.content.children[0].material.setValues({'map': tex});

                            _(obj_quest.listeners).each(function(fn_cb) {
                                fn_cb(obj_quest.obj.clone());
                            });
                        });

                        
                    }
                );
                loader.load(url);
            }
            
            if(obj_quest.obj) {
                callback(obj_quest.obj.clone());
            } else {
                //TODO must be a way to delete the awaithing callback
                obj_quest.listeners.push(callback);
            }
        }
    });

    return LoaderManager;
});