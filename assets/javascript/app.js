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

let database = firebase.database();
let rootref = database.ref().child('playerDatabase');

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
    determinePlayer ();
    retrieveData ();
    onreload ();
}

function determinePlayer () {
    $("#playerNameSubmit").on('click',function() {
        rootref.once("value", function(snapshot) {
            if (snapshot.val() === null) {
                console.log ("database is null");
                //if (snapshot.val().player1 !== null) {} else {
                    playerName = $("#playerName").val();
                    console.log ("P1: ", playerName);
                    playerId = 1;
                    updateDataBase();
                //};
            } else {
                playerName = $("#playerName").val();
                console.log ("P2: ", playerName)
                playerId = 2
                updateDataBase();
            }
        });
    });
}

function updateDataBase () {
    let playerIdString = "player" + playerId
    rootref.child(playerIdString).set({
        playerName: playerName,
        playerChoice: playerChoice,
        Win: win,
        Lose: lose,
        Tie: tie,
    });
}

function retrieveData () {
    rootref.on("value", function(snapshot) {
        if (snapshot.val() !== null) {
            if (playerId === 1) {
                playerDatabase = snapshot.val().player1;
                console.log (playerDatabase);
                dbplayerName = playerDatabase.playerName;
                dbplayerChoice = null;
                dbWin = playerDatabase.Win;
                dbLose = playerDatabase.Lose;
                dbTie = playerDatabase.Tie;
                append ();
            } else if (playerId === 2) {
                playerDatabase = snapshot.val().player2;
                console.log (playerDatabase);
                dbplayerName = playerDatabase.playerName;
                dbplayerChoice = null;
                dbWin = playerDatabase.Win;
                dbLose = playerDatabase.Lose;
                dbTie = playerDatabase.Tie;
                append ();
            }
            
            if (snapshot.val().player1 === undefined) {
                console.log("Player 1 Database is undefined")
            } else{
                dbplayerDivPlayerOneName = snapshot.val().player1.playerName
                displayPlayerDivPlayerName ();
            }

            if (snapshot.val().player2 === undefined) {
                console.log("Player 2 Database is undefined")
            } else{
                dbplayerDivPlayerTwoName = snapshot.val().player2.playerName
                displayPlayerDivPlayerName ();
            }

            dbP1Result = snapshot.val().player1.playerChoice
            console.log (dbP1Result);
            dbP2Result = snapshot.val().player2.playerChoice
            console.log (dbP2Result);

            if (dbP1Result !== undefined) {
                $("#P1ChoiceMade").text("Choice Made")
            } else {
                $("#P1ChoiceMade").text("")
            }

            if (dbP2Result !== undefined) {
                $("#P2ChoiceMade").text("Choice Made")
            } else {
                $("#P2ChoiceMade").text("")
            }

            if (dbP1Result !== undefined & dbP2Result !== undefined) {
                console.log ("ready for result")
                checkResult ();
            }
        }
    });
}

function append () {
    greeting ();
    buttonSetup ();
    RPSLSButton ();
}

function greeting () {
    $("#displayPlayerName").text(dbplayerName);
    $("#playerId").text(playerId);
}

function buttonSetup () {
    console.log ("button setup")
    if (playerId === 1) {
        buttonClassString = ".p1Choice"
        // playerOneDiv = $("#playerOneDiv");
        
        // rockIMG = $("<img>");
        // rockIMG.attr('class',buttonClassString);
        // rockIMG.attr('src',rock);
        // rockIMG.text("Rock");

        // playerOneDiv.append(rockIMG);
    } else if (playerId === 2) {
        buttonClassString = ".p2Choice"

    }
    console.log (buttonClassString)
}

function displayPlayerDivPlayerName () {
    if (dbplayerDivPlayerOneName !== null) {
        $("#playerOneName").text(dbplayerDivPlayerOneName + " - Player 1")
    }

    if (dbplayerDivPlayerTwoName !== null) {
        $("#playerTwoName").text(dbplayerDivPlayerTwoName + " - Player 2")
    }
}

function RPSLSButton () {
    console.log ("button active, Id: ", playerId)
    console.log (buttonClassString)
    $(buttonClassString).on('click', function(e) {
        if (playerChoiceMade === false) {
            playerChoice = e.currentTarget.innerText;
            console.log (playerChoice)
            playerChoiceMade = true;
            updateDataBase ();
            playerChoice = null;
            
        }
    });
}

function checkResult () {
    if (dbP1Result == "Rock") {
        if (dbP2Result == "Rock") {
            console.log ("tie")
            result = "Tie"
        } else if (dbP2Result == "Scissors" | dbP2Result == "Lizard") {
            console.log ("P1 win")
            result = "P1 win"
        } else {
            console.log ("p2 win")
            result = "P2 win"
        }
    }

    if (dbP1Result == "Paper") {
        if (dbP2Result == "Paper") {
            console.log ("tie")
            result = "Tie"
        } else if (dbP2Result == "Rock" | dbP2Result == "Spock") {
            console.log ("P1 win")
            result = "P1 win"
        } else {
            console.log ("p2 win")
            result = "P2 win"
        }
    }

    if (dbP1Result == "Scissors") {
        if (dbP2Result == "Scissors") {
            console.log ("tie")
            result = "Tie"
        } else if (dbP2Result == "Paper" | dbP2Result == "Lizard") {
            console.log ("P1 win")
            result = "P1 win"
        } else {
            console.log ("p2 win")
            result = "P2 win"
        }
    }

    if (dbP1Result == "Lizard") {
        if (dbP2Result == "Lizard") {
            console.log ("tie")
            result = "Tie"
        } else if (dbP2Result == "Paper" | dbP2Result == "Spock") {
            console.log ("P1 win")
            result = "P1 win"
        } else {
            console.log ("p2 win")
            result = "P2 win"
        }
    }

    if (dbP1Result == "Spock") {
        if (dbP2Result == "Spock") {
            console.log ("tie")
            result = "Tie"
        } else if (dbP2Result == "Rock" | dbP2Result == "Scissors") {
            console.log ("P1 win")
            result = "P1 win"
        } else {
            console.log ("p2 win")
            result = "P2 win"
        }
    }

    appendResult () 

};

function appendResult () {

    //$(".resultmsg").remove();

    resultDiv = $("#result")
    resultDiv.append("<span class='resultmsg'>" + dbplayerDivPlayerOneName +": " + dbP1Result + " </span>")
    resultDiv.append("<span class='resultmsg'>" + dbplayerDivPlayerTwoName +": " + dbP2Result + " </span>")
    resultDiv.append("<span class='resultmsg'>" + result + "</span>")
    playerChoice = null;
    playerChoiceMade = false;
    console.log ("playerId:" + playerId + " player choice made:" + playerChoiceMade)
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
    });
}
