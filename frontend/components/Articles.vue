<template>
  <div>
    <div class="uk-child-width-1-2" uk-grid>
      <div>
        <div class="uk-child-width-1-1" uk-grid>
          <ArticleCard4
            v-for="article in leftArticles"
            :key="article.id"
            :article="article"
          />
        </div>
      </div>
      <div>
        <div class="uk-child-width-1-2@m uk-grid-match" uk-grid>
          <ArticleCard4
            v-for="article in rightArticles"
            :key="article.id"
            :article="article"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleCard4 from "./ArticleCard4";

export default {
  components: {
    ArticleCard4,
  },
  props: {
    articles: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    leftArticlesCount() {
      // TODO : Faire moite-moite nn ?
      return Math.ceil(this.articles.length / 5);
    },
    leftArticles() {
      return this.articles.slice(0, this.leftArticlesCount);
    },
    rightArticles() {
      return this.articles.slice(this.leftArticlesCount, this.articles.length);
    },
  },
};
</script>
