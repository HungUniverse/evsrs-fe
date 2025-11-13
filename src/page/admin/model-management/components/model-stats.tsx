import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useModelStats } from "../hooks/use-model-stats";
import { Car, Grid3x3, Package, TrendingUp } from "lucide-react";

interface ModelStatsProps {
  totalModels: number;
}

export default function ModelStats({ totalModels }: ModelStatsProps) {
  const { stats, loading } = useModelStats(totalModels);

  const statCards = [
    {
      title: "Tổng Model",
      value: stats.totalModels,
      icon: Grid3x3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Tổng xe",
      value: stats.totalCars,
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Model có xe",
      value: stats.modelsWithCars,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "TB xe/model",
      value: stats.averageCarsPerModel,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

