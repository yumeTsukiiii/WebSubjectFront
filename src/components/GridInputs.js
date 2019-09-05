import React from 'react';
import PropTypes from 'prop-types';
import {TextField, Grid, Switch} from "@material-ui/core";
import { UndefinedChecker } from "../util/Checkers";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { DatePicker } from "@material-ui/pickers";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select/index";
import MenuItem from "@material-ui/core/MenuItem";
import {makeStyles} from "@material-ui/styles";

const inputTypesMap = {
    'TextField': ({ defaultValue, label, onChange,
                      value, disabled, fullWidth, placeholder }) => {
        return (
            <TextField
                label={label}
                value={value}
                defaultValue={defaultValue}
                disabled={disabled}
                onChange={onChange}
                fullWidth={fullWidth}
                placeholder={placeholder}/>
        );
    },
    'TextArea': ({ defaultValue, label, onChange,
                     value, disabled, rowsMax, rows,
                    fullWidth, placeholder }) => {
        return (
            <TextField
                label={label}
                value={value}
                defaultValue={defaultValue}
                disabled={disabled}
                onChange={onChange}
                multiline
                rowsMax={rowsMax}
                rows={rows}
                fullWidth={fullWidth}
                variant={"outlined"}
                placeholder={placeholder}
                InputLabelProps={{
                    shrink: true,
                }}/>
        );
    },
    'Switch': ({ defaultValue, label, onChange, value }) => {
        return (
            <FormControlLabel
                control={<Switch defaultChecked={defaultValue} onChange={onChange} checked={value} />}
                label={label}/>
        );
    },
    'CheckBox': ({ defaultValue, label, onChange, value }) => {
        return (
            <FormControlLabel
                control={<Checkbox defaultChecked={defaultValue} onChange={onChange} checked={value}/>}
                label={label}/>
        );
    },
    'DatePicker': ({ label, onChange, value }) => {
        return (
            <DatePicker
                variant={"inline"}
                label={label}
                value={value}
                format="yyyy-MM-dd"
                onChange={onChange}
            />
        );
    },

    'Selects': ({ label, onChange, selectItems, value, minWidth }) => {
        return (
            <FormControl>
                <InputLabel>{label}</InputLabel>
                <Select
                    value={value}
                    onChange={onChange}
                    style={{minWidth: `${!minWidth ? 120 : minWidth}px`}}>
                    {selectItems.map(item => (
                        <MenuItem
                            value={item.value}
                            key={item.value}>
                            {item.text}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
};

const useStyles = makeStyles(theme => ({
    defaultMarginTop: {
        marginTop: theme.spacing(3)
    }
}));

/**
 * 自定义组件，用于生成符合数据描述的Inputs布局
 * 支持的InputsComponent以及属性如上inputsTypeMap定义，
 * 属性具体定义参考material-ui官网
 * */
const GridInputs = (props) => {

    const classes = useStyles();

    return (
        <Grid
            container
            alignItems={"flex-end"}>
            {
                props.inputsTemp.map((input, index) => (
                    UndefinedChecker.of(inputTypesMap[input.type])
                        .isNotUndefined(inputBuilder => {
                            return (
                                <Grid
                                    item
                                    className={classes.defaultMarginTop}
                                    xs={input.xs}
                                    sm={input.sm}
                                    md={input.md}
                                    key={`${input.label}-${index}`}>
                                    {inputBuilder(input)}
                                </Grid>
                            );
                        }).otherwise(() => null)
                ))
            }
        </Grid>

    );

};

GridInputs.propTypes = {
    inputsTemp: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        xs: PropTypes.number.isRequired,
        sm: PropTypes.number.isRequired,
        md: PropTypes.number.isRequired,
        value: PropTypes.isRequired,
        onChange: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        selectItems: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.node.isRequired,
            text: PropTypes.string.isRequired
        }))
    })).isRequired
};

export default GridInputs;