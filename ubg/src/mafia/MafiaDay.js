import React, {useEffect} from 'react';

/**
 * @return {ReactElement} Mafia day element
 */
export default function MafiaDay({mafiaKill, doctorSave, 
  usersData, usersCollection}) {

  function startDay() {
    if(mafiaKill && mafiaKill.uid !== doctorSave.uid){
      usersCollection.doc(mafiaKill).update({alive: false});
      // send chat message or popup or snackbar for user killed
    }
  }

  useEffect(startDay, []);

  return (
    <div>
      day
    </div>
  );
}
