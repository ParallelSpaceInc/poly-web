import { useModelInfos } from "@libs/client/AccessDB";
import { deleteS3Files, getSavedModelList } from "@libs/server/s3client";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Diff: NextPage = () => {
  const dbModels = useModelInfos();
  const [s3Set, setS3Set] = useState(new Set<string>());
  useEffect(() => {
    const func = async () => {
      const res: Set<string> = (await getSavedModelList()) ?? new Set<string>();
      setS3Set(res);
    };
    if (s3Set.size !== 0) {
      return;
    }
    func();
  });
  if (!dbModels.data) {
    return <span>Loading</span>;
  }
  const dbSet: Set<string> =
    dbModels.data?.reduce((prev, cur) => {
      prev.add(cur.id);
      return prev;
    }, new Set<string>()) ?? new Set<string>();
  const dbOnly = [...dbSet].filter((e) => !s3Set.has(e));
  const s3Only = [...s3Set].filter((e) => !dbSet.has(e));
  console.log("db Only", dbOnly);
  console.log("s3 Only", s3Only);
  return (
    <div>
      {/* <table>
        <thead>
          <tr>
            <th>num</th>
            <th>uuid</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>1</td>
          </tr>
        </tbody>
      </table> */}
      <button
        onClick={async () => {
          await deleteS3Models(s3Only);
        }}
        className="w-32 h-20 bg-red-300"
      >
        Delete S3 Only
      </button>
    </div>
  );
};

export default Diff;

async function deleteS3Models(uuids: string[]) {
  const faileds: string[] = [];
  const successes: string[] = [];
  uuids.forEach(async (uuid) => {
    await deleteS3Files(uuid)
      .catch((e) => faileds.push(uuid))
      .then((res) => successes.push(uuid));
  });
  console.log("faileds", faileds);
  console.log("successes", successes);
  return;
}
