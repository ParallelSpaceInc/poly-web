import React from "react";

function ModalWrapper({
  children,
  closeCallback,
}: React.PropsWithChildren & { closeCallback: () => void }) {
  //if clicked outside of modal, close modal
  const handleClick = (e: any) => {
    if (e.target.classList.contains("backlayer")) {
      closeCallback();
    }
  };
  return (
    <div
      className="backlayer sm:fixed sm:top-0 sm:left-0 sm:w-screen sm:h-screen sm:bg-black sm:bg-opacity-50"
      onClick={handleClick}
    >
      <div className="flex flex-col p-4 sm:h-[90%] sm:scroll sm:overflow-y-scroll scroll-m-4 sm:bg-white sm:m-10 sm:rounded">
        {children}
      </div>
    </div>
  );
}

export default ModalWrapper;
