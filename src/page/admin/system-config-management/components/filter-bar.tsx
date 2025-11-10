import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, RotateCcw, Plus } from "lucide-react";
import type { SystemConfigType } from "@/@types/enum";

interface FilterBarProps {
  searchKey: string;
  onSearchKeyChange: (v: string) => void;
  configType: SystemConfigType | undefined;
  onConfigTypeChange: (v: SystemConfigType | "") => void;
  onClearFilters: () => void;
  onAdd: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  searchKey, 
  onSearchKeyChange, 
  configType, 
  onConfigTypeChange,
  onClearFilters,
  onAdd
}) => {
  const hasFilters = searchKey || configType;

  return (
    <Card className="shadow-sm border bg-muted/30 rounded-lg">
      <CardContent className="p-4">
        {/* Header with Filter Icon and Title */}
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-foreground" />
          <span className="text-sm font-semibold text-foreground">Bộ lọc tìm kiếm</span>
        </div>

        {/* Horizontal Filters Row - Compact Layout */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filters Section - Left Side */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Search Input */}
            <div className="flex-1 min-w-[150px] max-w-[220px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  value={searchKey}
                  onChange={(e) => onSearchKeyChange(e.target.value)}
                  placeholder="Tìm theo key..."
                  className="pl-8 h-9 bg-background text-sm"
                />
              </div>
            </div>

            {/* Config Type Filter */}
            <div className="flex-1 min-w-[160px] max-w-[220px]">
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
                <SelectTrigger className="h-9 bg-background text-sm">
                  <SelectValue placeholder="Tất cả loại" />
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

            {/* Reset Button */}
            {hasFilters && (
              <Button
                onClick={onClearFilters}
                variant="outline"
                size="sm"
                className="h-9 px-3 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground shrink-0 text-sm"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Đặt lại
              </Button>
            )}
          </div>

          {/* Add Button - Right Side */}
          <Button onClick={onAdd} className="h-9 shrink-0 text-sm ml-auto bg-emerald-200 text-emerald-900 hover:bg-emerald-300">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Thêm cấu hình
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;
