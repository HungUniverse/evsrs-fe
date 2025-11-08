import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      <div className="flex-1 flex items-center gap-3 flex-wrap">
        <Input 
          value={searchKey} 
          onChange={(e) => onSearchKeyChange(e.target.value)} 
          placeholder="Tìm theo key..." 
          className="max-w-xs"
        />
        <div className="w-[220px]">
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
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo loại" />
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
        {hasFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;

