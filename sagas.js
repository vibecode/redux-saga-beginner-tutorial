import { delay } from 'redux-saga'
import { put, takeEvery, all, call } from 'redux-saga/effects'

export function* helloSaga() {
  console.log('Hello sagas');
}

// Our worker Saga: will perform the async increment task
export function* incrementAsync() {
  yield call(delay, 1000)
  yield put({ type: 'INCREMENT' })
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync)
}

export default function* rootSaga() {
  yield all([
    helloSaga(),
    watchIncrementAsync()
  ])
}

