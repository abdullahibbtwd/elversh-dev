self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  const title = data.title || 'New Message';
  const options = {
    body: data.body || 'You have a new message!',
    icon: '/ev.png',
    badge: '/ev.png',
    data: data.url || '/',
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
}); 