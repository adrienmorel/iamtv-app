module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '88674d65de153cde288b892f844bfa8f'),
  },
});
