module.exports = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/api/item?id=30181167",
      },
      {
        source: "/item",
        destination: "/api/item",
      },
      {
        source: "/:path*",
        destination: "/api/redirect",
      },
    ]
  },
}
