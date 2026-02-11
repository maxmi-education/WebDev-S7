function loadHighScores() {
    let table = document.getElementById("highscoreTableBody");
    fetch("/api/get_high_scores?number=5", {
        method: "GET",
        /*headers: {
            'Content-Type': 'application/json',
        },
        /*body: JSON.stringify({
            number: 5
        }),*/
    })
    .then((response) => {return response.text();})
    .then((response) => {
        let values = JSON.parse(response);
        values.forEach(element => {
            let row = document.createElement('tr');
            let score = document.createElement('td');
            score.innerText = element.score;
            let name = document.createElement('td');
            name.innerText = element.first_name;
            row.appendChild(score);
            row.appendChild(name);
            table.appendChild(row);
        });
    })
}

function loadHighScoresConcat() {
    let table = document.getElementById("highscoreTableBody");
    fetch("/api/get_high_scores?number=5", {
        method: "GET",
        /*headers: {
            'Content-Type': 'application/json',
        },
        /*body: JSON.stringify({
            number: 5
        }),*/
    })
    .then((response) => {return response.text();})
    .then((response) => {
        let values = JSON.parse(response);
        values.forEach(value => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${value.score}</td>
                <td>${value.first_name}</td>
                <td>${value.last_name}</td>
            `;
            table.appendChild(row);
        });
    })
}

loadHighScoresConcat();