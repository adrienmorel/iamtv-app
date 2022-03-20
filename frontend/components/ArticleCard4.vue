<template>
  <nuxt-link
    :key="article.id"
    :to="{ name: 'articles-slug', params: { slug: article.attributes.slug } }"
    class="text-reset"
  >
    <div
      :style="{
        'background-image': `url(${getStrapiMedia(
          article.attributes.image.data.attributes.url
        )})`,
      }"
      class="card text-white card-has-bg click-col"
    >
      <div class="card-img-overlay d-flex flex-column">
        <div class="card-body">
          <small class="card-meta mb-2">{{
            article.attributes.category.data.attributes.name
          }}</small>
          <h4 class="card-title mt-0">
            <div class="text-white">{{ article.attributes.title }}</div>
          </h4>
          <small
            ><i class="far fa-clock"></i>
            {{
              moment(article.attributes.publishedAt).format("MMMM Do, YYYY")
            }}</small
          >
        </div>
        <div class="card-footer">
          <div>
            <img
              :alt="article.attributes.author.data.attributes.name"
              :src="
                getStrapiMedia(
                  article.attributes.author.data.attributes.picture.data
                    .attributes.url
                )
              "
              class="avatar mr-3 rounded-circle"
            />
          </div>
          <div class="p-2">
            <h6 class="my-0 text-white d-block">
              {{ article.attributes.author.data.attributes.name }}
            </h6>
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
import { getStrapiMedia } from "../utils/medias";
import moment from "moment";

/**
 * Coupe le contenu
 * @param content {string}
 * @returns {string|*}
 */
function trapContent(content) {
  if (!content) {
    return "";
  }

  if (content.length < 50) {
    return content;
  }

  return content.substr(0, 45) + "...";
}

export default {
  props: {
    article: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    moment,
    trapContent,
    getStrapiMedia,
  },
};
</script>

<style lang="scss" scoped>
//post card styles
.card {
  border: none;
  transition: all 500ms cubic-bezier(0.19, 1, 0.22, 1);
  overflow: hidden;
  border-radius: 20px;
  min-height: 450px;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    min-height: 350px;
  }

  @media (max-width: 420px) {
    min-height: 300px;
  }

  &.card-has-bg {
    transition: all 500ms cubic-bezier(0.19, 1, 0.22, 1);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: inherit;
      //-webkit-filter: grayscale(0.25);
      //-moz-filter: grayscale(25%);
      //-ms-filter: grayscale(25%);
      //-o-filter: grayscale(25%);
      //filter: grayscale(25%);
    }

    &:hover {
      transform: scale(0.95);
      box-shadow: 0 0 5px -2px rgba(0, 0, 0, 0.3);
      background-size: cover;
      transition: all 500ms cubic-bezier(0.19, 1, 0.22, 1);

      .card-img-overlay {
        transition: all 800ms cubic-bezier(0.19, 1, 0.22, 1);
        background: rgb(35, 79, 109);
        background: linear-gradient(
          0deg,
          rgba(4, 69, 114, 0.25) 0%,
          rgba(4, 69, 114, 0.5) 100%
        );
      }
    }
  }

  .card-footer {
    background: none;
    border-top: none;

    display: flex;

    .avatar {
      height: 40px;
      width: 40px;
    }

    .media {
      img {
        border: solid 3px rgba(234, 95, 0, 0.3);
      }
    }
  }

  .card-meta {
    color: orange;
  }

  .card-body {
    transition: all 500ms cubic-bezier(0.19, 1, 0.22, 1);
  }

  &:hover {
    .card-body {
      margin-top: 30px;
      transition: all 800ms cubic-bezier(0.19, 1, 0.22, 1);
    }

    cursor: pointer;
    transition: all 800ms cubic-bezier(0.19, 1, 0.22, 1);
  }

  .card-img-overlay {
    transition: all 800ms cubic-bezier(0.19, 1, 0.22, 1);
    //background: rgb(35, 79, 109);
    //background: linear-gradient(
    //  0deg,
    //  rgba(35, 79, 109, 0.3785889355742297) 0%,
    //  rgba(69, 95, 113, 1) 100%
    //);
  }
}
</style>
