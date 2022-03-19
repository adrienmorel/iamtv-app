const resource = "articles";
export default ($axios, Qs) => ({
  populate: {
    all: {
      category: {
        populate: "*",
      },
      image: {
        populate: "*",
      },
      author: {
        populate: "*",
      },
    },
  },

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
