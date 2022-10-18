import React from "react";

function Wrapper({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col max-h-[10/11] overflow-auto">
      <div className="flex flex-col my-10 relative w-full mx-auto md:max-w-[80%] max-w-[90%]">
        {children}
      </div>
    </div>
  );
}

export default Wrapper;
