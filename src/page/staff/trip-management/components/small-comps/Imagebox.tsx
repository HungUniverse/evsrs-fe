function ImageBox({ src, label }: { src?: string; label: string }) {
  if (!src)
    return (
      <div className="border rounded-lg h-40 flex items-center justify-center text-slate-400 text-sm">
        {label} (Chưa có ảnh)
      </div>
    );
  return (
    <div className="flex flex-col gap-1">
      <img
        src={src}
        alt={label}
        className="rounded-lg border h-40 object-cover"
      />
      <span className="text-xs text-center text-slate-500">{label}</span>
    </div>
  );
}
export default ImageBox;
