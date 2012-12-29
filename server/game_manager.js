define(['underscore', 'class', 'game/paper_battle/user'],
function(_, Class, User) {

var GameManager = Class.extend({
    //Logic
    game: null,
    channel: null,
    users: [],

    init: function(game, channel) {

        this.game = game;
        this.channel = channel;

        this._update_clients();

        var self = this;

        channel.on('connection', function(socket){

            console.log('Client Connected');
            
            var user = new User();
            socket.set('user', user, function(){});
            var added = self.game.add_user(user);

            if(!added) {
                var message = 'User rejected: player slots depleted';
                console.log(message);
                socket.emit('kick', {'message': message});
                socket.disconnect();
                return false;
            }

            console.log('User asigned to '+user.session.driver.player);
            socket.emit('init_data', {
                driver: user.session.driver.get_state(),
                state: game.get_state()
            });


            //A player change its move direction
            socket.on('setDir', function(data, callback){
                socket.get('user' , function(err, user) {
                   var player = user.session.driver.player;
                    if(player && player.isAlive()) player.set_dir(data.dir);

                    channel.emit('plSt', player.get_state(null));
                });
            });

            //Player change its facing angle
            socket.on('setAng', function(data, callback){
                socket.get('user' , function(err, user) {
                    var player = user.session.driver.player;
                    if(player && player.isAlive()) player.set_ang(data.ang);

                    socket.broadcast.volatile.emit(
                        'plAng',
                        player.id+'='+
                        player.control.ang.toFixed(3)
                    );
                });
            });

            //Player want to shoot
            socket.on('shoot', function(data, callback){
                socket.get('user' , function(err, user) {
                    var player = user.session.driver.player;
                    if(player && player.isAlive()) {
                        if(player.shoot()) {
                            var bullet = game.activate_bullet(player);

                            channel.emit('blSt', bullet.get_state(null));
                        } else {
                            //TODO: advice the client
                        }
                    }
                });
            });

            socket.on('disconnect', function(){
                socket.get('user' , function(err, user) {
                    self.game.rem_user(user);
                });
                console.log('Client Disconnected.');
            });
        });
    },

    /** Periodical update to fix inconsistences **/
    _update_clients: function() {
        var self = this;
        setTimeout(
            function() {
                self._update_clients();
                self.channel.volatile.emit(
                    'game_state',
                    self.game.get_state(null)
                );
            },
            1000 //Time betwen updates (ms)
        );
    }
});

return GameManager;

});