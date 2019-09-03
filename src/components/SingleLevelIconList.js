import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import PropTypes from 'prop-types';

const SingleLevelIconList = (props) => {

    return (
        <>
            <List>
                {
                    props.drawerNavigators.map(({text, action, icon}) => (
                        <ListItem
                            button
                            key={text}
                            onClick={action}>
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItem>
                    ))
                }
            </List>
        </>
    );
};

SingleLevelIconList.propTypes = {
    drawerNavigators: PropTypes.array.isRequired
};

SingleLevelIconList.defaultProps = {
    drawerNavigators: []
};

export default SingleLevelIconList