import { applyMiddleware } from 'redux';
import { createRoutes } from 'react-router/lib/RouteUtils';
import { useRouterHistory } from 'react-router';
import createTransitionManager from 'react-router/lib/createTransitionManager' ;
import historyMiddleware from './historyMiddleware';
import { ROUTER_STATE_SELECTOR } from './constants';

export default function reduxReactRouter({
  routes,
  createHistory,
  parseQueryString,
  stringifyQuery,
  routerStateSelector
}) {
  return createStore => (reducer, initialState) => {

    let baseCreateHistory;
    if (typeof createHistory === 'function') {
      baseCreateHistory = createHistory;
    } else if (createHistory) {
      baseCreateHistory = () => createHistory;
    }

    const createAppHistory = useRouterHistory(baseCreateHistory);

    const history = createAppHistory({
      parseQueryString,
      stringifyQuery,
    });

    const transitionManager = createTransitionManager(
        history, createRoutes(routes)
    );

    const store =
      applyMiddleware(
        historyMiddleware(history)
      )(createStore)(reducer, initialState);

    store.transitionManager = transitionManager;
    store.history = history;
    store[ROUTER_STATE_SELECTOR] = routerStateSelector;

    return store;
  };
}
