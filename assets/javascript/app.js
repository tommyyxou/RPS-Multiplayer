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

let rock = "./assets/image/rock.png"
let rock2 = "./assets/image/rock2.png"

let paper = "./assets/image/paper.png"
let paper2 = "./assets/image/paper2.png"

let scissors = "./assets/image/scissors.png"
let scissors2 = "./assets/image/scissors2.png"

let lizard = "./assets/image/lizard.png"
let lizard2 = "./assets/image/lizard2.png"

let spock = "./assets/image/spock.png"
let spock2 = "./assets/image/spock2.png"

function initialize () {
    // Game Function
    determinePlayer ();
    retrieveData ();
    onreload ();
    //Chat Function
    chatSubmit ();
    displayChat ();
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
        buttonSetup ();
        RPSLSButton ();
    });
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
                console.log("Player 1 Database is undefined")
            } else {
                dbplayerDivPlayerOneName = snapshot.val().player1.playerName;
                displayPlayerDivPlayerName ();
            }

            if (snapshot.val().player2 === undefined) {
                console.log("Player 2 Database is undefined")
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
    $("#playerInfo").append("<div>Hi " + dbplayerName + ", you are player: " + playerId);
}

function buttonSetup () {
    if (playerId === 1) {
        buttonClassString = ".p1Choice";
        // playerOneDiv = $("#playerOneDiv");
        
        // rockIMG = $("<img>");
        // rockIMG.attr('class',buttonClassString);
        // rockIMG.attr('src',rock);
        // rockIMG.text("Rock");

        // playerOneDiv.append(rockIMG);
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
            playerChoice = null; 
        }
    });
}

function p1Win () {
    result = dbplayerDivPlayerOneName + " win";
}

function p2Win () {
    result = dbplayerDivPlayerTwoName + " win";
}

function checkResult () {
    if (dbP1Result == "Rock") {
        if (dbP2Result == "Rock") {
            result = "Tie";
        } else if (dbP2Result == "Scissors" | dbP2Result == "Lizard") {
            p1Win ();
        } else {
            p2Win ();
        }
    }

    if (dbP1Result == "Paper") {
        if (dbP2Result == "Paper") {
            result = "Tie";
        } else if (dbP2Result == "Rock" | dbP2Result == "Spock") {
            p1Win ();
        } else {
            p2Win ();
        }
    }

    if (dbP1Result == "Scissors") {
        if (dbP2Result == "Scissors") {
            result = "Tie";
        } else if (dbP2Result == "Paper" | dbP2Result == "Lizard") {
            p1Win ();
        } else {
            p2Win ();
        }
    }

    if (dbP1Result == "Lizard") {
        if (dbP2Result == "Lizard") {
            result = "Tie";
        } else if (dbP2Result == "Paper" | dbP2Result == "Spock") {
            p1Win ();
        } else {
            p2Win ();
        }
    }

    if (dbP1Result == "Spock") {
        if (dbP2Result == "Spock") {
            result = "Tie";
        } else if (dbP2Result == "Rock" | dbP2Result == "Scissors") {
            p1Win ();
        } else {
            p2Win ();
        }
    }
    appendResult ();
};

function appendResult () {
    $(".resultmsg").remove();

    resultDiv = $("#result");
    resultDiv.append("<span class='resultmsg'>" + dbplayerDivPlayerOneName +": " + dbP1Result + " </span>");
    resultDiv.append("<span class='resultmsg'>" + dbplayerDivPlayerTwoName +": " + dbP2Result + " </span>");
    resultDiv.append("<span class='resultmsg'>" + result + "</span>");
    playerChoice = null;
    playerChoiceMade = false;
    updateDataBase ();
}

function onreload () {
    $(window).on("unload", function() {
        win = null;
        lose = null;
        tie = null;
        playerChoice = null;
        playerName = null;
        updateDataBase ();
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
                $("#chatroom").append("<div>" + dbplayerDivPlayerOneName + ": " + message.Message + "</div>");
            } else if (message.playerId === 2) {
                $("#chatroom").append("<div>" + dbplayerDivPlayerTwoName + ": " + message.Message + "</div>");
            }
        }
    });
}


