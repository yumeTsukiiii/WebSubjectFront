import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import React from "react";
import {makeStyles, useTheme} from "@material-ui/styles";
import PropTypes from 'prop-types';
import SingleLevelIconList from "./SingleLevelIconList";

const ResponsibleDrawer = (props) => {

    const useInnerStyles = makeStyles(theme => ({
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: props.drawerWidth,
                flexShrink: 0,
            },
        },
        drawerPaper: {
            width: props.drawerWidth,
        }
    }));

    const innerClasses = useInnerStyles();

    const theme = useTheme();

    return (
        <nav className={innerClasses.drawer} aria-label="Mailbox folders">
            <Hidden smUp implementation="css">
                <Drawer
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={props.mobileOpen}
                    onClose={props.onClose}
                    classes={{
                        paper: innerClasses.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true
                    }}>
                    <SingleLevelIconList drawerNavigators={props.drawerNavigators}/>
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{
                        paper: innerClasses.drawerPaper,
                    }}
                    variant="permanent"
                    open>
                    <SingleLevelIconList drawerNavigators={props.drawerNavigators}/>
                </Drawer>
            </Hidden>
        </nav>
    );
};

ResponsibleDrawer.propTypes = {
    drawerWidth: PropTypes.number.isRequired,
    mobileOpen: PropTypes.bool.isRequired,
    drawerNavigators: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ResponsibleDrawer