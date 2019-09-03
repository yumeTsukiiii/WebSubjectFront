import React, {useEffect, useState} from 'react';
import InboxIcon from "@material-ui/icons/Inbox";
import PageWithDrawerNavigator from "../../components/PageWithDrawerNavigator";
import MedicalRecord from "./sub_page/outpatient_medical_record/MedicalRecordPage";
import IconButton from "@material-ui/core/IconButton";
import ExitIcon from "@material-ui/icons/ExitToApp";
import {Fade} from "@material-ui/core";
const DoctorPage = (props) => {

    const basePath = '/doctor';

    const [fadeIn, setFadeIn] = useState(false);

    const drawerNavigatorsConfig = [
        {
            text: '门诊病历',
            navigateConfig: {
                title: '门诊病历',
                route: `/medical_record`,
                component: MedicalRecord
            },
            icon: <InboxIcon/>
        }
    ];

    useEffect(() => {
        setFadeIn(true);
    }, []);

    const logout = () => {
        setFadeIn(false);
        setTimeout(() => {
            props.history.replace("/");
        }, 300);
    };

    return (
        <Fade in={fadeIn}>
            <div>
                <PageWithDrawerNavigator
                    drawerNavigators={drawerNavigatorsConfig}
                    history={props.history}
                    basePath={basePath}
                    toolBarAction={
                        () => (
                            <IconButton onClick={logout}>
                                <ExitIcon style={{color: "white"}}/>
                            </IconButton>
                        )
                    }
                    navigateDelay={100}/>
            </div>
        </Fade>
    );
};

export default DoctorPage;