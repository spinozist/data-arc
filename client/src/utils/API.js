import axios from 'axios';

export default {
  getData: url => {
      return axios.get(url);
  }

};