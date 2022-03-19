import ArticleApi from "../shared/api/article.api";
import HomeApi from "../shared/api/home.api";
import GlobalApi from "../shared/api/global.api";
import CategorieApi from "../shared/api/categorie.api";
import Qs from "qs";

export default (ctx, inject) => {
  const client = ctx.$axios.create({
    baseURL: `${process.env.strapiBaseUri}/api`,
  });

  inject("api", {
    article: ArticleApi(client, Qs),
    home: HomeApi(client, Qs),
    global: GlobalApi(client, Qs),
    categorie: CategorieApi(client, Qs),
  });
};
