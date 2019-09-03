import React, {useContext, useEffect, useState} from 'react'
import {Typography} from "@material-ui/core";
import GridInputs from "../../../../components/GridInputs";
import RegisteredActionTile from "./components/RegisteredActionTile";
import {useTheme} from "@material-ui/styles";
import {PaymentRepository, ReservationRepository} from "../../../../net/repo/repository";
import {handleNetCodeMessage} from "../../../../net/handler/ResponseHandler";
import {hideLoading, showErrorMessage, showLoading, showSuccessMessage} from "../../../../store/default";
import GlobalContext from "../../../../store/context";
import DateFnsUtils from "@date-io/date-fns";
import Fade from "@material-ui/core/Fade";


const RegisteredPage = (props) => {

    const theme = useTheme();

    const ctx = useContext(GlobalContext);

    const [fadeIn, setFadeIn] = useState(false);

    const reservationRepository = ReservationRepository.of('remote');

    const paymentRepository = PaymentRepository.of('remote');

    let defaultMedicalNumber = '';

    const medicalBookPrice = 10;

    const [billNumber, setBillNumber] = useState('1251224');

    const [inputsValue, setInputValue] = useState({
        medicalNumber: '', //病历号
        patientName: '', //病人姓名
        sex: '男', //病人性别
        age: 0, //病人年龄
        birthday: new Date(), //病人出生日期
        identifyNumber: '', //病人身份证号
        homeAddress: '', //病人家庭住址
        payCategory: 0, //结算方式
        visitDate: new Date(), //看诊日期
        noon: (new Date()).getHours().let(hours => hours < 12), //午别
        registeredDepartment: 0, //挂号科室
        registeredLevel: 0, //挂号级别
        visitDoctor: 0, //看诊医生
        initNumber: '', //初始号额
        usedNumber: '', //已用号额
        isNeedMedicalBook: true, //是否需要病历本
        shouldPay: 30 + medicalBookPrice, //应收金额
        payMethod: 15, //收费方式
    });

    const [payCategoryItems, setPayCategoryItems] = useState([
        {
            value: 0,
            text: '自费'
        }
    ]);

    const [departmentItems, setDepartmentItems] = useState([]);

    const [registeredLevelItems, setRegisteredLevelItems] = useState([
        {
            value: 0,
            text: '普通号'
        },
        {
            value: 1,
            text: '专家号'
        }
    ]);

    const [registeredLevelPriceItems, setRegisteredLevelPriceItems] = useState([
        {
            value: 0,
            price: 30,
        },
        {
            value: 1,
            price: 50,
        }
    ]);

    const [visitDoctorItems, setVisitDoctorItems] = useState([]);

    const [payMethodItems, setPayMethodItems] = useState([]);

    const registeredInfoInputsTemp = [
        {
            type: 'TextField',
            label: '病历号',
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    medicalNumber: target.value
                });
                searchPatientInfoByMedicalNumber(target.value);
            },
            value: inputsValue.medicalNumber,
            xs: 6,
            sm: 6,
            md: 2
        },
        {
            type: 'TextField',
            label: '病人姓名',
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    patientName: target.value
                })
            },
            value: inputsValue.patientName,
            xs: 6,
            sm: 6,
            md: 2
        },
        {
            type: 'Selects',
            label: '性别',
            selectItems: [
                {
                    value: '男',
                    text: '男'
                },
                {
                    value: '女',
                    text: '女'
                }
            ],
            value: inputsValue.sex,
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    sex: target.value
                });
            },
            xs: 6,
            sm: 6,
            md: 2,
            minWidth: 120
        },
        {
            type: 'TextField',
            label: '年龄',
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    age: target.value
                });
            },
            value: inputsValue.age,
            xs: 6,
            sm: 6,
            md: 2,
            disabled: true
        },
        {
            type: 'DatePicker',
            label: '出生日期',
            onChange: (date) => {
                setInputValue({
                    ...inputsValue,
                    birthday: new Date(date),
                    age: new Date().getFullYear() - new Date(date).getFullYear()
                });
            },
            value: inputsValue.birthday,
            xs: 6,
            sm: 6,
            md: 2
        },
        {
            type: 'TextField',
            label: '身份证',
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    identifyNumber: target.value
                });
            },
            value: inputsValue.identifyNumber,
            xs: 6,
            sm: 6,
            md: 2
        },
        {
            type: 'TextField',
            label: '家庭住址',
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    homeAddress: target.value
                });
            },
            value: inputsValue.homeAddress,
            xs: 6,
            sm: 6,
            md: 2
        },
        {
            type: 'Selects',
            label: '结算类别',
            selectItems: payCategoryItems,
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    payCategory: target.value
                });
            },
            value: inputsValue.payCategory,
            xs: 6,
            sm: 6,
            md: 2,
            minWidth: 120
        },
        {
            type: 'DatePicker',
            label: '看诊日期',
            onChange: (date) => {
                setInputValue({
                    ...inputsValue,
                    visitDate: new Date(date)
                });
            },
            value: inputsValue.visitDate,
            xs: 6,
            sm: 6,
            md: 2
        },
        {
            type: 'Selects',
            label: '午别',
            selectItems: [
                {
                    value: true,
                    text: '上午'
                },
                {
                    value: false,
                    text: '下午'
                }
            ],
            value: inputsValue.noon,
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    noon: target.value
                });
            },
            xs: 6,
            sm: 6,
            md: 2,
            minWidth: 120
        },
        {
            type: 'Selects',
            label: '挂号科室',
            selectItems: departmentItems,
            value: inputsValue.registeredDepartment,
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    registeredDepartment: target.value
                });
            },
            xs: 6,
            sm: 6,
            md: 2,
            minWidth: 120
        },
        {
            type: 'Selects',
            label: '号别',
            selectItems: registeredLevelItems,
            value: inputsValue.registeredLevel,
            onChange: ({target}) => {
                let price = registeredLevelPriceItems.find(item => (
                    item.value === target.value
                )).price;

                price += inputsValue.isNeedMedicalBook ? medicalBookPrice : 0;

                setInputValue({
                    ...inputsValue,
                    registeredLevel: target.value,
                    shouldPay: price
                });
            },
            xs: 6,
            sm: 6,
            md: 2,
            minWidth: 120
        },
        {
            type: 'Selects',
            label: '看诊医生',
            selectItems: visitDoctorItems,
            value: inputsValue.visitDoctor,
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    visitDoctor: target.value
                });
            },
            xs: 6,
            sm: 6,
            md: 2,
            minWidth: 120
        },
        {
            type: 'TextField',
            label: '初始号额',
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    initNumber: target.value
                })
            },
            value: inputsValue.initNumber,
            xs: 6,
            sm: 6,
            md: 2,
            disabled: true
        },
        {
            type: 'TextField',
            label: '已用号额',
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    usedNumber: target.value
                })
            },
            value: inputsValue.usedNumber,
            xs: 6,
            sm: 6,
            md: 2,
            disabled: true
        },
        {
            type: 'TextField',
            label: '应收金额',
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    shouldPay: target.value
                })
            },
            value: inputsValue.shouldPay,
            xs: 6,
            sm: 6,
            md: 2,
            disabled: true
        },
        {
            type: 'Selects',
            label: '收费方式',
            selectItems: payMethodItems,
            value: inputsValue.payMethod,
            onChange: ({target}) => {
                setInputValue({
                    ...inputsValue,
                    payMethod: target.value
                });
            },
            xs: 6,
            sm: 6,
            md: 2,
            minWidth: 120
        },
        {
            type: 'CheckBox',
            label: '病历本',
            onChange: ({target}) => {
                let price = registeredLevelPriceItems.find(item => (
                    item.value === inputsValue.registeredLevel
                )).price;

                price += target.checked ? medicalBookPrice : 0;

                setInputValue({
                    ...inputsValue,
                    isNeedMedicalBook: target.checked,
                    shouldPay: price
                })
            },
            value: inputsValue.isNeedMedicalBook,
            xs: 6,
            sm: 6,
            md: 2
        },
    ];

    const handleRegistered = () => {
        let hasEmptyValue = Object.keys(inputsValue).filter(key => (typeof inputsValue[key] === "string"))
            .some(key => !inputsValue[key]);
        if (hasEmptyValue) {
            showErrorMessage(ctx, "请填写必要信息");
            return;
        }
        showLoading(ctx, "挂号中...");
        reservationRepository.registered({
            code: inputsValue.medicalNumber,
            name: inputsValue.patientName,
            sex: inputsValue.sex,
            birthday: new DateFnsUtils().format(inputsValue.birthday, 'yyyy-MM-dd'),
            payment: inputsValue.payMethod,
            date: new DateFnsUtils().format(inputsValue.visitDate, 'yyyy-MM-dd'),
            isMorning: inputsValue.noon,
            doctor: inputsValue.visitDoctor,
            home: inputsValue.homeAddress,
            identity_number: inputsValue.identifyNumber,
            record_book: inputsValue.isNeedMedicalBook,
            invoice_code: billNumber
        }).then(() => {
            hideLoading(ctx);
            showLoading(ctx, "生成发票中...");

            generateBillRecord()
        }).catch(data => {
            hideLoading(ctx);
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message)
            })
        })
    };

    const handleRefreshInfo = () => {
        initDefaultMedicalNumber().then(result => {
            if (result) {
                setInputValue({
                    ...inputsValue,
                    medicalNumber: defaultMedicalNumber, //病历号
                    patientName: '', //病人姓名
                    sex: '男', //病人性别
                    age: 0, //病人年龄
                    birthday: new Date(), //病人出生日期
                    identifyNumber: '', //病人身份证号
                    homeAddress: '', //病人家庭住址
                    visitDate: new Date(), //看诊日期
                    noon: true
                });
            }
        });
    };

    const generateBillRecord = () => {
        paymentRepository.commitBill({
            paymentId: billNumber,
            price: inputsValue.shouldPay
        }).then(data => {
            hideLoading(ctx);
            showSuccessMessage(ctx, "提交成功")
        }).catch(data => {
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message)
            })
        })
    };

    /**
     * 初始化病历号和科室
     * */
    useEffect(() => {
        initAllReservationCodeAndDepartmentItems();
        initPaymentMethods();
        setFadeIn(true);
    }, []);

    /**
     * 初始化所选科室的在线医生
     * */
    useEffect(() => {
        requestOnlineDoctor(inputsValue.registeredDepartment);
    }, [departmentItems]);

    useEffect(() => {
        requestOnlineDoctor(inputsValue.registeredDepartment)
    }, [inputsValue.registeredDepartment]);

    /**
     * 初始化所选医生的号额
     * */
    useEffect(() => {
        requestReservationLimitation(inputsValue.visitDoctor);
    }, [inputsValue.visitDoctor]);

    /**
     * 病历号变化时调用该方法，设置病人相关信息
     * */
    const searchPatientInfoByMedicalNumber = (medicalNumber) => {
        if (medicalNumber === defaultMedicalNumber) return;
        reservationRepository.getPatientInfoByMedicalNumber({code: medicalNumber})
            .then(data => {
                console.log(inputsValue);
                setInputValue({
                    ...inputsValue,
                    medicalNumber: medicalNumber,
                    patientName: data.name,
                    sex: data.sex,
                    birthday: new Date(data.birthday),
                    age: new Date().getFullYear() - new Date(data.birthday).getFullYear(),
                    identifyNumber: data.id,
                    homeAddress: data.home
                })
            }).catch(data => {
                if (data.status && data.status === -9) {
                    setInputValue({
                        ...inputsValue,
                        medicalNumber: medicalNumber,
                        patientName: '',
                        sex: '男',
                        age: 0,
                        identifyNumber: '',
                        homeAddress: '',
                        birthday: new Date()
                    })
                }
            })
    };



    const initAllReservationCodeAndDepartmentItems = () => {
        initDefaultMedicalNumber().then(result => {
            if (result) {
                initDepartments();
            }
        });
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
            })
    };

    /**
     * 初始化默认的自动生成的病历号
     * */
    const initDefaultMedicalNumber = () => {
        return reservationRepository.getRegisteredCode()
            .then(data => {
                defaultMedicalNumber = data.code;
                setInputValue({
                    ...inputsValue,
                    medicalNumber: data.code
                });
                return true;
            }).catch(data => {
                handleNetCodeMessage(data, (message,status) => {
                    showErrorMessage(ctx, message, () => {
                        if (status === -4) {
                            props.history.replace('/login')
                        }
                    })
                });
                return false;
            })
    };

    /**
     * 初始化医院的科室
     * */
    const initDepartments = () => {
        reservationRepository.getDepartments()
            .then(data => {
                setDepartmentItems(data.map((department, index) => ({
                    value: index,
                    text: department.name
                })))
            }).catch(data => {
                handleNetCodeMessage(data, message => {
                    showErrorMessage(ctx, message)
                })
            })
    };

    /**
     * 初始化值班医生
     * */
    const requestOnlineDoctor = (department) => {
        if (departmentItems.length <= 0) return;
        reservationRepository.getDoctorsByDepartment({
            department: departmentItems.find(item => item.value === department).text
        }).then(data => {
            setVisitDoctorItems(data.map(doctor => ({
                value: doctor.username,
                text: doctor.real_name
            })));
            if (data.length > 0) {
                setInputValue({
                    ...inputsValue,
                    visitDoctor: data[0].username
                });
            } else {
                setInputValue({
                    ...inputsValue,
                    visitDoctor: ''
                });
            }
        }).catch(data => {
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message)
            })
        })
    };

    const requestReservationLimitation = (visitDoctor) => {
        if (visitDoctorItems.length <= 0 || !visitDoctor) return;
        reservationRepository.getLimitationByDoctor({
            doctor: visitDoctor
        }).then(data => {
            setInputValue({
                ...inputsValue,
                initNumber: data.limitation,
                usedNumber: data.used
            })
        }).catch(data => {
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message)
            })
        })
    };

    return (
        <Fade in={fadeIn}>
            <div>
                <RegisteredActionTile
                    billNumber={billNumber}
                    registeredAction={handleRegistered}
                    refreshInfoAction={handleRefreshInfo}/>
                <div style={{marginTop: theme.spacing(4)}}/>
                <Typography variant={"subtitle1"}>
                    挂号信息
                </Typography>
                <GridInputs
                    inputsTemp={registeredInfoInputsTemp}
                    inputsValue={inputsValue}/>
            </div>
        </Fade>
    )
};

export default RegisteredPage