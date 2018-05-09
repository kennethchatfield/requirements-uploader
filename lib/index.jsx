import React from 'react';
import { render } from 'react-dom';
import './styles/styles.css';
import { HashRouter, Route } from 'react-router-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

const store = configureStore(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

render(
  <Provider store={ store }>
    <HashRouter>
      <Route path="/" component={ App }/>
    </HashRouter>
  </Provider>,
    document.getElementById('root')
);
