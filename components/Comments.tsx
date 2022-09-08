import { useSession } from "next-auth/react";
import Image from "next/image";

const Comments = ({
  comments,
  ...props
}: {
  comments: any[];
  className?: any;
}) => {
  const session = useSession();
  const src = session?.data?.user?.image;
  return (
    <div {...props}>
      <div className="space-y-3">
        {comments?.map((comment) => {
          return <Comment key={comment.id} comment={comment} />;
        })}
        {session.data ? (
          <form>
            <div className="border-2 p-2 border-blue-100 rounded-md flex-col flex space-y-3">
              <div className="flex">
                <Image
                  className="rounded-full"
                  src={src ?? ""}
                  height="40"
                  width="40"
                  alt="profile"
                />
                <div className="text-lg self-end pb-1 ml-3 text-slate-600">
                  {session.data.user?.name}
                </div>
              </div>
              <input className="ml-3 text-sm border-2 rounded p-2"></input>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export const Comment = ({ comment }: any) => (
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
    </div>
    <div className="ml-3 text-sm">{comment.text}</div>
  </div>
);

export default Comments;
