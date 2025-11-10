import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIIcon } from "@/components/ui/ai-icon";
import { capacityAIAPI } from "@/apis/capacity-ai.api";
import { depotAPI } from "@/apis/depot.api";
import { modelAPI } from "@/apis/model-ev.api";
import type { CapacityAction } from "@/@types/capacity";
import { AlertCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface EnrichedCapacityAction extends CapacityAction {
  depotName?: string;
  modelName?: string;
}

export default function CapacityAdvice() {
  const [actions, setActions] = useState<EnrichedCapacityAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCapacityAdvice();
  }, []);

  const fetchCapacityAdvice = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await capacityAIAPI.getCapacityAdvice();
      
      // Filter only BUY actions
      const buyActions = response.actions.filter(
        (action) => action.actionType === "BUY"
      );

      // Enrich with depot and model names
      const enrichedActions = await Promise.all(
        buyActions.map(async (action) => {
          try {
            const [depot, model] = await Promise.all([
              depotAPI.getById(action.stationId),
              modelAPI.getById(action.vehicleType),
            ]);
            return {
              ...action,
              depotName: depot.name,
              modelName: model.modelName,
            };
          } catch (err) {
            console.error("Error enriching action:", err);
            return action;
          }
        })
      );

      setActions(enrichedActions);
    } catch (err) {
      console.error("Error fetching capacity advice:", err);
      setError("Không thể tải gợi ý AI. Vui lòng thử lại sau.");
      toast.error("Không thể tải gợi ý AI");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AIIcon size={20} />
            Gợi ý AI - Nâng cấp đội xe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AIIcon size={20} />
            Gợi ý AI - Nâng cấp đội xe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AIIcon size={20} />
            Gợi ý AI - Nâng cấp đội xe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <p>Không có gợi ý mua xe nào lúc này</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AIIcon size={20} />
          Gợi ý AI - Nâng cấp đội xe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action, index) => (
            <div
              key={`${action.stationId}-${action.vehicleType}-${index}`}
              className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 hover:shadow-md transition-shadow"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-purple-600">
                    Mua
                  </Badge>
                  <span className="font-semibold text-lg">
                    {action.depotName || "Đang tải..."}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Loại xe: <span className="font-medium text-foreground">{action.modelName || "Đang tải..."}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">
                    {action.units}
                  </div>
                  <div className="text-xs text-muted-foreground">xe</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

