import { FastifyInstance } from "fastify";
import { $ref } from "./product.schema";
import { createProductHandler, getProductsHandler } from "./product.controller";

async function productRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createProductSchema"),
        response: {
          "2xx": $ref("productResponseSchema"),
        },
      },
    },
    createProductHandler
  );

  server.get(
    "/",
    {
      schema: {
        response: {
          200: $ref("productsResponseSchema"),
        },
      },
    },
    getProductsHandler
  );
}

export default productRoutes;
