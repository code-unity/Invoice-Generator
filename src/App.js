import Login from './pages/auth/login';
import Home from './pages/home';
import Client from './pages/addclient/addClient'
import History  from './pages/history/history';
import Header from './components/header'
import {Route,Router,Switch } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import history from './history'

function App() {
  return (
    <Router history={history}>
        <Header/>
        <Switch>
        <Route path="/" component={Login} exact />
        <ProtectedRoute path="/home" component={Home} exact />
        <ProtectedRoute path="/client" component={Client}  exact/>
        <ProtectedRoute path="/history" component={History} exact />
        </Switch>
    </Router>
  );
}

export default App;
