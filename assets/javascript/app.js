//Initialize Firebase
var config = {
    apiKey: "AIzaSyA7XCy3XzNbC6YBSHk_BNTGhglqTVnhOSo",
    authDomain: "rpsls-1877a.firebaseapp.com",
    databaseURL: "https://rpsls-1877a.firebaseio.com",
    projectId: "rpsls-1877a",
    storageBucket: "rpsls-1877a.appspot.com",
    messagingSenderId: "601122655635"
};

firebase.initializeApp(config);

// Rock Paper Scissors Lizard Spock - Core Game Functions

let database = firebase.database();
let gameRootref = database.ref().child('playerDatabase');

let playerName = "";
let playerChoiceMade = false;
let playerChoice = null;
let appendPlayerChoice = null;

let win = 0;
let lose = 0;
let tie = 0;
let result = null;

let dbplayerName = null;
let dbplayerChoice = null;
let dbWin = null;
let dbLose = null;
let dbTie = null;
let dbP1Result = null;
let dbP2Result = null;
let dbplayerDivPlayerOneName = null;
let dbplayerDivPlayerTwoName = null;
let playerId = null;

let buttonClassString = null;

function initialize () {
    // Game Function
    checkDatabase ();
    determinePlayer ();
    retrieveData ();
    onreload ();
    playerOneLeft ();
    //Chat Function
    chatSubmit ();
    displayChat ();
}

function playerOneLeft () {
    gameRootref.on('child_removed', function() {
        if (playerId === 2) {
            console.log ("need to change to player one")
            gameRootref.once("value", function(snapshot) {
                console.log (snapshot.val().player2);
                playerId = 1;
                playerName = snapshot.val().player2.playerName;
                gameRootref.child('player2').remove();
                greeting ();
                dbplayerDivPlayerOneName = playerName;
                dbplayerDivPlayerTwoName = null;
                displayPlayerDivPlayerName ();

                $("#playerTwoName").html("Waiting for player 2 <span id='P2ChoiceMade'></span>");

                $("#rule").remove();

                $("#playerOneDiv").append("<button class='p1Choice btn btnGame'>Rock</button>");
                $("#playerOneDiv").append("<button class='p1Choice btn btnGame'>Paper</button>");
                $("#playerOneDiv").append("<button class='p1Choice btn btnGame'>Scissors</button>");
                $("#playerOneDiv").append("<button class='p1Choice btn btnGame'>Lizard</button>");
                $("#playerOneDiv").append("<button class='p1Choice btn btnGame'>Spock</button>");
                buttonSetup();
                RPSLSButton();

                displayRule();

                updateDataBase();
            });
        }
        if (playId === 1) {
            console.log ("player two Left")
            gameRootref.child('player2').remove();
            retrieveData();
        }
    });
}

function checkDatabase () {
    gameRootref.once("value", function(snapshot) {
        if (snapshot.val().player1 !== undefined) {
            if (snapshot.val().player2 !== undefined) {
                $(".container").remove();
                $("#serverFull").text("SERVER FULL")
            }
        }  
    });
}

function determinePlayer () {
    $("#playerInput").on('submit',function(event) {
        event.preventDefault();
        gameRootref.once("value", function(snapshot) {
            if (snapshot.val() === null) {
                playerId = 1;
                getName ();
            } else {
                playerId = 2
                getName ();
            }
        });
        displayRule ();
        buttonSetup ();
        RPSLSButton ();
    });
}

function displayRule () {
    if (playerId === 1) {
        $(".p2Choice").remove();
        ruleImg = $("<img>");
        ruleImg.attr('id', "rule");
        ruleImg.attr('src', "assets/image/rule.jpg");
        $("#playerTwo").append (ruleImg);
    } else if (playerId ===2) {
        $(".p1Choice").remove();
        ruleImg = $("<img>");
        ruleImg.attr('id', "rule");
        ruleImg.attr('src', "assets/image/rule.jpg");
        $("#playerOne").append (ruleImg);
    }
}

