import {makeStyles} from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import React from "react";
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    title: {
        flexGrow: 1,
    },

}));

const ResponsibleAppBar = (props) => {

    const useInnerStyles = makeStyles(theme => ({
        appBar: {
            marginLeft: `${props.drawerWidth}px`,
            [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${props.drawerWidth}px)`,
            },
        }
    }));

    const classes = useStyles();

    const innerClasses = useInnerStyles();

    const ActionButton = props.rightAction;

    return (
        <AppBar
            position="fixed"
            className={innerClasses.appBar}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    edge="start"
                    onClick={props.menuIconAction}
                    className={classes.menuButton}>
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    noWrap
                    className={classes.title}>
                    {props.title}
                </Typography>
                {
                    ActionButton ? <ActionButton/> : null
                }
            </Toolbar>
        </AppBar>
    );
};

ResponsibleAppBar.propTypes = {
    title: PropTypes.string.isRequired,
    menuIconAction: PropTypes.func.isRequired,
    drawerWidth: PropTypes.number.isRequired,
    rightAction: PropTypes.node
};

export default ResponsibleAppBar;