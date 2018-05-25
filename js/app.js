// Types of cards
const cardTypes = ['fa-anchor', 'fa-bicycle', 'fa-bolt', 'fa-bomb', 'fa-cube', 'fa-diamond', 'fa-leaf', 'fa-paper-plane-o'];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Create the li element for each card and
// append it to the parent element
function createCard(type, parentElement) {
    const li = document.createElement('li');
    li.classList.add('card');
    const childEl = document.createElement('i');
    childEl.classList.add('fa', type);
    li.appendChild(childEl);
    parentElement.appendChild(li);
}

// Create the deck of cards
function createDeck() {
    // Create the ul element and add 'deck' class
    const ul = document.createElement('ul');
    ul.classList.add('deck');

    // Prep a fresh flat list of cards (shuffled and duplicated)
    const cards = shuffle([...cardTypes, ...cardTypes]);

    // Add a li element for each card under the ul element
    cards.forEach(c => createCard(c, ul));

    // Append it to the container div
    const container = document.querySelector('div.container');
    container.appendChild(ul);

    return ul;
}

const clock = (function() {
    // Private members
    const startTime = performance.now();
    let endTime;

    return {
        stop() {
            endTime = performance.now();
        },
        getElapsedTime() {
            return ((endTime - startTime)/1000).toFixed(0);
        }
    };
})();


const stars = (function() {
    // Private members
    let stars = 3;
    const TWO_STAR_THRESHOLD = 50;
    const ONE_STAR_THRESHOLD = 100;
    const container = document.querySelector('.stars');

    function render() {
        // Remove all children of the ul element
        while (container.lastChild) {
            container.lastChild.remove();
        }

        // Add as many stars as needed
        for (let i = 0; i < stars; ++i) {
            const li = document.createElement('li');
            const star = document.createElement('i');
            star.classList.add('fa', 'fa-star');
            li.appendChild(star);
            container.appendChild(li);
        }
    }

    return {
        update(moves) {
            if (moves >= ONE_STAR_THRESHOLD) {
                stars = 1;
            } else if (moves >= TWO_STAR_THRESHOLD) {
                stars = 2;
            } else {
                stars = 3;
            }
            render();
        },
        get() {
            return stars;
        }
    };
})();

const moves = (function() {
    // Private members
    let moves = 0;
    const container = document.querySelector('.moves');

    function render() {
        container.textContent = moves;
    }

    function update() {
        stars.update(moves);
        render();
    }

    return {
        increment() {
            ++moves;
            update();
        },
        reset() {
            moves = 0;
            update();
        },
        get() {
            return moves;
        }
    };
})();

// Click handler
let clickHandlerDisabled = false;
function clickHandler(e) {
    // Return early if click handler is disabled
    if (clickHandlerDisabled) {
        return;
    }
    // Get the target element
    const c = e.target;
    // Return early if this click is not on a card
    if (c.nodeName !== 'LI') {
        return;
    }
    // Return early if this card is already matched
    if (c.classList.contains('match')) {
        return;
    }
    // Return early if this cars if already opened
    if (c.classList.contains('show')) {
        return;
    }
    // Increment moves
    moves.increment();
    // Open this card
    c.classList.add('open', 'show');
    // Get all open cards
    const openCards = document.querySelectorAll('.card.open.show');
    // Return early if this is the only open card
    if (openCards.length !== 2) {
        return;
    }
    // Get the classes of the open card - to use for matching
    const openCardClassLists = [];
    for (const c of openCards) {
        openCardClassLists.push(c.firstElementChild.classList);
    }
    // Mark the cards as matched if they are the same
    if (openCardClassLists[0].value == openCardClassLists[1].value) {
        openCards.forEach(e => e.classList.add('match'));
        openCards.forEach(e => e.classList.remove('open', 'show'));
    } else {
        // Disable the click handler until we remove the open and show classes
        clickHandlerDisabled = true;
        setTimeout(() => {
            clickHandlerDisabled = false;
            openCards.forEach(e => e.classList.remove('open', 'show'));
        }, 750);
    }
    // Display a message if all cards have matched
    if (document.querySelectorAll('.card.match').length === 16) {
        clock.stop();
        const msg = `Congratulations you have matched all cards in ${clock.getElapsedTime()} seconds and you won ${stars.get()} stars!`;
        setTimeout(() => alert(msg), 100);
    }
}

function main() {
    // Create the deck
    const deck = createDeck();
    // Reset the moves counter
    moves.reset();
    deck.addEventListener('click', clickHandler);
}

main();


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
