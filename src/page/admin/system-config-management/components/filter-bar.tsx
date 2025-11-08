import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, RotateCcw, Settings } from "lucide-react";
import type { SystemConfigType } from "@/@types/enum";

interface FilterBarProps {
  searchKey: string;
  onSearchKeyChange: (v: string) => void;
  configType: SystemConfigType | undefined;
  onConfigTypeChange: (v: SystemConfigType | "") => void;
  onClearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  searchKey, 
  onSearchKeyChange, 
  configType, 
  onConfigTypeChange,
  onClearFilters 
}) => {
  const hasFilters = searchKey || configType;

  return (
    <Card className="shadow-sm border">
      <CardContent className="p-6 space-y-6">
        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 flex-1 w-full sm:max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchKey}
                onChange={(e) => onSearchKeyChange(e.target.value)}
                placeholder="Tìm theo key..."
                className="pl-10 pr-4 h-10"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Filters Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Filter className="h-4 w-4" />
            <span>Bộ lọc</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="config-type-filter" className="text-sm font-medium flex items-center gap-2">
                <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                Loại cấu hình
              </Label>
              <Select
                value={configType || "ALL"}
                onValueChange={(v) => {
                  if (v === "ALL") {
                    onConfigTypeChange("");
                  } else {
                    onConfigTypeChange(v as SystemConfigType);
                  }
                }}
              >
                <SelectTrigger id="config-type-filter" className="h-10">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả loại</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="PaymentGateway">PaymentGateway</SelectItem>
                  <SelectItem value="Notification">Notification</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reset Button */}
          {hasFilters && (
            <div className="flex justify-end pt-2">
              <Button
                onClick={onClearFilters}
                variant="outline"
                size="sm"
                className="h-9 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-2" />
                Đặt lại bộ lọc
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;

