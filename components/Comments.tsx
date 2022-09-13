import { hasRight } from "@libs/server/Authorization";
import { User } from "@prisma/client";
import Image from "next/image";

const Comments = ({
  comments,
  handleDelete,
  user,
  ...props
}: {
  comments: any[];
  handleDelete: any;
  user?: User | null;
  className?: any;
}) => {
  return (
    <div {...props}>
      <div className="space-y-3">
        {comments?.map((comment) => {
          return (
            <Comment
              handleDelete={handleDelete}
              key={comment.id}
              comment={comment}
              user={user}
            />
          );
        })}
      </div>
    </div>
  );
};

export const Comment = ({ comment, handleDelete, user }: any) => (
  <div
    key={comment.id}
    className="border-2 p-2 pb-4 rounded-md flex-col flex space-y-3"
  >
    <div className="flex">
      <Image
        className="rounded-full"
        src="/cube.png"
        height="40"
        width="40"
        alt="profile"
      />
      <div className="text-lg self-end pb-1 ml-3 text-slate-600">
        {comment.commenter.name}
      </div>
      {hasRight({ method: "delete", theme: "comment" }, user, null, comment) ? (
        <div
          className="ml-auto select-none"
          onClick={() => handleDelete(comment.id)}
        >
          X
        </div>
      ) : null}
    </div>
    <div className="ml-3 text-sm">{comment.text}</div>
  </div>
);

export default Comments;
