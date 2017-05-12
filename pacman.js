var context;
//var context = canvas;
var shape=new Object();
var board;
var start_time;
var time_elapsed;    
var interval;
var game;
var board;
var playersBoard;
var pacman;
var ghosts;
var slowCounter = 0;
var lblScore;
var lblTime;
var food;
var bg_sound;
var ghosts_sound = true;
/*
Board:
    0 = empty
    1 = regulaer food : 11 - food5, 12 - food15, 13 - food25           
    3 = wall
    6 = heart
    
    
playersBoard (objects that moves on board):
    2 = pacman
    4 = ghosts : 41 - ghost1, 42 - ghost2, 43 - ghost3 //in playersBoard
    5 = special food

*/

/*TODO:
    
    startGame button - V
    move JS to seperate file - V
    food - differents scores
    sound
    choose number of balls to play 
    choose number of ghosts
    choose maxTime (timer) //http://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer

    additional functions (need 2):
    - choose ghosts speed
    - choose number of points to win
    - added life
*/

function Game() {
    this.wallColor = "Blue";
    this.soundfx = 0;
    this.foodRemains=0;
    this.numOfGhosts=3;
    this.slowDown=5;
    this.timer;
    this.bonusHeart = false;
    this.score;
}

function pacman() {
    this.posX
    this.posY;

    //to draw the pacman in the right location
    this.angle1 = 0.15;
    this.angle2 = 1.85;
    this.eyeAngle1 = 12;
    this.eyeAngle2 = -6;
    // default is turning right

    this.lives = 3;
    this.color = "yellow";
    this.score = 0;  
}

function specialFood(){
    this.poxX;
    this.posY;
    this.isEaten = false;
}

function ghosts(num){
    this.arr = [];
    
}

function ghost(){
    this.posX;
    this.posY;
    this.cellKind;
}

function boardGame(){
    this.cellSize = 30;
    this.arr = new Array();
}

$(window).on('load',function() {
   initVars();
});

function initVars(){
    context = document.getElementById('canvas').getContext('2d');
    lblScore = document.getElementById('lblScore');
    lblScore.value=0;
    lblTime = document.getElementById('lblTime');
    bg_sound = document.getElementById("myAudio");
    bg_sound.volume = 0.5;
    bg_sound.loop = true;
}

game = new Game();
board = new boardGame();
pacman = new pacman();
playersBoard = new boardGame();
ghosts = new ghosts(game.numOfGhosts);
ghosts.arr.push(new ghost);
ghosts.arr.push(new ghost);
ghosts.arr.push(new ghost);
food = new specialFood();



function Start(isFirstTry, ghosts, balls, time, speed, score){      
    if(isFirstTry){

        initVars();
        buildMaze();
        bg_sound.play();
        start_time = new Date();
        pacman.score=0;
        pacman.lives=3;
        pacman.color="yellow";
        game.numOfGhosts = ghosts;
        game.time = time;
        game.balls = balls;
        game.timer = time*60;
        game.bonusHeart = false;
        game.score = score;
        game.foodRemains = balls;
        initGameSpeed(speed);
        choosePacmanLocation();
        chooseSpecialFoodLocation();
        PutFood();
        lblTime.value = game.timer - time_elapsed;
        window.clearInterval(interval);       
    }
    else
        buildMaze();
    drawHearts();
    chooseGohstLocations();
    if(pacman.lives==0){ //GameOver
        window.clearInterval(interval);
        window.alert("GameOver");
    }

    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);

    interval=setInterval(UpdatePosition, 75);
}

function initGameSpeed(speed){
    switch(speed){
        case 1:
            game.slowDown = 7;
            break;
        case 2:
            game.slowDown = 5;
        break;
        default:
            game.slowDown = 2;
        break;
    }
}

function ClearGame(){
    window.clearInterval(interval);
    context.clearRect(0, 0, canvas.width, canvas.height);
    removeHearts();
    bg_sound.pause();
}

