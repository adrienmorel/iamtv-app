export function getStrapiMedia(url) {
  //console.log("getStrapiMedia url = ", url);
  // Check if URL is a local path
  if (url.startsWith("/")) {
    // Prepend Strapi address
    return `${process.env.strapiBaseUri}${url}`;
  }
  // Otherwise return full URL
  return url;
}
