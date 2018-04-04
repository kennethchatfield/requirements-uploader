import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Upload from './upload/Upload'
import Metrics from './databaseMetrics/DatabaseMetrics'
import Mutate from './mutate/Mutate'


export default () => {
  return (
    <Switch>
      <Route exact path="/" render={() => ( <Redirect to="/mutate" /> ) } />
      <Route path="/upload" component={ Upload } />
      <Route path="/metrics" component={ Metrics } />
      <Route path="/mutate" component={ Mutate } />
    </Switch>
  )
}
