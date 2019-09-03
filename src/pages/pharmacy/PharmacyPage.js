import React, {useContext, useEffect, useState} from 'react';
import InboxIcon from "@material-ui/icons/Inbox";
import PageWithDrawerNavigator from "../../components/PageWithDrawerNavigator";
import MedicinePage from "./sub_page/medicine/MedicinePage";
import {Fade} from "@material-ui/core";
import {hideLoading, showErrorMessage, showLoading, showSuccessMessage} from "../../store/default";
import GlobalContext from "../../store/context";
import {AuthRepository} from "../../net/repo/repository";
import IconButton from "@material-ui/core/IconButton";
import ExitIcon from "@material-ui/icons/ExitToApp";

const PharmacyPage = (props) => {

    const basePath = '/pharmacy';

    const [fadeIn, setFadeIn] = useState(false);

    const drawerNavigatorsConfig = [
        {
            text: '药房发药',
            navigateConfig: {
                title: '药房发药',
                route: `/medicine`,
                component: MedicinePage
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

export default PharmacyPage;