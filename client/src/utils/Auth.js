import axios from 'axios';

export default {
  signup: data => axios.post('/api/user/signup', data),
  login: data => axios.post('/api/user/login', data),
  logout: () => {
    localStorage.removeItem('user_id');
    return axios.get('/api/user/logout');
  },
  updateUserInfo: data => axios.put('/api/user/update', data),
  session: async() => {
    console.log('Session function called')
    // A simple caching method to make it faster
    const cache = false;
    return Promise
      .resolve()
      .then(() => {
        if (cache && localStorage.getItem('user_id')) {
          return {
            user: {
              id: localStorage.getItem('user_id')
            },
            authenticated: true
          };
        } else {
          return axios.get('/api/user/session')
            .then(res => res.data);
        }
      })
      .then(data => {
        if (cache && data.user.id) {
          localStorage.setItem('user_id', data.user.id);
        }

      return data;
    });
  }
};