import React, {useEffect, useState} from 'react';
import GridInputs from "../../../../../components/GridInputs";
import PropTypes from 'prop-types';

const BillDialogContent = (props) => {

    const [inputsValue, setInputValue] = useState({
        payMethod: props.payMethodItems[0].value, //收费方式
        returnPay: 0,
        truePay: 0,
        billNumber: ''
    });

    useEffect(() => {
        if (inputsValue.truePay <= props.patientInfo.shouldPay) {
            setInputValue({
                ...inputsValue,
                returnPay: 0
            })
        } else {
            setInputValue({
                ...inputsValue,
                returnPay: inputsValue.truePay - props.patientInfo.shouldPay
            })
        }
    }, [inputsValue.truePay]);

    const chargeInfoInputsTemp = [
        {
            type: 'TextField',
            label: '发票号',
            value: inputsValue.billNumber,
            xs: 6,
            sm: 6,
            md: 6,
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    billNumber: target.value
                })
            }
        },
        {
            type: 'TextField',
            label: '病历号',
            value: props.patientInfo.medicalNumber,
            xs: 6,
            sm: 6,
            md: 6,
            disabled: true
        },
        {
            type: 'TextField',
            label: '患者姓名',
            value: props.patientInfo.patientName,
            xs: 6,
            sm: 6,
            md: 6,
            disabled: true
        },
        {
            type: 'Selects',
            label: '支付方式',
            selectItems: props.payMethodItems,
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    payMethod: target.value
                });
            },
            value: inputsValue.payMethod,
            xs: 6,
            sm: 6,
            md: 6
        },
        {
            type: 'TextField',
            label: '应收金额',
            value: props.patientInfo.shouldPay,
            xs: 6,
            sm: 6,
            md: 6,
            disabled: true
        },
        {
            type: 'TextField',
            label: '实收金额',
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    truePay: target.value
                });
            },
            value: inputsValue.truePay,
            xs: 6,
            sm: 6,
            md: 6
        },
        {
            type: 'TextField',
            label: '找零金额',
            value: inputsValue.returnPay,
            xs: 6,
            sm: 6,
            md: 6,
            disabled: true
        }
    ];

    return (
        <div>
            <GridInputs inputsTemp={chargeInfoInputsTemp}/>
        </div>
    );
};

BillDialogContent.propTypes = {
    patientInfo: PropTypes.shape({
        medicalNumber: PropTypes.string.isRequired,
        patientName: PropTypes.string.isRequired,
        shouldPay: PropTypes.number.isRequired
    }).isRequired,
    payMethodItems: PropTypes.array.isRequired
};

export default BillDialogContent;