<<<<<<< HEAD
import Login from './pages/auth/login';
import Home from './pages/home';
import Client from './pages/addEditClient/addEditClient'
import Candidate from './pages/addEditCandidate/addEditCandidate'
import History from './pages/history/history';
import Header from './components/header'
import ViewClient from './pages/viewClient/viewClient';
import ViewCandidate from './pages/viewCandidate/viewCandidate';
import { Route, Router, Switch } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import history from './history'
=======
import Login from "./pages/auth/login";
import Home from "./pages/home";
import Client from "./pages/addEditClient/addEditClient";
import History from "./pages/history/history";
import Header from "./components/header";
import { Route, Router, Switch } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import TimeSheetComp from "./components/addTimeSheet/TimeSheetComp";
import ViewClient from './pages/viewClient/viewClient';
import history from './history';
>>>>>>> c98a254696f3df4cfc9bcddce9d278aba9d1a1bd

function App() {
  return (
    <Router history={history}>
      <Header />
      <Switch>
        <Route path="/" component={Login} exact />
        <ProtectedRoute path="/home" component={Home} exact />
<<<<<<< HEAD
        <ProtectedRoute path="/client" component={Client} exact />
        <ProtectedRoute path="/client/:id" component={Client} exact />
        <ProtectedRoute path="/candidate" component={Candidate} exact />
        <ProtectedRoute path="/candidate/:id" component={Candidate} exact />
=======
        <ProtectedRoute path="/timesheet" component={TimeSheetComp} exact />
        <ProtectedRoute path="/client" component={Client}  exact/>
        <ProtectedRoute path="/client/:id" component={Client} exact/>
>>>>>>> c98a254696f3df4cfc9bcddce9d278aba9d1a1bd
        <ProtectedRoute path="/history" component={History} exact />
        <ProtectedRoute path="/view-client" component={ViewClient} exact />
        <ProtectedRoute path="/view-candidate" component={ViewCandidate} exact />
      </Switch>
    </Router>
  );
}

export default App;
