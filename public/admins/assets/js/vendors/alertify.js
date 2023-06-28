function callAlertify(notificationtype, message) {
  if (notificationtype === 'success') {
    alertify.set('notifier', 'position', 'top-right');
    alertify.success(`${message}`);
  } else if (notificationtype === 'error') {
    alertify.set('notifier', 'position', 'top-right');
    alertify.error(`${message}`);
  } else if (notificationtype === 'warning') {
    alertify.set('notifier', 'position', 'top-right');
    alertify.warning(`${message}`);
  }
  // else if(notificationtype === 'custom') {
  //   alertify.notify(`${message}`, 'custom', 2, function () { console.log('dismissed'); });
  // }
}
