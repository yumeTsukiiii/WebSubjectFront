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
import {handleNetCodeMessage} from "../../net/handler/ResponseHandler";
import DefaultNavigatorHeader from "../../components/DefaultNavigatorHeader";
import PharmacyAvatar from "../../assets/imgs/doctor-avatar-pharmacy.jpeg"

const PharmacyPage = (props) => {

    const basePath = '/pharmacy';

    const [isLogout, setIsLogout] = useState(false);

    const [fadeIn, setFadeIn] = useState(false);

    const ctx = useContext(GlobalContext);

    const authRepository = AuthRepository.of('remote');

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
                    header={<DefaultNavigatorHeader avatar={PharmacyAvatar} history={props.history}/>}/>
            </div>
        </Fade>
    );
};

export default PharmacyPage;