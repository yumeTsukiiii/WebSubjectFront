import React from 'react';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
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
import Undo from '@material-ui/icons/Undo';

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
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    Undo: forwardRef((props, ref) => <Undo {...props} ref={ref} />)
};

const RedUndo = () => <Undo style={{color: 'red'}}/>;

const PatientInfoTable = (props) => {
    const columns = [
        { title: '病历号', field: 'medicalNumber' },
        { title: '姓名', field: 'name' },
        { title: '身份证号', field: 'identityNumber' },
        { title: '挂号日期', field: 'registeredDate' },
        { title: '午别', field: 'registeredNoon' },
        { title: '看诊科室', field: 'visitDepartment' },
        { title: '看诊状态', field: 'visitStatus' },
    ];

    const data = props.patientsInfo;

    return (
        <MaterialTable
            title="病人信息"
            columns={columns}
            data={data}
            icons={tableIcons}
            options={{
                actionsColumnIndex: -1,
                search: false
            }}
            actions={[
                {
                    icon: RedUndo,
                    tooltip: '退号',
                    onClick: (event, rowData) => {
                        props.onUnRegistered(rowData)
                    }
                }
            ]}
        />
    );
};

PatientInfoTable.propTypes = {
    patientsInfo: PropTypes.arrayOf(PropTypes.shape(
        {
            medicalNumber: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            identityNumber: PropTypes.string.isRequired,
            registeredDate: PropTypes.string.isRequired,
            registeredNoon: PropTypes.string.isRequired,
            visitDepartment: PropTypes.string.isRequired,
            visitStatus: PropTypes.string.isRequired
        }
    )).isRequired,
    onUnRegistered: PropTypes.func.isRequired
};

export default PatientInfoTable;