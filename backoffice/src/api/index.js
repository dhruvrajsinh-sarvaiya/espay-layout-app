import axios from 'axios';

export default
   axios.create({
      baseURL: 'http://localhost:5000/',
      // baseURL: 'http://172.20.65.151:5000/',
      //   baseURL: 'http://172.20.65.110:5000/', //Kushalbhai
      // baseURL: 'http://172.20.65.119:5000/', //Nishatbhai
      // baseURL: 'https://new-stack-node-api.azurewebsites.net/',
      // baseURL : 'https://6768-2901zz06.azurewebsites.net', //Cooldex Live node url
      timeout: 30000,  //Changed by Jayesh from 2000
	  headers: {'Authorization': 'JWT ' + localStorage.getItem('access_token')}
   });