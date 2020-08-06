import React from 'react';
import MafiaDay from './MafiaDay';
import MafiaNight from './MafiaNight';
import PropTypes from 'prop-types';

/**
 * @return {ReactElement} Mafia game element
 */
export default function MafiaGame({day}) {
  return (
    <div>
      {
        day ?
        <MafiaDay /> :
        <MafiaNight />
      }
    </div>
  );
}

MafiaGame.propTypes = {
  day: PropTypes.bool,
};
