import React from 'react';
import InputBase from '@material-ui/core/InputBase';
import {fade, makeStyles} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  search: {
    'position': 'relative',
    'borderRadius': theme.shape.borderRadius,
    'backgroundColor': fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    'marginRight': 10,
    'width': '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      'width': '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

/**
 * @return {ReactElement} Search for games on Navbar
 */
export default function SearchField() {
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState('');

  const handleSubmit = () => {
    setValue('');
    history.push(`/search/${value}`);
  };
  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        value = {value}
        onChange={(e)=> setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value !== '') {
            handleSubmit();
          }
        }}
        inputProps={{'aria-label': 'search'}}
      />
    </div>
  );
}
