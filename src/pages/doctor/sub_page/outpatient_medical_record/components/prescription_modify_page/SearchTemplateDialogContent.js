import React, {forwardRef, useState} from 'react';
import PropTypes  from 'prop-types';
import Grid from "@material-ui/core/Grid";
import SearchBar from "../../../../../../components/SearchBar";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import {makeStyles, useTheme} from "@material-ui/styles";
import MaterialTable from "material-table";
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
import ViewColumn from '@material-ui/icons/ViewColumn';
import Select from '@material-ui/icons/SelectAllRounded'

const tableIcons = {
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
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: '360px'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

const PrimarySelect = () => <Select color={"primary"}/>;

const SearchTemplateDialogContent = (props) => {

    const theme = useTheme();

    const classes = useStyles();

    const [expanded, setExpanded] = React.useState(-1);

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const [chosenTemplateId, setChosenTemplateId] = useState('');

    return (
        <Grid
            className={classes.root}
            container
            direction={"column"}
            alignItems={"center"}>
            <div style={{margin: theme.spacing(2)}}>
                <SearchBar
                    label={'模版名称'} onChange={props.onSearchContentChange}/>
            </div>
            {
                props.templateList.map(template => (
                    <ExpansionPanel
                        key={template.id}
                        expanded={expanded === template.id}
                        onChange={handleChange(template.id)}>
                        <ExpansionPanelSummary
                            style={{display:'flex', alignItems: 'center'}}
                            expandIcon={<ExpandMoreIcon />}>

                            <Typography className={classes.heading}>{template.name}</Typography>
                            <Typography className={classes.secondaryHeading}>{template.scope}</Typography>

                        </ExpansionPanelSummary>

                        <ExpansionPanelDetails>
                            {
                                <MaterialTable
                                    icons={tableIcons}
                                    title={'模版明细'}
                                    columns={[
                                        { title: '药品名称', field: 'name' },
                                        { title:'规格', field: 'specification' },
                                        { title: '用法', field: 'usage' },
                                        { title: '数量', field: 'dosage' },
                                        { title: '频次', field: 'frequency' }
                                    ]}
                                    data={template.details}
                                    options={{
                                        search: false
                                    }}
                                    actions={[
                                        {
                                            icon: chosenTemplateId === template.name ? PrimarySelect : Select,
                                            tooltip: '选择该模版',
                                            isFreeAction: true,
                                            onClick: () => {
                                                setChosenTemplateId(template.name);
                                                props.onChooseTemplate({...template})
                                            }
                                        }
                                    ]}
                                />
                            }
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                ))
            }
        </Grid>
    );
};

SearchTemplateDialogContent.propTypes = {
    onSearchContentChange: PropTypes.func.isRequired,
    templateList: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        scope: PropTypes.string.isRequired,
        details: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            specification: PropTypes.string.isRequired,
            usage: PropTypes.string.isRequired,
            dosage: PropTypes.string.isRequired,
            frequency: PropTypes.string.isRequired,
            price: PropTypes.string.isRequired
        })).isRequired
    })).isRequired,
    onChooseTemplate: PropTypes.func.isRequired
};

export default SearchTemplateDialogContent;