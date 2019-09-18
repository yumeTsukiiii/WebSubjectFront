import React, {useContext, useEffect, useState} from 'react';
import Grid from "@material-ui/core/Grid";
import GridInputs from "../../../../components/GridInputs";
import Typography from "@material-ui/core/Typography";
import {makeStyles, useTheme} from "@material-ui/styles";
import PropTypes from 'prop-types';
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DiseaseDiagnosisTable from "./components/medical_modify_page/DiseaseDiagnosisTable";
import AddDiagnosisDialogContent from "./components/medical_modify_page/AddDiagnosisDialogContent";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import CloseIcon from '@material-ui/icons/Close';
import MedicalRecordModifyHeader from "./components/medical_modify_page/MedicalRecordModifyHeader";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import GlobalContext from "../../../../store/context";
import {DiagnoseRepository} from "../../../../net/repo/repository";
import {handleNetCodeMessage} from "../../../../net/handler/ResponseHandler";
import {addDiagnosis, removeDiagnosis, showErrorMessage, showSuccessMessage} from "../../../../store/default";
import DateFnsUtils from "@date-io/date-fns";
import DateFormatter from "../../../../util/DateFormatter";

const fixedHeight = 96;

const useStyles = makeStyles(theme => ({
    defaultMarginTop: {
        marginTop: theme.spacing(2)
    },
    root: {
        overflow: 'hidden',
        overflowY: 'scroll'
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    }
}));

