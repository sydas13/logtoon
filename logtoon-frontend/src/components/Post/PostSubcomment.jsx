export default function PostSubcomment({ subcomment }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-2">
      <img
        src={`http://localhost:8081/api/logtoon/general/image/${subcomment.avatarFileName}`}
        alt={`${subcomment.username} profile`}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold leading-4 text-slate-700">
          {subcomment.username}
        </p>
        <p className="mt-1 wrap-break-word text-sm leading-5 text-slate-800">
          {`@${subcomment?.parentUserName} ${subcomment.value}`}
        </p>
      </div>
    </div>
  );
}
