import React from 'react';
import PropTypes from 'prop-types'
import Grid from "@material-ui/core/Grid";
import {Tooltip} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import UploadIcon from '@material-ui/icons/CloudUpload';
import ClearIcon from '@material-ui/icons/ClearAll';
import AddCircle from '@material-ui/icons/AddCircle';

const PrescriptionModifyHeader = (props) => {
    return (
        <Grid
            id={props.id}
            container
            justify={"space-around"}>
            <Tooltip title={"添加处方"} >
                <IconButton
                    aria-label={"添加处方"}
                    onClick={props.onAddIconClick}>
                    <AddIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title={"从模版添加"} >
                <IconButton
                    aria-label={"从模版添加"}
                    onClick={props.onAddWithTempIconClick}>
                    <AddCircle/>
                </IconButton>
            </Tooltip>
            <Tooltip title={"开立"} >
                <IconButton
                    aria-label={"开立"}
                    onClick={props.onCommitIconClick}>
                    <UploadIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title={"作废处方"}>
                <IconButton
                    aria-label={"作废处方"}
                    onClick={props.onDeleteIconClick}>
                    <ClearIcon/>
                </IconButton>
            </Tooltip>
        </Grid>
    );
};

PrescriptionModifyHeader.propTypes = {
    id: PropTypes.string.isRequired,
    onAddIconClick: PropTypes.func.isRequired,
    onCommitIconClick: PropTypes.func.isRequired,
    onDeleteIconClick: PropTypes.func.isRequired,
    onAddWithTempIconClick: PropTypes.func.isRequired
};


export default PrescriptionModifyHeader;