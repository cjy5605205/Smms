$(function () {
    $("#username, #password").focus(function () {
        $("#box").css({
            "border-top-left-radius": "50%",
            "border-top-right-radius": "50%",
            "border-bottom-right-radius": "50%"
        });
    }).on("input", function () {
        let userVal = $("#username").val();
        let passVal = $("#password").val();
        if (userVal !== ""&&passVal !== ""){
            $(".circle01").fadeIn();
            $("#reset").fadeIn();
        }else {
            $(".circle01").fadeOut();
            $("#reset").fadeOut();
        }
    });
    
    $("#reset").on("click", function () {
        $(".circle01").fadeOut();
        $("#reset").fadeOut();
    })
});