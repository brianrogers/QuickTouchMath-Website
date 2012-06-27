var http = require('http');
var endpoints = [];
var StatementVerbs = [];
var ActivityTypes = [];
var LanguageTags = [];

// Additionally, the TCAPI object should be configurable with the following properties:
// Endpoint - The URL for the TCAPI endpoint
// AuthenticationConfiguration - Object representing authentication configuration (see below) TCAPICallback - Interface used in asynchronous statement reporting (see below) OfflineStorage - Interface used for offline statement queue (see below)
// StatementPostInterval - In seconds, how often to post the statement queue to the LRS. Use 0 to disable post interval (and use only the explicit Flush() method).

TCAPI = function(endpointsCollection){
	endpoints = endpointsCollection;
};

TCAPI.prototype.getPublicStatements = function(callback){
	//need to hook auth into endpoint object
	var username = '';
	var password = '';
	var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
	var header = {'Host': endpoints[0].host, 'Authorization': auth};
	// auth is: 'Basic VGVzdDoxMjM='
	var options = {
	  host: endpoints[0].host,//'cloud.scorm.com',
	  port: 80,
	  path: endpoints[0].path+'public/statements',//'/ScormEngineInterface/TCAPI/public/statements',
	  method: 'GET',
	  headers: header 
	};
	
	var pageData = '';
	
	http.get(options, function(res) {
	  //console.log('STATUS: ' + res.statusCode);
	  //console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	    //console.log('BODY: ' + chunk);
		pageData += chunk;
	  });
		res.on('end', function() {
			console.log(pageData);
			callback(pageData);
		});
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
	
	//validation
	/*
	Client libraries should attempt to validate the following, before sending a statement to the LRS:
	a) Actor objects have at least one uniquely identifying property
	b) The verb for a statement is in the core list of verbs from the TCAPI spec
	c) The verb for a statement is valid for the given activity to which it refers
	d) The results of the statement are valid for the given statement verb
	e) Interaction definitions include the correct components, given the interaction type
	f) Any other validation tasks that can be completed before sending the statement
	*/
	
};

TCAPI.prototype.putPublicStatement = function(statement, callback){
	//need to hook auth into endpoint object
	var username = '';
	var password = '';
	var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
	var header = {'Host': endpoints[0].host, 'Authorization': auth};
	// auth is: 'Basic VGVzdDoxMjM='
	var options = {
	  host: endpoints[0].host,//'cloud.scorm.com',
	  port: 80,
	  path: endpoints[0].path+'public/statements',//'/ScormEngineInterface/TCAPI/public/statements',
	  method: 'POST',
	  headers: header ,
	  data: statement
	};
	
	http.request(options, function(res) {
		res.on('end', function() {
			console.log(res);
			callback(res);
		});
	}).on('error', function(e){
		console.log('putPublicStatement error:' + e.message);
	});
	
};

exports.TCAPI = TCAPI;


TCAPI.Statement = function(){
	
};

// void StoreStatement(Statement statement, boolean synchronous* (false));
// void StoreStatements(Statement[] statements, boolean synchronous* (false));
// void VoidStatements(String[] statementIdsToVoid, boolean synchronous* (false));
// void Flush();
// Statement GetStatement(String statementId);
// StatementResult GetStatements(StatementQueryObject queryObject*);
// StatementResult GetStatements(String moreUrl);


TCAPI.Result = function(){
	
};


TCAPI.Score = function(){
	
};


TCAPI.Context = function(){
	
};

TCAPI.Agent = function(){
	
};

TCAPI.Account = function(){
	
};

TCAPI.Person = function(){
	
};

TCAPI.Group = function(){
	
};

TCAPI.Activity = function(){
	
};

TCAPI.ActivityDefinition = function(){
	
};

TCAPI.LanguageMap = function(){
	
};

TCAPI.Interaction = function(){
	
};

TCAPI.StatementsResult = function(){
	
};


TCAPI.State = function(){
	
};


// State and Profile Concurrency:
// The TCAPI spec addresses ways to overcome issues related to concurrent updates of state and profile documents. Specifically, clients can issue hashes of the last known content along with a write request to make sure they are not inadvertently overwriting another update.
// Client libraries ease the use of these rules through parameters on the various Save calls for
// ActivityState, ActivityProfile, and ActorProfile. For each, an optional boolean parameter will allow the application to ignore concurrency issues and overwrite the existing document. In the case of ActivityState, which is less likely to be shared among users or activities, the default behavior is to overwrite.
// In any case, the client application can also respect and resolve conflicts by issuing a Set
// call along with the last known copy of the State or Profile document. The client library will be responsible for calculating the hexidecimal string of the SHA-1 digest of the contents from the given previous copy and sending it in the update request, as outlined in the TCAPI spec. If
// a conflict occurs, the client library will raise a ConflictException that can then be used by the application to resolve the conflict, typically by getting the most recent copy of the document, merging in the desired changes to it, and saving it (again, providing the most recent copy just fetched, as the previous document).


TCAPI.StatementQueryObject = function(){
	
};

TCAPI.prototype.Exception = {
	// HTTP Error code	Exception class
	"400":"InvalidArgumentException",
	"401":"UnauthorizedException",
	"404":"NotFoundException",
	"409":"ConflictException",
	"412":"PreconditionFailedException",
	"500":"Exception (generic)."
};

TCAPI.GetOAuthAuthrorizationUrl = function(redirectUrl){};
// OAuthAuthentication UpdateOAuthTokenCredentials(String temporaryCredentialsId, String verifierCode);


TCAPI.GetActivityProfile = function(activityId, profileId){};
// void SaveActivityProfile(ActivityProfile activityProfile, bool overwrite* (false), ActivityProfile previousProfile*);
TCAPI.SaveActivityProfile = function(activityProfile, overwrite, previousProfile){};
TCAPI.DeleteActivityProfile = function(activityId, profileId){};
TCAPI.DeleteAllActivityProfile = function(activityId){};
// String[] GetActivityProfileIds(String activityId, Date since*);
TCAPI.GetActivityProfileIds = function(activityId, since){};
TCAPI.GetActivity = function(activityId){};

// ActivityState GetActivityState(String activityId, Actor actor, String stateId, String registrationId*);
TCAPI.GetActivityState = function(activityId, actor, stateId, registrationId){};
// void SaveActivityState(ActivityState activityState, bool overwrite* (true), ActivityState previousState*);
TCAPI.SaveActivityState = function(activityState, overwrite, previousState){};
// void DeleteActivityState(String activityId, Actor actor, String stateId, String registrationId*);
TCAPI.DeleteActivityState = function(activityId, actor, stateId, registrationId){};
// void DeleteAllActivityState(String activityId, Actor actor, String registrationId*);
TCAPI.DeleteAllActivityState = function(activityId, actor, registrationId){};
// String[] GetActivityStateIds(String activityId, Actor actor, String registrationId*, Date since*);
TCAPI.GetActivityStateIds = function(activityId, actor, registrationId, since){};

TCAPI.GetActorProfile = function(actor, profileId){};
// void SaveActorProfile(ActorProfile actorProfile, bool overwrite* (false), ActorProfile previousProfile);
TCAPI.SaveActorProfile = function(actorProfile, overwrite, previousProfile){};
TCAPI.DeleteActorProfile = function(actor, profileId){};
TCAPI.DeleteAllActorProfile = function(actor){};
// String[] GetActorProfileIds(Actor actor, Date since*);
TCAPI.GetActorProfileIds = function(actor, since){};
TCAPI.GetActor = function(partialActor){};