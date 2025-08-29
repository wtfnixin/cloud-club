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

let audioTurn = new Audio("pop.mp3");
let gameover = new Audio("gameover.mp3");
let drawAudio = new Audio("amongus.mp3");

let gameId, playerSymbol, isSpectator = false;
let questionTimer, moveTimer;
let localTimerIsRunning = false;

const questions = [
    { question: "What is the capital of France?", answers: ["Berlin", "Madrid", "Paris"], correct: "Paris" },
    { question: "Which planet is known as the Red Planet?", answers: ["Earth", "Mars", "Jupiter"], correct: "Mars" },
    { question: "What is the output of: print(2 * '12') ?", answers: ["24", "1212", "Error", "12"], correct: "1212" },
    { question: "Which of the following is immutable in Python?", answers: ["List", "Tuple", "Dictionary", "Set"], correct: "Tuple" },
    { question: "What is the output of: print(5 // 2) ?", answers: ["2.5", "3", "2", "Error"], correct: "2" },
    { question: "Which keyword in Python is used to handle exceptions?", answers: ["error", "except", "throw", "handle"], correct: "except" },
    { question: "If 3 pens cost ₹45, how many pens can be bought for ₹180?", answers: ["9", "12", "15", "18"], correct: "12" },
  { question: "A train 120 meters long passes a pole in 6 seconds. What is its speed?", answers: ["20 m/s", "25 m/s", "15 m/s", "18 m/s"], correct: "20 m/s" },
  { question: "If A = 2, B = 4, C = 8, then what is the value of Z (26th letter)?", answers: ["64", "128", "512", "1024"], correct: "512" },
  { question: "Find the missing number: 2, 6, 12, 20, ?", answers: ["30", "28", "32", "36"], correct: "30" },
  
    
];

// Animation utility functions
function animateElement(element, animationClass = 'fade-in', delay = 0) {
    if (!element) return;
    
    element.classList.add('animate-hidden');
    
    setTimeout(() => {
        element.classList.remove('animate-hidden');
        element.classList.add(animationClass);
    }, delay);
}

function animateElements(elements, animationClass = 'fade-in', staggerDelay = 100) {
    if (!elements || elements.length === 0) return;
    
    elements.forEach((element, index) => {
        animateElement(element, animationClass, index * staggerDelay);
    });
}

// Initialize animations on page load
function initializeAnimations() {
    // Animate game board
    const gameBoard = document.querySelector('.container');
    if (gameBoard) {
        animateElement(gameBoard, 'fade-in-scale', 300);
    }
    
    // Animate game info elements
    const gameInfo = document.querySelector('.gameInfo');
    if (gameInfo) {
        animateElement(gameInfo, 'fade-in-right', 500);
    }
    
    // Animate nav title
    const navTitle = document.querySelector('nav li');
    if (navTitle) {
        animateElement(navTitle, 'fade-in', 100);
    }
}

window.onload = () => {
    // Initialize animations first
    initializeAnimations();
    
    const urlParams = new URLSearchParams(window.location.search);
    gameId = urlParams.get('gameId');
    playerSymbol = urlParams.get('player');
    if (!gameId || !playerSymbol) { window.location.href = 'login.html'; return; }

    isSpectator = playerSymbol === 'Spectator';
    const gameRef = database.ref('games/' + gameId);

    // Validate player access before proceeding
    if (playerSymbol === 'X') {
        gameRef.once('value', snapshot => { 
            if (!snapshot.exists()) {
                createGameRoom();
            } else {
                // Game exists, check if this player X is allowed
                const game = snapshot.val();
                if (game.players && game.players.X) {
                    // Someone else is already Player X
                    alert("Player X slot is already taken!");
                    window.location.href = 'login.html';
                    return;
                }
            }
        });
    } else if (playerSymbol === 'O') {
        // Validate Player O access
        gameRef.once('value', snapshot => {
            if (!snapshot.exists()) {
                alert("Game not found! Please check the code.");
                window.location.href = 'login.html';
                return;
            }
            const game = snapshot.val();
            if (game.players && game.players.O) {
                // Someone else is already Player O
                alert("Player O slot is already taken!");
                window.location.href = 'login.html';
                return;
            }
            if (game.players && game.players.X && game.players.O) {
                // Room is full
                alert("Room is full! Only 2 players allowed.");
                window.location.href = 'login.html';
                return;
            }
        });
    } else if (playerSymbol === 'Spectator') {
        // Validate game exists for spectators
        gameRef.once('value', snapshot => {
            if (!snapshot.exists()) {
                alert("Game not found! Please check the code.");
                window.location.href = 'login.html';
                return;
            }
        });
    } else {
        // Invalid player symbol
        alert("Invalid player type!");
        window.location.href = 'login.html';
        return;
    }
    
    gameRef.on('value', updateGame);
};

