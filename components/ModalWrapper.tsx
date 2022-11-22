import React from "react";

function ModalWrapper({
  children,
  closeCallback,
}: React.PropsWithChildren & { closeCallback: () => void }) {
  //if clicked outside of modal, close modal
  const handleClick = (e: any) => {
    if (e.target.classList.contains("backlayer")) {
      // closeCallback();
      console.log("clicked outside");
    }
  };
  return (
    <div
      className="backlayer sm:fixed sm:top-0 sm:left-0 sm:w-screen sm:h-screen sm:bg-black sm:bg-opacity-50"
      onClick={handleClick}
    >
      <div className="flex flex-col sm:bg-white p-4 sm:m-10 sm:rounded">
        {children}
      </div>
    </div>
  );
}

export default ModalWrapper;
