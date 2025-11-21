import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { Paperclip, Star } from "lucide-react";

import type { FeedBack } from "@/@types/order/feedback";
import type { UserFull } from "@/@types/auth.type";
import { feedbackAPI } from "@/apis/feedback.api";
import { formatDate } from "@/lib/utils/formatDate";

interface AdminDetailPaperProps {
  orderId: string;
  user?: UserFull;
}

export default function AdminDetailPaper({ orderId, user }: AdminDetailPaperProps) {
  const [feedback, setFeedback] = useState<FeedBack | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!orderId) return;
    setFeedback(null);
    setLoading(true);
    setError(null);
    feedbackAPI
      .getByOrderId(orderId)
      .then((res) => {
        if (!mounted) return;
        setFeedback(res);
      })
      .catch((err) => {
        if (!mounted) return;
        const axiosErr = err as AxiosError;
        if (axiosErr.response?.status === 404) {
          setFeedback(null);
          return;
        }
        setError("Không tải được đánh giá");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [orderId]);

  const rating = Number(feedback?.rated || 0);
  const roundedRating = Number.isNaN(rating) ? 0 : Math.min(Math.max(rating, 0), 5);
  const starArray = useMemo(() => Array.from({ length: 5 }), []);
  const base = `/admin/order/${orderId}`;

  const displayName = user?.fullName || user?.userName || "Khách hàng";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    displayName.slice(0, 2).toUpperCase() ||
    "KH";

  return (
    <aside className="space-y-5">
      <section className="rounded-xl border bg-white p-4 md:p-5">
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
              Biên bản trả xe
            </Link>
          </li>
          <li>
            <Link
              to={`${base}/return/settlement`}
              className="inline-flex items-center gap-2 text-sm text-sky-700 hover:underline"
            >
              <Paperclip className="h-4 w-4" />
              Biên bản thanh toán trả xe
            </Link>
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-800 mb-4">Đánh giá của khách hàng</div>

        {loading && (
          <div className="space-y-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/2 rounded bg-slate-200" />
                <div className="h-3 w-1/3 rounded bg-slate-200" />
              </div>
            </div>
            <div className="h-3 w-full rounded bg-slate-200" />
            <div className="h-3 w-4/5 rounded bg-slate-200" />
          </div>
        )}

        {!loading && error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && !feedback && (
          <p className="text-sm text-slate-500">Chưa có đánh giá cho đơn hàng này.</p>
        )}

        {!loading && !error && feedback && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={displayName}
                  className="h-12 w-12 rounded-full object-cover border"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-semibold">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-800">{displayName}</p>
                <p className="text-xs text-slate-500">{formatDate(feedback.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-yellow-500">
              {starArray.map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${
                    index < Math.round(roundedRating)
                      ? "text-yellow-500 fill-yellow-400"
                      : "text-slate-300 fill-transparent"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-medium text-slate-700">
                {roundedRating.toFixed(1)}/5
              </span>
            </div>

            <p className="text-sm text-slate-700 whitespace-pre-wrap">{feedback.description}</p>
          </div>
        )}
      </section>
    </aside>
  );
}

