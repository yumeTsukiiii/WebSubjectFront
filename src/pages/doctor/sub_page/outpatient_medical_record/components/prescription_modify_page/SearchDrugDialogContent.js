import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import SearchBar from "../../../../../../components/SearchBar";
import TransferList from "../../../../../../components/TransferList";
import {useTheme} from "@material-ui/styles";
import PropTypes from "prop-types";

const SearchDrugDialogContent = (props) => {

    const theme = useTheme();

    const searchedDrug = {
        title: '未选择',
        items: props.drugs
    };

    const handleChoiceChange = (leftChoice, RightChoice) => {
        props.onDrugChoiceChange(leftChoice, RightChoice);
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
                leftRenderKey={'format'}
                rightRenderKey={'format'}
                leftChoices={searchedDrug}
                rightChoices={{
                    title: '已选择',
                    items: []
                }}
                onChoicesChange={handleChoiceChange}/>
        </Grid>
    );
};

SearchDrugDialogContent.propTypes = {
    drugs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        specification: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        format: PropTypes.string.isRequired
    })).isRequired,
    onSearchContentChange: PropTypes.func.isRequired,
    onDrugChoiceChange: PropTypes.func.isRequired
};

export default SearchDrugDialogContent;