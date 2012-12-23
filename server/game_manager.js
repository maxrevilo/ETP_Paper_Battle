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

        var self = this;

        channel.on('connection', function(socket){

            console.log('Client Connected');
            
            var user = new User();
            socket.set('user', user, function(){});
            self.game.add_user(user);

            console.log('User asigned to '+user.session.driver.player);
            socket.emit('init_data', {
                driver: user.session.driver.get_state(),
                state: game.get_state()
            });

            socket.on('setDir', function(data, callback){
                socket.get('user' , function(err, user) {
                   var player = user.session.driver.player;
                    if(player) player.set_dir(data.dir);

                    channel.emit('player_state', player.get_state(null));
                });
            });

            socket.on('setAng', function(data, callback){
                socket.get('user' , function(err, user) {
                    var player = user.session.driver.player;
                    if(player) player.set_ang(data.ang);

                    channel.volatile.emit(
                        'player_state',
                        _(player.get_state(null)).pick('id', 'control')
                    );
                });
            });

            socket.on('disconnect', function(){
                socket.get('user' , function(err, user) {
                    self.game.rem_user(user);
                });
                console.log('Client Disconnected.');
            });
        });

    }
});

return GameManager;

});