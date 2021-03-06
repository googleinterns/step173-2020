import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import {AuthCheck, useUser, useFirestore} from 'reactfire';
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
  const [activities, setActivities] = useState([]);
  const userCollection = useFirestore().collection('users');

  /**
   * @return {undefined}
   */
  function loadData() {
    if (user) {
      const allActivities = [];
      const ref = userCollection.doc(user.uid);
      ref.get().then(function(doc) {
        if (doc.exists) {
          doc.data().activities.forEach(
              (activity) => {
                const newActivity = [];
                const difference =
                (Date.now() - activity.timestamp) / (1000*60);
                if (Math.floor(difference / (60*24)) < 4) {
                  if (Math.floor(difference / (60*24)) < 1) {
                    if (Math.floor(difference / 60) < 1) {
                      if (Math.floor(difference) <= 1) {
                        newActivity.push(Math.floor(difference) +
                        ' minute ago');
                      } else {
                        newActivity.push(Math.floor(difference) +
                        ' minutes ago');
                      }
                    } else {
                      if (Math.floor(difference / 60) <= 1) {
                        newActivity.push(Math.floor(difference / 60) +
                        ' hour ago');
                      } else {
                        newActivity.push(Math.floor(difference / 60) +
                        ' hours ago');
                      }
                    }
                  } else {
                    if (Math.floor(difference / (60*24)) <= 1) {
                      newActivity.push(Math.floor(difference / (60*24)) +
                      ' day ago');
                    } else {
                      newActivity.push(Math.floor(difference / (60*24)) +
                      ' days ago');
                    }
                  }
                } else {
                  ref.update({
                    activities:
                    firebase.firestore.FieldValue.arrayRemove(activity),
                  });
                  return;
                }
                if (activity.type === 'review') {
                  newActivity.push(' left a review for ' + activity.game);
                } else {
                  newActivity.push(' added ' + activity.game + ' to favorites');
                }
                newActivity.push(activity.uid);
                newActivity.push(activity.displayName);
                newActivity.push(activity.type);
                allActivities.unshift(newActivity);
              },
          );
          setActivities(allActivities);
        }
      }).catch(function(error) {
        console.log('Error getting document:', error);
      });
    }
  }
  /**
   * Load the activity data
   */
  useEffect(loadData, [user]);
  return (
    // iterate through all activities
    <AuthCheck>
      <List width="100%">
        {activities.map((activity) =>
          <ListItem key={activity[2] + activity[1]} alignItems="flex-start">
            <ListItemIcon>
              {activity[4] === 'review' ?
              <ChatBubbleOutlineIcon /> :
              <FavoriteBorderIcon />}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
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
    </AuthCheck>
  );
}
