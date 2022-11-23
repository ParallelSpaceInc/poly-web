import React from "react";
import Wrapper from "./Wrapper";

function ModalWrapper({
  children,
  closeCallback,
  pageMode = false,
}: React.PropsWithChildren & {
  closeCallback: () => void;
  pageMode?: boolean;
}) {
  //if clicked outside of modal, close modal
  const handleClick = (e: any) => {
    if (e.target.classList.contains("backlayer")) {
      closeCallback();
    }
  };
  return pageMode ? (
    <Wrapper>{children}</Wrapper>
  ) : (
    <div
      className={`backlayer fixed top-0 left-0 w-screen h-screen bg-white sm:bg-black sm:bg-opacity-50`}
      onClick={handleClick}
    >
      <div
        className={`flex flex-col p-4 sm:h-[90%] sm:rounded h-full overflow-y-scroll sm:bg-white sm:m-10 "
      `}
      >
        {children}
      </div>
    </div>
  );
}

export default ModalWrapper;
