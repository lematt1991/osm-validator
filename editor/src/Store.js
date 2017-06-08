import { createStore, combineReducers, applyMiddleware } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { routerReducer, routerMiddleware } from 'react-router-redux'

export const history = createHistory()
const middleware = routerMiddleware(history)

const reducers = (state = {}, action) => {
	return state;
}

const store = createStore(
  combineReducers({
   	reducers,
    router: routerReducer
  }),
  applyMiddleware(middleware)
)

export default store;