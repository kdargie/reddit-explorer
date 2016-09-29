// @flow
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Ship from 'redux-ship';
import * as Effect from './effect';
import Index from './index/view';
import * as Controller from './index/controller';
import store from './store';

function padTwoDigits(n: number): string {
  return n < 10 ? '0' + String(n) : String(n);
}

function isoLocaleTimeString(date: Date): string {
  return padTwoDigits(date.getHours()) + ':' +
    padTwoDigits(date.getMinutes()) + ':' +
    padTwoDigits(date.getSeconds()) + '.' +
    (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5);
}

function snapshotShape<Effect, Action, State>(
  snapshot: Ship.Snapshot<Effect, Action, State>
): string[] {
  return snapshot.map((snapshotItem) => snapshotItem.type);
}

function* controller(action: Controller.Action) {
  const {snapshot} = yield* Ship.snapshot(Controller.controller(action));
  const now = new Date();
  console.group('ship', '@', isoLocaleTimeString(now), action.type);
  console.log('action', action);
  console.log('shape', ...snapshotShape(snapshot));
  console.log('snapshot', snapshot);
  console.groupEnd();
}

function handle(action: Controller.Action): void {
  Ship.run(Effect.run, store.dispatch, store.getState, controller(action));
}

function render() {
  ReactDOM.render(
    <Index
      handle={handle}
      state={store.getState()}
    />,
    document.getElementById('root'),
  );
}

store.subscribe(render);
render();

handle({
  type: 'Load',
});

import './route';
