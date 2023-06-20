import { module, test } from 'qunit';
import { setupTest } from 'ember-tic-tac-toe/tests/helpers';

module('Unit | Route | game-board', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:game-board');
    assert.ok(route);
  });
});
