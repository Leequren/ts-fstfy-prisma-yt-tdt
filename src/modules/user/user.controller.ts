import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByEmail, findUsers } from "./user.service";
import { CreateUserInput, LoginInput } from "./user.schema";
import { verifyPassword } from "../../utils/hash";

export async function registerUserHandler(
  req: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = req.body;
  console.log(body);
  try {
    const user = await createUser(body);
    return reply.send(user);
  } catch (err) {
    console.error(err);
    return reply.code(500).send(err);
  }
}

export async function loginHandler(
  req: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  const body = req.body;
  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(401).send({
      message: "Invalid email or password",
    });
  }

  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password,
  });

  if (correctPassword) {
    const { password, salt, ...rest } = user;

    return { accessToken: req.server.jwt.sign(rest) };
  }

  return reply.code(401).send({
    message: "Invalid email or password",
  });
}

export async function getUsersHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const users = await findUsers();
  return users;
}
