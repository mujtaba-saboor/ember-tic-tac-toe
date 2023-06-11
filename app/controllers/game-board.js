import Controller from '@ember/controller';
import { action } from '@ember/object';
import CONSTANTS from '../constants';

export default class GameBoardController extends Controller {
  turnData = [];
  tiles = [];
  @action
  async handleClick() {
    const currentEvent = event.target;
    const prevThis = this;
    var tiles = this.tiles;
    var turnData = this.turnData;
    var prevTurnData = turnData.at(-1);
    var snd = new Audio('/assets/music/mixkit-arcade-game-jump-coin-216.wav');
    snd.play();
    if (
      !this.model.data.current_game_board.completed &&
      (!prevTurnData || (!prevTurnData.winner && !prevTurnData.tie))
    ) {
      var currentTurn = prevTurnData ? prevTurnData.next_turn : 'o';
      fetch(
        `${CONSTANTS.API_URL}/api/v1/game_boards/${this.model.data.current_game_board.id}/turns`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          body: `tile_position=${event.target.id}&tile_type=${currentTurn}`,
          credentials: 'include',
        }
      )
        .then(function (response) {
          if (response.status === 200) {
            response.json().then(function (data) {
              currentEvent.firstChild.classList.add(
                data.prev_turn.toLowerCase()
              );
              tiles.push(currentEvent);
              turnData.push(data);
              if (data.winner) {
                prevThis.set('oCount', data.winner_count.O);
                prevThis.set('xCount', data.winner_count.X);
                var moveSound = new Audio(
                  '/assets/music/mixkit-fantasy-game-success-notification-270.wav'
                );
                moveSound.play();
                tiles.forEach((tile) => {
                  if (data.winner_tiles.includes(Number(tile.id))) {
                    tile.firstChild.classList.add('shaker');
                  }
                  if (data.winner_tiles.includes(Number(tile.id))) {
                    setTimeout(function () {
                      tile.firstChild.classList.remove('shaker');
                    }, 3000);
                  }
                });
              } else if (data.tie) {
                prevThis.set('tieCount', data.winner_count.tie);
                var tieSound = new Audio(
                  '/assets/music/mixkit-funny-fail-low-tone-2876.wav'
                );
                tieSound.play();
                setTimeout(function () {
                  alert('It is a Draw');
                }, 500);
              }
            });
          }
        })
        .catch(function (err) {
          console.log('Fetch Error :-S', err);
        });
    } else {
      this.send('handleReset');
    }
  }

  @action
  async handleReset() {
    let response = await fetch(
      `${CONSTANTS.API_URL}/api/v1/game_boards/${this.model.data.current_game_board.id}/reset`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );
    await response.json();
    this.model.data.current_game_board.completed = false;
    this.turnData = [];
    this.tiles.forEach((tile) => {
      tile.firstChild.classList.remove('x');
      tile.firstChild.classList.remove('o');
    });
  }
}
