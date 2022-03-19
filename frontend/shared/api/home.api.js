const resource = "homepage";
export default ($axios, Qs) => ({
  populate: {
    all: {
      seo: {
        populate: "*",
      },
      hero: {
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
});
