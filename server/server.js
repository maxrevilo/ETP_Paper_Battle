//setup Dependencies
var connect = require('connect'),
    express = require('express'),
    io = require('socket.io'),
    port = (process.env.PORT || 80),
    urls = require('./urls.js').urls,
    requirejs = require('requirejs');

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));

    //Static folders:
    server.use(connect.static(__dirname + '/static'));
    server.use(connect.static(__dirname + '/../client'));
    server.use(connect.static(__dirname + '/../game'));

    server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: {
                title : '404 - Not Found',
                description: '',
                author: '',
                analyticssiteid: 'XXXXXXX'
                }, status: 404 });
    } else {
        res.render('500.jade', { locals: {
                title : 'The Server Encountered an Error',
                description: '',
                author: '',
                analyticssiteid: 'XXXXXXX',
                error: err
                }, status: 500 });
    }
});
server.listen( port);

///////////////////////////////////////////
//              HTTP Routes              //
///////////////////////////////////////////

//Users urls:
for(var url_d in urls) {
    var data = /^(GET|POST|PUT|DELETE)\s+([\w\\\/]+)$/i.exec(url_d);
    if(!data) {
        throw "Syntact problem on url description \""+url_d+"\"";
    }

    var method = data[1].toLowerCase();
    var url    = data[2];

    server[method](url, urls[url_d]);
}

//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound();
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port );


///////////////////////////////////////////
//              Socket IO                //
///////////////////////////////////////////
var io = io.listen(server, {log: false});

///////////////////////////////////////////
//                 GAME                  //
///////////////////////////////////////////
S_GAME_M = null;

requirejs.config({
    paths: {
        'game':         '../game',
        'class':        '../game/libs/class',
        'underscore':   '../game/libs/underscore-1.4.2',
        'utils':        '../game/libs/utils'
    },

    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {
        "underscore": {exports: "_"}
    }, // end Shim Configuration

    nodeRequire: require
});

//Start point
requirejs(['game/paper_battle/paper_battle', './game_manager'],
function(PaperBattle, GameManager) {
    var updates_per_second = process.env.UPS || 60;

    S_GAME_M = new GameManager(
        new PaperBattle(updates_per_second),
        io.of('/game')
    );
});