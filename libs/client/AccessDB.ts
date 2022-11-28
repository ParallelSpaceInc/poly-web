import { ResponseQuery } from "@api/config";
import { ModelInfo } from "@customTypes/model";
import { User } from "@prisma/client";
import useSWR from "swr";

export function useUser() {
  const { data, error } = useSWR<User>(`/api/users`, (url) =>
    fetch(url).then((res) => res.json())
  );
  const loading = data === undefined && !error;
  return { loading, data, error };
}

export function useModelInfos(filter?: {
  id?: string;
  uploader?: string;
  sort?: string;
}) {
  const queryString = new URLSearchParams(filter).toString();
  const { data, error } = useSWR<ModelInfo[]>(
    `/api/models?${queryString}`,
    (url) => fetch(url).then((res) => res.json())
  );
  const loading = !data && !error;
  return { loading, data, error };
}

export function useModelInfo(modelId: string) {
  const { data, error } = useSWR<ModelInfo[]>(
    `/api/models?id=${modelId}`,
    (url) => fetch(url).then((res) => res.json())
  );
  const loading = !data && !error;
  const parsed = data?.[0] ?? null;
  return { loading, data: parsed, error };
}

export function useSiteConfig() {
  const { data, error } = useSWR<ResponseQuery>(
    "/api/config?config=true",
    (url) => fetch(url).then((res) => res.json())
  );
  const loading = !data && !error;
  return { loading, data, error };
}
