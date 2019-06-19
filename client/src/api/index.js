import axios from 'axios';
export default
   axios.create({
      //baseURL: 'https://6768-2901zz06.azurewebsites.net/',
	  baseURL: 'http://172.20.65.178:5000',
      timeout: 2000,
      headers: {'Authorization': 'JWT ' + localStorage.getItem('front_access_token')}
   });