function createGameRoom() {
    database.ref('games/' + gameId).set({
        board: Array(9).fill(""), turn: "", players: { "X": true },
        status: "waiting", question: null, winner: null, draw: false,
        answers: null, timerStartedAt: null
    });
}

function updateGame(snapshot) {
    const game = snapshot.val();
    if (!game) { document.querySelector('.info').innerText = `Waiting for host...`; return; }

    // Check if room is full (both X and O players exist)
    const roomIsFull = game.players && game.players.X && game.players.O;
    
    // If trying to join as O when room is not full
    if (playerSymbol === 'O' && game.status === 'waiting' && !game.players.O) {
        database.ref('games/' + gameId).update({ 'players/O': true, 'status': 'active' });
    }
    // If trying to join but room is full and player is not already in the game
    else if (roomIsFull && !game.players[playerSymbol] && playerSymbol !== 'Spectator') {
        // Show room full message and redirect
        document.querySelector('.info').innerText = `Room is full! Only 2 players allowed.`;
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    if (playerSymbol === 'X') {
        const bothWrong = game.answers && game.answers.X && game.answers.O && 
                          game.question && game.answers.X !== game.question.correct && game.answers.O !== game.question.correct;
        const isIdle = game.status === 'inprogress' && !game.question && !game.turn && !game.winner && !game.draw;
        if (bothWrong) {
            // Both players answered wrong - clear timer and change question with delay
            clearInterval(questionTimer);
            document.getElementById("question-timer-container").style.display = "none";
            setTimeout(() => {
                nextQuestion();
            }, 1500); // 1 second delay before new question
        } else if (isIdle) {
            setTimeout(nextQuestion, 1500);
        }
    }
    
    updateUI(game);
}

function updateUI(game) {
    updateInfoAndButtons(game);
    updateBoardAndGifs(game);
    handleTimers(game);
    if (game.question && game.status === 'inprogress') {
        displayQuestion(game.question, game.answers);
    } else {
        document.getElementById("quiz-container").style.display = "none";
    }
}

function updateInfoAndButtons(game) {
    const infoEl = document.querySelector('.info');
    const startGameBtn = document.getElementById('startGameBtn');

    if (playerSymbol === 'X') {
        startGameBtn.style.display = 'inline-block';
        if (game.status === 'waiting') {
            startGameBtn.disabled = true;
            startGameBtn.innerText = "Waiting for Player O...";
            infoEl.innerText = "Waiting for Player O to join...";
        } else if (game.status === 'active') {
            startGameBtn.disabled = false;
            startGameBtn.innerText = "Start Game";
            infoEl.innerText = "Player O has joined! Press Start.";
        } else {
            startGameBtn.style.display = 'none';
        }
    } else {
        if (startGameBtn) startGameBtn.style.display = 'none';
        if (game.status === 'active') {
             infoEl.innerText = "Waiting for the host to start the game...";
        }
    }

    if (isSpectator) { 
        document.getElementById('spectator-info').style.display = 'block';
        if (game.status === 'active') {
             infoEl.innerText = "Waiting for the host to start the game...";
        }
    }

    if (game.winner) { infoEl.innerText = `${game.winner} Won!`; } 
    else if (game.draw) { infoEl.innerText = "It's a Draw!"; }
    else if (game.status === 'inprogress') {
        if (game.turn) { infoEl.innerText = `Player ${game.turn}'s turn to move!`; }
        else if (game.question) { infoEl.innerText = "First to answer wins the turn!"; }
        else { infoEl.innerText = "Waiting for the next question..."; }
    }
}

document.getElementById("startGameBtn").addEventListener("click", () => {
    // We change the status and immediately ask the first question
    database.ref('games/' + gameId).update({ status: 'inprogress' }).then(nextQuestion);
});

function handleTimers(game) {
    // Only clear timers if game is over or not in progress
    if (game.winner || game.draw || game.status !== 'inprogress') {
        clearInterval(questionTimer);
        clearInterval(moveTimer);
        document.getElementById("question-timer-container").style.display = "none";
        document.getElementById("move-timer-container").style.display = "none";
        return;
    }

    // Check if both players answered wrong - don't start timer in this case
    const bothWrong = game.answers && game.answers.X && game.answers.O && 
                      game.question && game.answers.X !== game.question.correct && game.answers.O !== game.question.correct;
    if (bothWrong) {
        // Don't start any timers when both players are wrong - waiting for new question
        clearInterval(questionTimer);
        clearInterval(moveTimer);
        document.getElementById("question-timer-container").style.display = "none";
        document.getElementById("move-timer-container").style.display = "none";
        return;
    }

    // Handle question phase
    if (game.question) {
        // Only start question timer if it's not already running
        if (document.getElementById("question-timer-container").style.display !== "block") {
            clearInterval(moveTimer); // Clear move timer if switching from move to question
            document.getElementById("move-timer-container").style.display = "none";
            startQuestionTimer();
        }
    } 
    // Handle move phase
    else if (game.turn) {
        // Only start move timer if it's not already running
        if (document.getElementById("move-timer-container").style.display !== "block") {
            clearInterval(questionTimer); // Clear question timer when switching to move phase
            document.getElementById("question-timer-container").style.display = "none";
            startMoveTimer();
        }
    }
    else {
        clearInterval(questionTimer);
        clearInterval(moveTimer);
        document.getElementById("question-timer-container").style.display = "none";
        document.getElementById("move-timer-container").style.display = "none";
    }
}

function startQuestionTimer() {
    const timerDisplay = document.getElementById("question-time");
    document.getElementById("question-timer-container").style.display = "block";
    
    let timeLeft = 10;
    timerDisplay.innerText = timeLeft;
    
    questionTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(questionTimer);
            if (playerSymbol === 'X') {
                database.ref('games/' + gameId).update({ question: null, turn: "", answers: null });
            }
        }
    }, 1000);
}

