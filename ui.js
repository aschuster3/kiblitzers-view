// TODO - add interface in chrome extension to start the game

function trackPlayArea() {
  // Setup for the move list
  let main = document.getElementsByTagName('main')[0];

  clearMetaOfSpoilers();
  trackMoveChanges();

  const obs = new MutationObserver((mutationsList, _observer) => {
    for(const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((element) => {
          if (element.classList === undefined) return;
          if (element.classList.contains('areplay')) trackMoveChanges();
          return;
        })
      }
    }
  });
  obs.observe(main, { childList: true, subtree: true });

  // Setup for the game meta data
  // TODO: remove my profile name

  // TODO: stretch goal, try moving the move times to better location?
}

function clearMetaOfSpoilers() {
  let metaCard = document.getElementsByClassName('game__meta')[0];

  metaCard.getElementsByClassName('status')[0].innerText = 'Results? In this economy?';
  metaCard.getElementsByTagName('time')[0].style = 'visibility: hidden;';

  playersCard = metaCard.getElementsByClassName('game__meta__players')[0];
  no_change = playersCard.getElementsByTagName('span');
  increase_ranking = playersCard.getElementsByTagName('good');
  decrease_ranking = playersCard.getElementsByTagName('bad');

  [no_change, increase_ranking, decrease_ranking].forEach(score_results => {
    Array.prototype.forEach.call(score_results, (element) => {
      element.style = 'visibility: hidden;';
    })
  });

  let replayBoard = document.getElementsByClassName('areplay')[0];
  let resultEntry = replayBoard.getElementsByClassName('result')[0];
  let statusEntry = replayBoard.getElementsByClassName('status')[0];
  resultEntry.style = "display: none;"
  statusEntry.style = "display: none;"
}

function trackMoveChanges() {
  let moves = document.getElementsByTagName('move');

  Array.prototype.forEach.call(moves, (element) => {
    const obs = new MutationObserver((mutationsList, _observer) => {
      for(const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class')
          revealPlayedMoves();
      }
    })
    obs.observe(element, { attributes: true });
  });
  revealPlayedMoves();
}

function revealPlayedMoves() {
  const MOVE_PADDING = 30;

  let moves = document.getElementsByTagName('move');
  let activeVisible = false, activeSeen = false;

  // Check if the active element is available at all
  Array.prototype.forEach.call(moves, (element) => {
    if (element.classList.contains('active')) {
      activeVisible = true;
      return;
    }
  });

  // Pad out moves
  let movesBoard = document.getElementsByClassName('tview2')[0];
  if(movesBoard.dataset['padded'] === undefined) {
    movesBoard.dataset['padded'] = true;
    let i, count = Math.round(moves.length / 2) + 1, indexNode;
    // If we have an odd number, pad out the last one so everything lines up
    if (moves.length % 2 == 1) { movesBoard.appendChild(document.createElement('move')); }
    for (i = 0; i < MOVE_PADDING; i++) {
      indexNode = document.createElement('index');
      indexNode.innerHTML = `${count}`;
      movesBoard.appendChild(indexNode);
      movesBoard.appendChild(document.createElement('move'));
      movesBoard.appendChild(document.createElement('move'));
      count++;
    }
  }

  Array.prototype.forEach.call(moves, (element) => {
    if (activeSeen || !activeVisible) {
      element.style = "visibility: hidden;";
      // Once the active move has been seen, we don't need to continue
      // checking for it
      return;
    } else {
      element.style = "visibility: visible;";
    }
    activeSeen = element.classList.contains('active');
  });


  let lastMoveMade = moves[moves.length - 1 - (2 * MOVE_PADDING)].classList.contains('active');

  if (lastMoveMade) {
    let metaCard = document.getElementsByClassName('game__meta')[0];
    let replayBoard = document.getElementsByClassName('areplay')[0];

    metaCard.getElementsByClassName('status')[0].innerText = replayBoard.getElementsByClassName('status')[0].innerHTML;
  }
}

console.log("Started");
window.onload = trackPlayArea;