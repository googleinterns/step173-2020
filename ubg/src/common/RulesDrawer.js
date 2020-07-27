import React from 'react';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    rules: {
        background: 'white',
        borderRadius: '5%',
        borderTop: '1px solid black',
        textAlign: 'left'
    }
}));

export default function MakeshiftDrawer({ open, description }) {
    const classes = useStyles();

    return (
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
            <div className={classes.rules}>
                {description}
            </div>
        </Slide>
    );
}