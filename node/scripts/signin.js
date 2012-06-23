function PlayGame(key) {
    //console.log('redirecting to : ' + '/playgame/'+key);
    window.document.location = '/game?player=' + key;
}
$(document).ready(function() {
    //console.log("playername="+$("#playername").val()+"&password="+$("#password").val());
    $("#signinbutton").click(function() {
        $.ajax({
            type: "POST",
            url: "/signin",
            data: "playername=" + $("#playername").val() + "&password=" + $("#password").val(),
            //dataType: ($.browser.msie) ? "text/xml" : "xml",
            success: function(xml) {
                //alert('LOADED : ' + xml);
                //console.log($(xml).text());
                if (xml == false) {
                    //console.log('returned false');
                    $("#playername").val('');
                    $("#password").val('');
                } else {
                    //console.log(xml);
                    PlayGame(xml);
                }
            },
            error: function(err1, err2, err3, err4) {
                //console.log('false');
                //console.log('error : ' + err1 + ' *** ' + err2 + ' *** ' + err3 + ' *** ' + err4);
                }
        });
    });
    $("#newplayerbutton").click(function() {
        window.document.location = "/newplayer";
    });
    $("#qtmbutton").click(function() {
        window.document.location = "/";
    });
    $("#gotosignin").click(function() {
        $('#signinsplash').hide();
        $('#signinentry').show();
    });
    $("#gotonewplayer").click(function() {
        window.document.location = '/newplayer';
    });
    //startup with the splash and hide the entry
    $('#signinsplash').show();
    $('#signinentry').hide();
});