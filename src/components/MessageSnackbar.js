import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from "@material-ui/core/Snackbar";
import {SnackbarContent} from "@material-ui/core";
import DoneIcon from '@material-ui/icons/Done'
import ErrorIcon from '@material-ui/icons/Error';
import {makeStyles} from "@material-ui/styles";
import {green} from "@material-ui/core/colors";

const snackbarTypeColor = {
    error: {
        color: 'red',
        icon: <DoneIcon/>
    },
    success: {
        color: green[500],
        icon: <ErrorIcon/>
    }
};

const useStyles = makeStyles(theme => ({
    message: {
        display: 'flex',
        alignItems: 'center',
    }
}));

/**
 * 用于控制显示特定文字提示消息的Snackbar
 * 有Success信息和Error信息两种，可以做扩展
 * */
const MessageSnackbar = (props) => {

    const classes = useStyles();

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={props.open}
            onClose={props.onClose}
            autoHideDuration={2000}
            message={props.message}>
            <SnackbarContent
                style={{backgroundColor: snackbarTypeColor[props.type].color}}
                message={
                    <span className={classes.message}>
                        {snackbarTypeColor[props.type].icon}
                        {props.message}
                    </span>
                }/>
        </Snackbar>
    )
};

MessageSnackbar.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.string,
    onClose: PropTypes.func.isRequired
};

MessageSnackbar.defaultProps = {
    open: false,
    message: '',
    type: 'error'
};

export default MessageSnackbar;