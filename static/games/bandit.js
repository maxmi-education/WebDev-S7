const price = 10;
const signs = ["😄", "👮", "💌"]; //, "📯", "🕸", "❗️", "😏", "♣️"];

document.getElementById("spinButton").addEventListener("click", () => {
    let coins = document.getElementById("coins").dataset.coins;
    coins = parseInt(coins);
    if (coins >= 10) {
        coins -= price;
        document.getElementById("coins").dataset.coins = coins;
        document.getElementById("coins").innerHTML = "Coins: " + coins;

        let currentSigns = [];
        for (i = 1; i < 4; i++) {
            const sign = signs[Math.floor(Math.random() * signs.length)];
            document.getElementById("spin" + i).innerHTML = sign;
            currentSigns.push(sign);
        }

        if (currentSigns[0] == currentSigns[1] && currentSigns[1] == currentSigns[2]) {
            alert("winner");
            coins += 600;
            document.getElementById("coins").dataset.coins = coins;
            document.getElementById("coins").innerHTML = "Coins: " + coins;
        }
    }
    else {
        alert("Get more coins!");
    }
})