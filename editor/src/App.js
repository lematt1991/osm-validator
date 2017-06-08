import React, { Component } from 'react';
import store, {history} from './Store'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import Home from './pages/Home'
import { Route } from 'react-router'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Route exact path="/" component={Home}/>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
