import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../package.json";

const app = express();
app.use(express.json());

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "ColorMaster's API",
      description:
        "This API highlights the main functionality of ColorMaster. You can find out more information at [NPM - ColorMaster](https://www.npmjs.com/package/colormaster)",
      version,
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

app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
