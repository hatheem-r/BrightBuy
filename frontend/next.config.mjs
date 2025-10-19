// frontend/next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Add your Cloudinary domain here
    images: {
      domains: ['res.cloudinary.com'], // Ensure your Cloudinary domain is correct
    },
  };
  
  // ⭐ FIX: Change module.exports to export default
  export default nextConfig; 
  // OR: module.exports = nextConfig; (If you rename the file to next.config.js)