function MuteSound(){
    if (ghosts_sound==true){ //sound is on, need to mute
         var x = document.getElementById("ghosts_music");
         x.src="pics/mute.png"
         bg_sound.pause();
         ghosts_sound = false;
    }
    else{ //sound is off, need to unmute
        var x = document.getElementById("ghosts_music");
         x.src="pics/unmute.png"
         ghosts_sound = true;
         bg_sound.play();
    }
}

function drawHearts(){
    var img1 = document.getElementById("heart3");
    var img2 = document.getElementById("heart2");
    var img3 = document.getElementById("heart1");
    img1.style.visibility = 'visible';
    img2.style.visibility = 'visible';
    img3.style.visibility = 'visible'; 
    if(pacman.lives<3){
        img1.style.visibility = 'hidden';
    }
    if(pacman.lives<2){
        
        img2.style.visibility = 'hidden';
    }
    if(pacman.lives<1){
        
        img3.style.visibility = 'hidden';
    }
}

function removeHearts(){
    var img1 = document.getElementById("heart3");
    var img2 = document.getElementById("heart2");
    var img3 = document.getElementById("heart1");
    img1.style.visibility = 'hidden';
    img2.style.visibility = 'hidden';
    img3.style.visibility = 'hidden'; 
}

function GetKeyPressed() {
    if (keysDown[38]) { //up
        return 1;
    }
    if (keysDown[40]) { //down
        return 2;
    }
    if (keysDown[37]) { //left
        return 3;
    }
    if (keysDown[39]) {  //right
        return 4;
    }
}

