import React, {useContext, useEffect, useState} from 'react';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import RegisteredPage from "./sub_page/registered/RegisteredPage";
import UnRegisteredPage from "./sub_page/unregistered/UnRegisteredPage";
import PageWithDrawerNavigator from "../../components/PageWithDrawerNavigator";
import ChargePage from "./sub_page/charge/ChargePage";
import IconButton from "@material-ui/core/IconButton";
import ExitIcon from '@material-ui/icons/ExitToApp';
import {Fade} from "@material-ui/core";
import GlobalContext from "../../store/context";
import {AuthRepository} from "../../net/repo/repository";
import {handleNetCodeMessage} from "../../net/handler/ResponseHandler";
import {showErrorMessage, showSuccessMessage} from "../../store/default";
import DefaultNavigatorHeader from "../../components/DefaultNavigatorHeader";
import ChargeWorkerAvatar from "../../assets/imgs/doctor-avatar-charge-worker.jpeg"

const ChargeWorkerPage = (props) => {

    const [isLogout, setIsLogout] = useState(false);

    const ctx = useContext(GlobalContext);

    const authRepository = AuthRepository.of('remote');

    const basePath = "/charge_worker";

    const [fadeIn, setFadeIn] = useState(false);

    const drawerNavigatorsConfig = [
        {
            text: '现场挂号',
            navigateConfig: {
                title: '现场挂号',
                route: `/registered`,
                component: RegisteredPage
            },
            icon: <InboxIcon/>,
            toolBarAction: <InboxIcon/>
        },
        {
            text: '退号',
            navigateConfig: {
                title: '退号',
                route: `/unregistered`,
                component: UnRegisteredPage
            },
            icon: <InboxIcon/>,
            toolBarAction: <InboxIcon/>
        },
        {
            text: '收费',
            navigateConfig: {
                title: '收费',
                route: '/charge',
                component: ChargePage
            },
            icon: <InboxIcon/>,
        }
    ];

    useEffect(() => {
        setFadeIn(true);
    }, []);
    /**
     * 有个小bug，这个地方用全局ctx会导致整个页面刷新
     * */
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
                    basePath={basePath}
                    drawerNavigators={drawerNavigatorsConfig}
                    history={props.history}
                    toolBarAction={
                        () => (
                            <IconButton onClick={logout} disabled={isLogout}>
                                <ExitIcon style={{color: "white"}}/>
                            </IconButton>
                        )
                    }
                    navigateDelay={100}
                    header={<DefaultNavigatorHeader avatar={ChargeWorkerAvatar}/>}/>
            </div>
        </Fade>
    );
};


export default ChargeWorkerPage