export default function validate(values) {
  let errors = {};
  if (!values.villager || values.villager < 1) {
    errors.villager = 'One player is required for villager';
  }
  if (!values.mafia || values.mafia < 1) {
    errors.mafia = 'One player is required for mafia';
  }
  if (!values.detective || values.detective < 0) {
    errors.detective = 'At least 0 required for detective'
  }
  if (!values.doctor || values.doctor < 0) {
    errors.doctor = 'At least 0 required for doctor'
  }
  if (values.numPlayers !== values.villager + values.mafia + values.detective + values.doctor) {
    errors.players = 'Number of players must match number of roles'
  }
  return errors;
};