function Draw() {
	canvas.width = window.innerWidth*0.6;
    canvas.height = window.innerHeight*0.6;
    board.cellSize= Math.min(canvas.width,canvas.height)/13;
    lblScore.value = pacman.score;
    lblTime.value = game.timer - time_elapsed;
    var radius = board.cellSize/3;
    for (var i = 0; i < 20; i++) {
         for (var j = 0; j < 13; j++) {
            var center = new Object();
            center.x = i * board.cellSize + board.cellSize/2;
            center.y = j * board.cellSize + board.cellSize/2;
            if (playersBoard.arr[i][j] == 2) { //pacman location
                context.beginPath();
                context.arc(center.x, center.y, board.cellSize/2-2, pacman.angle1 * Math.PI, pacman.angle2 * Math.PI); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pacman.color; //color 
                context.fill();
                context.beginPath();
                context.arc(center.x + board.cellSize/pacman.eyeAngle1, center.y + board.cellSize/pacman.eyeAngle2, board.cellSize/12, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //eye color 
                context.fill();
            }
            else if(playersBoard.arr[i][j]==41){ //ghost1 location
                var imageObj = new Image();
                imageObj.src = 'pics/ghost1.png';
                context.drawImage(imageObj, center.x-board.cellSize/2, center.y-board.cellSize/2, width=board.cellSize, height=board.cellSize);
            }
            else if(playersBoard.arr[i][j]==42){ //ghost2 location
                var imageObj = new Image();
                imageObj.src = 'pics/ghost2.png';
                context.drawImage(imageObj, center.x-board.cellSize/2, center.y-board.cellSize/2, width=board.cellSize, height=board.cellSize);
            }
            else if(playersBoard.arr[i][j]==43){ //ghost3 location
                var imageObj = new Image();
                imageObj.src = 'pics/ghost3.png';
                context.drawImage(imageObj, center.x-board.cellSize/2, center.y-board.cellSize/2, width=board.cellSize, height=board.cellSize);
            }
            else if(playersBoard.arr[i][j]==5){ //special location
                var imageObj = new Image();
                imageObj.src = 'pics/cookie.png';
                context.drawImage(imageObj, center.x-board.cellSize/1.5, center.y-board.cellSize/2, width=board.cellSize*1.5, height=board.cellSize);
            }  
            else if(board.arr[i][j]==3){ //wall location
                 var imageObj = new Image();
                imageObj.src = 'pics/wall1.png';
                context.drawImage(imageObj, center.x-board.cellSize/2, center.y-board.cellSize/2, width=board.cellSize, height=board.cellSize);
            }
            else if(board.arr[i][j]==6){ //heart location
                 var imageObj = new Image();
                imageObj.src = 'pics/heart.png';
                context.drawImage(imageObj, center.x-board.cellSize/2, center.y-board.cellSize/2, width=board.cellSize, height=board.cellSize);
            }
            else if (board.arr[i][j] == 5) { //food location
                
                    context.beginPath(); 
                    context.arc(center.x, center.y, radius, 0, 2 * Math.PI); // circle
                    context.fillStyle = "blue"; //color 
                    context.fill();
                    context.fillStyle = "white";
                    context.font = "15px Comic Sans MS";
                    context.textAlign = "center";
                    context.fillText("5",center.x,center.y+radius/2);
                }
            else if (board.arr[i][j] == 15) { //food location
                    context.beginPath(); 
                    context.arc(center.x, center.y, radius, 0, 2 * Math.PI); // circle
                    context.fillStyle = "green"; //color 
                    context.fill();
                    context.fillStyle = "white";
                    context.font = "15px Comic Sans MS";
                    context.textAlign = "center";
                    context.fillText("15",center.x,center.y+radius/2);
            }
            else if (board.arr[i][j] == 25) { //food location
                   context.beginPath(); 
                    context.arc(center.x, center.y, radius, 0, 2 * Math.PI); // circle
                    context.fillStyle = "red"; //color 
                    context.fill();
                    context.fillStyle = "white";
                    context.font = "15px Comic Sans MS";
                    context.textAlign = "center";
                    context.fillText("25",center.x,center.y+radius/2);
            }
        } 
    }  
}


function PutFood(){
    var food = game.balls;
    var food5 = parseInt(food*0.6);
    var food15 = parseInt(food*0.3);
    var food25 = food - food5 - food15;
    
    while(food>0){
        for (var i = 0; i < 20 && food>0; i++) {
            for (var j = 0; j < 13 && food>0; j++) {
                if(board.arr[i][j]!=0){
                    continue;
                }
                var rand = Math.floor(Math.random() * 4) + 1; 
                switch (rand){
                    case 1:
                        if(food5>0){
                            board.arr[i][j] = 5;
                            food--;
                            food5--;
                        }
                        break;
                    case 2:
                         if(food15>0){
                            board.arr[i][j] = 15;
                            food--;
                            food15--;
                        }
                        break;
                    case 3:
                        if(food25>0){
                            board.arr[i][j] = 25;
                            food--;
                            food25--;
                        }
                        break;
                }
            }
        }
    }             
} 


function UpdatePosition() {
    if(lblTime.value<=0){
        window.clearInterval(interval);
        lblTime.value=0;
        if(lblScore.value < game.score){
            finishGame("Time's Up! You can do better");
        }
        else{
            finishGame("We Have A Winner!!!");
        }
    }
    // else if(lblScore.value >= game.score) {
    //         finishGame("We Have A Winner!!!");
    // }

    if(slowCounter % game.slowDown==0){
        moveGhosts();
        if(!food.isEaten)
            moveSpecialFood();
        slowCounter++;
    }
    else
        slowCounter++;
    if(pacman.lives<3){
        var rand = Math.floor(Math.random() * 20) + 1;
        if(rand==1 && game.bonusHeart==false){
            ChoseHeartLocation();
            game.bonusHeart=true;
        }

    }
    var x = GetKeyPressed()
    var move=false;
    lblScore.color="white";
    if(x==1) //up
    {
    	if(board.arr[shape.i][shape.j-1] !=3 && shape.j>0)
    	{
            board.arr[shape.i][shape.j]=0;
            playersBoard.arr[shape.i][shape.j]=0;
    		shape.j--;
            move=true;
            pacman.angle1 = 1.60;
            pacman.angle2 = 1.40;
            pacman.eyeAngle1 = 6;
            pacman.eyeAngle2 = 30;
    	}
    }
    if(x==2) //down
    {
    	if(board.arr[shape.i][shape.j+1] !=3 && shape.j<13)
    	{
            board.arr[shape.i][shape.j]=0;
            playersBoard.arr[shape.i][shape.j]=0;
    		shape.j++;
            move=true;
            pacman.angle1 = 0.60;
            pacman.angle2 = 2.40;
            pacman.eyeAngle1 = 4;
            pacman.eyeAngle2 = 4;
    	}
    }
    if(x==3) //left
    {
    	if(board.arr[shape.i-1][shape.j] !=3 && shape.i>0)
    	{
            board.arr[shape.i][shape.j]=0;
            playersBoard.arr[shape.i][shape.j]=0;
    		shape.i--;
            move=true;
            pacman.angle1 = 1.15;
            pacman.angle2 = 0.85;
            pacman.eyeAngle1 = -8;
            pacman.eyeAngle2 = -4;
    	}
    }
    if(x==4) //right
    {
    	if(board.arr[shape.i+1][shape.j] !=3 && shape.i<20)
    	{
            board.arr[shape.i][shape.j]=0;
            playersBoard.arr[shape.i][shape.j]=0;
    		shape.i++;
            move=true;
            pacman.angle1 = 0.15;
            pacman.angle2 = 1.85;
            pacman.eyeAngle1 = 12;
            pacman.eyeAngle2 = -6;
    	}
    }
    if(board.arr[shape.i][shape.j]>=5 && board.arr[shape.i][shape.j]<=25 && move ) //location of regular food
    {
    	pacman.score+=board.arr[shape.i][shape.j];
        game.foodRemains--;
        lblScore.color="red";
    }
    if(playersBoard.arr[shape.i][shape.j]==5 && move) //location of special food
    {
        pacman.score+=50;
        playersBoard.arr[food.posX][food.posY] = 0; //no more food, one per game
        food.isEaten = true;
        var sound = document.createElement("AUDIO");
        sound.setAttribute("src","sounds/pacman_eatfruit.wav");
        sound.play();
    }
    if(playersBoard.arr[shape.i][shape.j]>40){ //location of a ghost
        moveOneGhost(playersBoard.arr[shape.i][shape.j]-41);        
        pacman.lives--;
        //var sound = document.getElementById("death_sound");
        if(ghosts_sound==true){
            var sound = document.createElement("AUDIO");
            sound.setAttribute("src","sounds/pacman_death.wav");
            sound.play();
        }
 

        playerLostLive();
        chooseGohstLocations();
        choosePacmanLocation();
        drawHearts();
        if(pacman.lives==0){ //GameOver
            finishGame("You Lost!");
        }
        /////// ******** need to start new game or show another screen
    }
    if(board.arr[shape.i][shape.j]==6){ //eat heart, one plus life
        board.arr[shape.i][shape.j]=0;
        pacman.lives++;
        drawHearts();
        var sound = document.createElement("AUDIO");
        sound.setAttribute("src","sounds/pacman_eatfruit.wav");
        sound.play();
        
    }
    playersBoard.arr[shape.i][shape.j]=2;
    pacman.posX=shape.i;
    pacman.posY=shape.j;
    var currentTime=new Date();
    time_elapsed=(currentTime-start_time)/1000;
	if(pacman.score>=120)
	{
		pacman.color="green";
	}
	if(game.foodRemains == 0) //if(pacman.score>=150)
	{
        finishGame("We Have A Winner!!!");
	}
	else
	{
		Draw();
	}
}

function isMusicOn(){
    return ghosts_sound;
}

function finishGame(text){
        window.clearInterval(interval);
        context.clearRect(0, 0, canvas.width, canvas.height);
        removeHearts();
        bg_sound.pause();
        //window.alert("Game completed");
        ShowGameover(text);
}

function ChoseHeartLocation(){
    while(true){
        var randI = Math.floor(Math.random() * 19) + 1; 
        var randJ = Math.floor(Math.random() * 12) + 1;
        if(board.arr[randI][randJ]==0 && playersBoard.arr[randI][randJ]==0){
            board.arr[randI][randJ] = 6;
            break;
        }
    }
}

function moveGhosts(){ //moving by minimazing Manhattan distance
    for (i = 0; i < game.numOfGhosts; i++) {
        moveOneGhost(i);
    }   
}

function playerLostLive(){ //delete current location ghosts to later relocate them at the corners again
    for (var i = 0; i<game.numOfGhosts; i++) {
        var x = ghosts.arr[i].posX;
        var y = ghosts.arr[i].posY;
        board.arr[x][y] = ghosts.arr[i].cellKind;
        playersBoard.arr[x][y] = 0;
    }     
}

function moveOneGhost(i){
    var x = ghosts.arr[i].posX;
    var y = ghosts.arr[i].posY;
    board.arr[x][y] = ghosts.arr[i].cellKind;
    var up = calcManhattanDistance(x, y-1);
    var down = calcManhattanDistance(x, y+1);
    var right = calcManhattanDistance(x+1, y);
    var left = calcManhattanDistance(x-1, y);
    var newLoc = Math.min(Math.min(up, down), Math.min(left,right));
    playersBoard.arr[x][y]=0;
    if(newLoc==up){
        if(updateCellKind(x,y-1,i))
            ghosts.arr[i].posY--;
    }
    else if(newLoc==down){
        if(updateCellKind(x,y+1,i))
            ghosts.arr[i].posY++;
    }
    else if(newLoc==right){
        if(updateCellKind(x+1,y,i))
            ghosts.arr[i].posX++;
        }
    else{
        if(updateCellKind(x-1,y,i))
            ghosts.arr[i].posX--;
    }
}

function moveSpecialFood(){
    var x = food.posX;
    var y = food.posY;
    var counter = 0;
    playersBoard.arr[x][y] = 0;
    while(counter<5){
        var dir = Math.floor(Math.random() * 4) + 1; 
        if(dir==1 && board.arr[x][y-1]!=3 && playersBoard.arr[x][y-1]==0){ //up
            food.posY--;
            playersBoard.arr[x][y-1] = 5;
            break;
        }
        if(dir==2 && board.arr[x][y+1]!=3 && playersBoard.arr[x][y+1]==0){ //down
            food.posY++;
            playersBoard.arr[x][y+1] = 5;
            break;
        }
        if(dir==3 && board.arr[x-1][y]!=3 && playersBoard.arr[x-1][y]==0){ //left
            food.posX--;
            playersBoard.arr[x-1][y] = 5;
            break;
        }
        if(dir==4 && board.arr[x+1][y]!=3 && playersBoard.arr[x+1][y]==0){ //right
            food.posX++;
            playersBoard.arr[x+1][y] = 5;
            break;
        }
        counter++;
    }
    if(counter==5)
        playersBoard.arr[x][y] = 5;
}

function updateCellKind(x,y,ghostNum){
    if(playersBoard.arr[x][y]<40){ //there is already ghosts in this location
        ghosts.arr[ghostNum].cellKind= board.arr[x][y];
        playersBoard.arr[x][y]=41+ghostNum; //place the current ghost on the playersBoard
        return true;
    }
    else //else no update
        return false;
}

function calcManhattanDistance(x,y){
    if(playersBoard.arr[x][y]==2){ //catched pacman
        return -1;
    }
    else if(board.arr[x][y]==3) //return a huge number, making the function never chosing this location to move to (because of wall)
        return 10000000;
    var temp1 = Math.pow(pacman.posX-x,2);
    var temp2 = Math.pow(pacman.posY-y,2);
    var adding = temp1 + temp2;
    return Math.sqrt(adding);
}

function buildMaze(){
    board.arr = new Array();
    playersBoard.arr = new Array();
    for (var i = 0; i < 20; i++) {
        board.arr[i] = new Array();
        playersBoard.arr[i] = new Array();
        for(var j=0; j<13; j++){
            if(i==0 || i==19 || j==0 || j==12)
                board.arr[i][j]=3; //wall
            else if((i==1 || i==18) && (j>=1 && j<=12))
                board.arr[i][j]=0;
            else if((i==2 || i==17) && ( (j>=2 && j<=5) || (j>=7 && j<=10) ))
                board.arr[i][j]=3;
            else if(i==2 || i==17)
                board.arr[i][j]=0;
            else if( (i==3 || i==16) && (j==2 || j==17))
                board.arr[i][j]=3;
            else if(i==3 || i==16)
                board.arr[i][j]=0;
            else if( (i==4 || i==15) && (j==2 || j==4 || j==5 || j==7 || j==8 || j==10))
                board.arr[i][j]=3;
            else if(i==4 || i==15)
                    board.arr[i][j]=0;
            else if( (i==5 || i==14) && (j==4  || j==8))
                board.arr[i][j]=3;
            else if( i==5 || i==14)
                board.arr[i][j]=0;
            else if( (i==6 || i==13) && ( (j>=2 && j<=4) || j==6 || (j>=8 && j<=10) ))
                board.arr[i][j]=3;
            else if(i==6 || i==13)
                board.arr[i][j]=0;
            else if((i==7 || i==12)&&( j==2 || j==6 || j==10))
                board.arr[i][j]=3;
            else if (i==7 || i==12)
                board.arr[i][j]=0;
            else if ( (i==8 || i==11) && (j==2 || j==4 || j==6 || j==8 || j==10) )
                board.arr[i][j]=3;
            else if (i==8 || i==11)
                board.arr[i][j]=0;
            else if ( (i==9 || i==10) && (j==4 || j==8))
                board.arr[i][j]=3;
            else 
                board.arr[i][j]=0;
            playersBoard.arr[i][j]=0; //no player on the playersBoard
        }
    }
}

function choosePacmanLocation(){ //and choose specialFood location
    while(true){ //pacman
        //var randI = Math.floor(Math.random() * 19) + 1; 
        //var randJ = Math.floor(Math.random() * 12) + 1;
        var randI = Math.floor(Math.random()*(16-3+1)+3); //pacman can start only from the inside of the maze
        var randJ = Math.floor(Math.random()*(10-2+1)+2);
        if(board.arr[randI][randJ]==0 && playersBoard.arr[randI][randJ]==0){
            playersBoard.arr[randI][randJ]==2;
            shape.i=randI;
            shape.j=randJ;
            pacman.posX = randI;
            pacman.posY = randJ;
            break;
        }
    }
}

function chooseSpecialFoodLocation(){
    while(true){ //special food
        var randI = Math.floor(Math.random()*(16-3+1)+3);
        var randJ = Math.floor(Math.random()*(10-2+1)+2);
        if(board.arr[randI][randJ]==0 && playersBoard.arr[randI][randJ]==0){
            playersBoard.arr[randI][randJ]=5;
            food.posX = randI;
            food.posY = randJ;
            break;
        }
    }
}

function chooseGohstLocations(){
    playersBoard.arr[1][1]=41; //first ghost
    ghosts.arr[0].posX=1;
    ghosts.arr[0].posY=1;
    ghosts.arr[0].cellKind = board.arr[1][1];
    if(game.numOfGhosts>1){ //second ghost
        playersBoard.arr[1][11]=42;
        ghosts.arr[1].posX=1;
        ghosts.arr[1].posY=11;
        ghosts.arr[1].cellKind = board.arr[1][11];
    }
    if(game.numOfGhosts>2){ //third ghost
        playersBoard.arr[18][1]=43;
        ghosts.arr[2].posX=18;
        ghosts.arr[2].posY=1;
        ghosts.arr[2].cellKind = board.arr[18][1];
    }            
}