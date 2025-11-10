import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AIIcon } from "@/components/ui/ai-icon";
import { forecastAIAPI } from "@/apis/forecast-ai.api";
import { modelAPI } from "@/apis/model-ev.api";
import type { ForecastResponse, ForecastRecommendation } from "@/@types/forecast";
import type { RecommendedAction } from "@/@types/enum";
import { AlertCircle, Calendar, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";

interface ForecastDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  depotId: string;
  depotName: string;
}

interface EnrichedRecommendation extends ForecastRecommendation {
  modelName?: string;
}

const getActionLabel = (action: string): string => {
  switch (action as RecommendedAction) {
    case "BUY":
      return "Nên mua";
    case "OK":
      return "Ổn định";
    case "SURPLUS":
      return "Thừa";
    default:
      return action;
  }
};

const getActionVariant = (action: string): "default" | "secondary" | "outline" => {
  switch (action as RecommendedAction) {
    case "BUY":
      return "default";
    case "OK":
      return "secondary";
    case "SURPLUS":
      return "outline";
    default:
      return "outline";
  }
};

const getActionColor = (action: string): string => {
  switch (action as RecommendedAction) {
    case "BUY":
      return "bg-purple-600 hover:bg-purple-700";
    case "OK":
      return "bg-green-600 hover:bg-green-700";
    case "SURPLUS":
      return "bg-amber-600 hover:bg-amber-700";
    default:
      return "";
  }
};

export default function ForecastDialog({
  open,
  onOpenChange,
  depotId,
  depotName,
}: ForecastDialogProps) {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [recommendations, setRecommendations] = useState<EnrichedRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await forecastAIAPI.getForecastByStationId(depotId);
      setForecast(response);

      // Enrich with model names
      const enriched = await Promise.all(
        response.recommendations.map(async (rec: ForecastRecommendation) => {
          try {
            const model = await modelAPI.getById(rec.vehicleType);
            return {
              ...rec,
              modelName: model.modelName,
            };
          } catch (err) {
            console.error("Error fetching model:", err);
            return rec;
          }
        })
      );

      setRecommendations(enriched);
    } catch (err) {
      console.error("Error fetching forecast:", err);
      setError("Không thể tải dự báo AI. Vui lòng thử lại sau.");
      toast.error("Không thể tải dự báo AI");
    } finally {
      setLoading(false);
    }
  }, [depotId]);

  useEffect(() => {
    if (open && depotId) {
      // Reset state when opening dialog for a different depot
      setForecast(null);
      setRecommendations([]);
      fetchForecast();
    }
  }, [open, depotId, fetchForecast]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AIIcon size={24} />
            <div>
              <div>Dự báo AI - {depotName}</div>
              <div className="text-sm font-normal text-muted-foreground mt-1">
                Gợi ý nhu cầu thuê xe dựa trên phân tích dữ liệu
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && forecast && (
          <div className="space-y-6">
            {/* Forecast Info */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <div className="font-medium">Giai đoạn dữ liệu</div>
                  <div className="text-muted-foreground">
                    {new Date(forecast.forecastPeriod.startDate).toLocaleDateString("vi-VN")} -{" "}
                    {new Date(forecast.forecastPeriod.endDate).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <div className="font-medium">Số ngày phân tích</div>
                  <div className="text-muted-foreground">{forecast.horizonDays} ngày</div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {recommendations.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <p>Không có gợi ý nào cho trạm này</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={`${rec.vehicleType}-${index}`}
                    className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getActionVariant(rec.recommendedAction)}
                          className={getActionColor(rec.recommendedAction)}
                        >
                          {getActionLabel(rec.recommendedAction)}
                        </Badge>
                        <span className="font-semibold text-lg">
                          {rec.modelName || rec.vehicleTypeName || "Đang tải..."}
                        </span>
                      </div>
                      {rec.reason && (
                        <p className="text-sm text-muted-foreground">
                          {rec.reason}
                        </p>
                      )}
                    </div>
                    {rec.recommendedAction === "BUY" && (
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-3xl font-bold text-purple-600">
                            {rec.requiredUnits}
                          </div>
                          <div className="text-xs text-muted-foreground">xe cần</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