function getName () {
    playerName = $("#playerName").val();
    updateDataBase();
    $("#playerName").val("");
    $("#playerInput").remove();
    greeting ();
}

function updateDataBase () {
    let playerIdString = "player" + playerId;
    gameRootref.child(playerIdString).set({
        playerName: playerName,
        playerChoice: playerChoice,
        Win: win,
        Lose: lose,
        Tie: tie,
    });
}

function retrieveData () {
    console.log ("tik")
    gameRootref.on("value", function(snapshot) {
        if (snapshot.val() !== null) {
            if (playerId === 1) {
                playerDatabase = snapshot.val().player1;
                setDatabaseValue (playerDatabase);   
            } else if (playerId === 2) {
                playerDatabase = snapshot.val().player2;
                setDatabaseValue (playerDatabase);
            }
        
            if (snapshot.val().player1 === undefined) {
            } else {
                dbplayerDivPlayerOneName = snapshot.val().player1.playerName;
                displayPlayerDivPlayerName ();
            }

            if (snapshot.val().player2 === undefined) {
            } else {
                dbplayerDivPlayerTwoName = snapshot.val().player2.playerName;
                displayPlayerDivPlayerName ();
            }
           
            dbP1Result = snapshot.val().player1.playerChoice;
            dbP2Result = snapshot.val().player2.playerChoice;

            if (dbP1Result !== undefined) {
                $("#P1ChoiceMade").text("Choice Made");
            } else {
                $("#P1ChoiceMade").text("");
            }

            if (dbP2Result !== undefined) {
                $("#P2ChoiceMade").text("Choice Made");
            } else {
                $("#P2ChoiceMade").text("");
            }

            if (dbP1Result !== undefined & dbP2Result !== undefined) {
                checkResult ();
            }
        }
    });
}

function setDatabaseValue(playerDatabase) {
    dbplayerName = playerDatabase.playerName;
    dbplayerChoice = null;
    dbWin = playerDatabase.Win;
    dbLose = playerDatabase.Lose;
    dbTie = playerDatabase.Tie;
}

function greeting () {
    $("#greeting").remove();
    $("#playerInfo").append("<div id='greeting'><h1>Hi " + dbplayerName + ", you are player: " + playerId);
}

function buttonSetup () {
    if (playerId === 1) {
        buttonClassString = ".p1Choice";
    } else if (playerId === 2) {
        buttonClassString = ".p2Choice";
    }
}

function displayPlayerDivPlayerName () {
    if (dbplayerDivPlayerOneName !== null) {
        $("#playerOneName").text(dbplayerDivPlayerOneName + " - Player 1");
    }
    if (dbplayerDivPlayerTwoName !== null) {
        $("#playerTwoName").text(dbplayerDivPlayerTwoName + " - Player 2");
    }
}

function RPSLSButton () {
    $(buttonClassString).on('click', function(e) {
        if (playerChoiceMade === false) {
            playerChoice = e.currentTarget.innerText;
            playerChoiceMade = true;
            updateDataBase (); 
        }
    });
}

function checkResult () {
    if (dbP1Result == "Rock") {
        if (dbP2Result == "Rock") {
            result = "Tie";
            tietie ()
        } else if (dbP2Result == "Scissors" | dbP2Result == "Lizard") {
            p1Win ();
        } else {
            p2Win ();
        }
    }

    if (dbP1Result == "Paper") {
        if (dbP2Result == "Paper") {
            result = "Tie";
            tietie ()
        } else if (dbP2Result == "Rock" | dbP2Result == "Spock") {
            p1Win ();
        } else {
            p2Win ();
        }
    }

    if (dbP1Result == "Scissors") {
        if (dbP2Result == "Scissors") {
            result = "Tie";
            tietie ()
        } else if (dbP2Result == "Paper" | dbP2Result == "Lizard") {
            p1Win ();
        } else {
            p2Win ();
        }
    }

    if (dbP1Result == "Lizard") {
        if (dbP2Result == "Lizard") {
            result = "Tie";
            tietie ()
        } else if (dbP2Result == "Paper" | dbP2Result == "Spock") {
            p1Win ();
        } else {
            p2Win ();
        }
    }

    if (dbP1Result == "Spock") {
        if (dbP2Result == "Spock") {
            result = "Tie";
            tietie ()
        } else if (dbP2Result == "Rock" | dbP2Result == "Scissors") {
            p1Win ();
        } else {
            p2Win ();
        }
    }
    appendResult ();
};

