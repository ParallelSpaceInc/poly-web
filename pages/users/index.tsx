import { useUser } from "@libs/client/AccessDB";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function UsersPage() {
  const router = useRouter();
  const session = useSession();
  const user = useUser();
  const loading = session.status === "loading" || user.loading;

  if (loading) {
    return;
  }
  if (session.status === "unauthenticated" || !user.data) {
    router.push("/models");
    return;
  }
  router.push(`/users/${user.data.id}`);
  return <div></div>;
}

export default UsersPage;
