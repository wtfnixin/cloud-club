// --- login.js ---
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

    // The game page will create the room, we just show the popup here
    showGameIdPopup(gameId, playerSymbol);
}

function joinGame() {
    const gameId = document.getElementById("gameIdInput").value.toUpperCase();
    if (!gameId) { alert("Please enter a Game ID."); return; }
    
    // Check if room is full before joining
    const gameRef = database.ref('games/' + gameId);
    gameRef.once('value', (snapshot) => {
        if (!snapshot.exists()) {
            alert("Game not found! Please check the code.");
            return;
        }
        
        const game = snapshot.val();
        const roomIsFull = game.players && game.players.X && game.players.O;
        
        if (roomIsFull) {
            alert("Room is full! Only 2 players allowed. Please try a different room.");
            return;
        }
        
        // Room has space, allow joining as Player O
        window.location.href = `index.html?gameId=${gameId}&player=O`;
    });
}

function spectateGame() {
    const gameId = document.getElementById("gameIdInput").value.toUpperCase();
    if (!gameId) { alert("Please enter a Game ID to spectate."); return; }

    const gameRef = database.ref('games/' + gameId);
    gameRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            window.location.href = `index.html?gameId=${gameId}&player=Spectator`;
        } else {
            alert("Game not found! Please check the code.");
        }
    });
}

function showGameIdPopup(gameId, playerSymbol) {
    const modal = document.getElementById('gameIdModal');
    const gameIdDisplay = document.getElementById('gameIdDisplay');
    const startGameButton = document.getElementById('startGameButton');
    
    gameIdDisplay.innerText = gameId;
    modal.style.display = 'flex';
    
    startGameButton.onclick = () => {
        window.location.href = `index.html?gameId=${gameId}&player=${playerSymbol}`;
    };
}