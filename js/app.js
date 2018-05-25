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
    // Register event listener
    ul.addEventListener('click', clickHandler);
    // Append it to the container div
    const container = document.querySelector('div.container');
    container.appendChild(ul);
}

const clock = (function() {
    // Private members
    let elapsedTime;
    let interval;
    const container = document.querySelector('.timer');

    function render() {
        container.textContent = elapsedTime;
    }

    function intervalCallback() {
        ++elapsedTime;
        render();
    }

    function _clearInterval() {
        if (interval) {
            clearInterval(interval);
            interval = undefined;
        }
    }

    return {
        start() {
            _clearInterval();
            elapsedTime = 0;
            render();
            interval = setInterval(intervalCallback, 1000);
        },
        stop() {
            _clearInterval();
        },
        getElapsedTime() {
            return elapsedTime;
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

    // Get the classes of the open cards - to use for matching
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

    // Display a modal if all cards have matched
    if (document.querySelectorAll('.card.match').length === 16) {
        // Stop the clock
        clock.stop();
        // Set contents of the dialog
        document.querySelector('.modal .total-time').textContent = clock.getElapsedTime();
        document.querySelector('.modal .stars').textContent = stars.get();
        // Show
        setTimeout(() => document.querySelector('.modal').showModal(), 200);
    }
}

function reset() {
    // Remove the deck if it is already there
    const deck = document.querySelector('.deck');
    if (deck) {
        deck.remove();
    }
    // Create the deck
    createDeck();
    // Reset the moves counter
    moves.reset();
    // Reset the clock
    clock.start();
}

function main() {
    reset();
    // Restart button
    document.querySelector('.restart').addEventListener('click', reset);
    const modal = document.querySelector('.modal');
    // Yes button in the modal dialog
    document.querySelector('.modal-buttons .yes-button').addEventListener('click', () => {
        modal.close();
        reset();
    });
    // No button in the modal dialog
    document.querySelector('.modal-buttons .no-button').addEventListener('click', () => modal.close());
}

// Start
main();
