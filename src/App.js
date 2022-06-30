import Login from './pages/auth/login';
import Home from './pages/home';
import Client from './components/addClient/client'
import Candidate from './components/addCandidate/candidate'
import History from './pages/history/history';
import Header from './components/header'
import ViewClient from './pages/viewClient/viewClient';
import ViewCandidate from './pages/viewCandidate/viewCandidate';
import { Route, Router, Switch } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import history from './history'
import TimeSheetComp from "./components/addTimeSheet/TimeSheetComp";
import ViewTimeSheet from "./components/viewTimesheet";
import ScheduleInvoice from './components/scheduleInvoice/ScheduleInvoice';


function App() {
  return (
    <Router history={history}>
      <Header />
      <Switch>
        <Route path="/" component={Login} exact />
        <ProtectedRoute path="/home" component={Home} exact />
        <ProtectedRoute path="/client" key="add-client" component={Client} exact />
        <ProtectedRoute path="/client/:id" key="edit-client" component={Client} exact />
        <ProtectedRoute path="/candidate" key="add-candidate" component={Candidate} exact />
        <ProtectedRoute path="/candidate/:id" key="edit-candidate" component={Candidate} exact />
        <ProtectedRoute path="/timesheet" component={TimeSheetComp} exact />
        <ProtectedRoute path="/view-timesheet" component={ViewTimeSheet} exact />
        <ProtectedRoute path="/history" component={History} exact />
        <ProtectedRoute path="/view-client"  component={ViewClient} exact />
        <ProtectedRoute path="/view-candidate" component={ViewCandidate} exact />
        <ProtectedRoute path="/schedule-invoice"  component={ScheduleInvoice} exact />
      </Switch>
    </Router>
  );
}

export default App;
