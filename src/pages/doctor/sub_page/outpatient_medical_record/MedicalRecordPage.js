import React, {useContext, useEffect, useState} from 'react';
import Grid from "@material-ui/core/Grid";
import RegisteredPatientSearcher from "./components/medical_modify_page/RegisteredPatientSearcher";
import DoctorOperationController from "./components/medical_modify_page/DoctorOperationController";
import {DiagnoseRepository} from "../../../../net/repo/repository";
import GlobalContext from "../../../../store/context";
import {handleNetCodeMessage} from "../../../../net/handler/ResponseHandler";
import {showErrorMessage} from "../../../../store/default";
import {Fade} from "@material-ui/core";

const MedicalRecord = (props) => {

    const ctx = useContext(GlobalContext);

    const diagnoseRepository = DiagnoseRepository.of('remote');

    const [fadeIn, setFadeIn] = useState(false);

    const [currentPatient, setCurrentPatient] = useState(null);

    const [patients, setPatients] = useState([]);

    const [showingPatients, setShowingPatient] = useState([]);

    useEffect(() => {
        initPatients();
        setFadeIn(true);
    }, []);

    const handlePatientSearcherTextChange = ({target}) => {
        setShowingPatient(
            patients.filter((patient) => patient.name.search(target.value) !== -1)
        )
    };

    const handlePatientItemClick = (patient) => {
        setCurrentPatient(patient)
    };

    const initPatients = () => {
        diagnoseRepository.getRegisteredItemsByNowaday()
            .then(data => {
                let newPatients = data.map(patient => ({
                    reservationId: patient.reservation_id, //预约id
                    patientCode: patient.patient_code, //病人病历号？
                    name: patient.name, //病人名称,
                    status: patient.status
                }));
                setPatients(newPatients);
                setShowingPatient(newPatients)
            }).catch(data => {
                handleNetCodeMessage(data, (message, code) => {
                    showErrorMessage(ctx, message, () => {
                        if (code === -4) {
                            props.history.replace("/");
                        }
                    });
                })
            })
    };

    const onDiagnosisCommitSuccess = (patient) => {
        setCurrentPatient(null);
        patient.status = 1;
        setPatients([
            ...patients,
            patient
        ])
    };

    const handlePatientSearcherTextClear = () => {
        setShowingPatient(
            patients.filter((patient) => patient.name.search('') !== -1)
        )
    };

    return (
        <Fade in={fadeIn}>
            <div>
                <Grid container spacing={3}>
                    <Grid
                        item
                        xs={3}>
                        <RegisteredPatientSearcher
                            patients={showingPatients}
                            onChange={handlePatientSearcherTextChange}
                            onClear={handlePatientSearcherTextClear}
                            onPatientItemClick={handlePatientItemClick}/>
                    </Grid>
                    <Grid
                        item
                        xs={9}>
                        <DoctorOperationController
                            currentPatient={currentPatient}
                            onDiagnosisCommitSuccess={onDiagnosisCommitSuccess}/>
                    </Grid>
                </Grid>
            </div>
        </Fade>
    );
};

export default MedicalRecord;