function startMoveTimer() {
    const timerDisplay = document.getElementById("move-time");
    document.getElementById("move-timer-container").style.display = "block";
    
    let timeLeft = 5;
    timerDisplay.innerText = timeLeft;
    
    moveTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(moveTimer);
            if (playerSymbol === 'X') {
                database.ref('games/' + gameId).update({ turn: "" });
            }
        }
    }, 1000);
}

function nextQuestion() {
    if (playerSymbol === 'X') {
        const questionIndex = Math.floor(Math.random() * questions.length);
        database.ref('games/' + gameId).update({
            question: questions[questionIndex],
            turn: "",
            answers: null,
            timerStartedAt: firebase.database.ServerValue.TIMESTAMP
        });
    }
}

function handleAnswer(answer, correctAnswer) {
    const gameRef = database.ref('games/' + gameId);
    gameRef.once('value', snapshot => {
        const game = snapshot.val();
        if (game.question && (!game.answers || !game.answers[playerSymbol])) {
            if (answer === correctAnswer) {
                gameRef.update({ 
                    turn: playerSymbol, 
                    question: null, 
                    answers: null,
                    timerStartedAt: firebase.database.ServerValue.TIMESTAMP // Timestamp for move timer
                });
            } else {
                showFeedback("Wrong answer!", "error");
                let update = {};
                update['answers/' + playerSymbol] = answer; // Store the actual answer chosen
                gameRef.update(update);
            }
        }
    });
}

