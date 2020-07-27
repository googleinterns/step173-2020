import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 130,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    }
  }));

/**
 * @param {json} props Filter parameters
 * @return {ReactElement} Filter component 
 */

export default function Filter(props) {
    const classes = useStyles();
    let append = '';
    if (props.append) {
      append = props.append;
    }
    return (
      <FormControl className={classes.formControl}>
        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          {props.label}
        </InputLabel>
        <Select
          labelId="demo-simple-select-placeholder-label-label"
          id="demo-simple-select-placeholder-label"
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
          displayEmpty
          className={classes.selectEmpty}
        >
          {props.menu.map((item) => <MenuItem key={item} value={item}>{item}{append}</MenuItem>)}
        </Select>
      </FormControl>
    );
  }