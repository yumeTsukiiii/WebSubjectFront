import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Card, CardContent, CardHeader, Typography} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {makeStyles} from "@material-ui/styles";
import winterBackground from "../../assets/imgs/winter_background.jpeg";
import snowFirst from "../../assets/imgs/snow1.png";
import snowSecond from "../../assets/imgs/snow2.png";
import './LoginPageStyle.css'
import {AuthRepository} from "../../net/repo/repository";
import GlobalContext from "../../store/context";
import {hideLoading, showErrorMessage, showLoading, showSuccessMessage} from "../../store/default";
import {handleNetCodeMessage} from "../../net/handler/ResponseHandler";
import Fade from "@material-ui/core/Fade";
import RefreshIcon from '@material-ui/icons/Refresh'

const useStyles = makeStyles(theme => ({
    backgroundWithImage: {
        backgroundImage: `url(${winterBackground})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    },
    loginCard: {
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    defaultMarginTop: {
        marginTop: '16px'
    },
    snowBackground: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 999,
        pointerEvents: 'none',
        backgroundImage: `url(${snowFirst}), url(${snowSecond})`,
        animation: 'snow 15s linear infinite',
        '-webkit-animation': 'snow 15s linear infinite'
    }
}));

const LoginPage = (props) => {

    const classes = useStyles();

    const ctx = useContext(GlobalContext);

    const [canLogin, setCanLogin] = useState(true);

    const [pageHeight, setPageHeight] = useState(0);

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    const [captcha, setCaptcha] = useState('');

    const [captchaImg, setCaptchaImg] = useState(null);

    const [fadeIn, setFadeIn] = useState(false);

    const authRepository = AuthRepository.of('remote');

    useEffect(() => {
        document.getElementById('captchaImg').also(image => {
            image.onload = () => {
                window.URL.revokeObjectURL(image.src)
            };
        });
        setPageHeight(window.innerHeight);
        getCaptchaImage();
        setFadeIn(true);
    }, []);

    const handleUsernameChange = ({target}) => {
        setUsername(target.value);
    };

    const handlePasswordChange = ({target}) => {
        setPassword(target.value);
    };

    const handleCaptchaChange = ({target}) => {
        setCaptcha(target.value);
    };

    const transcationNavigateTo = (path) => {
        setFadeIn(false);
        setTimeout(() => {
            props.history.replace(path);
        }, 300);
    };

    const getCaptchaImage = () => {
        authRepository.getCaptcha().then(data => {
            setCaptchaImg(window.URL.createObjectURL(data.data))
        }).catch(data => {
            showErrorMessage(ctx, "服务器暂时无法处理您的请求")
        })
    };

    const handleLogin = () => {
        setCanLogin(false);
        showLoading(ctx, '登录中');
        authRepository.login({
            username, password, captcha
        }).then(data => {
            hideLoading(ctx);
            if (data.identity.includes('医生')) {
                showSuccessMessage(ctx, '登录成功', () => {
                    transcationNavigateTo("/doctor")
                });
            } else if (data.identity === '收银员'){
                showSuccessMessage(ctx, '登录成功', () => {
                    transcationNavigateTo("/charge_worker")
                });
            } else if (data.identity === '药师') {
                showSuccessMessage(ctx, '登录成功', () => {
                    transcationNavigateTo("/pharmacy")
                });
            }
        }).catch(data => {
            hideLoading(ctx);

            handleNetCodeMessage(data, (message, status) => {
                showErrorMessage(ctx, message);
                if (status === -11) {
                    getCaptchaImage()
                }
            });

            setCanLogin(true);
        });
    };

    return (
        <Fade in={fadeIn}>
            <Grid
                className={classes.backgroundWithImage}
                style={{height: pageHeight}}
                container
                justify={'center'}
                alignItems={'center'}>
                <Typography variant={"h3"} style={{
                    color: 'white',
                    position: 'fixed',
                    top: '8vh',
                    left: '0',
                    right: '0',
                    display: 'block',
                    margin: "auto",
                    textAlign: "center"
                }}>
                    HIS医疗系统
                </Typography>
                <div className={classes.snowBackground} />
                <Grid
                    item
                    xs={8}
                    sm={8}
                    md={3}>
                    <Card className={classes.loginCard}>
                        <CardHeader title={'用户登录'}/>
                        <CardContent>
                            <Grid
                                container
                                direction={'column'}
                                alignItems={'center'}>
                                <TextField
                                    value={username}
                                    onChange={handleUsernameChange}
                                    label={'用户名'}
                                    fullWidth/>
                                <div className={classes.defaultMarginTop}/>
                                <TextField
                                    value={password}
                                    onChange={handlePasswordChange}
                                    label={'密码'}
                                    fullWidth
                                    type="password"/>
                                <div className={classes.defaultMarginTop}/>
                                <TextField
                                    value={captcha}
                                    onChange={handleCaptchaChange}
                                    label={'验证码'}
                                    fullWidth/>
                                <div className={classes.defaultMarginTop}/>
                                <Grid container
                                      justify={"space-between"}
                                      direction={"row"}>
                                    <img id={'captchaImg'}
                                         src={captchaImg}
                                        style={{
                                            width: '40%'
                                        }}/>
                                    <Button
                                        onClick={getCaptchaImage}>
                                        <RefreshIcon/>
                                        看不清？换一张
                                    </Button>
                                </Grid>
                                <div className={classes.defaultMarginTop}/>
                                <Button
                                    color={"primary"}
                                    variant="contained"
                                    onClick={handleLogin}
                                    disabled={!canLogin}>
                                    登录
                                </Button>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Fade>
    );
};

LoginPage.propTypes = {
    pageHeight: PropTypes.number.isRequired,
};

export default LoginPage;