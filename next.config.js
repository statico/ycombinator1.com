module.exports = {
  async rewrites() {
    return [
      {
        source: "/item",
        destination: "/api/item",
      },
      {
        source: "/:path*",
        destination: "/api/redirect",
      },
    ];
  },
};
