import React from 'react';
import GameCard from './GameCard.js';
import ReactDOM from 'react-dom';

const item = {"id": 296912, "Name": "Fort", "minPlayer": 2, "maxPlayer": 4, "minAge": 10, "weight": 2.5, 
"rating": 7.54706, "year": 2020, 
"image": "https://cf.geekdo-images.com/original/img/k-xxbzcg97D7acow6ZJWrqw8Wq0=/0x0/pic5241325.png", 
"thumbnail": "https://cf.geekdo-images.com/thumb/img/EV--Q1JcdXlWfaKlaXeAU_UHruY=/fit-in/200x150/pic5241325.png", 
"description": "Fort is a 2-4 player card game about building forts and following friends.&#10;&#10;", 
"minPlaytime": 20, "maxPlaytime": 40, 
"videos": [{"title": "One Minute Overview of Fort", "category": "review", "language": "English", 
"link": "http://www.youtube.com/watch?v=aDC69e8MWNU", "postdate": "2020-07-23T13:28:40-05:00"}, 
{"title": "Fort - How To Play", "category": "instructional", "language": "English", 
"link": "http://www.youtube.com/watch?v=_OdrIpLEFLQ", "postdate": "2020-07-21T12:25:06-05:00"}, 
{"title": "Let's Unbox FORT from Leder Games!", "category": "unboxing", "language": "English", 
"link": "http://www.youtube.com/watch?v=JcaxNP0wAZc", "postdate": "2020-07-21T11:29:46-05:00"}, 
{"title": "Lord Of The Board", "category": "instructional", "language": "English", 
"link": "http://www.youtube.com/watch?v=lKeTmxLNNiU", "postdate": "2020-07-21T11:15:46-05:00"}
]}

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<GameCard  id={item['id']}  image={item['image']} name={item['Name']} year={item['year']} minTime={item['minPlaytime']} 
    maxTime={item['maxPlaytime']} minPlayer={item['minPlayer']} maxPlayer={item['maxPlayer']} rating={item['rating']} 
    minAge={item['minAge']} weight={item['weight']} />, div);
  });