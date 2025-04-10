// Frontend: next.config.js
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com', // Pro profilové obrázky z Google Auth
      'localhost',
      'vzdelavaci-portal-msk-api.herokuapp.com',
      'firebasestorage.googleapis.com', // Pro obrázky z Firebase Storage
      // Zde můžete přidat další domény podle potřeby
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};
