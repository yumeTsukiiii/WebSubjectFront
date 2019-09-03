import React, {useContext, useEffect, useState} from 'react';
import {Typography} from "@material-ui/core";
import UnRegisteredActionTile from "./component/UnRegisteredActionTile";
import GridInputs from "../../../../components/GridInputs";
import {useTheme} from "@material-ui/styles";
import PatientInfoTable from "./component/PatientInfoTable";
import GlobalContext from "../../../../store/context";
import {ReservationRepository} from "../../../../net/repo/repository";
import {handleNetCodeMessage} from "../../../../net/handler/ResponseHandler";
import {hideLoading, showErrorMessage, showLoading, showSuccessMessage} from "../../../../store/default";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";

const UnRegisteredPage = (props) => {

    const ctx = useContext(GlobalContext);

    const reservationRepository = ReservationRepository.of('remote');

    const [fadeIn, setFadeIn] = useState(false);

    const theme = useTheme();

    const [medicalNumber, setMedicalNumber] = useState('');

    const [unregisteredConfirmOpen, setUnregisteredConfirmOpen] = useState(false);

    const [currentUnregisteredId, setCurrentUnregisteredId] = useState(0);

    const [inputsValue, setInputValue] = useState({
        patientName: '', //病人姓名
        identifyNumber: '', //病人身份证号
        homeAddress: '', //病人家庭住址
    });

    const [patientsInfo, setPatientsInfo] = useState([]);

    const unRegisteredInputsTemp = [
        {
            type: 'TextField',
            label: '姓名',
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    patientName: target.value
                })
            },
            value: inputsValue.patientName,
            xs: 6,
            sm: 6,
            md: 4,
            disabled: true
        },
        {
            type: 'TextField',
            label: '身份证号',
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    identifyNumber: target.value
                })
            },
            value: inputsValue.identifyNumber,
            xs: 6,
            sm: 6,
            md: 4,
            disabled: true
        },
        {
            type: 'TextField',
            label: '家庭住址',
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    homeAddress: target.value
                })
            },
            value: inputsValue.homeAddress,
            xs: 6,
            sm: 6,
            md: 4,
            disabled: true
        },
    ];

    useEffect(() => {
        setFadeIn(true)
    }, []);

    const handleMedicalNumberChange = ({target}) => {
        setMedicalNumber(target.value);
    };

    const handleSearch = () => {
        showLoading(ctx, "查询中");
        reservationRepository.getRegisteredInfoByMedicalNumber({
            medicalNumber: medicalNumber
        }).then(data => {
            hideLoading(ctx);
            setInputValue({
                patientName: data.name,
                identifyNumber: data.id,
                homeAddress: data.home
            });
            setPatientsInfo(data.reservations.map(reservation => ({
                reservationId: reservation.reservation_id,
                medicalNumber: medicalNumber,
                name: data.name,
                identityNumber: data.id,
                registeredDate: reservation.date,
                registeredNoon: reservation.ismorning ? '上午' : '下午',
                visitDepartment: reservation.department_name,
                visitStatus: reservation.status.let(it => {
                    if (it === 0) {
                        return '已挂号';
                    } else if (it === 1) {
                        return '已看诊';
                    } else if (it === 2) {
                        return '已退费';
                    } else {
                        return '';
                    }
                })
            })))
        }).catch(data => {
            hideLoading(ctx);
            handleNetCodeMessage(data, (message, status) => {
                if (status === -4) {
                    showErrorMessage(ctx, message, () => {
                        props.history.replace("/")
                    });
                } else {
                    setInputValue({
                        patientName: '',
                        identifyNumber: '',
                        homeAddress: ''
                    });
                    setPatientsInfo([]);
                }
            })
        })
    };

    const handleUnRegistered = (rowData) => {
        if (rowData.visitStatus === '已挂号') {
            setCurrentUnregisteredId(rowData.reservationId);
            setUnregisteredConfirmOpen(true);
        } else {
            showErrorMessage(ctx, "该挂号记录已无法退号");
        }
    };

    const unregistered = (reservationId) => {
        setUnregisteredConfirmOpen(false);
        showLoading(ctx, "退号中");
        reservationRepository.unregistered({
            medicalNumber: reservationId
        }).then(data => {
            hideLoading(ctx);
            if (data) {
                showSuccessMessage(ctx, "退号成功");
                let unregisteredIndex = patientsInfo.findIndex(item => item.reservationId === reservationId);
                patientsInfo[unregisteredIndex].visitStatus = '已退费';
                setPatientsInfo(patientsInfo);
            } else {
                showErrorMessage(ctx, "退号失败")
            }
            setCurrentUnregisteredId(0);
        }).catch(data => {
            hideLoading(ctx);
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message)
            });
            setCurrentUnregisteredId(0);
        })
    };

    return (
        <Fade in={fadeIn}>
            <div>
                <Typography variant={"subtitle1"}>
                    患者信息查询
                </Typography>
                <UnRegisteredActionTile
                    medicalNumber={medicalNumber}
                    onMedicalNumberChange={handleMedicalNumberChange}
                    onSearchAction={handleSearch}/>

                <div style={{marginTop: theme.spacing(2)}}/>

                <Typography variant={"subtitle1"}>
                    患者信息确认
                </Typography>

                <GridInputs inputsTemp={unRegisteredInputsTemp}/>

                <div style={{marginTop: theme.spacing(2)}}/>

                <Typography variant={"subtitle1"}>
                    患者挂号信息
                </Typography>

                <div style={{marginTop: theme.spacing(2)}}/>

                <PatientInfoTable patientsInfo={patientsInfo} onUnRegistered={handleUnRegistered}/>

                <Dialog open={unregisteredConfirmOpen} fullWidth>
                    <DialogTitle>提示</DialogTitle>
                    <DialogContent>
                        您确定要退号吗？
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setUnregisteredConfirmOpen(false);
                            setCurrentUnregisteredId(0);
                        }}>取消</Button>

                        <Button color={'primary'}
                                onClick={() => {unregistered(currentUnregisteredId)}}>退号</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Fade>
    );
};

export default UnRegisteredPage;