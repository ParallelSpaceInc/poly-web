import React from "react";

function Wrapper({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col">
      <div className="flex-1 my-10 w-full px-10 mx-auto max-w-7xl lg:px-20">
        {children}
      </div>
    </div>
  );
}

export default Wrapper;
