///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

//Loading controllers:
var main  = require('./controllers/main.js');

/////// ADD ALL YOUR ROUTES HERE  /////////
exports.urls = {
    //Index:
    'GET /': main.index
};