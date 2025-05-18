import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api/api'; // Adjust the import path as necessary

interface Notification {
  id: number;
  notification_type: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('users/notifications/');
        setNotifications(response.data);
      } catch (err) {
        setError('Failed to fetch notifications.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="h-16"> </div>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg shadow-sm ${
                    notification.is_read ? 'bg-gray-100' : 'bg-blue-50'
                  }`}
                >
                  <h2 className="text-lg font-semibold text-gray-900">
                    {notification.notification_type || 'General'}
                  </h2>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No notifications available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;