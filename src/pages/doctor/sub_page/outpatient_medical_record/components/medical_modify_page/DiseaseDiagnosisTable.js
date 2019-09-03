import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types'
import MaterialTable from "material-table";

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
import SelectAll from '@material-ui/icons/SelectAll'
import {DateTimePicker} from "@material-ui/pickers";
import {TextField} from "@material-ui/core";

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

const DiseaseDiagnosisTable = (props) => {

    const [selected, setSelected] = useState(false);

    const [actions, setActions] = useState([
        {
            icon: BlueAdd,
            tooltip: '添加诊断',
            isFreeAction: true,
            onClick: (event) => {
                props.onAddIconClick(event)
            }
        }
    ]);

    const columns = [
        {
            title: 'ICD编码',
            field: 'icdCode',
            editComponent: props => (
                <TextField
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                    disabled/>
            )
        },
        {
            title: '疾病名称',
            field: 'diseaseName',
            editComponent: props => (
                <TextField
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                    disabled/>
            )
        },
        {
            title: '发病时间',
            field: 'occurredTime',
            render: rowData => <DateTimePicker disabled value={rowData.occurredTime} format={'yyyy-MM-dd hh:mm'} />,
            editComponent: props => (
                <DateTimePicker
                    value={props.value}
                    onChange={date => props.onChange(date)}
                    format={'yyyy-MM-dd hh:mm'}/>
            )
        }
    ];

    const data = props.diseaseDiagnosis;

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
                    tooltip: '删除',
                    onClick: (event, rows) => {
                        props.onDeleteIconClick(rows)
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
                ...actions.filter(action => action.tooltip !== '删除')
                    .filter(action => action.tooltip !== '关闭选择'),
            ]);
        }
    }, [selected]);

    return (
        <MaterialTable
            title={props.title}
            columns={columns}
            data={data}
            icons={tableIcons}
            options={{
                actionsColumnIndex: -1,
                search: false,
                selection: selected
            }}
            actions={actions}
            editable={{
                isDeletable: false,
                onRowUpdate: (newData, oldData) => (
                    new Promise((resolve) => {
                        props.onDateTimeChange(newData);
                        resolve(newData.occurredTime);
                    })
                )
            }}

        />
    )
};

DiseaseDiagnosisTable.propTypes = {
    title: PropTypes.string.isRequired,
    diseaseDiagnosis: PropTypes.arrayOf(PropTypes.shape({
        icdCode: PropTypes.string.isRequired,
        diseaseName: PropTypes.string.isRequired,
        occurredTime: PropTypes.isRequired //Date类型
    })).isRequired,
    onDeleteIconClick: PropTypes.func.isRequired,
    onAddIconClick: PropTypes.func.isRequired,
    onDateTimeChange: PropTypes.func.isRequired
};

export default DiseaseDiagnosisTable;