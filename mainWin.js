var username;
var password;
var isLogged = false;
var isValidDetails = true;
var allUsers = [];

$(window).on('load',function() {
    localStorage.clear();
    var user1 = {uname: 'test2017' , pword: 'test2017'};
    var user2 = {uname: 'a' , pword: 'a'};
    allUsers.push(user1);
    allUsers.push(user2);
});


function loginClick(){
    HideAll();
	$("#logIn").css("visibility","visible");

}

function signinClick(){
    HideAll();
    $("#signIn").css("visibility","visible");
}

function logoutClick(){
    HideAll();
    ClearGame();
    username ="";
    isLogged = false;
    $(".firstbutton").css("visibility","visible");
    $(".afterloginbutton").css("visibility","hidden");
    $("#logIn").css("visibility","hidden");
    $("#signIn").css("visibility","hidden");            
    alert('You are no longer logged in!');
    $("#usernameLable").html("Hello, guest");
}

function enterClick(){
    // entered data from the login-form
    var userName = document.getElementById('usernmLogin');
    var userPw = document.getElementById('pwLogin');
    var nameRight = false;

    for (var key in allUsers){
        if (userName.value == allUsers[key].uname) {
            nameRight = true;
            if (userPw.value == allUsers[key].pword) {
                isLogged = true;
                username = allUsers[key].uname;
            }
        }
    }
    if (isLogged) {
        $(".firstbutton").css("visibility","hidden");
        $(".afterloginbutton").css("visibility","visible");
        $("#newgamebutton").css("visibility","visible");
        $("#logIn").css("visibility","hidden");
        $("#usernameLable").html("Hello, "+username);   
        alert('Welcome '+username+', you are loged in!');
        //showUsername();
    } else {
        if (nameRight) { alert('Incorrect password'); }
        else { alert('User name does not exist in system'); }  
    }
}

/*
function registerClick() {
    //if (isValidDetails) {
        var user = {uname: usernmSignin.value , pword: pwSignin.value};
        allUsers.push(user);
        $(".firstbutton").css("visibility","hidden");
        $(".afterloginbutton").css("visibility","visible");
        $("#logIn").css("visibility","hidden");       
        alert('You are loged in as '+username);
    //}
}
*/

function showUsername(){
    $("#lblUser").val(username);
}

function gameSettingsClick(){
    var ghosts = parseInt(document.getElementById('ghostsSet').value);
    var balls = parseInt(document.getElementById('ballsSet').value);
    var time = parseInt(document.getElementById('timeSet').value);
    var speed = parseInt(document.getElementById('speedSet').value);
    var score = parseInt(document.getElementById('scoreSet').value);
    HideAll();
    $("#game").css("visibility","visible");
    $("#myAudio").css("visibility","visible");
    $("#logoutB").css("visibility","visible");
    showUsername();
    Start(true, ghosts, balls, time, speed, score);
}

function ShowSettings(){
    ClearGame();
    removeHearts();   
    HideAll();
    $("#gameSettings").css("visibility","visible");
    $("#logoutB").css("visibility","visible");
    var bg_sound = document.getElementById("myAudio");
    bg_sound.pause();
}

function ShowGameover(text){
    HideAll();
    $("#gameover").css("visibility","visible");
    $("#logoutB").css("visibility","visible");

    $("#gameovertext").text(text);
    if(isMusicOn()){
        var sound = document.createElement("AUDIO");
        sound.loop=false;
        if(text=="We Have A Winner!!!")
            sound.setAttribute("src","sounds/pacman_winning.mp3");
        else
            sound.setAttribute("src","sounds/pacman_losing_cut.mp3");
        sound.play();
    }
}

function ShowAbout(){
    document.getElementById("about").showModal();
}
function closeDialog(){
    document.getElementById("about").close();
}

function HideAll(){
    $("#logIn").css("visibility","hidden");
    $("#signIn").css("visibility","hidden");
    $("#game").css("visibility","hidden");
    $("#gameSettings").css("visibility","hidden");
    $("#myAudio").css("visibility","hidden");
    //$("#about").css("visibility","hidden");
    $("#gameover").css("visibility","hidden");
    $(".afterloginbutton").css("visibility","hidden");
    $("#startScreen").css("visibility","hidden");
    $(".wrapper").css("visibility","hidden");
    $("#aboutB1").css("visibility","hidden");
    $("#loginB1").css("visibility","hidden");
    $("#signinB1").css("visibility","hidden");
    

}

function ShowFirstMenu(){
    HideAll();
    ClearGame();
    $("#game").css("visibility","hidden");
    if(isLogged){
        $("#logoutB").css("visibility","visible");
        $("#afterLoginMenu").css("visibility","visible");
        $("#aboutB2").css("visibility","visible");
        $("#newgameB2").css("visibility","visible");
        $("#logoutB2").css("visibility","visible");
    }
    else{
        $("#startScreen").css("visibility","visible");
        $("#aboutB1").css("visibility","visible");
        $("#loginB1").css("visibility","visible");
        $("#signinB1").css("visibility","visible");
    }
}

