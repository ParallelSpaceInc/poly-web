import { useUser } from "@libs/client/AccessDB";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function UsersPage() {
  const router = useRouter();
  const session = useSession();
  const user = useUser();
  const onLoading =
    session.status === "loading" || user.loading || !router.isReady;
  if (onLoading) return;
  if (session.status === "unauthenticated" || !user.data) {
    router.replace("/models");
    return;
  }
  router.replace(`/users/${user.data.id}`);
  return;
}

export default UsersPage;
