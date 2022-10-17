import { hasRight } from "@libs/server/Authorization";
import { Comment, User } from "@prisma/client";
import moment from "moment";
import Image from "next/image";

const Comments = ({
  comments,
  handleDelete,
  user,
  ...props
}: {
  comments?: Comment[];
  handleDelete: any;
  user?: User | null;
  className?: any;
}) => {
  return comments && comments.length !== 0 ? (
    <div {...props} className="mt-3 space-y-3">
      {comments.map((comment) => {
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
  ) : null;
};

export function Comment({ comment, handleDelete, user }: any) {
  return (
    <div
      key={comment.id}
      className="p-2 pb-4 rounded-md flex-col flex space-y-3"
    >
      <div className="flex">
        <Image
          src={comment.commenter.image ?? "/cube.png"}
          alt="profile image"
          width={40}
          height={40}
          layout="fixed"
          className="rounded-full"
        ></Image>
        <div>
          <div className="flex-col text self-end pb-1 ml-3 text-slate-600">
            {comment.commenter.name}
            <div className="flex mt-1 text-sm whitespace-normal">
              {comment.text}
            </div>
            <span className="flex mt-1 text-sm text-gray-500 ">
              {moment(comment.createdAt).fromNow()}
            </span>
            {hasRight(
              { method: "delete", theme: "comment" },
              user,
              null,
              comment
            ) ? (
              <span
                className="ml-auto text-sm text-blue-700 select-none"
                onClick={() => handleDelete(comment.id)}
              >
                Delete
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewComment({ session, handler, register, openLogin }: any) {
  if (!session || !session.data) {
    return (
      <div className="flex justify-center py-10 whitespace-pre">
        댓글을 달기 위해서는{" "}
        <span
          onClick={openLogin}
          className="text-blue-600 font-bold cursor-pointer"
        >
          로그인
        </span>
        이 필요합니다.
      </div>
    );
  }
  return (
    <div className="p-2 mt-4 rounded-md flex">
      <Image
        src={session.data.user.image}
        alt="profile image"
        width={40}
        height={40}
        layout="fixed"
        className="rounded-full"
      ></Image>
      <div className="flex ml-2 w-full">
        <textarea
          {...register("text", { required: true, maxLength: 300 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey === false) {
              handler();
            }
          }}
          className="w-full p-2 align-top overflow-auto border-2 border-gray-300 rounded h-20 focus:outline-sky-200"
        ></textarea>
      </div>
    </div>
  );
}

export default Comments;
