import React from 'react'
import Grid from '@material-ui/core/Grid'
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PropTypes from 'prop-types';
import {makeStyles} from "@material-ui/styles";
import ClearIcon from '@material-ui/icons/Clear'
import RefreshIcon from '@material-ui/icons/Refresh'
import UploadIcon from '@material-ui/icons/CloudUpload'

const useStyles = makeStyles(theme => ({
    defaultMarginHorizontal: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    defaultPaddingRight: {
        paddingRight: theme.spacing(4)
    }
}));

const RegisteredActionTile = (props) => {

    const classes = useStyles();

    return (
        <Grid container>
            <TextField
                label={'发票号'}/>
            <Button
                color={"primary"}
                variant="contained"
                onClick={props.registeredAction}
                className={`${classes.defaultMarginHorizontal} ${classes.defaultPaddingRight}`}>
                <UploadIcon className={classes.defaultMarginHorizontal}/>
                挂号
            </Button>
            <Button
                color={"primary"}
                variant="contained"
                onClick={props.refreshInfoAction}
                className={`${classes.defaultMarginHorizontal} ${classes.defaultPaddingRight}`}>
                <RefreshIcon className={classes.defaultMarginHorizontal}/>
                获取发票号
            </Button>
            <Button
                color={"primary"}
                variant={"contained"}
                onClick={props.clearAction}
                className={`${classes.defaultMarginHorizontal} ${classes.defaultPaddingRight}`}>
                <ClearIcon className={classes.defaultMarginHorizontal}/>
                清空
            </Button>
        </Grid>
    );
};

RegisteredActionTile.propTypes = {
    billNumber: PropTypes.string.isRequired,
    registeredAction: PropTypes.func.isRequired,
    refreshInfoAction: PropTypes.func.isRequired,
    clearAction: PropTypes.func.isRequired
};

export default RegisteredActionTile;