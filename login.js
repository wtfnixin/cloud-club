// --- login.js (Final Version with Popup Card) ---

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

document.getElementById("createGame").addEventListener("click", createGame);
document.getElementById("joinGame").addEventListener("click", joinGame);
document.getElementById("spectateGame").addEventListener("click", spectateGame);

function createGame() {
    const gameId = Math.random().toString(36).substr(2, 5).toUpperCase();
    const playerSymbol = "X";

    database.ref('games/' + gameId).set({
        board: Array(9).fill(""),
        turn: "",
        players: { "X": true },
        status: "waiting",
        question: null,
        winner: null,
        draw: false,
        answers: null
    });
    
    // Show the custom popup card instead of an alert
    showGameIdPopup(gameId, playerSymbol);
}

function joinGame() {
    const gameId = document.getElementById("gameIdInput").value.toUpperCase();
    if (!gameId) {
        alert("Please enter a Game ID.");
        return;
    }
    window.location.href = `index.html?gameId=${gameId}&player=O`;
}

function spectateGame() {
    const gameId = document.getElementById("gameIdInput").value.toUpperCase();
    if (!gameId) {
        alert("Please enter a Game ID to spectate.");
        return;
    }
    const gameRef = database.ref('games/' + gameId);
    gameRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            window.location.href = `index.html?gameId=${gameId}&player=Spectator`;
        } else {
            alert("Game not found! Please check the code.");
        }
    });
}

// This is the new function that shows the popup
function showGameIdPopup(gameId, playerSymbol) {
    // Get the HTML elements
    const modal = document.getElementById('gameIdModal');
    const gameIdDisplay = document.getElementById('gameIdDisplay');
    const startGameButton = document.getElementById('startGameButton');
    
    // Set the game code in the popup
    gameIdDisplay.innerText = gameId;
    
    // Show the popup
    modal.style.display = 'flex';
    
    // When the "Let's Go!" button is clicked, go to the game page
    startGameButton.onclick = () => {
        window.location.href = `index.html?gameId=${gameId}&player=${playerSymbol}`;
    };
}