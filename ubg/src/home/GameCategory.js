import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import GameCard from '../search/GameCard';
import IconButton from '@material-ui/core/IconButton';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  expand: {
        marginLeft: 'calc(50% - 23px)',
    marginRight: '50vw',
  },
//   header: {
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
}));

/**
 * @return {ReactElement} Home page which is also landing page
 */
export default function GameCategory({category, games}) {
  const classes = useStyles();
  const [expand, setExpand] = React.useState(false);
  const [display, setDisplay] = React.useState('none');

  // function modifyDisplay() {
  //   // console.log(expand);
  //   console.log(display);
  //   if (expand === true) {
  //     setDisplay('block');
  //   } else {
  //     setDisplay('none');
  //   }
  // }
  // useEffect(modifyDisplay, [expand]);

  const handleExpandClick = () => {
    setExpand(!expand);
    console.log('click');
  };

  function loadGameCard(item, index) {
    
    let displayCard;
    if (expand === false) {
    if (index < 3) {
      displayCard = 'block';
    // } else if (index === 2) {
    //   display = { xs: 'none',md: 'none', lg: 'block' };
    } else if (index === 3) {
      displayCard = { xs: 'block' ,md: 'none', lg: 'block' };
    } else if (index < 6) {
      displayCard = { xs: 'none', md: 'none', lg: 'none', xl: 'block' };
    } else {
      displayCard = 'none';
    }
  } else {
    displayCard = 'block';
  }
    const component= <Grid key={item['id']} item xs={12} sm={6} xl={2} lg={3} md={4}>
      <Box display={displayCard}>
      <GameCard id={item['id']}
        image={item['image']}
        name={item['Name']}
        year={item['year']}
        minTime={item['minPlaytime']}
        maxTime={item['maxPlaytime']}
        minPlayer={item['minPlayer']}
        maxPlayer={item['maxPlayer']}
        rating={item['rating']}
        minAge={item['minAge']}
        weight={item['weight']} /></Box>
    </Grid>
    if (index === 5) {
      console.log(component);
    }
    
    return component
  }

  return (
    <Box m={10}>
      <h1>{category}</h1>
      <Grid container justify="flex-start" alignItems="stretch" spacing={4}>
      {games.map((item, index) => loadGameCard(item, index)
        )}
        {/* <div onClick={() => setExpand(!expand)}> */}
        {/* <div onClick={console.log('click')}> */}
        <IconButton className={classes.expand} onClick={handleExpandClick}>
          <ExpandMore />
        </IconButton>
        {/* </div> */}
        </Grid>
    </Box>
    );
  }