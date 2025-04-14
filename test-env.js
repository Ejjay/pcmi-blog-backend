import dotenv from 'dotenv';
dotenv.config();

console.log('ImageKit Public Key:', process.env.IMAGEKIT_PUBLIC_KEY);
console.log('ImageKit Private Key:', process.env.IMAGEKIT_PRIVATE_KEY);
console.log('ImageKit URL Endpoint:', process.env.IMAGEKIT_URL_ENDPOINT);
