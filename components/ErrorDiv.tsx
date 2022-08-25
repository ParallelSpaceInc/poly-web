import { FieldError } from "react-hook-form";

const ErrorDiv = ({ error }: { error?: FieldError | undefined }) => (
  <div className="text-red-600 pl-1">
    {error?.type === "required" && error.message}
  </div>
);
export default ErrorDiv;
