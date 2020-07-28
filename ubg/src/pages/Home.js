import React from 'react';
import Navbar from '../common/Navbar';

/**
 * @return {ReactElement} Home page which is also landing page
 */
export default function Home() {
    return (
      <div>
        <Navbar/>
        <h1>
          Welcome to UltimateBoardGame!!!  
        </h1>
      </div>
    );
  }
  