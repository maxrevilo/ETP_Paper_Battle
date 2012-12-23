define(['underscore'], //, 'three'],
function(_) { //, THREE) {

    var InputManager = {
        keyPressed: {},
        mouse: {x:0 , y:0},

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
        }
    };

    return InputManager;
});