// All functions below are correct and do not need changes.
function updateBoardAndGifs(game) { 
    Array.from(document.getElementsByClassName("boxtext")).forEach((box, i) => {
        const symbol = game.board[i] || "";
        box.innerText = symbol;
        
        // Remove existing player classes
        box.classList.remove("player-x", "player-o");
        
        // Add appropriate class based on symbol
        if (symbol === "X") {
            box.classList.add("player-x");
        } else if (symbol === "O") {
            box.classList.add("player-o");
        }
    }); 
    
    const winBox = document.querySelector(".imgbox"); 
    const drawBox = document.querySelector(".draw-imgbox"); 
    if (game.winner) { 
        winBox.classList.add("show"); 
        if (!isSpectator) gameover.play(); 
    } else { 
        winBox.classList.remove("show"); 
    } 
    if (game.draw) { 
        drawBox.classList.add("show"); 
        if (!isSpectator) drawAudio.play(); 
    } else { 
        drawBox.classList.remove("show"); 
    } 
}
function displayQuestion(q, gameAnswers) { 
    const quizContainer = document.getElementById("quiz-container"); 
    quizContainer.style.display = "block"; 
    document.getElementById("question").innerText = q.question; 
    const answersDiv = document.getElementById("answers"); 
    answersDiv.innerHTML = ""; 
    
    const playerHasAnswered = gameAnswers && gameAnswers[playerSymbol]; 
    
    if (isSpectator) {
        // Spectator view: Show both players' choices
        q.answers.forEach(answer => { 
            const answerContainer = document.createElement("div");
            answerContainer.className = "spectator-answer-container";
            
            const answerText = document.createElement("div");
            answerText.className = "spectator-answer-text";
            answerText.innerText = answer;
            
            const playerChoices = document.createElement("div");
            playerChoices.className = "spectator-player-choices";
            
            // Check if Player X chose this answer
            const playerXChose = gameAnswers && gameAnswers.X === answer;
            // Check if Player O chose this answer  
            const playerOChose = gameAnswers && gameAnswers.O === answer;
            
            if (playerXChose || playerOChose) {
                const choices = [];
                if (playerXChose) choices.push("Player X");
                if (playerOChose) choices.push("Player O");
                playerChoices.innerText = `✓ Chosen by: ${choices.join(", ")}`;
                playerChoices.classList.add("chosen");
            } else {
                playerChoices.innerText = "○ No players chose this";
                playerChoices.classList.add("not-chosen");
            }
            
            answerContainer.appendChild(answerText);
            answerContainer.appendChild(playerChoices);
            answersDiv.appendChild(answerContainer);
        });
    } else {
        // Regular player view
        q.answers.forEach(answer => { 
            const button = document.createElement("button"); 
            button.innerText = answer; 
            if (playerHasAnswered) { 
                button.disabled = true; 
            } else { 
                button.onclick = () => handleAnswer(answer, q.correct); 
            } 
            answersDiv.appendChild(button); 
        }); 
    }
}
Array.from(document.getElementsByClassName("box")).forEach((element, i) => { element.addEventListener("click", () => { if (isSpectator) return; database.ref('games/' + gameId).once('value', snapshot => { const game = snapshot.val(); if (game.board[i] === "" && game.turn === playerSymbol && !game.winner && !game.draw) { clearInterval(moveTimer); audioTurn.play(); database.ref(`games/${gameId}/board/${i}`).set(playerSymbol); checkWinAndDrawAndUpdate(); } }); }); });
function checkWinAndDrawAndUpdate() { database.ref('games/' + gameId).once('value', snapshot => { const game = snapshot.val(); let isWin = false, isDraw = false; const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; wins.forEach(e => { if (game.board[e[0]] && game.board[e[0]] === game.board[e[1]] && game.board[e[1]] === game.board[e[2]]) { isWin = true; database.ref('games/' + gameId).update({ winner: game.board[e[0]] }); } }); if (!isWin && !game.board.includes("")) { isDraw = true; database.ref('games/' + gameId).update({ draw: true }); } if (!isWin && !isDraw) { database.ref('games/' + gameId).update({ turn: "" }); } }); }
function showFeedback(message, type) { const feedbackEl = document.getElementById('feedback-message'); feedbackEl.textContent = message; feedbackEl.className = 'feedback'; feedbackEl.classList.add(type); feedbackEl.classList.add('show'); setTimeout(() => { feedbackEl.classList.remove('show'); }, 2500); }