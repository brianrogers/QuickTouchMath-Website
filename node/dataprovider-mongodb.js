//var Db = require('mongodb').Db;
//var Connection = require('mongodb').Connection;
//var Server = require('mongodb').Server;
//var BSON = require('mongodb').BSON;
//var ObjectID = require('mongodb').ObjectID;

var mongoose = require('mongoose');

var Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;

var Scores = new Schema({
	 player : {type: String}
	,game : {type: String}
	,score : {type: Number}
	,date : {type:Date, default: Date.now}
});

var Players = new Schema({
	 player : {type: String}
	,password : {type: String}
	,lastlogin : {type: Date}
	,createdate : {type:Date, default: Date.now}
});

DataProvider = function(host, port) {
  //this.db= new Db('qtm', new Server(host, port, {auto_reconnect: true}, {}));
  //this.db.open(function(){});

	mongoose.connect('mongodb://localhost/qtm');

};

DataProvider.prototype.getCollection= function(callback) {
  // this.db.collection('scores', function(error, score_collection) {
  //   if( error ) callback(error);
  //   else callback(null, score_collection);
  // });
};

DataProvider.prototype.checkAuth = function(player, pass, callback) {
	this.findPlayer(player, function(err,p){
		//console.log(p);
		//console.log(pass+'-'+p[0].password);
		if(pass==p[0].password){
			callback(err,p[0]._id);
		}else{
			callback(err,false);
		}
	});
}

DataProvider.prototype.getHighScores = function(game,callback) {
	var scores = mongoose.model('scores', Scores);

	var query = scores.find({'game':game});
	query.sort('score', -1);
	//query.limit(2);
	query.exec(function(error, docs){
		callback(docs);
	});
}

DataProvider.prototype.saveScore = function(score, callback) {
	var scores = mongoose.model('scores', Scores);
	newScore = new scores();
	newScore.player = score.player;
	newScore.game = score.game;
	newScore.score = score.score;
	newScore.save(function(err){
		if(err){
			console.log(err);
		}else{
			callback(err);
		}
	});
};

DataProvider.prototype.getPlayerScores = function(player, callback) {
	var scores = mongoose.model('scores', Scores);
	scores.find({'player':player},function(err,docs){
		console.log(err);
		console.log(docs);
		callback(err,docs)
	});
};

DataProvider.prototype.findPlayer = function(player, callback) {
	var players = mongoose.model('players', Players);
	players.find({'player':player}, function(err,docs){
		//console.log(docs);
		callback(err,docs);
	});
};

DataProvider.prototype.addPlayer = function(player,pass, callback) {
	var player_data = {
	    player: player
	  , password: pass
	};
	
	var Player = mongoose.model('players', Players);
	var player = new Player(player_data);

	player.save( function(error, data){
	    callback(error,data);
	});
}

DataProvider.prototype.findPlayerById = function(id,callback) {
	var players = mongoose.model('players', Players);
	players.findById(id, function(err,docs){
		//console.log(docs);
		callback(err,docs);
	});
};

DataProvider.prototype.findAll = function(callback) {
    // this.getCollection(function(error, score_collection) {
    //   if( error ) callback(error)
    //   else {
    //     score_collection.find().toArray(function(error, results) {
    //       if( error ) callback(error)
    //       else callback(null, results)
    //     });
    //   }
    // });
};

exports.DataProvider = DataProvider;