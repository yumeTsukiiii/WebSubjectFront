import React, {useEffect, useState} from 'react';
import ResponsibleAppBar from "./ResponsibleAppBar";
import ResponsibleDrawer from "./ResponsibleDrawer";
import {makeStyles} from "@material-ui/styles";
import PropTypes from 'prop-types';
import {Route} from 'react-router-dom';
import UndefinedChecker from "../util/UndefinedChecker";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

const PageWithDrawerNavigator = (props) => {

    const drawerWidth = props.drawerWidth;

    const classes = useStyles();

    const [currentPageRoute, setCurrentPageRoute] = useState('/');

    //states
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [currentPageTitle, setCurrentPageTitle] = useState(
        !props.drawerNavigators[0] ? '' : props.drawerNavigators[0].navigateConfig.title
    );

    //drawer导航控制数据
    const drawerNavigators = props.drawerNavigators.map(pageConfig => ({
            text: pageConfig.text,
            action: () => {
                if (pageConfig.navigateConfig.route === currentPageRoute) return;
                props.beforeNavigate && props.beforeNavigate(pageConfig.navigateConfig.route);
                setCurrentPageTitle(pageConfig.navigateConfig.title);
                navigateToSubPage(pageConfig.navigateConfig.route);
                setCurrentPageRoute(pageConfig.navigateConfig.route)
            },
            icon: pageConfig.icon
        }));

    const navigateToSubPage = (route) => {
        if (props.navigateDelay === 0) {
            props.history.replace(`${props.basePath}${route}`);
            props.afterNavigate && props.afterNavigate(route);
        } else {
            setTimeout(() => {
                props.history.replace(`${props.basePath}${route}`);
                props.afterNavigate && props.afterNavigate(route);
            }, props.navigateDelay)
        }
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <div className={classes.root}>
            {/* appBar */}
            <ResponsibleAppBar
                title={currentPageTitle}
                menuIconAction={handleDrawerToggle}
                drawerWidth={drawerWidth}
                rightAction={props.toolBarAction}/>

            {/* drawer控制右侧页面 */}
            <ResponsibleDrawer
                drawerWidth={drawerWidth}
                mobileOpen={mobileOpen}
                drawerNavigators={drawerNavigators}
                onClose={handleDrawerToggle}/>

            {/* 功能页面 */}
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {
                    UndefinedChecker.of(props.drawerNavigators[0])
                        .isNotUndefined(pageConfig => (
                            <Route
                                exact
                                path={props.basePath}
                                component={pageConfig.navigateConfig.component}/>
                        )).otherwise(() => null)
                }
                {props.drawerNavigators.map(pageConfig => (
                    <Route
                        path={`${props.basePath}${pageConfig.navigateConfig.route}`}
                        component={pageConfig.navigateConfig.component}
                        key={pageConfig.navigateConfig.route}/>
                ))}
            </main>

        </div>
    );
};

PageWithDrawerNavigator.propTypes = {
    history: PropTypes.object.isRequired,
    drawerWidth: PropTypes.number,
    basePath: PropTypes.string,
    drawerNavigators: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        navigateConfig: PropTypes.shape({
            title: PropTypes.string.isRequired,
            route: PropTypes.string.isRequired,
            component: PropTypes.node.isRequired
        }).isRequired,
        icon: PropTypes.node
    })).isRequired,
    toolBarAction: PropTypes.node,
    beforeNavigate: PropTypes.func,
    afterNavigate: PropTypes.func,
    navigateDelay: PropTypes.number
};

PageWithDrawerNavigator.defaultProps = {
    drawerWidth: 240,
    basePath: '/',
    navigateDelay: 0
};

export default PageWithDrawerNavigator;