import React from "react";

function Wrapper({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col max-h-[10/11] overflow-auto">
      <div className="flex-1 my-10 relative w-auto mx-6 max-w-7xl lg:px-8">
        {children}
      </div>
    </div>
  );
}

export default Wrapper;
