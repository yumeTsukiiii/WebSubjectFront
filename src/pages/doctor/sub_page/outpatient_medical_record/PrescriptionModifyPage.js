import React, {useContext, useEffect, useState} from 'react';
import PrescriptionModifyHeader from "./components/prescription_modify_page/PrescriptionModifyHeader";
import {makeStyles, useTheme} from "@material-ui/styles";
import PrescriptionTable from "./components/prescription_modify_page/PrescriptionTable";
import PropTypes from 'prop-types';
import {Dialog} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import SearchDrugDialogContent from "./components/prescription_modify_page/SearchDrugDialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import SearchTemplateDialogContent from "./components/prescription_modify_page/SearchTemplateDialogContent";
import GlobalContext from "../../../../store/context";
import {DiagnoseRepository} from "../../../../net/repo/repository";
import {handleNetCodeMessage} from "../../../../net/handler/ResponseHandler";
import {showErrorMessage, showSuccessMessage} from "../../../../store/default";

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

const PrescriptionModifyPage = (props) => {

    const classes = useStyles();

    const theme = useTheme();

    const ctx = useContext(GlobalContext);

    const diagnoseRepository = DiagnoseRepository.of('remote');

    //搜索药品dialog开关
    const [searchDrugDialogOpen, setSearchDrugDialogOpen] = useState(false);
    //新建处方dialog开关
    const [newPrescriptionDialogOpen, setNewPrescriptionDialogOpen] = useState(false);
    //新建处方(搜索模版)dialog开关
    const [newPrescriptionWithTempDialogOpen, setNewPrescriptionWithTempDialogOpen] = useState(false);
    //改变处方名称dialog开关
    const [changePrescriptionNameDialogOpen, setChangePrescriptionNameDialogOpen] = useState(false);
    //正在改变名称的处方名称
    const [currentChangePrecriptionName, setCurrentChangePrescriptionName] = useState('');
    //改变后的处方名称
    const [changedPrescriptionName, setChangedPrescriptionName] = useState('');
    //新建处方的名称
    const [newPrescriptionName, setNewPrescriptionName] = useState('');
    //页面处方table-content最大高度
    const [contentHeight, setContentHeight] = useState(props.medicalRecordContentHeight);
    //搜索到的药品
    const [searchedDrug, setSearchedDrug] = useState([]);
    //搜索到的模版
    const [searchedTemplate, setSearchedTemplate] = useState([
        {
            name: 'demo模版',
            scope: '全院',
            details: [
                {
                    name: '某药品',
                    specification: '爱咋用咋用',
                    usage: '= =',
                    dosage: 1,
                    frequency: 'emm',
                    price: 0
                }
            ]
        }
    ]);
    //选择的模版
    const [chosenTemplate, setChosenTemplate] = useState(null);
    //选择好的药品
    const [chosenDrug, setChosenDrug] = useState([]);
    //当前编辑中的处方
    const [prescriptions, setPrescriptions] = useState([{
        name: '某处方',
        detail: []
    }]);
    //当前选择中的处方名称
    const chosenPrescription = [];
    //当前添加药瓶中的处方

    const [currentEditPrescriptionName, setCurrentEditPrescriptionName] = useState('');

    useEffect(() => {
        setContentHeight(calculateContentHeight());
    }, []);

    const calculateContentHeight = () => {
        return Boolean(props.prescriptionContentHeight).yes(height => height)
            .otherwise(() => (
                document.getElementById('prescription-button-group').let(searchBar => (
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
     * 打开添加新的空处方dialog
     * */
    const handleAddPrescription = () => {
        setNewPrescriptionDialogOpen(true);
    };

    /**
     * 打开搜索处方模版dialog
     * */
    const handleAddPrescriptionWithTemp = () => {
        setNewPrescriptionWithTempDialogOpen(true);
    };

    /**
     * 添加新的空处方
     * */
    const handleConfirmAddPrescription = () => {
        if (!props.patient) {
            showErrorMessage(ctx, "请先选择病人");
            setNewPrescriptionName('');
            setNewPrescriptionDialogOpen(false);
            return;
        }
        setNewPrescriptionDialogOpen(false);
        setPrescriptions([
            ...prescriptions,
            {
                name: newPrescriptionName,
                detail: []
            }
        ])
    };

    /**
     * 从选中的处方模版添加处方
     * */
    const handleConfirmAddPrescriptionWithTemp = () => {
        //更新添加新处方
        if (!chosenTemplate) {
            showErrorMessage(ctx, "请选择一个模版");
            return;
        }
        setPrescriptions([
            ...prescriptions,
            {
                name: chosenTemplate.name,
                detail: chosenTemplate.details.map(tempDetail => ({
                    id: tempDetail.id,
                    name: tempDetail.name,
                    specification: tempDetail.specification,
                    usage: tempDetail.usage,
                    dosage: tempDetail.dosage,
                    frequency: tempDetail.frequency,
                    price: tempDetail.price
                }))
            }
        ]);
        setSearchedTemplate([]);
        setChosenTemplate(null);
        setNewPrescriptionWithTempDialogOpen(false)
    };

    /**
     * 提交处方
     * */
    const handleCommitPrescription = () => {
        if (!props.patient) {
            showErrorMessage(ctx, "请先选择病人");
            return;
        }
        diagnoseRepository.commitPrescription({
            id: props.patient.reservationId,
            prescriptions: prescriptions.map(pres => ({
                ...pres,
                detail: pres.detail.map(item => ({
                    id: item.id,
                    usage: item.usage,
                    frequency: item.frequency,
                    dosage: item.dosage
                }))
            }))
        }).then(data => {
            showSuccessMessage(ctx, "提交成功")
        }).catch(data => {
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message)
            })
        })
    };

    /**
     * 删除选中的处方
     * */
    const handleDeletePrescription = () => {
        setPrescriptions(prescriptions.filter(prescription =>
            chosenPrescription.indexOf(prescription.name) === -1));
        chosenPrescription.length = 0;
    };

    /**
     * 选择/取消选择要删除的处方
     * */
    const handleChoosePrescription = (prescriptionName, isChosen) => {
        if (isChosen) {
            chosenPrescription.push(prescriptionName);
        } else {
            let removeIndex = prescriptions.findIndex(pre => pre.name === prescriptionName);
            let afterRemovedPrescription = chosenPrescription.slice(removeIndex, removeIndex + 1);
            chosenPrescription.length = 0;
            chosenPrescription.push(afterRemovedPrescription);
        }
    };

    /**
     * 删除一个药品
     * */
    const handleDeleteDrug = (rows, prescriptionName) => {
        let newPrescriptions = [...prescriptions];
        let editPrescription = newPrescriptions.find(item => item.name === prescriptionName);
        editPrescription.detail.filter(drug => (
            rows.every(shouldDelete => shouldDelete.id !== drug.id)
        )).also(newDetail => {
            editPrescription.detail = newDetail
        });
        setPrescriptions(newPrescriptions);
    };

    /**
     * 添加一个药品
     * */
    const handleAddDrug = (prescriptionName) => {
        setCurrentEditPrescriptionName(prescriptionName);
        setSearchDrugDialogOpen(true)
    };

    /**
     * 关闭添加搜索添加药品的dialog
     * */
    const handleCancelAddDrug = () => {
        setCurrentEditPrescriptionName('');
        setSearchDrugDialogOpen(false);
    };

    /**
     * 添加一个药品到处方
     * */
    const handleConfirmAddDrug = () => {
        setSearchDrugDialogOpen(false);
        let newPrescriptions = prescriptions;
        newPrescriptions.find(prescription => prescription.name === currentEditPrescriptionName)
            .also(it => {
                it.detail = chosenDrug.map(drug => ({
                    id: drug.id,
                    price: drug.price, //药品价格
                    name: drug.name, //药品规格
                    specification: drug.specification,
                    dosage: 1, //药量
                    usage: '', //用法
                    frequency: '', //频次,
                }));
                setPrescriptions(newPrescriptions)
            });

        setCurrentEditPrescriptionName('');
    };

    /**
     * 搜索药品
     * */
    const handleSearchDrugContentChange = ({target}) => {
        diagnoseRepository.getDrugsByName({
            drugName: target.value
        }).then(data => {
            setSearchedDrug(data.map(drug => ({
                id: drug.id,
                name: drug.name,
                specification: drug.specification,
                price: drug.price,
                format: drug.name
            })))
        }).catch(data => {
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message)
            });
        });
    };

    /**
     * 药品项内容改变触发
     * */
    const handleDrugItemContentChange = (rowData, prescriptionName) => {
        console.log('emm', rowData);
        console.log(prescriptions);
        let newPrescriptions = prescriptions;
        try {
            newPrescriptions.find(prescription => prescription.name === prescriptionName)
                .also(prescription => {
                    prescription.detail.find(item => item.id === rowData.id)
                        .also(it => {
                            it.id = rowData.id;
                            it.price = rowData.price; //药品价格
                            it.name = rowData.name; //药品规格
                            it.specification = rowData.specification;
                            it.usage = rowData.usage; //用法
                            it.dosage = rowData.dosage; //用量
                            it.frequency = rowData.frequency; //频次
                            it.amount = rowData.amount //数量
                        })
                });
            setPrescriptions(newPrescriptions);
        } catch (e) {
            console.log(e)
        }
    };

    /**
     * 改变搜索和选择的药品项
     * */
    const handleDrugChoiceChange = (searchedDrug, chosenDrug) => {
        setSearchedDrug(searchedDrug);
        setChosenDrug(chosenDrug);
    };

    /**
     * 查询处方模版
     * */
    const handleSearchTemplateContentChange = ({target}) => {
        diagnoseRepository.getPrescriptionTemplateByName({
            diagnoseName: target.value
        }).then(data => {
            let temps = data.map(temp => ({
                name: temp.name,
                scope: temp.scope,
                details: []
            }));
            setSearchedTemplate(temps);

            /**搜索模版详情*/
            temps.map(temp => (
                diagnoseRepository.getPrescriptionDetailByName({
                    name: temp.name
                }).then(data => {
                    temp.details = data.map(detail => ({
                        id: detail.id,
                        price: detail.price,
                        name: detail.name,
                        specification: detail.specification,
                        usage: detail.usage,
                        dosage: detail.dosage,
                        frequency: detail.frequency
                    }))
                })
            )).also(it => {
                Promise.all(it).then(() => {
                        setSearchedTemplate(temps);
                    }).catch(data => {
                        handleNetCodeMessage(data, message => {
                            showErrorMessage(ctx, message)
                        })
                    })
            })

        }).catch(data => {
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message)
            })
        })
    };

    /**
     * 选择某处方模版
     * */
    const handleChooseTemplate = (template) => {
        setChosenTemplate(template);
    };

    /**
     * 打开修改处方名称dialog
     * */
    const handleOpenChangePrescriptionName = (prescriptionName) => {
        setCurrentChangePrescriptionName(prescriptionName);
        setChangedPrescriptionName(prescriptionName);
        setChangePrescriptionNameDialogOpen(true)
    };

    /**
     * 取消修改处方名称
     * */
    const handleCancelModifyPrescriptionName = () => {
        setCurrentChangePrescriptionName('');
        setChangedPrescriptionName('');
        setChangePrescriptionNameDialogOpen(false);
    };

    /**
     * 修改处方名称
     * */
    const handleConfirmChangePrescriptionName = () => {
        if (prescriptions.filter(pre => pre.name === changedPrescriptionName).length !== 0) {
            showErrorMessage(ctx, "已有相同名称处方");
            return;
        }
        let newPrescriptions = [...prescriptions];
        newPrescriptions.forEach(pre => {
            if (pre.name === currentChangePrecriptionName) {
                pre.name = changedPrescriptionName
            }
        });
        setPrescriptions(newPrescriptions);
        setCurrentChangePrescriptionName('');
        setChangedPrescriptionName('');
        setChangePrescriptionNameDialogOpen(false);
    };

    return (
        <>
            <PrescriptionModifyHeader
                id={'prescription-button-group'}
                onAddIconClick={handleAddPrescription}
                onCommitIconClick={handleCommitPrescription}
                onDeleteIconClick={handleDeletePrescription}
                onAddWithTempIconClick={handleAddPrescriptionWithTemp}/>
            <div
                className={classes.root}
                style={{height: contentHeight}}>
                {prescriptions.map((prescription, index) => (
                    <div
                        style={{margin: theme.spacing(1)}}
                        key={`${prescription.name}-${index}`}>
                        <PrescriptionTable
                            prescriptionName={prescription.name}
                            drugs={[...prescription.detail]}
                            onDeleteIconClick={handleDeleteDrug}
                            onAddIconClick={handleAddDrug}
                            onTableChosenChange={handleChoosePrescription}
                            onDrugItemContentChange={handleDrugItemContentChange}
                            onPrescriptionNameChangeIconClick={handleOpenChangePrescriptionName}
                        />
                    </div>
                ))}
            </div>
            {/**添加药品的dialog */}
            <Dialog
                open={searchDrugDialogOpen}
                fullScreen>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleCancelAddDrug} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            添加药品
                        </Typography>
                        <Button color="inherit" onClick={handleConfirmAddDrug}>
                            添加
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <SearchDrugDialogContent
                        drugs={searchedDrug}
                        onSearchContentChange={handleSearchDrugContentChange}
                        onDrugChoiceChange={handleDrugChoiceChange}/>
                </DialogContent>
            </Dialog>
            {/**新增处方的dialog */}
            <Dialog open={newPrescriptionDialogOpen}>
                <DialogTitle>
                    新增处方
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label={'处方名称'}
                        value={newPrescriptionName}
                        onChange={({target}) => {setNewPrescriptionName(target.value)}}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setNewPrescriptionDialogOpen(false) }}>
                        取消
                    </Button>
                    <Button
                        color={"primary"}
                        onClick={() => {handleConfirmAddPrescription()}}>
                        确认
                    </Button>
                </DialogActions>
            </Dialog>
            {/**搜索模版的dialog */}
            <Dialog
                open={newPrescriptionWithTempDialogOpen}
                fullWidth
                maxWidth={"md"}>
                <DialogContent>
                    <SearchTemplateDialogContent
                        onSearchContentChange={handleSearchTemplateContentChange}
                        templateList={searchedTemplate}
                        onChooseTemplate={handleChooseTemplate}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setNewPrescriptionWithTempDialogOpen(false) }}>
                        取消
                    </Button>
                    <Button
                        color={"primary"}
                        onClick={() => {handleConfirmAddPrescriptionWithTemp()}}>
                        确认
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={changePrescriptionNameDialogOpen}
                fullWidth>

                <DialogTitle title={'修改处方名称'}/>

                <DialogContent>
                    <TextField value={changedPrescriptionName}
                               onChange={({target}) => { setChangedPrescriptionName(target.value) }}
                               label={'处方名称'}
                                fullWidth/>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCancelModifyPrescriptionName}>
                        取消
                    </Button>
                    <Button
                        color={"primary"}
                        onClick={handleConfirmChangePrescriptionName}>
                        修改
                    </Button>
                </DialogActions>

            </Dialog>
        </>
    );
};

PrescriptionModifyPage.propTypes = {
    prescriptionContentHeight: PropTypes.number,
    patient: PropTypes.shape({
        reservationId: PropTypes.number, //预约id
        patientCode: PropTypes.string, //病人病历号？
        name: PropTypes.string //病人名称
    })
};

export default PrescriptionModifyPage;