function p1Win () {
    clearChoice ();
    result = dbplayerDivPlayerOneName + " win";
    if (playerId === 1) {
        win++;
    } else {
        lose++;
    }
    updateDataBase();
}

function p2Win () {
    clearChoice ();
    result = dbplayerDivPlayerTwoName + " win";
    if (playerId === 2) {
        win++;
    } else {
        lose++;
    }
    updateDataBase();
}

function tietie () {
    clearChoice ();
    tie++;
    updateDataBase();
}

function clearChoice () {
    appendPlayerChoice = playerChoice;
    playerChoice = null;
    playerChoiceMade = false;
}

function appendResult () {

    $(".resultmsg").remove();

    resultDiv = $("#resultMsg");
    if (playerId === 1) {
        resultDiv.append("<span class='resultmsg'>" + dbplayerDivPlayerOneName +": " + appendPlayerChoice + " -- </span>");
        resultDiv.append("<span class='resultmsg'> " + dbplayerDivPlayerTwoName +": " + dbP2Result + " -- </span>");
    } else if (playerId === 2) {
        resultDiv.append("<span class='resultmsg'>" + dbplayerDivPlayerOneName +": " + dbP1Result + " -- </span>");
        resultDiv.append("<span class='resultmsg'> " + dbplayerDivPlayerTwoName +": " + appendPlayerChoice + " -- </span>");
    }
    resultDiv.append("<span class='resultmsg'>" + result + "</span>");
    console.log ("result appended")
    $("#dbWin").text ("Win: " + dbWin);
    $("#dbLose").text ("Lose: " + dbLose);
    $("#dbTie").text ("Tie: " + dbTie);
}

function onreload () {
    $(window).on("unload", function() {
        if (playerId === 1) {   
            gameRootref.child('player1').remove();
        } else {gameRootref.child('player2').remove();}
        if (playerId !== null) {
            let message = "Disconnected!";
            pushChat(message);
        }
        gameRootref.on("value", function(snapshot) {
            if (snapshot.val() === null) {
                chatRootref.remove();
            }
        });
        
    });
}

// chat function 

let chatRootref = database.ref().child('chatDatabase');

function pushChat (message) {
    let messageObject = {playerId: playerId, Message: message};
    chatRootref.push(messageObject);
    $("#playerMessage").val ("");
}

function chatSubmit () {
    $("#messageInput").on('submit',function(event) {
        if (playerId !== null) {
            event.preventDefault();
            let message = $("#playerMessage").val ();
            pushChat (message);
        }
    });
}

function displayChat () {
    chatRootref.on("child_added", function(snapshot) {
        if (playerId !== null) {
            message = snapshot.val();
            if (message.playerId === 1) {
                if (playerId === 1) {
                    $("#chatroom").append("<div class='row justify-content-end'>" + dbplayerDivPlayerOneName + ":<br> " + message.Message + "</div>");
                } else {
                    $("#chatroom").append("<div class='row justify-content-start'>" + dbplayerDivPlayerOneName + ":<br> " + message.Message + "</div>");
                }
            } else if (message.playerId === 2) {
                if (playerId === 2) {
                    $("#chatroom").append("<div class='row justify-content-end'>" + dbplayerDivPlayerTwoName + ":<br> " + message.Message + "</div>");
                } else {
                    $("#chatroom").append("<div class='row justify-content-start'>" + dbplayerDivPlayerTwoName + ":<br> " + message.Message + "</div>");
                }
                
            }
        }
    });
}