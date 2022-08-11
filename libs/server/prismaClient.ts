import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";

declare global {
  var prismaClient: PrismaClient;
}

global.prismaClient ??= new PrismaClient();

export default global.prismaClient;

export const getUser = async (req: NextApiRequest) => {
  const session = await getSession({ req });
  const email = session?.user?.email;
  const user = email
    ? await global.prismaClient.user.findUnique({
        where: { email },
      })
    : null;
  return user;
};
