import api from '../utils/api';
const contentService = {
  async uploadContent(formData) {
    const { data } = await api.post('/content/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  async getMyContent() {
    const { data } = await api.get('/content/my-content');
    return data;
  },
  async getLiveContent(teacherId) {
    const { data } = await api.get(`/public/live/${teacherId}`);
    return data;
  },
};
export default contentService;
