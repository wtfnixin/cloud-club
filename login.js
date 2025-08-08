// --- login.js (with dedicated Spectate Button logic) ---

const firebaseConfig = {
  apiKey: "AIzaSyDftwuUAkK6alqJWRh2YkokVk3G_-TN9i4",
  authDomain: "tic-tac-toe-cloud-41e2b.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-cloud-41e2b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tic-tac-toe-cloud-41e2b",
  storageBucket: "tic-tac-toe-cloud-41e2b.appspot.com",
  messagingSenderId: "267681007927",
  appId: "1:267681007927:web:86cd3bbf5e2498314332b2"
};

// Initialize Firebase for this page to check if a room exists
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.getElementById("createGame").addEventListener("click", createGame);
document.getElementById("joinGame").addEventListener("click", joinGame);
// Add event listener for our new button
document.getElementById("spectateGame").addEventListener("click", spectateGame);

function createGame() {
    const gameId = Math.random().toString(36).substr(2, 5).toUpperCase();
    alert(`Your Game Room Code is: ${gameId}\n\nShare this code with a friend to play!`);
    window.location.href = `index.html?gameId=${gameId}&player=X`;
}

function joinGame() {
    const gameId = document.getElementById("gameIdInput").value.toUpperCase();
    if (!gameId) {
        alert("Please enter a Game ID.");
        return;
    }
    // The game page will handle the logic of joining as Player O
    window.location.href = `index.html?gameId=${gameId}&player=O`;
}

// This new function handles the spectate button click
function spectateGame() {
    const gameId = document.getElementById("gameIdInput").value.toUpperCase();
    if (!gameId) {
        alert("Please enter a Game ID to spectate.");
        return;
    }

    // Check Firebase to make sure the game room exists before redirecting
    const gameRef = database.ref('games/' + gameId);
    gameRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            // The room exists, so we can redirect as a spectator
            window.location.href = `index.html?gameId=${gameId}&player=Spectator`;
        } else {
            // The room does not exist
            alert("Game not found! Please check the code.");
        }
    });
}