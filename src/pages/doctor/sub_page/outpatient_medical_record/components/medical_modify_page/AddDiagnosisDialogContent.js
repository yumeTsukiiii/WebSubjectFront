import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import {useTheme} from "@material-ui/styles";
import PropTypes from "prop-types";
import SearchBar from "../../../../../../components/SearchBar";
import TransferList from "../../../../../../components/TransferList";

const AddDiagnosisDialogContent = (props) => {

    const theme = useTheme();

    const searchedDisease = {
        title: '未选择',
        items: props.diseases
    };

    const handleChosenChange = (leftItems, rightItems) => {
        props.onDiseaseChosenChange(leftItems, rightItems);
    };

    return (
        <Grid
            container
            direction={"column"}
            alignItems={"center"}>
            <div style={{marginBottom: `${theme.spacing(4)}px`}}>
                <SearchBar label={'疾病名称'} onChange={props.onSearchContentChange} />
            </div>
            <TransferList
                leftRenderKey={'diseaseName'}
                rightRenderKey={'diseaseName'}
                leftChoices={searchedDisease}
                rightChoices={{
                    title: '已选择',
                    items: []
                }}
                onChoicesChange={handleChosenChange}/>
        </Grid>
    );
};

AddDiagnosisDialogContent.propTypes = {
    diseases: PropTypes.arrayOf(PropTypes.shape({
        icdCode: PropTypes.string.isRequired,
        diseaseName: PropTypes.string.isRequired
    })).isRequired,
    onSearchContentChange: PropTypes.func.isRequired,
    onDiseaseChosenChange: PropTypes.func.isRequired
};

export default AddDiagnosisDialogContent;