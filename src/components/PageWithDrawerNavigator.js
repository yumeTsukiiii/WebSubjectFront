import React, {useState} from 'react';
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

/**
 * 一个固定布局的组件，通过数据描述生成具有侧边导航和右侧页面切换的布局页面
 * 可选AppBar中的右侧Action
 * */
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

    /**
     * 根据route进行右侧子页面跳转
     * */
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
                onClose={handleDrawerToggle}
                header={props.header}/>

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
    history: PropTypes.object.isRequired, //由于该组件为BrowserRouter的孙子组件，所以需要传入history供其子组件使用
    drawerWidth: PropTypes.number, //左侧导航栏宽度
    basePath: PropTypes.string, //导航路由前缀
    drawerNavigators: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired, //导航项的名称
        navigateConfig: PropTypes.shape({
            title: PropTypes.string.isRequired, //该导航项在AppBar上的title
            route: PropTypes.string.isRequired, //该导航项的路由
            component: PropTypes.node.isRequired //该导航项对应渲染的组件
        }).isRequired,
        icon: PropTypes.node //导航项的icon
    })).isRequired,
    toolBarAction: PropTypes.node, //AppBar右侧可选导航
    beforeNavigate: PropTypes.func, //子页面跳转前函数
    afterNavigate: PropTypes.func, //子页面跳转后函数
    navigateDelay: PropTypes.number, //页面跳转延迟,
    header: PropTypes.any
};

PageWithDrawerNavigator.defaultProps = {
    drawerWidth: 240,
    basePath: '/',
    navigateDelay: 0
};

export default PageWithDrawerNavigator;