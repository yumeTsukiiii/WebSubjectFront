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
import Done from '@material-ui/icons/Done'

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

const MedicineTable = (props) => {
    const columns = [
        { title: '药品名称', field: 'name' },
        { title: '单价', field: 'price' },
        { title: '数量', field: 'amount' },
        { title: '单价', field: 'price' },
        { title: '开立医生', field: 'doctor' },
        { title: '开立时间', field: 'createTime' },
    ];

    const data = props.medicineInfo;

    return (
        <MaterialTable
            title="收费条目"
            columns={columns}
            data={data}
            icons={tableIcons}
            options={{
                actionsColumnIndex: -1,
                search: false,
                selection: true
            }}
            actions={[
                {
                    icon: Done,
                    tooltip: '发药',
                    onClick: (event, rowData) => {
                        props.onCharge(rowData)
                    }
                }
            ]}
        />
    );
};

MedicineTable.propTypes = {
    medicineInfo: PropTypes.arrayOf(PropTypes.shape(
        {
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            amount: PropTypes.number.isRequired,
            doctor: PropTypes.string.isRequired,
            createTime: PropTypes.string.isRequired,
        }
    )).isRequired,
    onMedicine: PropTypes.func.isRequired
};

export default MedicineTable;