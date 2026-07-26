import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Seo from '../components/common/Seo.jsx';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../services/notificationService.js';

function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    getNotifications()
      .then((notifications) => {
        setItems(notifications);
        setStatus('succeeded');
      })
      .catch(() => setStatus('failed'));
  }, []);

  const readOne = async (item) => {
    if (!item.isRead) {
      await markNotificationRead(item.id);
      setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, isRead: true } : entry)));
    }
  };

  const readAll = async () => {
    await markAllNotificationsRead();
    setItems((current) => current.map((item) => ({ ...item, isRead: true })));
  };

  return (
    <>
      <Seo title="Notifications | Amorah" description="Updates about your Amorah orders." path="/account/notifications" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-4xl font-semibold text-amorah-black">Notifications</h1>
        {items.some((item) => !item.isRead) ? <Button variant="outline" onClick={readAll}>Mark all as read</Button> : null}
      </div>
      {status === 'loading' ? <p className="mt-6 text-sm text-amorah-brown">Loading notifications...</p> : null}
      {status === 'failed' ? <p className="mt-6 text-sm text-amorah-error">Unable to load notifications.</p> : null}
      {status === 'succeeded' && items.length === 0 ? (
        <EmptyState title="No notifications yet" description="Order updates will appear here." />
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <article key={item.id} className={`border p-5 ${item.isRead ? 'border-amorah-border bg-amorah-white' : 'border-amorah-rose bg-amorah-light'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-amorah-black">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-amorah-brown">{item.message}</p>
                  <p className="mt-2 text-xs text-amorah-brown">{new Date(item.createdAt).toLocaleString('en-IN')}</p>
                </div>
                {!item.isRead ? <span className="text-xs font-semibold uppercase tracking-[0.12em] text-amorah-maroon">Unread</span> : null}
              </div>
              {item.orderNumber ? <Link onClick={() => readOne(item)} className="mt-3 inline-block text-sm font-semibold text-amorah-maroon" to={`/account/orders/${item.orderNumber}`}>View order</Link> : null}
            </article>
          ))}
        </div>
      )}
    </>
  );
}

export default NotificationsPage;
