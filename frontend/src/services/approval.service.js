import api from '../utils/api';
const approvalService = {
  async getPending() {
    const { data } = await api.get('/approval/pending');
    return data;
  },
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.subject) query.append('subject', params.subject);
    if (params.status) query.append('status', params.status);
    const { data } = await api.get(`/approval/all?${query}`);
    return data;
  },
  async approve(contentId) {
    const { data } = await api.post(`/approval/status/${contentId}`, {
      status: 'approved',
      rejection_reason: '',
    });
    return data;
  },
  async reject(contentId, reason) {
    const { data } = await api.post(`/approval/status/${contentId}`, {
      status: 'rejected',
      rejection_reason: reason,
    });
    return data;
  },
};
export default approvalService;
