import React from 'react';
import PropTypes from 'prop-types'
import Grid from "@material-ui/core/Grid";
import {Tooltip} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from '@material-ui/icons/Save';
import UploadIcon from '@material-ui/icons/CloudUpload';
import ClearIcon from '@material-ui/icons/ClearAll';

const MedicalRecordModifyHeader = (props) => {
    return (
        <Grid
            id={props.id}
            container
            justify={"space-around"}>
            <Tooltip title={"暂存"} >
                <IconButton
                    aria-label={"暂存"}
                    onClick={props.onTemporaryStorageIconClick}>
                    <SaveIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title={"提交"} >
                <IconButton
                    aria-label={"提交"}
                    onClick={props.onCommitIconClick}>
                    <UploadIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title={"清空所有"}>
                <IconButton
                    aria-label={"清空所有"}
                    onClick={props.onClearIconClick}>
                    <ClearIcon/>
                </IconButton>
            </Tooltip>
        </Grid>
    );
};

MedicalRecordModifyHeader.propTypes = {
    id: PropTypes.string.isRequired,
    onTemporaryStorageIconClick: PropTypes.func.isRequired,
    onCommitIconClick: PropTypes.func.isRequired,
    onClearIconClick: PropTypes.func.isRequired
};


export default MedicalRecordModifyHeader;