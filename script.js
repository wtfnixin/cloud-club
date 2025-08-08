
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

let gameId, playerSymbol, isSpectator = false;
let questionTimer, moveTimer;
let isTimerRunning = { question: false, move: false };

const questions = [
    { question: "What is the capital of France?", answers: ["Berlin", "Madrid", "Paris"], correct: "Paris" },
    { question: "Which planet is known as the Red Planet?", answers: ["Earth", "Mars", "Jupiter"], correct: "Mars" },
];

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    gameId = urlParams.get('gameId');
    playerSymbol = urlParams.get('player');

    if (!gameId || !playerSymbol) {
        window.location.href = 'login.html'; // Go back if details are missing
        return;
    }

    isSpectator = playerSymbol === 'Spectator';
    const gameRef = database.ref('games/' + gameId);

    // --- SETUP LOGIC ---
    if (playerSymbol === 'X') {
        // Player X (the creator) sets up the game room in Firebase.
        createGameRoom();
    }

    if (isSpectator) {
        setupSpectatorUI();
    }
    
    // Everyone starts listening for game data.
    gameRef.on('value', updateGame);
};

function createGameRoom() {
    database.ref('games/' + gameId).set({
        board: Array(9).fill(""),
        turn: "",
        players: { "X": true },
        status: "waiting", // Game starts in 'waiting' state
        question: null,
        winner: null,
        draw: false
    });
}

// --- Main Game Update Function ---
function updateGame(snapshot) {
    const game = snapshot.val();
    
    // If game data doesn't exist yet, Player O and Spectators will wait.
    if (!game) {
        document.querySelector('.info').innerText = `Waiting for host to create game: ${gameId}...`;
        return;
    }

    // Player O joins the game when they see the "waiting" status.
    if (playerSymbol === 'O' && game.status === 'waiting' && !game.players.O) {
        database.ref('games/' + gameId).update({
            'players/O': true,
            'status': 'active'
        });
    }

    // If game was reset, clear local timers
    if (!game.question && !game.turn) {
        clearInterval(questionTimer);
        clearInterval(moveTimer);
    }
    
    // Show waiting message if game is not active yet
    if (game.status === 'waiting' && !isSpectator) {
        document.querySelector('.info').innerText = `Waiting for Player O to join...`;
        return;
    }
    
    // Player X starts the next question round
    if (game.status === 'active' && !game.question && !game.turn && !game.winner && !game.draw && playerSymbol === 'X') {
        setTimeout(nextQuestion, 1500);
    }

    // Update timers and the rest of the UI
    handleTimers(game);
    updateBoardUI(game);
}


