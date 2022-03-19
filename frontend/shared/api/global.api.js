const resource = "global";
export default ($axios, Qs) => ({
  populate: {
    all: {
      defaultSeo: {
        populate: "*",
      },
      favicon: {
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
