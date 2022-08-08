import { Model, User } from "@prisma/client";

type AuthorizationRequest = {
  operation: Operation;
  body: {
    requester?: User; // Not modifiable by user because this is encrypted value in jwt
    model?: Model;
  };
};
type Operation = {
  theme: "model" | "user";
  method: "create" | "read" | "update" | "delete";
};

export function hasRight({ body, operation }: AuthorizationRequest): boolean {
  const role = body.requester?.role;
  switch (role) {
    case "ADMIN":
      return true;
    case "USER":
      switch (operation.theme) {
        case "model":
          const userIsUploader =
            (body.model &&
              body.requester &&
              body.model.id == body.requester.id) ??
            false;
          switch (operation.method) {
            case "create":
              return true;
            case "delete":
              return userIsUploader;
            case "read":
              return true;
            case "update":
              return userIsUploader;
          }
        case "user":
          switch (operation.method) {
            case "create":
              return false;
            case "delete":
              return true;
            case "read":
              return true;
            case "update":
              return true;
          }
      }
      return false;
    case "UNAUTHENTICATED":
      return false;
  }
  return false;
}
