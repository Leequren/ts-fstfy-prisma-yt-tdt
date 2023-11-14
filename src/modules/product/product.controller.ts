import { FastifyRequest, FastifyReply } from "fastify";
import { CreateProductInput } from "./product.schema";
import { createProduct, getProducts } from "./product.service";

export async function createProductHandler(
  req: FastifyRequest<{
    Body: CreateProductInput;
  }>,
  reply: FastifyReply
) {
  const product = await createProduct({
    ...req.body,
    ownerId: req.user.id,
  });
  reply.send(product);
}

export async function getProductsHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const products = await getProducts();
  return products;
}
