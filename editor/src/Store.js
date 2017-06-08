import { createStore, combineReducers, applyMiddleware } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { routerReducer, routerMiddleware } from 'react-router-redux'

import MapReducer from './reducers/MapReducer';

export const history = createHistory()
const middleware = routerMiddleware(history)

const store = createStore(
  combineReducers({
   	map : MapReducer,
    router: routerReducer
  }),
  applyMiddleware(middleware)
)

export default store;