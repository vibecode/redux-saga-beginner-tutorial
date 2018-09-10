import { delay } from 'redux-saga'
import { call, put, take, takeLatest } from 'redux-saga/effects'

//To retry a XHR call for a specific amount of times, use a for loop with a delay:

function* updateAPI(data) {
  for (let i = 0; i < 5; i++) {
    try {
      return yield call(apiRequest, { data })
    } catch(err) {
      if (i < 4) {
        yield call(delay, 2000)
      }
    }
  }

  // attempts failed after 5 attempts
  throw new Error('API request failed');
}

//endless
export default function* updateResource() {
  while (true) {
    const { data } = yield take('UPDATE_START');
    try {
      const apiResponse = yield call(updateApi, data);
      yield put({
        type: 'UPDATE_SUCCESS',
        payload: apiResponse.body,
      });
    } catch (error) {
      yield put({
        type: 'UPDATE_ERROR',
        error
      });
    }
  }
}

//If you want unlimited retries, then the for loop can be replaced with a while (true). Also instead of take you can use takeLatest, so only the last request will be retried. By adding an UPDATE_RETRY action in the error handling, we can inform the user that the update was not successfull but it will be retried.

import { delay } from 'redux-saga'

function* updateApi(data) {
  while (true) {
    try {
      const apiResponse = yield call(apiRequest, { data });
      return apiResponse;
    } catch(error) {
      yield put({
        type: 'UPDATE_RETRY',
        error
      })
      yield call(delay, 2000);
    }
  }
}

function* updateResource({ data }) {
  const apiResponse = yield call(updateApi, data);
  yield put({
    type: 'UPDATE_SUCCESS',
    payload: apiResponse.body,
  });
}

export function* watchUpdateResource() {
  yield takeLatest('UPDATE_START', updateResource);
}

function apiRequest() {
  return fetch('www.example.com/data.json')
}