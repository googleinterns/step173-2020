import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 130,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

/**
 * @param {string} label Filter name
 * @param {number} value Filter default value
 * @param {object} menu All possible values of filter
 * @param {string} append string add on when displaying values
 * @param {object} onChange function when filter value is changed
 * @return {ReactElement} Filter component
 */
export default function Filter({label, value, menu, append, onChange}) {
  const classes = useStyles();
  let appendContent = '';
  if (append) {
    appendContent = append;
  }
  return (
    <FormControl className={classes.formControl}>
      <InputLabel shrink id="demo-simple-select-placeholder-label-label">
        {label}
      </InputLabel>
      <Select
        labelId="demo-simple-select-placeholder-label-label"
        id="demo-simple-select-placeholder-label"
        value={value}
        onChange={e => onChange(e.target.value)}
        displayEmpty
        className={classes.selectEmpty}
      >
        {menu.map((item) => <MenuItem key={item} value={item}>{item}{appendContent}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

Filter.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  menu: PropTypes.array,
  append: PropTypes.string,
  onChange: PropTypes.func,
};