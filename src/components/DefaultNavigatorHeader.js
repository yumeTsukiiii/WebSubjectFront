import React, {useContext, useEffect, useState} from 'react';
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import DoctorAvatar from "../assets/imgs/doctor-avatar.jpg"
import PropTypes from 'prop-types'
import {Typography} from "@material-ui/core";
import {handleNetCodeMessage} from "../net/handler/ResponseHandler";
import {showErrorMessage} from "../store/default";
import GlobalContext from "../store/context";
import {AuthRepository} from "../net/repo/repository";
import {useTheme} from "@material-ui/styles";

const DefaultNavigatorHeader = (props) => {

    const ctx = useContext(GlobalContext);

    const authRepository = AuthRepository.of('remote');

    const [username, setUsername] = useState('');

    //使用主题
    const theme = useTheme();

    useEffect(() => {
        getUsername()
    }, []);

    const getUsername = () => {
        authRepository.getUserName().then(data => {
            setUsername(data.msg);
        }).catch(data => {
            handleNetCodeMessage(data, (message, code) => {
                showErrorMessage(ctx, message, () => {
                    if (code ===  -4) {
                        props.history.replace("/")
                    }
                })
            })
        })
    };

    return (
        <Grid style={
            {
                height: '200px',
                backgroundColor: theme.palette.primary.main
            }
        } container alignItems={"center"} justify={"center"} direction={"column"}>
            <Avatar src={DoctorAvatar} style={{
                height: '64px',
                width: '64px'
            }}/>
            <div style={{height: '8px'}}/>
            <Typography variant={"h5"}
                style={{
                    color: 'white'
                }}>
                {username}
            </Typography>
        </Grid>
    );
};

export default DefaultNavigatorHeader