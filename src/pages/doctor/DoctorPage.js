import React, {useContext, useEffect, useState} from 'react';
import InboxIcon from "@material-ui/icons/Inbox";
import PageWithDrawerNavigator from "../../components/PageWithDrawerNavigator";
import MedicalRecord from "./sub_page/outpatient_medical_record/MedicalRecordPage";
import IconButton from "@material-ui/core/IconButton";
import ExitIcon from "@material-ui/icons/ExitToApp";
import {Fade} from "@material-ui/core";
import GlobalContext from "../../store/context";
import {AuthRepository} from "../../net/repo/repository";
import {showErrorMessage, showSuccessMessage} from "../../store/default";
import {handleNetCodeMessage} from "../../net/handler/ResponseHandler";
import DefaultNavigatorHeader from "../../components/DefaultNavigatorHeader";
const DoctorPage = (props) => {

    const basePath = '/doctor';

    const [isLogout, setIsLogout] = useState(false);

    const ctx = useContext(GlobalContext);

    const authRepository = AuthRepository.of('remote');

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
        setIsLogout(true);
        authRepository.logout().then(data => {
            showSuccessMessage(ctx, '登出成功', () => {
                setFadeIn(false);
                setTimeout(() => {
                    props.history.replace("/");
                }, 300);
            })
        }).catch(data => {
            setIsLogout(false);
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message)
            });
        });
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
                            <IconButton onClick={logout} disabled={isLogout}>
                                <ExitIcon style={{color: "white"}}/>
                            </IconButton>
                        )
                    }
                    navigateDelay={100}
                    header={<DefaultNavigatorHeader/>}/>
            </div>
        </Fade>
    );
};

export default DoctorPage;