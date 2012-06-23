
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , DataProvider = require('./dataprovider-mongodb').DataProvider;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use("/scripts", express.static(__dirname + '/scripts'));
  app.use("/style", express.static(__dirname + '/style'));
  app.use("/images", express.static(__dirname + '/images'));
  app.use("/questions", express.static(__dirname + '/questions'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var dataProvider = new DataProvider('localhost', 27017);

// Routes

app.get('/game', routes.index);

app.get('/play', routes.play);

app.get('/newplayer', routes.newplayer);

app.get('/highscores', routes.highscores);

app.post('/newplayer', function(req,res){
	dataProvider.addPlayer(req.param('playername'),req.param('password'), function(err,data){
		//console.log(err);
		//console.log(data._id);
		res.send(data._id);
	});
});

app.post('/signin', function(req,res){
	dataProvider.checkAuth(req.param('playername'),req.param('password'),function(err,data){
		if(!err){
			res.send(data);
		}
	});
});

app.post('/checkplayer', function(req,res){
	dataProvider.findPlayer(req.param('playername'),function(err,doc){
		if(!err){
			if(doc.length == 0){
				res.send("<result>false</result>");
			}else{
				res.send("<result>true</result>");
			}
		}
	});
	
});

app.post('/savescore', function(req, res){
    dataProvider.saveScore({
        player: req.param('player'),
        game: req.param('game'),
        score: req.param('score')
    }, function( error, docs) {
		//console.log(error);
		//console.log(docs);
        res.redirect('/')
    });
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
