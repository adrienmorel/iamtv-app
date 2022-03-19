<template>
  <div>
    <div class="uk-section">
      <div class="uk-container uk-container-large">
        <h1>{{ homepage.attributes.hero.title }}</h1>
        <Articles :articles="articles" />
      </div>
    </div>
  </div>
</template>

<script>
import Articles from "../components/Articles";
import { getMetaTags } from "../utils/seo";
import { getStrapiMedia } from "../utils/medias";

export default {
  components: {
    Articles,
  },
  async asyncData({ $api }) {
    let articlesRes = await $api.article.all({
      populate: $api.article.populate.all,
    });
    let homepageRes = await $api.home.all({
      populate: $api.home.populate.all,
    });
    let globalRes = await $api.global.all({
      populate: $api.global.populate.all,
    });

    return {
      articles: articlesRes.data.data,
      homepage: homepageRes.data.data,
      global: globalRes.data.data,
    };
  },
  head() {
    const { seo } = this.homepage.attributes;
    const { defaultSeo, favicon, siteName } = this.global.attributes;

    // Merge default and article-specific SEO data
    const fullSeo = {
      ...defaultSeo,
      ...seo,
    };

    return {
      titleTemplate: `%s | ${siteName}`,
      title: fullSeo.metaTitle,
      meta: getMetaTags(fullSeo),
      link: [
        {
          rel: "favicon",
          href: getStrapiMedia(favicon.data.attributes.url),
        },
      ],
    };
  },
};
</script>
