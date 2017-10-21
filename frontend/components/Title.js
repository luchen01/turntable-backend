import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const clickHandler = () => {
  console.log("in clickHandler");
  axios.get("https://turntableapp.herokuapp.com/auth/spotify")
  .then((resp)=>res.send(resp))
}

const Title = ( { name } ) => {
  console.log("in title");
    return (
      <div>
        <button onClick={()=>(clickHandler())}>Login with Spotify</button>
      </div>

          );
};

Title.propTypes = {
    name: PropTypes.string,
};


export default Title;
