import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    //console.log('set axios token',token);
    // Apply to every request
    axios.defaults.headers.common['Authorization'] = 'JWT ' + token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common['Authorization']; 
  }
};

export default setAuthToken;
