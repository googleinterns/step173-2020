import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    videoDiv: {
        background: 'white',
        margin: '15px'
    }
}));

export default function UserVideo({user}) {
    const classes = useStyles();
    return (
        <div className={classes.videoDiv}>
            {user}
        </div>
    )
}
