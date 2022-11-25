// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { exec } from "child_process";

import path from "path/posix";

export const supportedExt = [
  ".abc",
  ".blend",
  ".dae",
  ".fbx",
  ".obj",
  ".ply",
  ".stl",
  ".usd",
  ".wrl",
  ".x3d",
];

export async function executeConvertor(
  filePath: string,
  destDir: string = "/tmp"
) {
  if (!supportedExt.includes(path.extname(filePath))) {
    throw Error("Not supported type.");
  }
  await execute(`sh exec/convert.sh "${filePath}"`);
  const convertedFile =
    path.basename(filePath).split(".").slice(0, -1).join(".") + ".glb";
  await execute(`mv "${convertedFile}" ${destDir}`).catch((e) =>
    console.log(e)
  );
  return `${destDir}/${convertedFile}`;
}

export async function execute(command: string) {
  return new Promise((res, rej) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        rej(error);
        return;
      }
      res({ stdout, stderr });
    });
  });
}