// --- All other functions ---
function nextQuestion() { /* ... same as before ... */
    if (playerSymbol === 'X') { const questionIndex = Math.floor(Math.random() * questions.length); database.ref('games/' + gameId).update({ question: questions[questionIndex], turn: "" }); }
}
function setupSpectatorUI() { /* ... same as before ... */
    document.getElementById('spectator-info').style.display = 'block';
    document.querySelector('.gamecontainer').classList.add('spectating');
    document.getElementById('reset').style.display = 'none';
}
function handleTimers(game) { /* ... same as before ... */
    clearInterval(questionTimer); clearInterval(moveTimer);
    document.getElementById("question-timer-container").style.display = "none";
    document.getElementById("move-timer-container").style.display = "none";
    isTimerRunning = { question: false, move: false };
    if (game.question && !game.winner && !game.draw) { startQuestionTimer(); } 
    else if (game.turn && !game.winner && !game.draw) { startMoveTimer(game.turn); }
}
function startQuestionTimer() { /* ... same as before ... */
    isTimerRunning.question = true; let timeLeft = 10;
    const timerDisplay = document.getElementById("question-time");
    timerDisplay.innerText = timeLeft;
    document.getElementById("question-timer-container").style.display = "block";
    questionTimer = setInterval(() => {
        timeLeft--; timerDisplay.innerText = timeLeft;
        if (timeLeft <= 0) { clearInterval(questionTimer); if (playerSymbol === 'X') { database.ref('games/' + gameId).update({ question: null, turn: "" }); } }
    }, 1000);
}
function startMoveTimer(playerWhoAnswered) { /* ... same as before ... */
    isTimerRunning.move = true; let timeLeft = 5;
    const timerDisplay = document.getElementById("move-time");
    timerDisplay.innerText = timeLeft;
    document.getElementById("move-timer-container").style.display = "block";
    moveTimer = setInterval(() => {
        timeLeft--; timerDisplay.innerText = timeLeft;
        if (timeLeft <= 0) { clearInterval(moveTimer); if (playerSymbol === playerWhoAnswered) { database.ref('games/' + gameId).update({ turn: "" }); } }
    }, 1000);
}
function updateBoardUI(game) { /* ... same as before ... */
    Array.from(document.getElementsByClassName("boxtext")).forEach((box, i) => box.innerText = game.board[i] || "");
    const info = document.querySelector(".info");
    document.querySelector(".imgbox").classList.remove("show"); document.querySelector(".draw-imgbox").classList.remove("show");
    if (game.winner) { info.innerText = game.winner + " Won!"; if (!isSpectator) gameover.play(); document.querySelector(".imgbox").classList.add("show"); } 
    else if (game.draw) { info.innerText = "It's a Draw!"; if (!isSpectator) drawAudio.play(); document.querySelector(".draw-imgbox").classList.add("show"); } 
    else if (game.turn) { info.innerText = `Player ${game.turn} has 5 seconds to move!`; } 
    else if (game.question) { info.innerText = "First to answer gets a turn!"; } 
    else if (game.status === 'active') { info.innerText = "Waiting for the next question..."; }
    if (game.question) { displayQuestion(game.question); } 
    else { document.getElementById("quiz-container").style.display = "none"; }
}
function displayQuestion(q) { /* ... same as before ... */
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.style.display = "block"; document.getElementById("question").innerText = q.question;
    const answersDiv = document.getElementById("answers"); answersDiv.innerHTML = "";
    q.answers.forEach(answer => {
        const button = document.createElement("button"); button.innerText = answer;
        if (!isSpectator) { button.onclick = () => handleAnswer(answer, q.correct); }
        answersDiv.appendChild(button);
    });
}
function handleAnswer(answer, correctAnswer) { /* ... same as before ... */
    const gameRef = database.ref('games/' + gameId);
    gameRef.once('value', snapshot => {
        if (snapshot.val().question) {
            clearInterval(questionTimer);
            if (answer === correctAnswer) { gameRef.update({ turn: playerSymbol, question: null }); } 
            else { alert("Wrong answer!"); document.querySelectorAll('#answers button').forEach(button => button.disabled = true); }
        }
    });
}
Array.from(document.getElementsByClassName("box")).forEach((element, i) => { /* ... same as before ... */
    element.addEventListener("click", () => {
        if (isSpectator) return;
        database.ref('games/' + gameId).once('value', snapshot => {
            const game = snapshot.val();
            if (game.board[i] === "" && game.turn === playerSymbol && !game.winner && !game.draw) {
                clearInterval(moveTimer); audioTurn.play();
                database.ref(`games/${gameId}/board/${i}`).set(playerSymbol);
                checkWinAndDrawAndUpdate();
            }
        });
    });
});
function checkWinAndDrawAndUpdate() { /* ... same as before ... */
    database.ref('games/' + gameId).once('value', snapshot => {
        const game = snapshot.val(); let isWin = false, isDraw = false;
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        wins.forEach(e => {
            if (game.board[e[0]] && game.board[e[0]] === game.board[e[1]] && game.board[e[1]] === game.board[e[2]]) {
                isWin = true; database.ref('games/' + gameId).update({ winner: game.board[e[0]] });
            }
        });
        if (!isWin && !game.board.includes("")) { isDraw = true; database.ref('games/' + gameId).update({ draw: true }); }
        if (!isWin && !isDraw) { database.ref('games/' + gameId).update({ turn: "" }); }
    });
}
document.getElementById("reset").addEventListener("click", () => { /* ... same as before ... */
    if (gameId && playerSymbol === "X") {
        database.ref('games/' + gameId).update({
            board: Array(9).fill(""), turn: "", question: null, winner: null, draw: false
        });
    } else if (!isSpectator) { alert("Only the host (Player X) can reset the game."); }
});