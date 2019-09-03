import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import React from 'react';
import LoginPage from './pages/login/LoginPage';
import MedicalWorkerPageContainer from "./pages/medical_worker/MedicalWorkerPageContainer";
import DoctorPage from "./pages/doctor/DoctorPage";
import ChargeWorkerPageContainer from "./pages/charge_worker/ChargeWorkerPage";
import PharmacyPage from "./pages/pharmacy/PharmacyPage";

const GlobalRouter = (props) => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={'/'} component={LoginPage}/>
                <Route path={'/login'} component={LoginPage}/>
                <Route path={'/medical_worker'} component={MedicalWorkerPageContainer}/>
                <Route path={'/doctor'} component={DoctorPage}/>
                <Route path={'/charge_worker'} component={ChargeWorkerPageContainer}/>
                <Route path={'/pharmacy'} component={PharmacyPage}/>
                <Redirect to={'/'}/>
            </Switch>
        </BrowserRouter>
    );
};

export default GlobalRouter;