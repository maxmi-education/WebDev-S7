document.getElementById("firstButton").addEventListener("click", () => {
    console.log("This goes to the Console");
    document.getElementById("somePTag").innerHTML = parseInt(document.getElementById("somePTag").innerHTML) + 1;
});


const cardContainer = document.getElementById('cardContainer');
const addBtn = document.getElementById('addCard');
let counter = 1;

addBtn.addEventListener('click', () => {
    //create an empty div. This will be the column from bootstrap.
    const col = document.createElement('div');
    // column takes up 4/12ths of the width of the row. "sm": the row collapses into a stack if window-width is small. Try col-lg-4 instead and change the window width!
    col.className = 'col-sm-4';

    //create another empty div. This will be the card within the column
    const card = document.createElement('div');
    // the card itseld. p-3 creates a padding of size 3, so the content of the card is 3 away from the border of the card
    card.className = 'card p-3';
    // dataset can be used to store additional data within html elements, that is not shown directly to the user. Look for "data-cardID=""" in your browser console!
    card.dataset.cardId = counter; 
    // the stuff that goes inside the card
    card.innerHTML = `
        <h5>Card #${counter}</h5>
        <p>This is a dynamic card.</p>
        <button class="btn btn-danger deleteBtn">Delete</button>
    `;

    // building the hierarchy of html
    col.appendChild(card);
    cardContainer.appendChild(col);

    // each card gets a unique number
    counter = counter + 1;
});