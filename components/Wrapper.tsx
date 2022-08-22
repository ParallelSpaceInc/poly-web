import React from "react";

function Wrapper({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col">
      <div className="flex-1 mt-10 relative w-full px-6 mx-auto max-w-7xl lg:px-8">
        {children}
      </div>
    </div>
  );
}

export default Wrapper;
