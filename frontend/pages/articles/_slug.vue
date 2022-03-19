<template>
  <div>
    <div
        v-if="article.attributes.image"
        id="banner"
        class="uk-height-small uk-flex uk-flex-center uk-flex-middle uk-background-cover uk-light uk-padding"
        :data-src="getStrapiMedia(article.attributes.image.data.attributes.url)"
        uk-img
    >
      <h1>{{ article.attributes.title }}</h1>
    </div>

    <div class="uk-section">
      <div class="uk-container uk-container-small">
        <!-- eslint-disable vue/no-v-html -->
        <div
            v-if="article.attributes.content"
            id="editor"
            v-html="$md.render(article.attributes.content)"
        />
        <!-- eslint-enable vue/no-v-html -->
        <p v-if="article.attributes.publishedAt">
          {{ moment(article.attributes.publishedAt).format("MMM Do YY") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {getStrapiMedia} from "../../utils/medias";
import {getMetaTags} from "../../utils/seo";
import Qs from "qs";

export default {
  async asyncData({$axios, params}) {
    const qSlug = Qs.stringify(
        {
          filters: {
            slug: params.slug,
          },
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

    let globalUrl = `http://localhost:1337/api/global?${qGlobal}`;
    let articleSlugUrl = `http://localhost:1337/api/articles?${qSlug}`;

    console.log("globalUrl", globalUrl);
    console.log("articleSlugUrl", articleSlugUrl);

    let articleSlugRes = await $axios.get(articleSlugUrl);
    let globalRes = await $axios.get(globalUrl);

    return {
      article: articleSlugRes.data.data[0],
      global: globalRes.data.data,
    };
  },
  data() {
    return {
      apiUrl: process.env.strapiBaseUri,
    };
  },
  methods: {
    moment,
    getStrapiMedia,
  },
  head() {
    const {defaultSeo, favicon, siteName} = this.global.attributes;

    // Merge default and article-specific SEO data
    const fullSeo = {
      ...defaultSeo,
      metaTitle: this.article.attributes.title,
      metaDescription: this.article.attributes.description,
      shareImage: this.article.attributes.image,
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
