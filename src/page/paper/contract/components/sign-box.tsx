import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (dataUrl: string) => Promise<void> | void; // có thể async
  height?: number;
};

export default function SignatureDialog({
  open,
  onOpenChange,
  onSave,
  height = 192,
}: Props) {
  const sigRef = useRef<SignatureCanvas | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => {
        sigRef.current?.clear();
        setIsEmpty(true);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  const onEnd = () => setIsEmpty(sigRef.current?.isEmpty() ?? true);

  const clear = () => {
    sigRef.current?.clear();
    setIsEmpty(true);
  };

  const save = async () => {
    if (!sigRef.current || sigRef.current.isEmpty()) return;
    const dataUrl = sigRef.current.toDataURL("image/png");
    try {
      setBusy(true);
      await onSave(dataUrl); // ⬅️ chờ upload Cloudinary
      onOpenChange(false); // ⬅️ đóng sau khi lưu OK
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ký hợp đồng</DialogTitle>
        </DialogHeader>

        <div className="border rounded-lg bg-white" style={{ height }}>
          <SignatureCanvas
            ref={sigRef}
            penColor="black"
            onEnd={onEnd}
            canvasProps={{ className: "w-full h-full rounded-lg" }}
          />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={clear} disabled={busy}>
            Xóa
          </Button>
          <Button disabled={isEmpty || busy} onClick={save}>
            {busy ? "Đang lưu..." : "Lưu chữ ký"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
