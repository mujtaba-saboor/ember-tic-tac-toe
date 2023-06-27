import Route from '@ember/routing/route';
import fetch from 'fetch';
import CONSTANTS from '../constants';

export default class GameBoardRoute extends Route {
  async model() {
    let response = await fetch(`${CONSTANTS.API_URL}/api/v1/game_boards`, {
      method: 'post',
      credentials: 'include',
    });
    let data = await response.json();
    return { data };
  }
}
