import api, { normalizeApiError, unwrapData } from './api.js';

export async function getNotifications() {
  try {
    const response = await api.get('/notifications');
    return unwrapData(response)?.notifications || [];
  } catch (error) {
    throw normalizeApiError(error, 'Unable to load notifications');
  }
}

export async function markNotificationRead(notificationId) {
  try {
    await api.patch(`/notifications/${notificationId}/read`);
  } catch (error) {
    throw normalizeApiError(error, 'Unable to update notification');
  }
}

export async function markAllNotificationsRead() {
  try {
    await api.patch('/notifications/read-all');
  } catch (error) {
    throw normalizeApiError(error, 'Unable to update notifications');
  }
}
