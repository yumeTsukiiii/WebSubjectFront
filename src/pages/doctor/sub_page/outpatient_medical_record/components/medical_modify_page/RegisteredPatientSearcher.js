import React, {useEffect, useState} from 'react';
import Grid from "@material-ui/core/Grid";
import SearchBar from "../../../../../../components/SearchBar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {Switch} from "@material-ui/core";
import RegisteredPatientList from "./RegisteredPatientList";
import PropTypes from 'prop-types';
import {useTheme} from "@material-ui/styles";

const fixedHeight = 96;

const RegisteredPatientSearcher = (props) => {

    const theme = useTheme();

    const [showOkPatient, setShowOkPatient] = useState(false);

    const [patientListHeight, setPatientListHeight] = useState(props.patientListHeight);

    useEffect(() => {
        setPatientListHeight(calculateDefaultListHeight())
    }, []);

    const handleShowOkPatientSwitchChange = ({target}) => {
        setShowOkPatient(target.checked);
    };

    /**
     * 计算病人列表高度
     * */
    const calculateDefaultListHeight = () => {

        return Boolean(props.patientListHeight).yes(height => height)
            .otherwise(() => (
                document.getElementById('search-bar').let(searchBar => (
                    searchBar.offsetHeight
                )).let(searchBarHeight => (
                    searchBarHeight + document.getElementById('switch-control')
                        .offsetHeight
                )).let(composeHeight => (
                    theme.mixins.toolbar.minHeight + composeHeight
                )).let(allShouldSubHeight => (
                    window.innerHeight - allShouldSubHeight
                )).let(normalHeight => (
                    normalHeight - fixedHeight
                ))
            ));

    };

    return (
        <Grid container direction={"column"}>
            <SearchBar
                id={'search-bar'}
                onChange={props.onChange}
                label={'病人姓名'}/>
            <FormControlLabel
                id={'switch-control'}
                control={
                    <Switch
                        value={showOkPatient}
                        onChange={handleShowOkPatientSwitchChange}/>
                }
                label={'已诊患者'}/>
            <div style={{height: '16px'}}/>
            <RegisteredPatientList
                patients={props.patients}
                showOkPatient={showOkPatient}
                height={patientListHeight}
                onPatientItemClick={props.onPatientItemClick}/>
        </Grid>
    );
};

RegisteredPatientSearcher.propTypes = {
    patients: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired
    })).isRequired,
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func,
    onPatientItemClick: PropTypes.func.isRequired,
    patientListHeight: PropTypes.number
};

export default RegisteredPatientSearcher;