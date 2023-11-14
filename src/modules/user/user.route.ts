import { FastifyInstance } from "fastify";
import {
  registerUserHandler,
  loginHandler,
  getUsersHandler,
} from "./user.controller";
import { $ref } from "./user.schema";
async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: { "2xx": $ref("createUserResponseSchema") },
      },
    },
    registerUserHandler
  );

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginSchema"),
        response: {
          "2xx": $ref("loginResponseSchema"),
        },
      },
    },
    loginHandler
  );

  server.get("/", { preHandler: [server.authenticate] }, getUsersHandler);
}

export default userRoutes;
