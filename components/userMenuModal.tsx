import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type props = {
  logOut: () => void;
};

const UserMenuModal = React.forwardRef<HTMLDivElement, props>((props, ref) => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <div
      ref={ref}
      className={
        "absolute mt-2 right-8 border border-gray-300 rounded shadow-md bg-white shadow-slate-400 z-10"
      }
    >
      <ul className={"divide-y cursor-pointer divide-slate-300"}>
        <li
          onClick={() => {
            router.push("/users");
          }}
          className={"px-16 py-4  text-center"}
        >
          마이페이지
        </li>
        <li onClick={props.logOut} className={"px-16 py-4 text-center"}>
          로그아웃
        </li>
        {session?.role === Role.ADMIN || session?.role === Role.DEVELOPER ? (
          <Link href="/dev">
            <li className="px-16 py-4 text-center">To DevPage</li>
          </Link>
        ) : null}
      </ul>
    </div>
  );
});

UserMenuModal.displayName = "UserMenuModal";

export default UserMenuModal;
