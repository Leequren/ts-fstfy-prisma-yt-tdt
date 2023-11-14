import fastifyJWT from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import productRoutes from "./modules/product/product.route";
import { productSchemas } from "./modules/product/product.schema";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
const swaggerOptions = {
  swagger: {
    info: {
      title: "My Title",
      description: "My Description.",
      version: "1.0.0",
    },
    host: "localhost",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [{ name: "Default", description: "Default" }],
  },
};

const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: number;
      name: string;
      email: string;
    };
  }
}

const server = Fastify({ logger: true });

server.get("/healthcheck", async function (req, reply) {
  return { status: "OK" };
});

server.register(fastifyJWT, {
  secret: "elleryrain123uiefj",
});

server.decorate(
  "authenticate",
  async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      return reply.send(err);
    }
  }
);

async function main() {
  server.register(swagger, swaggerOptions);
  server.register(swaggerUi, swaggerUiOptions);
  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema);
    // console.log(schema);
  }

  server.register(userRoutes, { prefix: "api/users" });
  server.register(productRoutes, { prefix: "api/products" });

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server started at http://localhost:3000");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
