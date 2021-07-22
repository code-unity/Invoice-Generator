import Login from './pages/auth/login';
import Home from './pages/home';
import Client from './pages/addclient/addClient'
import History  from './pages/history/history';
import SideNav from './components/sideNav'
import {Route,Router } from 'react-router-dom';
import history from './history'

function App() {
  return (
    <Router history={history}>
        <SideNav/>
        <switch>
        <Route path="/" component={Login} exact></Route>
        <Route path="/home" component={Home} exact></Route>
        <Route path="/client" component={Client} exact></Route>
        <Route path="/history" component={History} exact></Route>
        </switch>
    </Router>
  );
}

export default App;
