import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    root: {
        margin: 'auto',
    },
    listRoot: {
        minWidth: '40%',
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        height: 256,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
}));

function not(a, b) {
    return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter(value => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

/**
 * 该组件详情见material-ui官网
 * */
const TransferList = (props) => {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(props.leftChoices.items);
    const [right, setRight] = React.useState(props.rightChoices.items);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    //监听做列表变化
    useEffect(() => {
        setLeft(props.leftChoices.items);
    }, [props.leftChoices]);

    const numberOfChecked = items => intersection(checked, items).length;

    const handleToggleAll = items => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        let afterRight = right.concat(leftChecked);
        setRight(afterRight);
        let afterLeft = not(left, leftChecked);
        setLeft(afterLeft);
        props.onChoicesChange([...afterLeft], [...afterRight]);
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        let afterLeft = left.concat(rightChecked);
        setLeft(afterLeft);
        let afterRight = not(right, rightChecked);
        setRight(afterRight);
        props.onChoicesChange([...afterLeft], [...afterRight]);
        setChecked(not(checked, rightChecked));
    };

    const customList = (title, items, key) => (
        <Card>
            <CardHeader
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        inputProps={{ 'aria-label': 'all items selected' }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List className={classes.list} dense component="div" role="list">
                {items.map((value, index) => {
                    const labelId = `transfer-list-all-item-${value[key]}-label`;

                    return (
                        <ListItem key={`${value[key]}-${index}`} role="listitem" button onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value[key]}`} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <Grid
            container
            spacing={2}
            justify="center"
            alignItems="center"
            className={classes.root}>
            <Grid
                item
                className={classes.listRoot}>
                {
                    customList(props.leftChoices.title, left, props.leftRenderKey)
                }
            </Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid
                item
                className={classes.listRoot}>
                {
                    customList(props.rightChoices.title, right, props.rightRenderKey)
                }
            </Grid>
        </Grid>
    );
};

TransferList.propTypes = {
    leftRenderKey: PropTypes.string,
    rightRenderKey: PropTypes.string,
    leftChoices: PropTypes.shape({
        title: PropTypes.string.isRequired,
        items: PropTypes.array.isRequired
    }).isRequired,
    rightChoices: PropTypes.shape({
        title: PropTypes.string.isRequired,
        items: PropTypes.array.isRequired
    }).isRequired,
    onChoicesChange: PropTypes.func.isRequired
};

TransferList.defaultProps = {
    leftRenderKey: 'text',
    rightRenderKey: 'text',
};

export default TransferList;