import { module, test } from 'qunit';

import { setupTest } from 'ember-tic-tac-toe/tests/helpers';

module('Unit | Model | game board', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('game-board', {});
    assert.ok(model);
  });
});
