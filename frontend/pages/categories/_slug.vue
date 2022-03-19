<template>
  <div>
    <client-only>
      <div class="uk-section">
        <div class="uk-container uk-container-large">
          <h1>{{ category.attributes.name }}</h1>
          <Articles :articles="articles || []"/>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import Articles from "../../components/Articles";
import {getMetaTags} from "../../utils/seo";
import {getStrapiMedia} from "../../utils/medias";
import Qs from "qs";

export default {
  components: {
    Articles,
  },
  async asyncData({$axios, params}) {
    const qCategorieSlug = Qs.stringify(
        {
          filters: {
            slug: params.slug,
          },
          populate: [
            "articles",
            "articles.category",
            "articles.image",
            "articles.author",
            "articles.author.picture",
          ],
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

    let globalUrl = `http://localhost:1337/api/global?${qGlobal}`;
    let categorieSlugUrl = `http://localhost:1337/api/categories?${qCategorieSlug}`;

    console.log("globalUrl", globalUrl);
    console.log("categorieSlugUrl", categorieSlugUrl);

    let globalRes = await $axios.get(globalUrl);
    let categorieSlugRes = await $axios.get(categorieSlugUrl);

    return {
      category: categorieSlugRes.data.data[0],
      articles: categorieSlugRes.data.data[0].attributes.articles.data,
      global: globalRes.data.data,
    };
  },
  head() {
    const {defaultSeo, favicon, siteName} = this.global.attributes;

    // Merge default and article-specific SEO data
    const fullSeo = {
      ...defaultSeo,
      metaTitle: `${this.category.attributes.name} articles`,
      metaDescription: `All articles about ${this.category.attributes.name}`,
    };

    return {
      title: fullSeo.metaTitle,
      titleTemplate: `%s | ${siteName}`,
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
