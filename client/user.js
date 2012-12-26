define(['underscore', 'utils', 'class', 'input_manager'],
function(_, Utils, Class, InputManager) {

    var KEY_TO_VEC = {
        68: {x:-1, y: 0},
        65: {x:+1, y: 0},
        83: {x: 0, y:-1},
        87: {x: 0, y:+1}
    };

    var User = Class.extend({
        game: null,
        driver: null,
        player: null,
        prev_control: null,

        dirUpdated: function(){},
        angUpdated: function(){},
        shooted: function(){},

        init: function(game, driver) {
            if(driver===null)
                throw new Error("'driver' is null");

            this.game = game;
            this.driver = driver;

            this.player = game.get_actor(driver.player_id);
            this.prev_control = Utils.clone(this.player.control);
        },

        name: function() {
            return this.driver.username;
        },

        update_input: function() {
            this.prev_control = Utils.clone(this.player.control);
            this.player.reset_control();

            //Angle
            var offsetX = InputManager.mouse.x - window.innerWidth,
                offsetY = InputManager.mouse.y - window.innerHeight,
                div = window.innerWidth / -Math.PI / 4,
                ang = offsetX/div;
            this.player.control.ang = ang;

            //Direction
            for(var key in KEY_TO_VEC)
                if(InputManager.keyPressed[key])
                    this.player.add_dir( KEY_TO_VEC[key] );

            var cont = this.player.control, prev_cont = this.prev_control;
            if(cont.dir.x != prev_cont.dir.x ||
                cont.dir.y != prev_cont.dir.y) {
                //Trigger the event:
                this.dirUpdated(prev_cont.dir, cont.dir);
            }

            //Trigger the event IF:
            if(cont.ang !== prev_cont.ang)
                this.angUpdated(prev_cont.ang, cont.ang);

            //Actions
            if(InputManager.mousePressed.l) {
                if(this.player.shoot()) {
                    this.shooted();
                }
            }
        }

    });

    return User;
});