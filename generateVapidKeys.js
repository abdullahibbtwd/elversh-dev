
import webpush from "web-push"

// Generate a new set of VAPID keys
const vapidKeys = webpush.generateVAPIDKeys();

console.log('----------------------------------------------------');
console.log('         VAPID Keys Generated Successfully!         ');
console.log('----------------------------------------------------');
console.log('');
console.log('VAPID Public Key:');
console.log(vapidKeys.publicKey);
console.log('');
console.log('VAPID Private Key:');
console.log(vapidKeys.privateKey);
console.log('');
console.log('----------------------------------------------------');
console.log('IMPORTANT: Store these keys securely as environment variables.');
console.log('  - The Public Key goes to your frontend code (e.g., NEXT_PUBLIC_VAPID_PUBLIC_KEY)');
console.log('  - The Private Key goes to your backend code (KEEP THIS ABSOLUTELY SECRET!).');
console.log('');
console.log('  You will also need a "subject" (a mailto: email or a URL) for VAPID details.');
console.log('  Example: mailto:your_contact_email@example.com');
console.log('----------------------------------------------------');

// Optionally, you can also set the VAPID details here if you want to test it immediately,
// but for production, you'll set these dynamically using environment variables.
// webpush.setVapidDetails(
//     'mailto:your_contact_email@example.com', // Replace with your actual email or URL
//     vapidKeys.publicKey,
//     vapidKeys.privateKey
// );