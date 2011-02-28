TestCase("McquizTests", {
    testSiteStartup:function() {
		var qtm = new mcquiz();
		qtm.parseXml(getAdditionQuestions());
		assertEquals("testStartUp",3,qtm.questions.length);
    }
  });



// Mock objects
function getAdditionQuestions() {
	return $('<?xml version="1.0" encoding="UTF-8"?><addition><questions><question><string>0+0</string><string>0 + 0</string><string>0</string><string>1</string><string>2</string><string>3</string><string>0</string></question><question><string>0+1</string><string>0 + 1</string><string>1</string><string>2</string><string>3</string><string>0</string><string>1</string></question><question><string>0+2</string><string>0 + 2</string><string>2</string><string>3</string><string>4</string><string>1</string><string>2</string></question></questions></addition>');
}