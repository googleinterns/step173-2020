import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
    useFirestore, 
    useFirestoreDocData, 
    useUser, 
    useFirestoreCollectionData 
} from 'reactfire';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import UserVideo from '../common/UserVideo';
import RulesDrawer from '../common/RulesDrawer';
import IconButton from '@material-ui/core/IconButton';
import UpIcon from '@material-ui/icons/ExpandLess';
import DownIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    main: {
        height: '100vh'
    },
    video: {
        background: 'black',
        textAlign: '-webkit-center'
    },
    gameContainer: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    },
    title: {
        textAlign: 'center',
        margin: '20px'
    },
    game: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    table: {
        height: '300px',
        width: '300px',
        color: 'white',
        background: 'black'
    },
    rules: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        textAlign: 'center'
    }
}));

export default function Room() {
    const [openRules, setOpenRules] = useState(false);
    const classes = useStyles();
    const {uid, displayName, email} = useUser();
    const { roomId } = useParams();
    const room = useFirestore().collection('rooms').doc(roomId);
    const roomData = useFirestoreDocData(room);
    const usersCollection = room.collection('users');
    const usersData = useFirestoreCollectionData(usersCollection);

    function joinRoom() {
        usersCollection.doc(uid).set({displayName, email, uid});
    }

    function leaveRoom() {
        usersCollection.doc(uid).delete();
    }

    return (
        <Grid className={classes.main} container>
            <Grid className={classes.gameContainer} item xs={9}>
                <div className={classes.title}>
                    <Typography variant="h4">
                        {roomData.gameId}
                    </Typography>
                </div>
                <div className={classes.game}>
                    {
                        roomData.host === uid ? 
                            "You're the host" 
                        : 
                            "Waiting for the host"
                    }
                    {
                        usersData.some(user => user.uid === uid) ? 
                        <button onClick={leaveRoom}>Leave Room</button> 
                        :
                        <button onClick={joinRoom}>Join Room</button>
                    }
                </div>
                <div className={classes.rules}>
                    <IconButton onClick={() => setOpenRules(!openRules)} >
                        {openRules ? <DownIcon /> : <UpIcon />}
                    </IconButton>
                    <RulesDrawer 
                        open={openRules} 
                        description="Here is the game description" 
                    />
                </div>
            </Grid>
            <Grid className={classes.video} item xs={3}>
                {   
                    usersData.map(user => {
                        return (
                            <UserVideo 
                                key={user.uid} 
                                user={user.displayName} 
                            />
                        )
                    })
                }
            </Grid>
        </Grid>
    )
}
