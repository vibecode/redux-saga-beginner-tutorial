import { delay } from 'redux-saga'
import { call, cancel, fork, take, takeLatest } from 'redux-saga/effects'

function* handleInput(input) {
  //debounce by 500ms
  yield call(delay, 500)

  //...
}

function* watchInput() {
  let task
  while (true) {
    const { input } = yield take('INPUT_CHANGED')

    if(task) {
      yield cancel(task)
    }

    task = yield fork(handleInput, input)
  }
}

//Example above could be rewritten with redux-saga takeLatest helper

function* _watchInput() {
  // will cancel current running handleInput task
  yield takeLatest('INPUT_CHANGED', handleInput);
}