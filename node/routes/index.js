/*
 * GET home page.
 */

var DataProvider = require('../dataprovider-mongodb').DataProvider;

exports.index = function(req, res) {
	var dataProvider = new DataProvider('localhost', 27017);
	var playerId = req.param('player');
	dataProvider.findPlayerById(playerId, function(err, player) {
		//console.log(player);
		dataProvider.getPlayerScores(player.player, function(error, scores) {
			//console.log(scores.length);
			var i = 0;
			var addHS = 0;
			var subHS = 0;
			var mulHS = 0;
			var divHS = 0;

			for (i = 0; i < scores.length; i++) {
				switch (scores[i].game) {
				case "add":
					if (scores[i].score > addHS) addHS = scores[i].score;
					break;
				case "sub":
					if (scores[i].score > subHS) subHS = scores[i].score;
					break;
				case "mul":
					if (scores[i].score > mulHS) mulHS = scores[i].score;
					break;
				case "div":
					if (scores[i].score > divHS) divHS = scores[i].score;
					break;
				default:
					break;
				}
			}

			res.render('game', {
				title: 'game',
				scores: scores,
				player: player.player,
				add_score: addHS,
				sub_score: subHS,
				mul_score: mulHS,
				div_score: divHS
			});
		});
	});
};

exports.play = function(req, res) {

	res.render('play', {
		title: 'sign in'
	});
};

exports.newplayer = function(req, res) {

	res.render('newplayer', {
		title: 'new player'
	});
};

exports.highscores = function(req, res) {

	var dataProvider = new DataProvider('localhost', 27017);
	dataProvider.getHighScores('add', function(addscores) {
		dataProvider.getHighScores('sub', function(subscores) {
			dataProvider.getHighScores('mul', function(mulscores) {
				dataProvider.getHighScores('div', function(divscores) {
					res.render('highscores', {
						title: 'highscores',
						add_scores: addscores,
						sub_scores: subscores,
						mul_scores: mulscores,
						div_scores: divscores
					});
				});
			});
		});
	});

};
