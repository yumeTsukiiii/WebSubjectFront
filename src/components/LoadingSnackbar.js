import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from "@material-ui/core/Snackbar";
import {SnackbarContent} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(theme => ({
    message: {
        display: 'flex',
        alignItems: 'center',
    }
}));

/**
 * 一个用于控制显示提示的加载中的Snackbar，可自定义加载文字
 * */
const LoadingSnackbar = (props) => {

    const classes = useStyles();

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={props.open}>
            <SnackbarContent
                style={{backgroundColor: "dodgerblue"}}
                message={
                    <span className={classes.message}>
                        <CircularProgress style={{color: 'white'}}/>
                        {props.message}
                    </span>
                }/>
        </Snackbar>
    )
};

LoadingSnackbar.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string,
};

LoadingSnackbar.defaultProps = {
    open: false,
    message: '加载中',
};

export default LoadingSnackbar;