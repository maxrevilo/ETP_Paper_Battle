define(['underscore', 'jquery'], //, 'three'],
function(_, $) { //, THREE) {

    var MOUSE_BTN_MAP = {1:'l', 2:'m', 3:'r'};

    var InputManager = {
        keyPressed: {},
        mouse: {x:0 , y:0},
        mousePressed: {r: false, m: false, l: false},

        init: function(dom) {
            //Input Events initialization:

            //Keyboard:
            dom.onkeydown = function(e){
                e = e || window.event;
                InputManager.keyPressed[e.keyCode] = true;
                //console.log("Pressed "+e.keyCode);
            };

            dom.onkeyup = function(e){
                e = e || window.event;
                delete InputManager.keyPressed[e.keyCode];
                //console.log("Relesed "+e.keyCode);
            };

            //Mouse:
            dom.onmousemove = function(e) {
                InputManager.mouse.x = e.clientX;
                InputManager.mouse.y = e.clientY;
                //console.log("X: "+PB.mouse.x+", "+"Y: "+PB.mouse.y);
            };

            dom.onmousedown = function(e) {
                InputManager.mousePressed[MOUSE_BTN_MAP[event.which]] = true;
            };

            dom.onmouseup = function(e) {
                InputManager.mousePressed[MOUSE_BTN_MAP[event.which]] = false;
            };


            //Input cleaning:
            $(dom).bind('contextmenu', function(e){
                e.preventDefault();
                return false;
            });
        }
    };

    return InputManager;
});