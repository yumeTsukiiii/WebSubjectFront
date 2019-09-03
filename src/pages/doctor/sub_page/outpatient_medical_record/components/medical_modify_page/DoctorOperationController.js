import React from 'react';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MedicalRecordModifyPage from "../../MedicalRecordModifyPage";
import PrescriptionModifyPage from "../../PrescriptionModifyPage";
import PropTypes from 'prop-types';

const pages = [
    (patient, onDiagnosisCommitSuccess) => <MedicalRecordModifyPage patient={patient} onDiagnosisCommitSuccess={onDiagnosisCommitSuccess}/>,
    (patient) => <PrescriptionModifyPage patient={patient}/>
];

const DoctorOperationController = (props) => {

    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth">
                <Tab label="病历首页" />
                <Tab label="医生开药" />
            </Tabs>
            { pages[value](props.currentPatient, props.onDiagnosisCommitSuccess) }
        </>
    )
};

DoctorOperationController.propTypes = {
    currentPatient: PropTypes.shape({
        reservationId: PropTypes.number, //预约id
        patientCode: PropTypes.string, //病人病历号？
        name: PropTypes.string //病人名称
    }),
    onDiagnosisCommitSuccess: PropTypes.func
};

export default DoctorOperationController;