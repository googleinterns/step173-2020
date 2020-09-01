import React, {useState} from 'react';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import {useUser, useFirestoreDocData} from 'reactfire';
import PropTypes from 'prop-types';

/**
 * Renders users activity feed
 * @return {ReactElement} 
 */
export default function ActivityFeed() {
  const user = useUser();
  const [initialize, setInitialize] = useState(false);
  const [activites, setActivities] = useState([]);
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
      {const newActicity = [];
        const difference = (activity.timestamp - Date.now()) / (1000*60*60);
        if (Math.floor(difference / 24) < 4) {
          if (Math.floor(difference / 24) < 1) {
            newActicity.push(Math.floor(difference) + "hours ago");
          } else {
            newActicity.push(Math.floor(difference / 24) + "days ago");
          }
        } else {
          ref.update({
            activities: firebase.firestore.FieldValue.arrayRemove(activity),
          });
          continue;
        }
      if (activity.type == "review") {
        newActivity.push("left a review for" + game);
      } else {
        newActivity.push("added" + game + "to favorites");
      }
      newActicity.push(activity.uid);
      newActicity.push(activity.displayName);
      allActivities.unshift(newActicity);
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
          <ListItem key={user.id}>
            <Link href={'/profile/' + activity[2]}>
              {activity[3]}
            </Link>
            {activity[1]}
            {activity[0]}
            <Divider />
          </ListItem>,
        )}
      </List>
    </div>
  );
}
