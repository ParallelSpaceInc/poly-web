import Image from "next/image";

type comment = {
  profileUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  text: string;
  userName: string;
};

const Comments = ({
  comments,
  ...props
}: {
  comments: any[];
  className?: any;
}) => {
  return (
    <div {...props}>
      <div className="space-y-3">
        {comments.map((comment) => {
          return (
            <div
              key={comment.id}
              className="border-2 p-2 rounded-md flex-col flex space-y-3"
            >
              <div className="flex">
                <Image
                  className="rounded-full"
                  src="/cube.png"
                  height="40"
                  width="40"
                  alt="profile"
                />
                <div className="text-lg self-end pb-1 text-slate-600">
                  {comment.userId}
                </div>
              </div>
              <div className="ml-3">{comment.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;
