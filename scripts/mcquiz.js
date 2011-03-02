// copyright 2011 Brian Rogers - Creature Teachers

var mcquiz = function(){
	this.quizTime = 60;
	this.counter = 60 ;
	this.questions = [] ;
	this.wrongQuestions = [] ;
	this.currentQuestion = 0 ;
	this.score = 0 ;
	this.gametype = 'add' ;
	this.randomizeQuestions = true ;
	
	this.parseXml = function(xml) {
		var thisClass = this;
		$(xml).find("question").each(function()
		{
			var question = [];
			$(this).find("string").each(function()
			{
				question.push($(this).text());
			});
			thisClass.addQuestion(question);
		});

		this.askQuestion();
	};
	
	this.addQuestion = function(question) {
		this.questions.push(question);
	};
	
	this.saveScoreToServer = function() {
		var thisClass = this;
		//save score
		$.ajax({
	            type: "POST",
	            url: "/actions/savescore",
				data: "playername="+ thisClass.playerName +"&score="+thisClass.score+"&type="+thisClass.gametype,
	            //dataType: ($.browser.msie) ? "text/xml" : "xml",
	            success: function(xml) {
	            },
				error: function(err1,err2,err3,err4) {
				}
	        });
	};
	
	this.gameOver = function() {
		clearInterval(this.timer);
		
		var missedString = "<br>";
		var i = 0;
		for (i=0; i<this.wrongQuestions.length-1; i++) {
			missedString += this.wrongQuestions[i][1] + ' = ' + this.wrongQuestions[i][2] + "<br>";
		}
		
		this.updateGameOverUI('Good Job!<br>You got ' + this.score + ' correct!<br><br>You missed ' + missedString + "");
		
		this.saveScoreToServer();
	};
	
	this.timerStep = function() {
		this.counter--;
		if(this.counter===0)
		{
			//game over
			this.updateTimerUI(this.counter);
			this.gameOver();	

		}else{
			//update timer
			this.updateTimerUI(this.counter);
		}
	};
	
	mcquiz.prototype.updateResetGameUI = function(){};
	mcquiz.prototype.updateStartGameUI = function(){};
	mcquiz.prototype.updateGameOverUI = function(message){};
	mcquiz.prototype.updateTimerUI = function(counter){};
	mcquiz.prototype.updateQuestionUI = function(text,answers){};
	mcquiz.prototype.updateScoreUI = function(score){};
	this.shuffle = function(ArrayToSuffle){
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
	};
	
	this.askQuestion = function() {
		if(this.randomizeQuestions) {
			this.loadRandomQuestion();
		}else{
			this.loadNextSequentialQuestion();
		}
	};
	
	this.loadRandomQuestion = function() {
		this.currentQuestion = this.questions[Math.floor(Math.random()*this.questions.length)];
		
		answers = [this.currentQuestion[2],this.currentQuestion[3],this.currentQuestion[4],this.currentQuestion[5]];
		this.shuffle(answers);
		
		this.updateQuestionUI(this.currentQuestion[1],answers);
		
	};
	
	this.loadNextSequentialQuestion = function() {

		answers = [this.currentQuestion[2],this.currentQuestion[3],this.currentQuestion[4],this.currentQuestion[5]];
		this.shuffle(answers);
		
		this.updateQuestionUI(this.currentQuestion[1],answers);
		
		this.currentQuestion++; //increment the currentQuestion
	};
	
	this.submitAnswer = function(buttonClicked) {
		if(buttonClicked === this.currentQuestion[6])
		{
			this.score++;
			this.updateScoreUI(this.score);
		}else{
			this.wrongQuestions.push(this.currentQuestion);
		}

		this.askQuestion();
	};
	
	this.resetGame = function(gameType) {
		this.gametype = gameType;

		this.score = 0;
		this.counter = this.quizTime;
		
		this.updateResetGameUI();
		this.updateScoreUI(this.score);
		this.updateTimerUI(this.counter);

		var questionFile = '';
		switch(this.gametype){
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
		this.loadQuestionXml(questionFile);
	};
	
	this.loadQuestionXml = function(questionFile) {
		var thisClass = this;
		//load the plist xml file
		$.ajax({
		            type: "GET",
		            url: questionFile,
		            dataType: ($.browser.msie) ? "text/xml" : "xml",
		            success: function(xml) {
						thisClass.parseXml(xml);
		            },
					error: function(err,e2,e3) {
						this.logError(err);
					}
		        });	
	};
	
	this.startGame = function() {
		thisClass = this;
		this.askQuestion();
		this.updateStartGameUI();
		//now start the timer
		this.timer = window.setInterval(function(){
			thisClass.timerStep();
		},1000);
	};
	
	this.logError = function(err) {
		console.log('error : '+err);
	};	
};