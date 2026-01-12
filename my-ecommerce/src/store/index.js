import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk"; // Note: might be 'redux-thunk' or just 'thunk' depending on version
import rootReducer from "../reducers";

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;