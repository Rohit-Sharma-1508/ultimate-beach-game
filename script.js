 const bucket = document.getElementById("bucket");
const gameArea = document.getElementById("gameArea");

const scoreText = document.getElementById("scoreText");
const timerText = document.getElementById("timerText");
const levelText = document.getElementById("levelText");

const bgMusic = document.getElementById("bgMusic");
const catchSound = document.getElementById("catchSound");
const missSound = document.getElementById("missSound");
const explosionSound = document.getElementById("explosionSound");

let score = 0;
let timeLeft = 60;
let level = 1;
let bucketPos = 50;
let gameRunning = false;

/* ========= MENU LOGIC ========= */

const menuScreen = document.getElementById("menuScreen");
const howScreen = document.getElementById("howScreen");
const gameUI = document.getElementById("gameUI");

document.getElementById("howBtn").onclick = () => {
    menuScreen.classList.add("hidden");
    howScreen.classList.remove("hidden");
};

document.getElementById("backBtn").onclick = () => {
    howScreen.classList.add("hidden");
    menuScreen.classList.remove("hidden");
};

// Skin choosing
document.querySelectorAll(".skin").forEach(s => {
    s.onclick = () => {
        bucket.textContent = s.dataset.skin;
    };
});

// Start game
document.getElementById("startGameBtn").onclick = () => {
    menuScreen.classList.add("hidden");
    gameUI.classList.remove("hidden");

    startGame();
};

/* ========= GAME LOGIC ========= */

function startGame() {
    gameRunning = true;
    bgMusic.play();
    startTimer();
    spawnLoop();
    levelLoop();
}

function startTimer() {
    const timerInterval = setInterval(() => {
        if (!gameRunning) return;
        timeLeft--;
        timerText.textContent = "Time: " + timeLeft;

        if (timeLeft <= 0) {
            gameOver("⏱️ Time’s Up!");
            clearInterval(timerInterval);
        }
    }, 1000);
}

function levelLoop() {
    setInterval(() => {
        if (!gameRunning) return;
        level++;
        levelText.textContent = "Level: " + level;
    }, 20000);
}

function spawnLoop() {
    setInterval(() => {
        if (!gameRunning) return;
        spawnItem();
    }, Math.max(600, 1200 - level * 90));
}

const itemTypes = [
    { emoji: "🐚", value: +1 },
    { emoji: "⭐", value: +3 },
    { emoji: "🦀", value: -2 },
    { emoji: "💣", value: "bomb" }
];

function spawnItem() {
    const i = document.createElement("div");
    i.classList.add("item");

    const t = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    i.textContent = t.emoji;
    i.dataset.value = t.value;

    i.style.left = Math.random() * 90 + "%";

    // FIXED — proper template literal
    i.style.animation = `fall ${Math.max(1.5, 3 - level * 0.1)}s linear`;

    gameArea.appendChild(i);

    let check = setInterval(() => {
        const r = i.getBoundingClientRect();
        const b = bucket.getBoundingClientRect();

        // Collision check
        if (
            r.bottom >= b.top &&
            r.left <= b.right &&
            r.right >= b.left
        ) {
            handleCatch(t, i);
            clearInterval(check);
        }

        // Missed item
        if (r.top > gameArea.getBoundingClientRect().bottom) {
            missSound.play();
            i.remove();
            clearInterval(check);
        }
    }, 40);
}

function handleCatch(type, item) {
    if (type.value === "bomb") {
        explosionSound.play();
        gameOver("💣 You caught a bomb!");
        return;
    }

    score += type.value;
    scoreText.textContent = "Score: " + score;
    catchSound.play();
    item.remove();
}

function gameOver(message) {
    gameRunning = false;
    bgMusic.pause();

    // FIXED — template literal
    alert(`${message}\nFinal Score: ${score}`);
    location.reload();
}

/* ========= CONTROLS ========= */

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && bucketPos > 0) bucketPos -= 5;
    if (e.key === "ArrowRight" && bucketPos < 95) bucketPos += 5;

    bucket.style.left = bucketPos + "%";
});

document.getElementById("leftBtn").onclick = () => {
    if (bucketPos > 0) bucketPos -= 5;
    bucket.style.left = bucketPos + "%";
};

document.getElementById("rightBtn").onclick = () => {
    if (bucketPos < 95) bucketPos += 5;
    bucket.style.left = bucketPos + "%";
};

document.getElementById("restartBtn").onclick = () => {
    location.reload();
};
