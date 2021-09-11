import express = require("express");
import swaggerJSDoc = require("swagger-jsdoc");
import swaggerUi = require("swagger-ui-express");
import packageJSON = require("../package.json");
import path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../", "public")));

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "ColorMaster's API",
      description:
        "This API highlights the main functionality of ColorMaster. You can find out more information at [NPM - ColorMaster](https://www.npmjs.com/package/colormaster)",
      version: packageJSON.version,
      license: {
        name: "MIT License",
        url: "https://github.com/lbragile/ColorMaster/blob/master/LICENSE.md"
      },
      contact: {
        email: "lbragile.masc@gmail.com"
      }
    },
    externalDocs: {
      description: "Codebase Documentation",
      url: "https://lbragile.github.io/ColorMaster/"
    },
    tags: [{ name: "ColorMaster", description: "Routes for main functionality" }]
  },
  apis: ["api/*"]
});

const cssOpts = {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "ColorMaster - A TypeScript library for all your coloring needs"
};

app.use("/api/v1", swaggerUi.serve, swaggerUi.setup(swaggerSpec, cssOpts));

module.exports = app;
