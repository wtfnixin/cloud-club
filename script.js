// --- script.js (Final Corrected Version with Robust Timers) ---

let audioTurn = new Audio("pop.mp3");
let gameover = new Audio("gameover.mp3");
let drawAudio = new Audio("amongus.mp3");

const firebaseConfig = {
  apiKey: "AIzaSyDftwuUAkK6alqJWRh2YkokVk3G_-TN9i4",
  authDomain: "tic-tac-toe-cloud-41e2b.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-cloud-41e2b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tic-tac-toe-cloud-41e2b",
  storageBucket: "tic-tac-toe-cloud-41e2b.appspot.com",
  messagingSenderId: "267681007927",
  appId: "1:267681007927:web:86cd3bbf5e2498314332b2"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let gameId;
let playerSymbol;
let isSpectator = false;
let questionTimer, moveTimer; // Global timer variables
let isTimerRunning = { question: false, move: false }; // State tracking for timers

const questions = [
    { question: "What is the capital of France?", answers: ["Berlin", "Madrid", "Paris"], correct: "Paris" },
    { question: "Which planet is known as the Red Planet?", answers: ["Earth", "Mars", "Jupiter"], correct: "Mars" },
];

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    gameId = urlParams.get('gameId');
    playerSymbol = urlParams.get('player');

    if (!gameId || !playerSymbol) {
        window.location.href = 'login.html';
        return;
    }

    isSpectator = playerSymbol === 'Spectator';
    const gameRef = database.ref('games/' + gameId);

    gameRef.once('value', (snapshot) => {
        const gameData = snapshot.val();
        if (playerSymbol === 'X' && !gameData) createGameRoom();
        else if (playerSymbol === 'O' && gameData && !gameData.players.O) joinGameRoom();
        else if (!gameData) {
            alert("Game room does not exist.");
            window.location.href = 'login.html';
            return;
        }
        gameRef.on('value', updateGame);
    });
    document.querySelector('.info').innerText = `Welcome! Game ID: ${gameId}`;
};

function createGameRoom() {
    database.ref('games/' + gameId).set({
        board: Array(9).fill(""), turn: "", players: { "X": true },
        status: "waiting", question: null, winner: null, draw: false
    });
}

function joinGameRoom() {
    database.ref('games/' + gameId).update({ 'players/O': true, 'status': 'active' });
}

function nextQuestion() {
    if (playerSymbol === 'X') {
        const questionIndex = Math.floor(Math.random() * questions.length);
        database.ref('games/' + gameId).update({ question: questions[questionIndex], turn: "" });
    }
}

function updateGame(snapshot) {
    const game = snapshot.val();
    if (!game) { return; }

    // --- NEW TIMER MANAGEMENT LOGIC ---
    // Handle question timer
    if (game.question && !game.winner && !game.draw && !isTimerRunning.question) {
        startQuestionTimer();
    } else if (!game.question) {
        clearInterval(questionTimer);
        isTimerRunning.question = false;
        document.getElementById("question-timer-container").style.display = "none";
    }

    // Handle move timer
    if (game.turn && !game.winner && !game.draw && !isTimerRunning.move) {
        startMoveTimer(game.turn);
    } else if (!game.turn) {
        clearInterval(moveTimer);
        isTimerRunning.move = false;
        document.getElementById("move-timer-container").style.display = "none";
    }

    if (game.status === 'waiting' && !isSpectator) {
        document.querySelector('.info').innerText = `Waiting for Player O to join...`;
        return;
    }
    
    if (game.status === 'active' && !game.question && !game.turn && !game.winner && !game.draw && playerSymbol === 'X') {
        setTimeout(nextQuestion, 1500);
    }

    updateBoardUI(game);
}

function startQuestionTimer() {
    isTimerRunning.question = true;
    let timeLeft = 10;
    const timerDisplay = document.getElementById("question-time");
    timerDisplay.innerText = timeLeft;
    document.getElementById("question-timer-container").style.display = "block";
    questionTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(questionTimer);
            isTimerRunning.question = false;
            if (playerSymbol === 'X') {
                database.ref('games/' + gameId).update({ question: null, turn: "" });
            }
        }
    }, 1000);
}

