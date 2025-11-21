import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { feedbackAPI } from "@/apis/feedback.api";
import type { FeedBack } from "@/@types/order/feedback";

type FeedbackProps = {
  orderBookingId: string;
  orderStatus: string;
};

export default function Feedback({
  orderBookingId,
  orderStatus,
}: FeedbackProps) {
  const [feedback, setFeedback] = useState<FeedBack | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [description, setDescription] = useState("");

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

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (!description.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      setSubmitting(true);
      const newFeedback = await feedbackAPI.create({
        orderBookingId,
        rated: rating.toString(),
        description: description.trim(),
        images: null,
      });

      setFeedback(newFeedback);
      toast.success("Gửi đánh giá thành công!");
      setRating(0);
      setDescription("");
    } catch (error) {
      console.error("Submit feedback error:", error);
      toast.error("Không thể gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <section className="rounded-2xl border bg-white p-5 md:p-6">
      <div className="text-lg font-semibold mb-4">Đánh giá chuyến đi</div>

      {feedback ? (
        // Display existing feedback
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Đánh giá của bạn:</span>
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
              <span className="ml-2 text-sm font-medium">
                {feedback.rated}/5
              </span>
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
      ) : (
        // Feedback form
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Đánh giá của bạn <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                  disabled={submitting}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {rating}/5
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Nội dung đánh giá <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Chia sẻ trải nghiệm của bạn về chuyến đi này..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={submitting}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={submitting || rating === 0 || !description.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
