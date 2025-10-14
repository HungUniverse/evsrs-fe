import { Link } from "react-router-dom";
import { Paperclip } from "lucide-react";

export default function StaffDetailPaper({ orderId }: { orderId: string }) {
  const base = `/staff/trip/${orderId}`;
  return (
    <aside className="rounded-xl border bg-white p-4 md:p-5">
      <div className="text-emerald-700 text-xs font-semibold uppercase tracking-wide">
        Tài liệu đính kèm
      </div>
      <ul className="mt-3 space-y-2">
        <li>
          <Link
            to={`${base}/contract`}
            className="inline-flex items-center gap-2 text-sm text-sky-700 hover:underline"
          >
            <Paperclip className="h-4 w-4" />
            Hợp đồng thuê xe
          </Link>
        </li>
        <li>
          <Link
            to={`${base}/handover/inspection`}
            className="inline-flex items-center gap-2 text-sm text-sky-700 hover:underline"
          >
            <Paperclip className="h-4 w-4" />
            Biên bản giao xe
          </Link>
        </li>
        <li>
          <Link
            to={`${base}/return/inspection`}
            className="inline-flex items-center gap-2 text-sm text-sky-700 hover:underline"
          >
            <Paperclip className="h-4 w-4" />
            Biên bản nhận xe
          </Link>
        </li>
      </ul>
    </aside>
  );
}
