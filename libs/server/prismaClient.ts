import { PrismaClient } from '@prisma/client';

declare global {
  var client: PrismaClient;
}

global.client ??= new PrismaClient();

export default global.client;
