
/*
 * GET play page.
 */

var DataProvider = require('../dataprovider-mongodb').DataProvider;

exports.play = function(req, res){
	var dataProvider = new DataProvider('localhost', 27017);
 	
	
	res.render('play', { title: 'sign in'});

};