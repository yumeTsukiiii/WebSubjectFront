import React, {useContext, useEffect, useState} from 'react';
import {Typography} from "@material-ui/core";
import ChargeActionTile from "./component/ChargeActionTile";
import GridInputs from "../../../../components/GridInputs";
import {useTheme} from "@material-ui/styles";
import ChargeInfoTable from "./component/ChargeInfoTable";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import BillDialogContent from "./component/BillInfoDialogContent";
import Fade from "@material-ui/core/Fade";
import {PaymentRepository} from "../../../../net/repo/repository";
import {handleNetCodeMessage} from "../../../../net/handler/ResponseHandler";
import {showErrorMessage, showSuccessMessage} from "../../../../store/default";
import GlobalContext from "../../../../store/context";

const ChargePage = (props) => {

    const theme = useTheme();

    const ctx = useContext(GlobalContext);

    const [confirmChargeDialogOpen, setConfirmChargeDialogOpen] = useState(false);

    const paymentRepository = PaymentRepository.of('remote');

    const [fadeIn, setFadeIn] = useState(false);

    const [medicalNumber, setMedicalNumber] = useState('');

    const [inputsValue, setInputValue] = useState({
        patientName: '', //病人姓名
        identifyNumber: '', //病人身份证号
        homeAddress: '', //病人家庭住址
    });

    const [payMethodItems, setPayMethodItems] = useState([]);

    const [chosenChargesInfo, setChosenChargesInfo] = useState([]);

    const [chargesInfo, setChargesInfo] = useState([]);

    const chargeInputsTemp = [
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
        setFadeIn(true);
        initPaymentMethods();
    }, []);

    const handleMedicalNumberChange = ({target}) => {
        setMedicalNumber(target.value);
    };

    const handleSearch = () => {
        paymentRepository.getChargeItemsByCode({
            medicalNumber: medicalNumber
        }).then(data => {
            setInputValue({
                patientName: data.name, //病人姓名
                identifyNumber: data.id, //病人身份证号
                homeAddress: data.home, //病人家庭住址
            });
            setChargesInfo(data.info.map(item => {
                let status = '';
                if (item.status === 0) {
                    status = '已开立'
                } else if (item.status === 1) {
                    status = '已收费'
                } else if (item.status === 2) {
                    status = '已取药'
                }
                return {
                    id: item.id,
                    medicalNumber: data.id,
                    name: data.name,
                    itemName: item.name,
                    price: item.price,
                    amount: parseInt(item.dosage),
                    createTime: item.createtime,
                    status: status
                }
            }))
        }).catch(data => {
            setInputValue({
                patientName: '', //病人姓名
                identifyNumber: '', //病人身份证号
                homeAddress: '', //病人家庭住址
            });
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message)
            });
        })
    };

    const handleCharge = (rowData) => {
        if (rowData.some(item => item.status !== '已开立')) {
            showErrorMessage(ctx, "存在已收费的选项");
            return;
        }
        setChosenChargesInfo(rowData);
        setConfirmChargeDialogOpen(true);
    };

    const handleConfirmCharge = () => {
        setConfirmChargeDialogOpen(false);

        paymentRepository.changeDrugStatus({
            info: chosenChargesInfo.map(item => item.id)
        }).then(data => {
            commitBillRecord();
        }).catch(data => {
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message)
            })
        })
    };

    const commitBillRecord = () => {
        paymentRepository.commitBill({
            paymentId: '',
            price: chosenChargesInfo.map(item => item.price)
                .reduce((pre, cur) => pre + cur)
        }).then(data => {
            showSuccessMessage(ctx, "收费成功");
            setChosenChargesInfo([]);
            chargesInfo.forEach(item => item.status === '已收费');
            setChargesInfo(chargesInfo);
        }).catch(data => {
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message)
            })
        })
    };

    const initPaymentMethods = () => {
        paymentRepository.getPaymentMethods()
            .then(data => {
                setPayMethodItems(data.map(item => ({
                    value: item.id,
                    text: item.name
                })))
            })
            .catch(data => {
                handleNetCodeMessage(data, message => {
                    showErrorMessage(ctx, message)
                })
            });
    };

    return (
        <Fade in={fadeIn}>
            <div>
                <Typography variant={"subtitle1"}>
                    患者信息查询
                </Typography>
                <ChargeActionTile
                    medicalNumber={medicalNumber}
                    onMedicalNumberChange={handleMedicalNumberChange}
                    onSearchAction={handleSearch}/>

                <div style={{marginTop: theme.spacing(2)}}/>

                <Typography variant={"subtitle1"}>
                    患者信息确认
                </Typography>

                <GridInputs inputsTemp={chargeInputsTemp}/>

                <div style={{marginTop: theme.spacing(2)}}/>

                <Typography variant={"subtitle1"}>
                    患者收费信息
                </Typography>

                <div style={{marginTop: theme.spacing(2)}}/>

                <ChargeInfoTable chargesInfo={chargesInfo} onCharge={handleCharge}/>
                <Dialog open={confirmChargeDialogOpen}>
                    <DialogTitle>
                        发票信息(交费)
                    </DialogTitle>
                    <DialogContent>
                        <BillDialogContent
                            patientInfo={
                                {
                                    medicalNumber: medicalNumber,
                                    patientName: inputsValue.patientName,
                                    shouldPay: chosenChargesInfo.length === 0 ? 0 :
                                        chosenChargesInfo
                                            .map(item => item.price * item.amount)
                                            .reduce((pre, cur) => (pre + cur), 0)
                                }
                            }
                            payMethodItems={payMethodItems}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setConfirmChargeDialogOpen(false) }}>
                            取消
                        </Button>
                        <Button
                            color={"primary"}
                            onClick={ handleConfirmCharge }>
                            确认
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Fade>
    );
};

export default ChargePage;