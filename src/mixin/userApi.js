import uAxios from "../../axios";

const userApi = {
    async login(phone, password) {
      try {
        const response = await uAxios.post('/auth/login', { phone, password });
        const res = response.data;

        const token = res.data.access_token;
  
        // Save the token in localStorage or use another storage method
        localStorage.setItem('access_token', token);
        return res;
      } catch (error) {
        throw error.response.data;
      }
    },
  
    async logout() {
      try {
        await uAxios.post('/auth/logout');
        // Remove the token from localStorage or another storage method
        localStorage.removeItem('access_token');
      } catch (error) {
        throw error.response.data;
      }
    },
  
    // async register(userData) {
    //   try {
    //     const response = await uAxios.post('/auth/register', userData);
    //     return response.data;
    //   } catch (error) {
    //     throw error.response.data;
    //   }
    // },
  
    // async getCurrentUser() {
    //   try {
    //     const response = await uAxios.get('/auth/me');
    //     return response.data;
    //   } catch (error) {
    //     throw error.response.data;
    //   }
    // },
};

export default userApi;