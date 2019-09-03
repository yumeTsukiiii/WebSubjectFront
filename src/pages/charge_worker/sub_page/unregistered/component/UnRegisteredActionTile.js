import React from 'react';
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid';
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import SearchIcon from '@material-ui/icons/Search';
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
    defaultMarginHorizontal: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    defaultPaddingRight: {
        paddingRight: theme.spacing(4)
    }
}));

const UnRegisteredActionTile = (props) => {

    const classes = useStyles();

    return (
        <Grid
            container>
            <TextField
                value={props.medicalNumber}
                label={'病历号'}
                onChange={props.onMedicalNumberChange}/>
            <Button
                variant={"contained"}
                color={"primary"}
                onClick={props.onSearchAction}
                className={`${classes.defaultMarginHorizontal} ${classes.defaultPaddingRight}`}>
                <SearchIcon className={classes.defaultMarginHorizontal}/>
                查询
            </Button>
        </Grid>
    );
};

UnRegisteredActionTile.propTypes = {
    medicalNumber: PropTypes.string.isRequired,
    onMedicalNumberChange: PropTypes.func.isRequired,
    onSearchAction: PropTypes.func.isRequired
};

export default UnRegisteredActionTile