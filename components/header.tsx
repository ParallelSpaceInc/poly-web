import Login from "@components/login";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const [isOpenLoginCP, setIsOpenLoginCp] = useState(false);

  const closeLoginBox = (): void => {
    setIsOpenLoginCp(false);
  };

  return (
    <div className="relative">
      <div className="flex justify-end bg-gray-400 w-full h-12  pl-10 pr-8 md:pr-16 items-center text-amber-50">
        {status === "authenticated" ? (
          <div className="flex justify-between items-center space-x-5">
            <div>
              <p>{session?.user?.name}님</p>
            </div>
            <button className="border-2 px-2 rounded" onClick={() => signOut()}>
              log out
            </button>
          </div>
        ) : (
          <div
            className="cursor-pointer"
            onClick={() => setIsOpenLoginCp(!isOpenLoginCP)}
          >
            LOGIN
          </div>
        )}
      </div>
      {isOpenLoginCP && <Login closeLoginBox={closeLoginBox} />}
    </div>
  );
}
