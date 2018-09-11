import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import createStore from './src/state/createStore';

exports.replaceRouterComponent = ({ history }) => {
  const store = createStore();

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./src/reducers', () => {
      const nextRootReducer = require('./src/reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  const ConnectedRouterWrapper = ({ children }) => (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  );

  return ConnectedRouterWrapper;
};
