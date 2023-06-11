import Route from '@ember/routing/route';
import fetch from 'fetch';
import CONSTANTS from '../constants';

export default class GameBoardRoute extends Route {
  model() {
    return fetch(`${CONSTANTS.API_URL}/api/v1/game_boards`, {
      method: 'post',
      credentials: 'include',
    })
      .then(function (response) {
        if (response.status !== 200) {
          console.log(
            'Looks like there was a problem. Status Code: ' + response.status
          );
          return;
        }

        return response.json().then(function (data) {
          return { data };
        });
      })
      .catch(function (err) {
        console.log('Fetch Error :-S', err);
      });
  }
}
