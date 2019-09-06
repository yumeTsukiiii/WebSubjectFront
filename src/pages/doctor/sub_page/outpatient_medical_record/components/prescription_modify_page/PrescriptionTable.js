import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types'
import MaterialTable, {MTableToolbar} from "material-table";

import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {useTheme} from "@material-ui/styles";
import {TextField} from "@material-ui/core";
import SelectAll from '@material-ui/icons/SelectAll';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const RedDelete = () => <Delete style={{color: 'red'}}/>;
const BlueAdd = () => <Add style={{color: "dodgerblue"}}/>;

const PrescriptionTable = (props) => {

    const theme = useTheme();

    const [selected, setSelected] = useState(false);

    const [actions, setActions] = useState([
        {
            icon: BlueAdd,
            tooltip: '添加药品',
            isFreeAction: true,
            onClick: (event) => {
                props.onAddIconClick(props.prescriptionName)
            }
        },
        {
            icon: Edit,
            tooltip: '修改处方名称',
            isFreeAction: true,
            onClick: (event) => {
                props.onPrescriptionNameChangeIconClick(props.prescriptionName)
            }
        }
    ]);

    useEffect(() => {
        if (selected) {
            setActions([
                {
                    icon: SelectAll,
                    tooltip: '关闭选择',
                    isFreeAction: true,
                    onClick: () => {
                        setSelected(!selected);
                    }
                },
                ...actions.filter(action => action.tooltip !== '开启选择'),
                {
                    icon: RedDelete,
                    tooltip: '删除药品',
                    onClick: (event, rows) => {
                        props.onDeleteIconClick(rows, props.prescriptionName)
                    }
                }
            ])
        } else {
            setActions([
                {
                    icon: SelectAll,
                    tooltip: '开启选择',
                    isFreeAction: true,
                    onClick: () => {
                        setSelected(!selected);
                    }
                },
                ...actions.filter(action => action.tooltip !== '删除药品')
                    .filter(action => action.tooltip !== '关闭选择'),
            ]);
        }
    }, [selected]);

    const columns = [
        {
            title: '名称',
            field: 'name',
            editComponent: props => (
                <TextField
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                    disabled/>
            )
        },
        {
            title: '规格',
            field: 'specification',
            editComponent: props => (
                <TextField
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                    disabled/>
            ) },
        {
            title: '单价',
            field: 'price',
            editComponent: props => (
                <TextField
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                    disabled/>
            )
        },
        {
            title: '用法',
            field: 'usage',
            render: rowData => <TextField disabled value={rowData.usage}/>,
            editComponent: props => (
                <TextField
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}/>
            )
        },
        {
            title: '频次',
            field: 'frequency',
            render: rowData => <TextField disabled value={rowData.frequency}/>,
            editComponent: props => (
                <TextField
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}/>
            )
        },
        {
            title: '数量',
            field: 'dosage',
            render: rowData => <TextField disabled value={rowData.dosage}/>,
            editComponent: props => (
                <TextField
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}/>
            )
        }
    ];

    const [chosen, setChosen] = useState(false);

    const data = props.drugs;

    return (
        <MaterialTable
            title={props.prescriptionName}
            columns={columns}
            data={data}
            icons={tableIcons}
            components={{
                Toolbar: toolbarProps => (
                    <div>
                        <MTableToolbar {...toolbarProps} />
                        <Grid
                            container
                            alignItems={"center"}
                            style={{marginLeft: theme.spacing(3)}}>
                            <FormControlLabel
                                control={
                                    <Checkbox onChange={({target}) => {
                                        setChosen(target.checked);
                                        props.onTableChosenChange(props.prescriptionName, target.checked);
                                    }} checked={chosen}/>
                                }
                                label={'选择处方'}/>
                        </Grid>
                    </div>
                )
            }}
            options={{
                actionsColumnIndex: -1,
                search: false,
                selection: selected,
                pageSize: 5,
                pageSizeOptions:[1, 5]
            }}
            actions={actions}
            editable={{
                isDeletable: false,
                onRowUpdate: (newData, oldData) => (
                    new Promise((resolve) => {
                        props.onDrugItemContentChange(newData, props.prescriptionName);
                        resolve(newData);
                    })
                )
            }}
        />
    )
};

PrescriptionTable.propTypes = {
    prescriptionName: PropTypes.string.isRequired,
    drugs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired, //药品价格
        name: PropTypes.string.isRequired,
        specification: PropTypes.string.isRequired,//药品规格
        dosage: PropTypes.string.isRequired, //药量
        usage: PropTypes.string.isRequired, //用法
        frequency: PropTypes.string.isRequired, //频次

    })).isRequired,
    onDeleteIconClick: PropTypes.func.isRequired,
    onAddIconClick: PropTypes.func.isRequired,
    onTableChosenChange: PropTypes.func.isRequired,
    onDrugItemContentChange: PropTypes.func.isRequired,
    onPrescriptionNameChangeIconClick: PropTypes.func.isRequired
};

export default PrescriptionTable;