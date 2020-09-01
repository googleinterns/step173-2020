import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import {useUser, useFirestore, useFirestoreDocData} from 'reactfire';
import * as firebase from 'firebase/app';

const useStyles = makeStyles((theme) => ({
  fonts: {
    display: 'inherit',
  },
}));

/**
 * Renders users activity feed
 * @return {ReactElement} 
 */
export default function ActivityFeed() {
  const user = useUser();
  const classes = useStyles();
  const [initialize, setInitialize] = useState(false);
  const [activities, setActivities] = useState([]);
  const ref = useFirestore().collection('users').doc(user.uid);
  const userActivities = useFirestoreDocData(ref).activities;

  /**
 * @return {undefined}
 */
function loadData() {
  if (initialize === false) {
    setInitialize(true);
    const allActivities = [];
    userActivities.forEach(
      activity => 
      {const newActivity = [];
        const difference = (Date.now() - activity.timestamp) / (1000*60);
        if (Math.floor(difference / (60*24)) < 4) {
          if (Math.floor(difference / (60*24)) < 1) {
            if (Math.floor(difference / 60) < 1) {
              newActivity.push(Math.floor(difference) + " minutes ago");
            } else {
            newActivity.push(Math.floor(difference / 60) + " hours ago");
            }
          } else {
            newActivity.push(Math.floor(difference / (60*24)) + " days ago");
          }
        } else {
          ref.update({
            activities: firebase.firestore.FieldValue.arrayRemove(activity),
          });
          return;
        }
      if (activity.type === "review") {
        newActivity.push(" left a review for " + activity.game);
      } else {
        newActivity.push(" added " + activity.game + " to favorites");
      }
      newActivity.push(activity.uid);
      newActivity.push(activity.displayName);
      allActivities.unshift(newActivity);
      console.log(newActivity);
      }
    );
    setActivities(allActivities);
  }
}
/**
 * Load the activity data
 */
useEffect(loadData, [initialize]);
  return (
    // iterate through all activities
    <div>
      <List width="100%">
        {activities.map((activity) =>
        
          <ListItem key={activity[2] + activity[0]}  alignItems="flex-start">
            <ListItemIcon>
              <AddCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  // variant='h6'
                  component={'span'}
                  className={classes.fonts}
                >
                  <Link href={'/profile/' + activity[2]}>
                    {activity[3]}
                  </Link>
                  {activity[1]}
                </Typography>
              }
              secondary={
                <Typography
                  component={'span'}
                >
                  {activity[0]}
                </Typography>
              }
            />
            
          </ListItem>,
        )}
      </List>
    </div>
  );
}
