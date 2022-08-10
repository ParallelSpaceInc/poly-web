import Login from "@components/login";
import UserMenuModal from "@components/userMenuModal";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

export default function Header() {
  const [isOpenLoginCP, setIsOpenLoginCp] = useState(false);
  const [isClickUserName, setIsClickUserName] = useState(false);
  const userBoxRef = useRef<HTMLElement>(
    null
  ) as React.MutableRefObject<HTMLDivElement>;
  const userMenuModalRef = useRef<HTMLElement>(
    null
  ) as React.MutableRefObject<HTMLDivElement>;
  const { data: session, status } = useSession();

  const router = useRouter();

  const closeLoginBox = (): void => {
    setIsOpenLoginCp(false);
  };

  useEffect(() => {
    function handleClickOutside(event: React.BaseSyntheticEvent | MouseEvent) {
      if (
        userBoxRef.current &&
        !userBoxRef.current.contains(event.target) &&
        userMenuModalRef.current &&
        !userMenuModalRef.current.contains(event.target)
      ) {
        setIsClickUserName(false);
      }
    }

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const clickUserNameBox = () => {
    setIsClickUserName(!isClickUserName);
  };

  const uploadRounter = () => {
    router.push("/models/upload");
  };

  return (
    <div
      className={`relativev w-full ${
        router.pathname === "/upload"
          ? "fixed top-0 left-0 right-0 z-20"
          : "block"
      }`}
    >
      <div
        className={
          "flex justify-between bg-header-gray w-full h-12  pl-10 pr-8 md:pr-6 items-center text-amber-50"
        }
      >
        <div
          className={"text-3xl cursor-pointer select-none"}
          onClick={() => router.push("/")}
        >
          POLY
        </div>
        <div className={"flex justify-between items-center space-x-5"}>
          {status === "authenticated" ? (
            <button
              onClick={uploadRounter}
              className={
                "border bg-white text-black py-1.5 pr-3 pl-2 text-[10px] font-extrabold rounded flex justify-between items-center"
              }
            >
              <Image
                src="/upload1.png"
                width={"10px"}
                height={"10px"}
                alt="uploadPng"
              />
              <p className={"ml-1"}>UPLOAD</p>
            </button>
          ) : null}
          {status === "authenticated" ? (
            <div
              onClick={clickUserNameBox}
              ref={userBoxRef}
              className={
                "flex justify-between items-center space-x-2 cursor-pointer"
              }
            >
              <div>
                <p>{session?.user?.name}</p>
              </div>
              <svg
                className={`rotate-${isClickUserName ? "0" : "180"}`}
                width="9"
                height="7"
                viewBox="0 0 9 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.50387 7L8.52387 0.0299997H0.473867L4.50387 7Z"
                  fill="white"
                />
              </svg>
            </div>
          ) : (
            <div
              className={"cursor-pointer"}
              onClick={() => setIsOpenLoginCp(!isOpenLoginCP)}
            >
              LOGIN
            </div>
          )}
        </div>
      </div>
      {isOpenLoginCP && <Login closeLoginBox={closeLoginBox} />}
      {isClickUserName && (
        <UserMenuModal ref={userMenuModalRef} logOut={signOut} />
      )}
    </div>
  );
}
