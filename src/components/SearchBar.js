import React, {useState} from 'react';
import {TextField} from "@material-ui/core";
import PropTypes from 'prop-types';
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

/**
 * 具有清空等操作的搜索TextView
 * */
const SearchBar = (props) => {

    const [searchValue, setSearchValue] = useState('');

    return (
        <TextField
            id={props.id}
            value={searchValue}
            onChange={(event) => {
                setSearchValue(event.target.value);
                props.onChange && props.onChange(event);
            }}
            onClick={props.onClick}
            label={props.label}
            disabled={props.disabled}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            fullWidth={props.fullWidth}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon onClick={props.onSearch}/>
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position={"end"}>
                        <ClearIcon onClick={() => {
                            setSearchValue('');
                            props.onClear && props.onClear();
                        }}/>
                    </InputAdornment>
                )
            }}/>
    );
};

SearchBar.propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    onClear: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onClick: PropTypes.func,
    id: PropTypes.any,
    fullWidth: PropTypes.bool
};

export default SearchBar;