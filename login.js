// --- login.js (Final Corrected Version) ---

document.getElementById("createGame").addEventListener("click", createGame);
document.getElementById("joinGame").addEventListener("click", joinGame);

function createGame() {
    // 1. Just generate a code for the URL
    const gameId = Math.random().toString(36).substr(2, 5).toUpperCase();
    alert(`Your Game Room Code is: ${gameId}\n\nShare this code with a friend to play!`);

    // 2. Redirect. The game page will now handle creating the room in Firebase.
    window.location.href = `index.html?gameId=${gameId}&player=X`;
}

function joinGame() {
    const gameId = document.getElementById("gameIdInput").value.toUpperCase();
    if (!gameId) {
        alert("Please enter a Game ID.");
        return;
    }
    // Redirect. The game page will handle joining.
    window.location.href = `index.html?gameId=${gameId}&player=O`;
}