import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import {makeStyles} from "@material-ui/styles";
import {Typography} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Slide from "@material-ui/core/Slide";
import Collapse from "@material-ui/core/Collapse";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        overflow: 'hidden',
        overflowY: 'scroll'
    },
    subHeader: {
        color: '#9a9a9a',
        marginLeft: '16px'
    }
}));

const RegisteredPatientList = (props) => {

    const classes = useStyles();

    const [chosenPatientIndex, setChosenPatientIndex] = useState(null);

    const [chosenPatientStatus, setChosenPatientStatus] = useState(0);

    const [isPatientCollapse, setIsPatientCollapse] = useState(false);

    useEffect(() => {
        setIsPatientCollapse(true)
    }, []);

    return (
        <div
            className={classes.root}
            style={{height: `${props.height}px`}}>
            <Collapse in={isPatientCollapse}>
                <List
                    subheader={
                        <Typography
                            className={classes.subHeader}
                            variant={"subtitle2"}>
                            未诊患者
                        </Typography>
                    }>
                    {
                        props.patients.filter(patient => patient.status === 0)
                            .map((patient, index) => (
                                <ListItem
                                    onClick={() => {
                                        setChosenPatientIndex(index);
                                        setChosenPatientStatus(0);
                                        props.onPatientItemClick(patient)
                                    }}
                                    button
                                    key={`${patient.name}-${index}`}>
                                    <ListItemText>
                                        {patient.patientCode + " - " + patient.name}
                                    </ListItemText>
                                    {
                                        (() => {
                                            if(chosenPatientIndex === index && chosenPatientStatus === 0) {
                                                return <ListItemIcon children={<DoneIcon color={"primary"}/>}/>
                                            } else {
                                                return null
                                            }
                                        })()
                                    }
                                </ListItem>
                            ))
                    }
                </List>
            </Collapse>
            {
                <Slide direction={"up"} in={props.showOkPatient} mountOnEnter unmountOnExit>
                    <List
                        subheader={
                            <Typography
                                className={classes.subHeader}
                                variant={"subtitle2"}>
                                已诊患者
                            </Typography>
                        }>
                        {
                            props.patients.filter(patient => patient.status === 1)
                                .map((patient, index) => (
                                    <ListItem
                                        button
                                        key={`${patient.name}-${index}`}
                                        onClick={() => {
                                            setChosenPatientIndex(index);
                                            setChosenPatientStatus(1);
                                            props.onPatientItemClick(patient)
                                        }}>
                                        <ListItemText>
                                            {patient.patientCode + " - " + patient.name}
                                        </ListItemText>
                                        {
                                            (() => {
                                                if(chosenPatientIndex === index && chosenPatientStatus === 1) {
                                                    return <ListItemIcon children={<DoneIcon color={"primary"}/>}/>
                                                } else {
                                                    return null
                                                }
                                            })()
                                        }
                                    </ListItem>
                                ))
                        }
                    </List>
                </Slide>
            }

        </div>

    )
};

RegisteredPatientList.propTypes = {
    patients: PropTypes.arrayOf(PropTypes.shape({
        patientCode: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired
    })).isRequired,
    showOkPatient: PropTypes.bool,
    height: PropTypes.number,
    onPatientItemClick: PropTypes.func
};

RegisteredPatientList.defaultProps = {
    showOkPatient: false,
    height: 150
};

export default RegisteredPatientList;