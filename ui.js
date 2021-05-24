// TODO - finish setting up chrome extension
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
  // TODO: remove the game result from meta and from bottom of the replay board
  // TODO: remove my profile name
  // TODO: unhide things when the game is over

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
  let moves = document.getElementsByTagName('move');
  let activeVisible = false, activeSeen = false;

  // Check if the active element is available at all
  Array.prototype.forEach.call(moves, (element) => {
    if (element.classList.contains('active')) {
      activeVisible = true;
      return;
    }
  });

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

  let lastMoveMade = moves[moves.length - 1].classList.contains('active');
  let replayBoard = document.getElementsByClassName('areplay')[0];
  let resultEntry = replayBoard.getElementsByClassName('result')[0];
  let statusEntry = replayBoard.getElementsByClassName('status')[0];
  if (lastMoveMade) {
    resultEntry.style = "visibility: visible;"
    statusEntry.style = "visibility: visible;"
  } else {
    resultEntry.style = "visibility: hidden;"
    statusEntry.style = "visibility: hidden;"
  }
}

console.log("Started");
window.onload = trackPlayArea;