const MedicalRecordModifyPage = (props) => {

    const classes = useStyles();

    const theme = useTheme();

    const ctx = useContext(GlobalContext);

    const diagnoseRepository = DiagnoseRepository.of('remote');

    const [contentHeight, setContentHeight] = useState(props.medicalRecordContentHeight);

    const [inputsValue, setInputsValue] = useState({
        mainDescription: '', //主诉
        nowDiseaseHistory: '', //现病史
        nowTreatment: '', //现病治疗情况
        pastHistory: '', //既往史
        allergies: '', //过敏史,
        physicalExamination: '' //体格检查,
    });

    const [diseaseDiagnosis, setDiseaseDiagnosis] = useState([]);
    const [diagnosisType, setDiagnosisType] = useState('西医诊断');
    const [addDiseaseDiagnosisOpen, setAddDiseaseDiagnosisOpen] = useState(false);
    const [searchedDisease, setSearchedDisease] = useState([]);

    const [chosenDisease, setChosenDisease] = useState([]);

    const inputTemps = [
        {
            type: 'TextArea',
            label: '主诉',
            onChange: ({target}) => {
                setInputsValue({
                    ...inputsValue,
                    mainDescription: target.value
                })
            },
            value: inputsValue.mainDescription,
            xs: 12,
            sm: 12,
            md: 12,
            rows: 2,
            placeholder: '请输入内容',
            fullWidth: true
        },
        {
            type: 'TextArea',
            label: '现病史',
            onChange: ({target}) => {
                setInputsValue({
                    ...inputsValue,
                    nowDiseaseHistory: target.value
                })
            },
            value: inputsValue.nowDiseaseHistory,
            xs: 12,
            sm: 12,
            md: 12,
            rows: 2,
            placeholder: '请输入内容',
            fullWidth: true
        },
        {
            type: 'TextArea',
            label: '现病治疗情况',
            onChange: ({target}) => {
                setInputsValue({
                    ...inputsValue,
                    nowTreatment: target.value
                })
            },
            value: inputsValue.nowTreatment,
            xs: 12,
            sm: 12,
            md: 12,
            rows: 2,
            placeholder: '请输入内容',
            fullWidth: true
        },
        {
            type: 'TextArea',
            label: '既往史',
            onChange: ({target}) => {
                setInputsValue({
                    ...inputsValue,
                    pastHistory: target.value
                })
            },
            value: inputsValue.pastHistory,
            xs: 12,
            sm: 12,
            md: 12,
            rows: 2,
            placeholder: '请输入内容',
            fullWidth: true
        },
        {
            type: 'TextArea',
            label: '过敏史',
            onChange: ({target}) => {
                setInputsValue({
                    ...inputsValue,
                    allergies: target.value
                })
            },
            value: inputsValue.allergies,
            xs: 12,
            sm: 12,
            md: 12,
            rows: 2,
            placeholder: '请输入内容',
            fullWidth: true
        },
        {
            type: 'TextArea',
            label: '体格检查',
            onChange: ({target}) => {
                setInputsValue({
                    ...inputsValue,
                    physicalExamination: target.value
                })
            },
            value: inputsValue.physicalExamination,
            xs: 12,
            sm: 12,
            md: 12,
            rows: 2,
            placeholder: '请输入内容',
            fullWidth: true
        },
    ];

    useEffect(() => {
        setContentHeight(calculateContentHeight());
    }, []);

    useEffect(() => {
        if (!props.patient) {
            setInputsValue({
                mainDescription: '请选择诊断病人', //主诉
                nowDiseaseHistory: '请选择诊断病人', //现病史
                nowTreatment: '请选择诊断病人', //现病治疗情况
                pastHistory: '请选择诊断病人', //既往史
                allergies: '请选择诊断病人', //过敏史,
                physicalExamination: '请选择诊断病人' //体格检查,
            })
        } else {
            let diagnosis = ctx.state.diagnosis.find(item => item.reservationId === props.patient.reservationId);
            if (diagnosis) {
                setInputsValue({
                    mainDescription: diagnosis.mainDescription, //主诉
                    nowDiseaseHistory: diagnosis.nowDiseaseHistory, //现病史
                    nowTreatment: diagnosis.nowTreatment, //现病治疗情况
                    pastHistory: diagnosis.pastHistory, //既往史
                    allergies: diagnosis.allergies, //过敏史,
                    physicalExamination: diagnosis.physicalExamination //体格检查,
                });
                setDiseaseDiagnosis(diagnosis.diseaseDiagnosis);
            } else {
                initPatientMedicalInfo()
            }
        }
    }, [props.patient]);

    const calculateContentHeight = () => {
        return Boolean(props.medicalRecordContentHeight).yes(height => height)
            .otherwise(() => (
                document.getElementById('button-group').let(searchBar => (
                    searchBar.offsetHeight
                )).let(buttonGroupHeight => (
                    theme.mixins.toolbar.minHeight * 1.5 + buttonGroupHeight
                )).let(allShouldSubHeight => (
                    window.innerHeight - allShouldSubHeight
                )).let(normalHeight => (
                    normalHeight - fixedHeight
                ))
            ));
    };

    /**
     * 切换诊断类型 西医/中医
     * */
    const handleDiagnosisTypeChange = ({target}) => {
        setDiagnosisType(target.value);
    };

    /**
     * 删除一堆诊断
     * */
    const handleDeleteDiagnosis = (diagnosis) => {
        diseaseDiagnosis.filter(disDiagnosis => (
            diagnosis.every(shouldDelete => shouldDelete.icdCode !== disDiagnosis.icdCode)
        )).also(newDiseaseDiagnosis => {
            setDiseaseDiagnosis(newDiseaseDiagnosis);
        });
    };

    /**
     * 打开添加诊断信息的dialog
     * */
    const handleAddDiagnosis = () => {
        setAddDiseaseDiagnosisOpen(true);
    };

    /**
     * 取消添加诊断信息
     * */
    const handleCancelAddDiagnosis = () => {
        setAddDiseaseDiagnosisOpen(false);
        setChosenDisease([]);
    };

    /**
     * 确认添加一个诊断信息
     * */
    const handleConfirmAddDiagnosis = () => {
        //关闭dialog
        setAddDiseaseDiagnosisOpen(false);
        //添加至诊断数组
        setDiseaseDiagnosis([
            ...diseaseDiagnosis,
            ...chosenDisease.map(dis => ({
                icdCode: dis.icdCode,
                diseaseName: dis.diseaseName,
                occurredTime: new Date()
            }))
        ]);
        //清空
        setChosenDisease([]);
    };

    /**
     * 暂存
     * */
    const handleTemporaryStorageIconClick = () => {
        if (!props.patient) {
            showErrorMessage(ctx, "未选择诊断病人");
            return;
        }

        if (props.patient.status === 1) {
            showErrorMessage(ctx, "该病人已诊断");
            return;
        }

        addDiagnosis(ctx, {
            reservationId: props.patient.reservationId,
            ...inputsValue,
            diseaseDiagnosis: [
                ...diseaseDiagnosis
            ]
        });
        showSuccessMessage(ctx, "暂存成功");
    };

    /**
     * 提交
     * */
    const handleCommitIconClick = () => {
        if (!props.patient) {
            showErrorMessage(ctx, "未选择诊断病人");
            return;
        }

        if (props.patient.status === 1) {
            showErrorMessage(ctx, "该病人已诊断");
            return;
        }

        if (Object.keys(inputsValue).some(key =>
            !inputsValue[key]
        )) {
            showErrorMessage(ctx, "请填写完整");
            return;
        }

        if (diseaseDiagnosis.length === 0) {
            showErrorMessage(ctx, "至少选择一种疾病");
            return;
        }

        diagnoseRepository.commitDiagnose({
            reservation_id: props.patient.reservationId,
            description: inputsValue.mainDescription,
            current_history: inputsValue.nowDiseaseHistory,
            treatment_situation: inputsValue.nowTreatment,
            pass_history: inputsValue.pastHistory,
            allergy_history: inputsValue.allergies,
            check: inputsValue.physicalExamination,
            diagnosis: diseaseDiagnosis.map(item => ({
                ICD: item.icdCode,
                date: new DateFnsUtils().format(new Date(item.occurredTime), "yyyy-MM-dd")
            }))
        }).then(data => {
            showSuccessMessage(ctx, "提交成功");
            removeDiagnosis(ctx, props.patient.reservationId);
            setDiseaseDiagnosis([]);
            props.onDiagnosisCommitSuccess && props.onDiagnosisCommitSuccess(props.patient);
        }).catch(data => {
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message)
            })
        })
    };

    /**
     * 清除所有
     * */
    const handleClearIconClick = () => {
        setInputsValue({
            mainDescription: '', //主诉
            nowDiseaseHistory: '', //现病史
            nowTreatment: '', //现病治疗情况
            pastHistory: '', //既往史
            allergies: '', //过敏史,
            physicalExamination: '' //体格检查,
        });
        setDiseaseDiagnosis([]);
    };

    /**
     * 搜索disease
     * */
    const handleSearchDiseaseChange = ({target}) => {
        diagnoseRepository.getDiseaseByName({
            diseaseName: target.value
        }).then(data => {
            setSearchedDisease(data.map(disease => ({
                icdCode: disease.icd,
                diseaseName: disease.name,
                occurredTime: new Date()
            })))
        }).catch(data => {
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message);
            })
        })
    };

    const handleDateTimeChange = (newDiseaseDiagnosis) => {
        let updateDiseaseDiagnosis = diseaseDiagnosis;
        updateDiseaseDiagnosis.find(item => item.icdCode === newDiseaseDiagnosis.icdCode)
            .occurredTime = newDiseaseDiagnosis.occurredTime;
        setDiseaseDiagnosis(updateDiseaseDiagnosis)
    };

    const handleDiseaseChosenChange = (searchedDiseases, chosenDiseases) => {
        setSearchedDisease(searchedDiseases);
        setChosenDisease(chosenDiseases);
    };

    /**
     * 获取该病人最近的一次病历
     * */
    const initPatientMedicalInfo = () => {
        diagnoseRepository.getRecentMedicalRecordByCode({
            medicalNumber: props.patient.patientCode
        }).then(data => {
            setInputsValue({
                mainDescription: data.description, //主诉
                nowDiseaseHistory: data.current_history, //现病史
                nowTreatment: data.treatment_situation, //现病治疗情况
                pastHistory: data.pass_history, //既往史
                allergies: data.allergy_history, //过敏史,
                physicalExamination: data.check //体格检查,
            });
            setDiseaseDiagnosis([]);
        }).catch(data => {
            handleNetCodeMessage(data, (message, code) => {
                if (code === -10) {
                    setInputsValue({
                        mainDescription: '', //主诉
                        nowDiseaseHistory: '', //现病史
                        nowTreatment: '', //现病治疗情况
                        pastHistory: '', //既往史
                        allergies: '', //过敏史,
                        physicalExamination: '' //体格检查,
                    })
                } else {
                    showErrorMessage(ctx, message)
                }

            })
        })
    };

    return (
        <>
            <MedicalRecordModifyHeader
                id={'button-group'}
                onTemporaryStorageIconClick={handleTemporaryStorageIconClick}
                onCommitIconClick={handleCommitIconClick}
                onClearIconClick={handleClearIconClick}/>
            <div
                className={classes.root}
                style={{height: contentHeight}}>
                <Typography
                    className={classes.defaultMarginTop}
                    variant={"subtitle1"}>
                    病史内容
                </Typography>
                <Grid container>
                    <GridInputs inputsTemp={inputTemps}/>
                </Grid>
                <Grid
                    container
                    alignItems={"center"}
                    className={classes.defaultMarginTop}>
                    <Typography
                        variant={"subtitle1"}>
                        评估诊断
                    </Typography>
                    <RadioGroup
                        style={{flexDirection: "row"}}
                        value={diagnosisType}
                        onChange={handleDiagnosisTypeChange}>
                        <div style={{marginLeft: theme.spacing(2)}}/>
                        <FormControlLabel
                            value={'西医诊断'}
                            control={<Radio/>}
                            label={'西医诊断'}/>
                        <FormControlLabel
                            value={'中医诊断'}
                            control={<Radio/>}
                            label={'中医诊断'}/>
                    </RadioGroup>
                </Grid>
                <div style={{margin: theme.spacing(1)}}>
                    <DiseaseDiagnosisTable
                        title={diagnosisType}
                        diseaseDiagnosis={diseaseDiagnosis}
                        onDeleteIconClick={handleDeleteDiagnosis}
                        onAddIconClick={handleAddDiagnosis}
                        onDateTimeChange={handleDateTimeChange}/>
                </div>
            </div>
            <Dialog
                open={addDiseaseDiagnosisOpen}
                fullScreen>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleCancelAddDiagnosis} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            添加诊断
                        </Typography>
                        <Button color="inherit" onClick={handleConfirmAddDiagnosis}>
                            添加
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <div style={{margin: `${theme.spacing(4)}px`}}>
                        <AddDiagnosisDialogContent
                            diseases={searchedDisease}
                            onSearchContentChange={handleSearchDiseaseChange}
                            onDiseaseChosenChange={handleDiseaseChosenChange}/>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    )
};

MedicalRecordModifyPage.propTypes = {
    medicalRecordContentHeight: PropTypes.number,
    patient: PropTypes.shape({
        reservationId: PropTypes.number, //预约id
        patientCode: PropTypes.string, //病人病历号？
        name: PropTypes.string //病人名称
    }),
    onDiagnosisCommitSuccess: PropTypes.func
};

export default MedicalRecordModifyPage;