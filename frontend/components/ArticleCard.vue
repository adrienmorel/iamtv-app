<template>
  <nuxt-link
    :key="article.id"
    :to="{ name: 'articles-slug', params: { slug: article.attributes.slug } }"
    class="uk-link-reset"
  >
    <div class="uk-card uk-card-muted">
      <div class="uk-card-media-top">
        <img
          :src="getStrapiMedia(article.attributes.image.data.attributes.url)"
          height="100"
        />
      </div>
      <div class="uk-card-body">
        <p
          v-if="article.attributes.category"
          id="category"
          class="uk-text-uppercase"
        >
          {{ article.attributes.category.data.attributes.name }}
        </p>
        <p id="title" class="uk-text-large">{{ article.attributes.title }}</p>
        <hr class="uk-divider-small" />
        <div class="uk-grid-small uk-flex-left" data-uk-grid="true">
          <div>
            <img
              :alt="article.attributes.title"
              :src="
                getStrapiMedia(
                  article.attributes.author.data.attributes.picture.data
                    .attributes.url
                )
              "
              class="avatar"
              height="40px"
              style="position: static; border-radius: 50%; object-fit: cover"
              width="40px"
            />
          </div>
          <div class="uk-width-expand">
            <p class="uk-margin-remove-bottom">
              {{ article.attributes.author.data.attributes.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
import { getStrapiMedia } from "../utils/medias";

export default {
  props: {
    article: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    getStrapiMedia,
  },
};
</script>
