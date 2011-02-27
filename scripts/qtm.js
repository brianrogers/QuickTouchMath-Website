

var mcquiz = {
	quizTime : 60 ,
	counter : 60 ,
	questions : [] ,
	wrongQuestions : [] ,
	currentQuestion : null ,
	score : 0 ,
	gametype : 'add' ,
	parseXml : function(xml) {
		$(xml).find("question").each(function()
		{
			//$("#output").append($(this).attr("author") + "<br />");
			var question = [];
			$(this).find("string").each(function()
			{
				question.push($(this).text());
			});
			mcquiz.questions.push(question);
		});

		mcquiz.loadRandomQuestion();
	} ,
	gameOver : function() {
		clearInterval(mcquiz.timer);
		$('#gameframe').hide();
		$('#gameover').show();
		var missedString = "<br>";
		var i = 0;
		for (i=0; i<mcquiz.wrongQuestions.length-1; i++) {
			missedString += mcquiz.wrongQuestions[i][1] + ' = ' + mcquiz.wrongQuestions[i][2] + "<br>";
		}
		$('#gameover-msg').html('Good Job!<br>You got ' + mcquiz.score + ' correct!<br><br>You missed ' + missedString + "");

		//save score
		$.ajax({
	            type: "POST",
	            url: "/actions/savescore",
				data: "playername="+ mcquiz.playerName +"&score="+mcquiz.score+"&type="+mcquiz.gametype,
	            //dataType: ($.browser.msie) ? "text/xml" : "xml",
	            success: function(xml) {
					//alert('LOADED : ' + xml);
					//console.log('savescore : ' + $(xml).text());

	            },
				error: function(err1,err2,err3,err4) {
					//console.log('false');
					//console.log('error : ' + err1 + ' *** ' + err2 + ' *** ' + err3 + ' *** ' + err4);
				}
	        });
	} ,
	timerStep : function() {
		mcquiz.counter--;
		if(mcquiz.counter===0)
		{
			//game over
			$('#timer').text(mcquiz.counter);
			mcquiz.gameOver();	

		}else{
			//update timer
			$('#timer').text(mcquiz.counter);
		}
	} ,
	updateTimerDiv : function(){},
	shuffle : function(ArrayToSuffle){
		var i = ArrayToSuffle.length;
	  	if ( i === 0 ) {
			return false;
		}
	  	while ( --i ) {
			var j = Math.floor( Math.random() * ( i + 1 ) );
	     	var tempi = ArrayToSuffle[i];
	     	var tempj = ArrayToSuffle[j];
	     	ArrayToSuffle[i] = tempj;
	     	ArrayToSuffle[j] = tempi;
	   	}
		return true;
	} ,
	loadRandomQuestion : function() {
		this.currentQuestion = this.questions[Math.floor(Math.random()*this.questions.length)];
		//populate the question
		$('#questionText').text(mcquiz.currentQuestion[1]);
		//need to randomize these selections

		answers = [mcquiz.currentQuestion[2],mcquiz.currentQuestion[3],mcquiz.currentQuestion[4],mcquiz.currentQuestion[5]];
		mcquiz.shuffle(answers);
		$('#button1').text(answers[0]);
		$('#button2').text(answers[1]);
		$('#button3').text(answers[2]);
		$('#button4').text(answers[3]);
	} ,
	submitAnswer : function(buttonClicked) {
		if(buttonClicked === mcquiz.currentQuestion[6])
		{
			mcquiz.score++;
			$('#score').text(mcquiz.score);
		}else{
			mcquiz.wrongQuestions.push(mcquiz.currentQuestion);
		}

		mcquiz.loadRandomQuestion();
	} ,
	resetGame : function(gameType) {
		gametype = gameType;

		$('#getready').show();
		$('#gamemenu').hide();
		$('#gameover').hide();
		$('#gameframe').hide();
		score = 0;
		counter = this.quizTime;
		$('#score').text(score);
		$('#timer').text(counter);

		var questionFile = '';
		switch(gameType){
			case 'add':
				questionFile = '/questions/addition.xml';
				break;
			case 'sub':
				questionFile = '/questions/subtraction.xml';
				break;
			case 'mul':
				questionFile = '/questions/multiplication.xml';
				break;
			case 'div':
				questionFile = '/questions/division.xml';
				break;
			default:
				questionFile = '/questions/addition.xml';
				break;
		}
		//load the plist xml file
		$.ajax({
		            type: "GET",
		            url: questionFile,
		            dataType: ($.browser.msie) ? "text/xml" : "xml",
		            success: function(xml) {
						//alert('LOADED : ' + xml);
						mcquiz.parseXml(xml);
		            },
					error: function(err) {
						alert('error : ');
					}
		        });
	} ,
	startGame : function() {
		mcquiz.loadRandomQuestion();
		$('#getready').hide();
		$('#gameframe').show();
		//now start the timer
		mcquiz.timer = window.setInterval(function(){
			mcquiz.timerStep();
		},1000);
	}	
};