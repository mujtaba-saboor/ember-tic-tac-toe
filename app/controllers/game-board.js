import Controller from '@ember/controller';
import { action } from '@ember/object';
import CONSTANTS from '../constants';

export default class GameBoardController extends Controller {
  currrentTurnResponse = [];
  boardTiles = [];
  @action
  async handleClick() {
    const currentClickEvent = event.target;
    const oldSelf = this;

    var boardTiles = this.boardTiles;
    var currrentTurnResponse = this.currrentTurnResponse;
    var previousTurnResponse = currrentTurnResponse.at(-1);

    var snd = new Audio('/assets/music/mixkit-arcade-game-jump-coin-216.wav');
    snd.play();

    if (
      !this.model.data.game_board.completed &&
      (!previousTurnResponse ||
        (!previousTurnResponse.turn.winner && !previousTurnResponse.turn.tie))
    ) {
      var currentTurn = previousTurnResponse
        ? previousTurnResponse.turn.next_turn
        : 'o';
      let response = await fetch(
        `${CONSTANTS.API_URL}/api/v1/game_boards/${this.model.data.game_board.id}/turns`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          body: `tile_position=${event.target.id}&tile_type=${currentTurn}`,
          credentials: 'include',
        }
      );
      let data = await response.json();
      handleTurnResponse(
        data,
        currentClickEvent,
        oldSelf,
        boardTiles,
        currrentTurnResponse
      );
    } else {
      this.send('handleReset');
    }
  }

  @action
  async handleReset() {
    let response = await fetch(
      `${CONSTANTS.API_URL}/api/v1/game_boards/${this.model.data.game_board.id}/reset`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );
    await response.json();
    this.model.data.game_board.completed = false;
    this.currrentTurnResponse = [];
    this.boardTiles.forEach((tile) => {
      tile.firstChild.classList.remove('x');
      tile.firstChild.classList.remove('o');
    });
  }
}

function handleTurnResponse(
  data,
  currentClickEvent,
  oldSelf,
  boardTiles,
  currrentTurnResponse
) {
  currentClickEvent.firstChild.classList.add(data.turn.prev_turn.toLowerCase());
  boardTiles.push(currentClickEvent);
  currrentTurnResponse.push(data);
  if (data.turn.winner) {
    handleWinner(data, boardTiles, oldSelf);
  } else if (data.turn.tie) {
    handleTie(data, oldSelf);
  }
}

function handleWinner(data, boardTiles, oldSelf) {
  oldSelf.set('oCount', data.turn.winner_count.O);
  oldSelf.set('xCount', data.turn.winner_count.X);
  var moveSound = new Audio(
    '/assets/music/mixkit-fantasy-game-success-notification-270.wav'
  );
  moveSound.play();
  boardTiles.forEach((tile) => {
    if (data.turn.winner_tiles.includes(Number(tile.id))) {
      tile.firstChild.classList.add('shaker');
    }
    if (data.turn.winner_tiles.includes(Number(tile.id))) {
      setTimeout(function () {
        tile.firstChild.classList.remove('shaker');
      }, 3000);
    }
  });
}

function handleTie(data, oldSelf) {
  oldSelf.set('tieCount', data.turn.winner_count.tie);
  var tieSound = new Audio('/assets/music/mixkit-funny-fail-low-tone-2876.wav');
  tieSound.play();
  setTimeout(function () {
    alert('It is a Draw');
  }, 500);
}
