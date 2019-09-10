import { all } from "redux-saga/effects";
import startStopChannel from "./tasks";

export default function* rootSaga() {
  yield all([startStopChannel()]);
}
