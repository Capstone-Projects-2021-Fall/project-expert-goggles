import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Welcome from './pages/Welcome/Welcome';
import Settings from './pages/Settings/Settings';
import HistoryofViews from './pages/HistoryofViews/HistoryofViews';
import Download from './pages/Download/Download';
import AvailableGuides from './AvailableGuides';
import Navbar from './Components/Navbar/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar/>
      <main>
        <Switch>
          <Route path = "/" exact>
            <Welcome/>
          </Route>
          <Route path = "/Download" exact>
            <Download/>
          </Route>
          <Route path = "/Settings" exact>
            <Settings/>
          </Route>
          <Route path = "/HistoryofViews" exact>
            <HistoryofViews/>
          </Route>
          <Route path = "/AvailableGuides" exact>
            <AvailableGuides/>
          </Route>
          <Redirect to ="/" />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
