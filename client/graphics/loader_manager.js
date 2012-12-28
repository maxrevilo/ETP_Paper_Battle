define(['game/fw/event_listener', 'utils', 'three', 'OBJLoader'],
function(EventListener, Utils, THREE) {

    var EVENTS = ['LOADED'];

    var MATERIAL;
    THREE.ImageUtils.loadTexture('assets/dresses/Snake.png', null, function (tex) {
        MATERIAL = new THREE.MeshPhongMaterial({ map: tex });
    });
    

    var LoaderManager = EventListener.extend({
        events: EVENTS,
        _obj_loaded: {},
        _tex_loaded: {},

        init: function() {
            this._super();
            this._obj_loaded = Utils.clone(this._obj_loaded);
            this._tex_loaded = Utils.clone(this._tex_loaded);
        },

        loadOBJ: function(url, callback) {
            var obj_quest = this._obj_loaded[url];
            if(!obj_quest) {
                obj_quest = {obj: null, listeners: []};
                this._obj_loaded[url] = obj_quest;

                //Loading OBJ
                var loader = new THREE.OBJLoader();
                loader.addEventListener('load',
                    function(ev) {
                        obj_quest.obj = ev.content;
                        
                        //TODO Array.pop instead of each?
                        _(obj_quest.listeners).each(function(fn_cb) {
                            fn_cb(obj_quest.obj.clone());
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
        },

        loadTexture: function(url, callback) {
            var tex_quest = this._tex_loaded[url];
            if(!tex_quest) {
                tex_quest = {tex: null, listeners: []};
                this._tex_loaded[url] = tex_quest;

                //Loading texture
                THREE.ImageUtils.loadTexture(url, null, function (tex) {
                    tex_quest.tex = tex;
                    //TODO Array.pop instead of each?
                    _(tex_quest.listeners).each(function(fn_cb) {
                        fn_cb(tex_quest.tex);
                    });
                });
            }
            
            if(tex_quest.tex) {
                callback(tex_quest.tex);
            } else {
                //TODO must be a way to delete the awaithing callback
                tex_quest.listeners.push(callback);
            }
            
        }
    });

    return LoaderManager;
});