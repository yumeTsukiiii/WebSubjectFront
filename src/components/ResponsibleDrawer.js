import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import React from "react";
import {makeStyles, useTheme} from "@material-ui/styles";
import PropTypes from 'prop-types';
import SingleLevelIconList from "./SingleLevelIconList";

/**
 * 自适应网页宽度的Drawer，会在网页宽度过小时收起
 * */
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
                    {props.header}
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
                    {props.header}
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
    onClose: PropTypes.func.isRequired,
    header: PropTypes.any //自定义头部组件
};

export default ResponsibleDrawer