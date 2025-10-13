document.getElementById("firstButton").addEventListener("click", () => {
    console.log("This goes to the Console");
    document.getElementById("somePTag").innerHTML = parseInt(document.getElementById("somePTag").innerHTML) + 1;
});


const cardContainer = document.getElementById('cardContainer');
const addBtn = document.getElementById('addCard');
let counter = 1;

addBtn.addEventListener('click', () => {
    if (document.getElementById("textInput").value == "") {
        alert("please enter text");
        return;
    }

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
        <p>${document.getElementById("textInput").value}</p>
        <div class="row"> 
            <div class="col-6">
                <button class="btn btn-danger deleteBtn">Delete</button> 
            </div>
            <div class="col-6">
                <button class="btn btn-outline-primary likeBtn" data-likes="0">❤️ 0</button>
            </div>
        </div>
    `;

    // building the hierarchy of html
    col.appendChild(card);
    cardContainer.appendChild(col);

    document.getElementById("textInput").value = "";

    // each card gets a unique number
    counter = counter + 1;
});

// we attach the event listener to the entire document, instead of only a single element.
// also note that there is something in the parentheses. This is an argument for the listener function
document.addEventListener('click', (event) => {
    //The event.target is the clicked element
    if (event.target.classList.contains('deleteBtn')) {
        //.closest starts at the given element, and then travels to the root (<body>) of the document while looking for the specified selector (class="card"). 
        //It either returns the first element it finds, or null, if it finds nothing. Check the screen shot to see the search direction of "closest" for each button.
        const card = event.target.closest('.card');
        // using dataset to get the id back
        console.log('Deleting card with ID:', card.dataset.cardId);
        //remember, our card sits inside a <div class="col-sm-4">, which is the parent of the card. We remove that div here.
        card.parentElement.remove();
    }

    if (event.target.classList.contains('likeBtn')) {
        let likes = parseInt(event.target.dataset.likes);
        likes = likes + 1;
        event.target.dataset.likes = likes;
        event.target.innerHTML = `❤️ ${likes}`;
    }
});