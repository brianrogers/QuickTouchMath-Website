var nameChecked = false;


function PlayGame(key) {
	//console.log('redirecting to : ' + '/playgame/'+key);
	window.document.location = '/game?player=' + key;
}
$(document).ready(function() {
	//console.log("playername="+$("#playername").val()+"&password="+$("#password").val());
	$("#newplayerbutton").click(function() {
		//console.log('nameChecked: '+nameChecked);
		if (nameChecked) {
			$.ajax({
				type: "POST",
				url: "/newplayer",
				data: "playername=" + $("#playername").val() + "&password=" + $("#password").val(),
				//dataType: ($.browser.msie) ? "text/xml" : "xml",
				success: function(xml) {
					alert('LOADED : ' + xml);
					//console.log($(xml).text());
					if ($(xml).text() == 'False') {
						//console.log('returned false');
						$("#playername").val('');
						$("#password").val('');
					} else {
						
						PlayGame(xml);
					}
				},
				error: function(err1, err2, err3, err4) {
					//console.log('false');
					//console.log('error : ' + err1 + ' *** ' + err2 + ' *** ' + err3 + ' *** ' + err4);
				}
			});
		}
	});
	$("#playername").blur(function() {
		$.ajax({
			type: "POST",
			url: "/checkplayer",
			data: "playername=" + $("#playername").val(),
			//dataType: ($.browser.msie) ? "text/xml" : "xml",
			success: function(xml) {
				//alert('LOADED : ' + xml);
				//console.log($(xml).text());
				if ($(xml).text() == 'false') {
					$("#newplayerbutton").fadeTo('slow', 1.0);
					$("#playername").css('background-color', '#ccff33');
					nameChecked = true;
					$("#checkname").hide();
				} else {
					$("#newplayerbutton").fadeTo('slow', 0.5);
					$("#playername").css('background-color', '#ffcccc');
					nameChecked = false;
					$("#checkname").show();
				}
			},
			error: function(err1, err2, err3, err4) {
				////console.log('false');
				//console.log('error : ' + err1 + ' *** ' + err2 + ' *** ' + err3 + ' *** ' + err4);
			}
		});
	});
	$("#newplayerbutton").fadeTo('slow', 0.5);
	$("#checkname").hide();
});
