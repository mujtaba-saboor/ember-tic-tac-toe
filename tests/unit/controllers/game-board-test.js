import { module, test } from 'qunit';
import { setupTest } from 'ember-tic-tac-toe/tests/helpers';

module('Unit | Controller | game-board', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:game-board');
    assert.ok(controller);
  });
});
