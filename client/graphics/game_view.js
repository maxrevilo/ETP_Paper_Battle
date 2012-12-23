define(['class', 'three'],
function(Class, THREE) {

    var GameView = Class.extend({
        //Object to draw:
        component: null,

        init: function(component) {
            this.component = component;
        }


    });

    return GameView;
});