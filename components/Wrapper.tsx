import React from "react";

function Wrapper({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col max-h-[10/11] overflow-auto">
      <div className="flex flex-col my-10 relative mx-auto max-w-7xl px-8">
        {children}
      </div>
    </div>
  );
}

export default Wrapper;
