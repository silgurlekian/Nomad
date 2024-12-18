import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // your cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // your API key
  api_secret: process.env.CLOUDINARY_API_SECRET  // your API secret
});

export default cloudinary;
