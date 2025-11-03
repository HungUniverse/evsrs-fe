import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface OrderNoteProps {
  note: string;
  onChange: (note: string) => void;
}

export function OrderNote({ note, onChange }: OrderNoteProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Ghi chú (tùy chọn)
      </h2>
      <div>
        <Label htmlFor="note">Ghi chú đơn hàng</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nhập ghi chú nếu cần..."
          className="mt-2 min-h-[100px]"
        />
        <p className="text-sm text-gray-500 mt-1">{note.length} / 500 ký tự</p>
      </div>
    </div>
  );
}
