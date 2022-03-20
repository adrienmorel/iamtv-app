"use strict";

const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const set = require("lodash.set");
const {
  categories,
  homepage,
  writers,
  articles,
  global,
} = require("../data/data.json");

async function isFirstRun() {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: "type",
    name: "setup",
  });
  const initHasRun = await pluginStore.get({key: "initHasRun"});
  await pluginStore.set({key: "initHasRun", value: true});
  return !initHasRun;
}

async function setPublicPermissions(newPermissions) {
  // Find the ID of the public role
  const publicRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({
      where: {
        type: "public",
      },
    });

  // Create the new permissions and link them to the public role
  const allPermissionsToCreate = [];
  Object.keys(newPermissions).map(controller => {
    const actions = newPermissions[controller];
    const permissionsToCreate = actions.map(action => {
      return strapi.query("plugin::users-permissions.permission").create({
        data: {
          action: `api::${controller}.${controller}.${action}`,
          role: publicRole.id,
        },
      });
    });
    allPermissionsToCreate.push(...permissionsToCreate);
  });
  await Promise.all(allPermissionsToCreate);
}

function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats["size"];
  return fileSizeInBytes;
}

function getFileData(fileName) {
  const filePath = `./data/uploads/${fileName}`;

  // Parse the file metadata
  const size = getFileSizeInBytes(filePath);
  const ext = fileName.split(".").pop();
  const mimeType = mime.lookup(ext);

  return {
    path: filePath,
    name: fileName,
    size,
    type: mimeType,
  };
}

// Create an entry and attach files if there are any
async function createEntry({model, entry, files}) {
  try {
    if (files) {
      for (const [key, file] of Object.entries(files)) {
        // Get file name without the extension
        const [fileName] = file.name.split('.');
        // Upload each individual file
        const uploadedFile = await strapi
          .plugin("upload")
          .service("upload")
          .upload({
            files: file,
            data: {
              fileInfo: {
                alternativeText: fileName,
                caption: fileName,
                name: fileName,
              },
            },
          });

        // Attach each file to its entry
        set(entry, key, uploadedFile[0].id);
      }
    }

    // Actually create the entry in Strapi
    const createdEntry = await strapi.entityService.create(
      `api::${model}.${model}`,
      {
        data: entry,
      }
    );
  } catch (e) {
    console.log("model", entry, e);
  }
}

async function importCategories() {
  return Promise.all(
    categories.map((category) => {
      return createEntry({model: "category", entry: category});
    })
  );
}

async function importHomepage() {
  const files = {
    "seo.shareImage": getFileData("default-image.png"),
  };
  await createEntry({model: "homepage", entry: homepage, files});
}

async function importWriters() {
  return Promise.all(
    writers.map(async (writer) => {
      const files = {
        picture: getFileData(`${writer.email}.jpg`),
      };
      return createEntry({
        model: "writer",
        entry: writer,
        files,
      });
    })
  );
}

async function importArticles() {
  return Promise.all(
    articles.map((article) => {
      const files = {
        image: getFileData(`${article.slug}.jpg`),
      };

      return createEntry({
        model: "article",
        entry: {
          ...article,
          // Make sure it's not a draft
          publishedAt: Date.now(),
        },
        files,
      });
    })
  );
}

async function importGlobal() {
  const files = {
    favicon: getFileData("favicon.png"),
    "defaultSeo.shareImage": getFileData("default-image.png"),
  };
  return createEntry({model: "global", entry: global, files});
}

async function importSeedData() {
  // Allow read of application content types
  await setPublicPermissions({
    global: ["find"],
    homepage: ["find"],
    article: ["find", "findOne"],
    category: ["find", "findOne"],
    writer: ["find", "findOne"],
  });

  // Create all entries
  await importCategories();
  await importHomepage();
  await importWriters();
  await importArticles();
  await importGlobal();
}

/**
 * Re-upload des fichiers en bdd dans le dossier public/upload
 * avec la method replace du service "upload"
 * @returns {Promise<void>}
 */
async function reUploadFile() {
  console.log("Start reUploadFile method");

  const files = fs.readdirSync("./data/uploads/");
  console.log(`Files found : ${files}`);

  const entries = (await strapi.entityService.findMany('plugin::upload.file',
    {
      fields: ['id', 'name'],
    }));

  console.log(`Entries found : ${entries.map(entry => JSON.stringify(entry))}`);

  for (const entry of entries) {
    console.log(`Search for entry=${JSON.stringify(entry)}`)
    const file = files.find((value) => value.startsWith(entry.name));
    if (file) {
      console.log(`Match found, between entry=${entry.name} and file=${file}`)

      const fileData = getFileData(file);
      const [fileName] = fileData.name.split('.');

      await strapi
        .plugin("upload")
        .service("upload")
        .replace(entry.id, {
          files: fileData,
          data: {
            fileInfo: {
              alternativeText: fileName,
              caption: fileName,
              name: fileName,
            },
          },
        });

      console.log(`File=${entry} is replace by ${fileData}`);
    }
  }
}

module.exports = async () => {
  const shouldImportSeedData = await isFirstRun();

  if (shouldImportSeedData) {
    try {
      console.log("Setting up the template...");
      await importSeedData();
      console.log("Ready to go");
    } catch (error) {
      console.log("Could not import seed data");
      console.error(error);
    }
  } else {
    // TODO : A retirer par la suite
    // Pour le moment on copy/paste les fichiers de data/uploads dans publics/uploads
    // Puisque on utilise Heroku, le serveur est regenéré completement mais
    // la bdd postgres as deja la data (shouldImportSeedData=false) mais
    // le serveur lui n'a plus les fichiers car c'est une nouvelle instance !
    // on fait donc un copy/paste pour les remettre
    // A note que si on upload un media sur l'environnement de prod,
    // alors il n'y sera plus au prochain deploiement
    // Resolution du prod = Passer sur AWS s3 !
    await reUploadFile();
  }
};
