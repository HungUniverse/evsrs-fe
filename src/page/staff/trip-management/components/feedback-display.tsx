import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { feedbackAPI } from "@/apis/feedback.api";
import type { FeedBack } from "@/@types/order/feedback";

type FeedbackDisplayProps = {
  orderBookingId: string;
  orderStatus: string;
};

export default function FeedbackDisplay({
  orderBookingId,
  orderStatus,
}: FeedbackDisplayProps) {
  const [feedback, setFeedback] = useState<FeedBack | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing feedback
  useEffect(() => {
    if (orderStatus !== "COMPLETED") {
      setLoading(false);
      return;
    }

    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const data = await feedbackAPI.getByOrderId(orderBookingId);
        setFeedback(data);
      } catch {
        // No feedback exists yet
        setFeedback(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [orderBookingId, orderStatus]);

  // Don't show feedback section if order is not completed
  if (orderStatus !== "COMPLETED") {
    return null;
  }

  if (loading) {
    return (
      <section className="rounded-2xl border bg-white p-5 md:p-6">
        <div className="text-lg font-semibold mb-4">Đánh giá</div>
        <div className="text-sm text-gray-500">Đang tải...</div>
      </section>
    );
  }

  // Don't show section if no feedback
  if (!feedback) {
    return null;
  }

  return (
    <section className="rounded-2xl border bg-white p-5 md:p-6">
      <div className="text-lg font-semibold mb-4">Đánh giá của khách hàng</div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Đánh giá:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Number(feedback.rated)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm font-medium">{feedback.rated}/5</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {feedback.description}
          </p>
        </div>

        <div className="text-xs text-gray-500">
          Đánh giá vào: {new Date(feedback.createdAt).toLocaleString("vi-VN")}
        </div>
      </div>
    </section>
  );
}
