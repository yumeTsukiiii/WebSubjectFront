import React, {useReducer} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {blue} from "@material-ui/core/colors";
import { ThemeProvider } from '@material-ui/styles';
import installKtExtensions from "./util/kt-extensions";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import GlobalContext from './store/context';
import {tipReducer} from "./store/reducer";
import {SET_MESSAGE} from "./store/action";
import LoadingSnackbar from "./components/LoadingSnackbar";
import MessageSnackbar from "./components/MessageSnackbar";
import ReactIcon from './assets/imgs/react-icon.png'
import './index.css'
import {Typography} from "@material-ui/core";

//一些很有用的扩展函数
installKtExtensions();

const theme = createMuiTheme({
   palette: {
       primary: blue
   }
});

/**
 * 就在这里改相关主题色，参考官网, https://material-ui.com/zh/customization/theming/
 * const theme = createMuiTheme({
 * palette: {
 *   primary: purple,
 *   secondary: green,
 * },
 * status: {
 *   danger: 'orange',
 * },
 *});
 * */

const ThemedApp = () => {
    return (
        <ThemeProvider theme={theme}>
            <App/>
        </ThemeProvider>
    );
};

const WithPickerApp = () => {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ThemedApp/>
        </MuiPickersUtilsProvider>
    )
};

const WithGlobalStateApp = () => {

    const [globalState, globalDispatch] = useReducer(tipReducer, {
        loadingMessage: {
            isLoading: false,
            message: '加载中'
        },
        snackbarMessage: {
            open: false,
            message: '',
            type: 'success',
            onClose: () => {
                globalDispatch({
                    type: SET_MESSAGE,
                    snackbarMessage: {
                        ...globalState.snackbarMessage,
                        open: false
                    }
                })
            }
        },
        diagnosis: [
            {
                reservationId: -100
            }
        ],
        prescription: [
            {
                reservationId: -100
            }
        ]
    });

    return (
        <GlobalContext.Provider value={{
            state: globalState, dispatch: globalDispatch
        }}>
            <WithPickerApp/>
            <LoadingSnackbar
                open={globalState.loadingMessage.isLoading}
                message={globalState.loadingMessage.message}
                />
            <MessageSnackbar
                open={globalState.snackbarMessage.open}
                message={globalState.snackbarMessage.message}
                type={globalState.snackbarMessage.type}
                onClose={globalState.snackbarMessage.onClose}/>
            <img src={ReactIcon} className={"rotate-react"}/>
        </GlobalContext.Provider>
    )
};

ReactDOM.render(<WithGlobalStateApp/>, document.getElementById('root'));
