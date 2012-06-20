
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('game', { title: 'Express', player: 'brian', add_score: '10', sub_score: '5', mul_score: '20', div_score: '9' })
};