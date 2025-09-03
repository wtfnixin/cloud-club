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
let usedQuestions = [];

const questions = [
    { question: "What's the output: print([] or 'default')?", answers: ["[]", "default", "True", "False"], correct: "default" },{ question: "TCP handshake requires how many steps?", answers: ["2", "3", "4", "5"], correct: "3" },
  
  { question: "In binary: 1101 XOR 1011 = ?", answers: ["0110", "1110", "0010", "1100"], correct: "0110" },
  
  { question: "Which sorting has worst-case O(n²) but best average?", answers: ["Merge Sort", "Quick Sort", "Heap Sort", "Bubble Sort"], correct: "Quick Sort" },
  
  { question: "In subnet /26, how many host bits?", answers: ["4", "5", "6", "8"], correct: "6" },
  
  { question: "What's print(0.1 + 0.2 == 0.3) in most languages?", answers: ["True", "False", "Error", "0.3"], correct: "False" },
  
  { question: "Which HTTP status means 'Resource not found'?", answers: ["400", "401", "403", "404"], correct: "404" },
  
  { question: "In SQL: SELECT COUNT(DISTINCT NULL). Result?", answers: ["0", "1", "NULL", "Error"], correct: "0" },  { question: "In Python: print([] == False)", answers: ["True", "False", "Error", "[]"], correct: "False" },
  
  { question: "Which protocol uses port 22?", answers: ["HTTP", "SSH", "Telnet", "FTP"], correct: "SSH" },
  
  { question: "Hexadecimal FF in decimal?", answers: ["255", "256", "254", "15"], correct: "255" }, 

  { question: "Which data structure for implementing recursion?", answers: ["Queue", "Stack", "Array", "Tree"], correct: "Stack" },
  
  { question: "In C: int *p, q; What is q?", answers: ["Pointer to int", "Integer", "Pointer to pointer", "Array"], correct: "Integer" },
    
  { question: "What's print(type(type(int)))?", answers: ["<class 'int'>", "<class 'type'>", "<class 'object'>", "Error"], correct: "<class 'type'>" },
  
  { question: "Which has constant amortized insertion time?", answers: ["Array", "Linked List", "Dynamic Array", "Stack"], correct: "Dynamic Array" },
  
  { question: "In IPv6, how many bits for address?", answers: ["64", "96", "128", "256"], correct: "128" },
  
  { question: "What's the output: print(3 in [1,2,3] and 4)?", answers: ["True", "False", "4", "Error"], correct: "4" },
  
  { question: "Which tree traversal gives sorted order in BST?", answers: ["Preorder", "Inorder", "Postorder", "Level order"], correct: "Inorder" },
  
  { question: "In Git, what does HEAD~2 mean?", answers: ["2nd commit", "2 commits back", "2nd branch", "2 files back"], correct: "2 commits back" },
  
  { question: "What's malloc(0) behavior in C?", answers: ["Returns NULL", "Implementation defined", "Segmentation fault", "Returns valid pointer"], correct: "Implementation defined" },

  { question: "What's the output: console.log(0.1 + 0.2)?", answers: ["0.3", "0.30000000000000004", "Error", "0.299999999999"], correct: "0.30000000000000004" },
  
  { question: "Which consistency model is strongest?", answers: ["Eventual", "Causal", "Sequential", "Linearizability"], correct: "Linearizability" },

    { question: "In Python: print(bool('False'))", answers: ["True", "False", "Error", "'False'"], correct: "True" },

    { question: "Which HTTP method is idempotent?", answers: ["POST", "GET", "PATCH", "CONNECT"], correct: "GET" },

    { question: "In binary: 1011 AND 1101 = ?", answers: ["1001", "1111", "0101", "0011"], correct: "1001" },

    { question: "If 2^x + 2^x = 2^(x+1), then x can be?", answers: ["Any real number", "Only positive", "Only integers", "Only 0"], correct: "Any real number" },
  
  { question: "Three cards: RR, BB, RB. You see red. P(other side red)?", answers: ["1/3", "1/2", "2/3", "3/4"], correct: "2/3" },
  
  { question: "If log_a b = 2 and log_b c = 3, then log_a c = ?", answers: ["5", "6", "8", "9"], correct: "6" },
      
  { question: "A clock gains 5 minutes every hour. After 12 hours, it shows 3:00. Actual time?", answers: ["2:00", "1:00", "4:00", "2:30"], correct: "2:00" },
  
  { question: "If x! = 120, then (x-1)! + x! = ?", answers: ["144", "145", "143", "142"], correct: "144" },
    
  { question: "If 3^x = 81, then 9^(x/2) = ?", answers: ["9", "27", "81", "3"], correct: "9" },
  
  { question: "Two dices. P(sum ≥ 10) = ?", answers: ["1/6", "1/4", "1/3", "1/12"], correct: "1/6" },
  
  { question: "If sin²θ + cos²θ = 1, then sin⁴θ + cos⁴θ = ?", answers: ["1", "1 - 2sin²θcos²θ", "2sin²θcos²θ", "sin²θ + cos²θ"], correct: "1 - 2sin²θcos²θ" },
  
  { question: "A sequence: 1, 1, 2, 3, 5, 8, ?. What's the pattern?", answers: ["Fibonacci", "Prime numbers", "Perfect squares", "Arithmetic"], correct: "Fibonacci" },
  
  { question: "If |x - 3| = 5, possible values of x?", answers: ["8 only", "-2 only", "8 or -2", "3 or 5"], correct: "8 or -2" },
  
  { question: "lim(x→0) sin(x)/x = ?", answers: ["0", "1", "∞", "Undefined"], correct: "1" },
  
  { question: "If logₐ x = 2 and logₐ y = 3, then logₐ(x²y) = ?", answers: ["5", "6", "7", "12"], correct: "7" },
  
  { question: "Complex number i⁴ = ?", answers: ["1", "-1", "i", "-i"], correct: "1" },
  
  { question: "If P(A) = 0.6, P(B) = 0.4, P(A∩B) = 0.2, then P(A∪B) = ?", answers: ["0.8", "0.6", "1.0", "0.4"], correct: "0.8" },
  
  { question: "Derivative of x^x = ?", answers: ["x^(x-1)", "x^x(1 + ln x)", "x^x ln x", "xx^(x-1)"], correct: "x^x(1 + ln x)" },
  
  { question: "If det(A) = 5 and det(B) = 3, then det(AB) = ?", answers: ["8", "15", "2", "5/3"], correct: "15" },
  
  { question: "Series: 2, 8, 18, 32, 50, ?", answers: ["70", "72", "74", "68"], correct: "72" },
  
  { question: "If z = 3 + 4i, then |z| = ?", answers: ["3", "4", "5", "7"], correct: "5" },

    { question: "If f(x) = |x|, is f differentiable at x = 0?", answers: ["Yes", "No", "Only left derivative", "Only right derivative"], correct: "No" },
  
  { question: "Poisson distribution parameter λ represents?", answers: ["Variance", "Mean", "Both mean and variance", "Standard deviation"], correct: "Both mean and variance" },
  
  { question: "If A and B are independent, then P(A|B) = ?", answers: ["P(A)", "P(B)", "P(A∩B)", "1"], correct: "P(A)" },
  
  { question: "Curl of conservative vector field is?", answers: ["Zero", "One", "Field dependent", "Undefined"], correct: "Zero" },
  
  { question: "If z₁ = 1+i and z₂ = 1-i, then z₁z₂ = ?", answers: ["0", "2", "2i", "1"], correct: "2" },

  { question: "A man lives on 20th floor. He uses elevator to go down but walks up except on rainy days. Why?", answers: ["Exercise", "He's too short to reach button", "Elevator is broken", "Saves electricity"], correct: "He's too short to reach button" },
  
  { question: "What comes next: J, F, M, A, M, J, ?", answers: ["J", "A", "S", "O"], correct: "J" },
  
  { question: "If you're in a dark room with candle, oil lamp, gas stove and only one match, what do you light first?", answers: ["Candle", "Oil lamp", "Gas stove", "The match"], correct: "The match" },
  
  { question: "A rooster lays an egg on roof peak. Which side does it roll?", answers: ["Left", "Right", "Stays on peak", "Roosters don't lay eggs"], correct: "Roosters don't lay eggs" },
  
  { question: "You have 12 balls, one is heavier. Minimum weighings to find it?", answers: ["2", "3", "4", "5"], correct: "3" },
  
  { question: "What's heavier: a ton of feathers or a ton of bricks?", answers: ["Feathers", "Bricks", "Same weight", "Depends on gravity"], correct: "Same weight" },
  
  { question: "If plane crashes on border of two countries, where do you bury survivors?", answers: ["Country A", "Country B", "International waters", "Don't bury survivors"], correct: "Don't bury survivors" },
  
  { question: "How many months have 28 days?", answers: ["1", "2", "11", "12"], correct: "12" },
  
  { question: "Electric train travels north. Wind blows south. Which way does smoke go?", answers: ["North", "South", "Up", "Electric trains don't produce smoke"], correct: "Electric trains don't produce smoke" },
  
  { question: "What can travel around world while staying in corner?", answers: ["Light", "Sound", "Stamp", "Wind"], correct: "Stamp" },
  
  { question: "If doctor gives you 3 pills to take every 30 minutes, how long will they last?", answers: ["90 minutes", "60 minutes", "120 minutes", "30 minutes"], correct: "60 minutes" },
  
  { question: "What gets wetter the more it dries?", answers: ["Sponge", "Towel", "Paper", "Cloth"], correct: "Towel" },
  
  { question: "Before Mount Everest was discovered, what was the tallest mountain?", answers: ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"], correct: "Mount Everest" },
  
  { question: "How many times can you subtract 10 from 100?", answers: ["10", "9", "1", "Infinite"], correct: "1" },
  
  { question: "What goes up but never comes down?", answers: ["Balloon", "Age", "Temperature", "Airplane"], correct: "Age" },
  
  { question: "If you drop a yellow hat in Red Sea, what does it become?", answers: ["Red hat", "Wet", "Lost", "Orange hat"], correct: "Wet" },
  
  { question: "What has hands but cannot clap?", answers: ["Statue", "Clock", "Mannequin", "Robot"], correct: "Clock" },
  
  { question: "How many sides does a circle have?", answers: ["0", "1", "2", "Infinite"], correct: "2" },
  
  { question: "What breaks but never falls?", answers: ["Glass", "Day", "Promise", "Wave"], correct: "Day" },
  
  { question: "If son is half his father's age, and father is 40, when will son be 3/4 father's age?", answers: ["Never", "In 20 years", "In 10 years", "Now"], correct: "Never" },
  
  { question: "What has keys but no locks, space but no room?", answers: ["House", "Car", "Keyboard", "Piano"], correct: "Keyboard" },

  { question: "If it takes 5 machines 5 minutes to make 5 widgets, how long for 100 machines to make 100 widgets?", answers: ["100 minutes", "20 minutes", "5 minutes", "1 minute"], correct: "5 minutes" },
  
  { question: "What has one eye but cannot see?", answers: ["Blind person", "Needle", "Cyclops", "Camera"], correct: "Needle" },
  
  { question: "If you have it, you want to share it. If you share it, you don't have it. What is it?", answers: ["Money", "Secret", "Food", "Love"], correct: "Secret" },
  
  


  
    
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
    
    let timeLeft = 60;
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
        // If all questions have been used, reset the used questions list
        if (usedQuestions.length >= questions.length) {
            usedQuestions = [];
        }

        // Get available question indices (not used yet)
        const availableIndices = [];
        for (let i = 0; i < questions.length; i++) {
            if (!usedQuestions.includes(i)) {
                availableIndices.push(i);
            }
        }

        // Select a random question from available ones
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const questionIndex = availableIndices[randomIndex];

        // Mark this question as used
        usedQuestions.push(questionIndex);

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