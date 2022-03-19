<template>
  <div>
    <div class="uk-section">
      <div class="uk-container uk-container-large">
        <h1>{{ homepage.attributes.hero.title }}</h1>
        <Articles :articles="articles"/>
      </div>
    </div>
  </div>
</template>

<script>
import Articles from "../components/Articles";
import {getMetaTags} from "../utils/seo";
import {getStrapiMedia} from "../utils/medias";
import Qs from "qs";

export default {
  components: {
    Articles,
  },
  async asyncData({$axios}) {
    const qHomepage = Qs.stringify(
        {
          populate: {
            seo: {
              populate: "*",
            },
            hero: {
              populate: "*",
            },
          },
        },
        {
          encodeValuesOnly: true,
        }
    );

    const qArticles = Qs.stringify(
        {
          populate: {
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
        {
          encodeValuesOnly: true,
        }
    );

    const qGlobal = Qs.stringify(
        {
          populate: {
            defaultSeo: {
              populate: "*",
            },
            favicon: {
              populate: "*",
            },
          },
        },
        {
          encodeValuesOnly: true,
        }
    );

    let homePageUrl = `http://localhost:1337/api/homepage?${qHomepage}`;
    let articleUrl = `http://localhost:1337/api/articles?${qArticles}`;
    let globalUrl = `http://localhost:1337/api/global?${qGlobal}`;

    console.log("homePageUrl", homePageUrl);
    console.log("articleUrl", articleUrl);
    console.log("globalUrl", globalUrl);

    let articlesRes = await $axios.get(articleUrl);
    let homepageRes = await $axios.get(homePageUrl);
    let globalRes = await $axios.get(globalUrl);

    return {
      articles: articlesRes.data.data,
      homepage: homepageRes.data.data,
      global: globalRes.data.data,
    };
  },
  head() {
    const {seo} = this.homepage.attributes;
    const {defaultSeo, favicon, siteName} = this.global.attributes;

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
