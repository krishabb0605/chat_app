import axios from 'axios';

export default class UserService {
  static async register(userData) {
    const response = await axios.post('/api/register', userData);
    return response;
  }

  static async checkEmail(emailData) {
    const response = await axios.post('/api/email', emailData);
    return response;
  }

  static async checkPassword(passwordData) {
    const response = await axios.post('/api/password', passwordData);
    return response;
  }
  static async updateUser(token, updatedUserData) {
    const response = await axios.post('/api/update-user', updatedUserData, {
      headers: { token },
    });
    return response;
  }

  static async userDetail(token) {
    const response = await axios.get('/api/user-details', {
      headers: { token },
    });
    return response;
  }

  static async searchUser(query) {
    const response = await axios.post('/api/search-user', query);
    return response;
  }
}