function startMoveTimer(playerWhoAnswered) {
    isTimerRunning.move = true;
    let timeLeft = 5;
    const timerDisplay = document.getElementById("move-time");
    timerDisplay.innerText = timeLeft;
    document.getElementById("move-timer-container").style.display = "block";
    moveTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(moveTimer);
            isTimerRunning.move = false;
            // Only the player whose turn it was should update Firebase
            if (playerSymbol === playerWhoAnswered) {
                database.ref('games/' + gameId).update({ turn: "" });
            }
        }
    }, 1000);
}

// ... The updateBoardUI, displayQuestion, and handleAnswer functions remain exactly the same ...
function updateBoardUI(game) {
    const boxtexts = document.getElementsByClassName("boxtext");
    Array.from(boxtexts).forEach((box, i) => box.innerText = game.board[i] || "");
    const info = document.querySelector(".info");
    document.querySelector(".imgbox").classList.remove("show");
    document.querySelector(".draw-imgbox").classList.remove("show");
    
    if (game.winner) {
        info.innerText = game.winner + " Won!"; if (!isSpectator) gameover.play();
        document.querySelector(".imgbox").classList.add("show");
    } else if (game.draw) {
        info.innerText = "It's a Draw!"; if (!isSpectator) drawAudio.play();
        document.querySelector(".draw-imgbox").classList.add("show");
    } else if (game.turn) {
        info.innerText = `Player ${game.turn} has 5 seconds to move!`;
    } else if (game.question) {
        info.innerText = "First to answer gets a turn!";
    } else if (game.status === 'active') {
        info.innerText = "Waiting for the next question...";
    }

    if (game.question && !isSpectator) { displayQuestion(game.question); } 
    else { document.getElementById("quiz-container").style.display = "none"; }
}

function displayQuestion(q) {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.style.display = "block";
    document.getElementById("question").innerText = q.question;
    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";
    q.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer;
        button.onclick = () => handleAnswer(answer, q.correct);
        answersDiv.appendChild(button);
    });
}

function handleAnswer(answer, correctAnswer) {
    const gameRef = database.ref('games/' + gameId);
    gameRef.once('value', snapshot => {
        if (snapshot.val().question) {
            clearInterval(questionTimer); // Stop timer immediately on answer
            isTimerRunning.question = false;
            if (answer === correctAnswer) {
                gameRef.update({ turn: playerSymbol, question: null });
            } else {
                alert("Wrong answer!");
                document.querySelectorAll('#answers button').forEach(button => button.disabled = true);
            }
        }
    });
}


Array.from(document.getElementsByClassName("box")).forEach((element, i) => {
    element.addEventListener("click", () => {
        if (isSpectator) return;
        database.ref('games/' + gameId).once('value', snapshot => {
            const game = snapshot.val();
            if (game.board[i] === "" && game.turn === playerSymbol && !game.winner && !game.draw) {
                clearInterval(moveTimer);
                isTimerRunning.move = false;
                audioTurn.play();
                database.ref(`games/${gameId}/board/${i}`).set(playerSymbol);
                checkWinAndDrawAndUpdate();
            }
        });
    });
});

function checkWinAndDrawAndUpdate() {
    database.ref('games/' + gameId).once('value', snapshot => {
        const game = snapshot.val();
        let isWin = false, isDraw = false;
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        wins.forEach(e => {
            if (game.board[e[0]] && game.board[e[0]] === game.board[e[1]] && game.board[e[1]] === game.board[e[2]]) {
                isWin = true;
                database.ref('games/' + gameId).update({ winner: game.board[e[0]] });
            }
        });
        if (!isWin && !game.board.includes("")) {
            isDraw = true;
            database.ref('games/' + gameId).update({ draw: true });
        }
        if (!isWin && !isDraw) {
            database.ref('games/' + gameId).update({ turn: "" });
        }
    });
}

document.getElementById("reset").addEventListener("click", () => {
    if (gameId && playerSymbol === "X") {
        database.ref('games/' + gameId).update({
            board: Array(9).fill(""),
            turn: "", question: null, winner: null, draw: false
        });
    } else if (!isSpectator) {
        alert("Only the host (Player X) can reset the game.");
    }
});