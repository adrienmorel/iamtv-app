const resource = "categories";
export default ($axios, Qs) => ({
  all(q = {}) {
    const qs = Qs.stringify(
      {
        ...q,
      },
      {
        encodeValuesOnly: true,
      }
    );

    return $axios.get(`${resource}?${qs}`);
  },

  getBySlug(slug, q = {}) {
    const qs = Qs.stringify(
      {
        filters: {
          slug: slug,
        },
        ...q,
      },
      {
        encodeValuesOnly: true,
      }
    );

    return $axios.get(`${resource}?${qs}`);
  },
});
