import { useEffect, useState } from "react";
import { SystemConfigUtils } from "@/hooks/use-system-config";

interface SystemConfigDisplayProps {
  configKey: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  defaultValue?: string;
  formatter?: (value: string) => string;
}

// Component để hiển thị giá trị system config
export function SystemConfigDisplay({
  configKey,
  prefix = "",
  suffix = "",
  className = "",
  defaultValue = "N/A",
  formatter,
}: SystemConfigDisplayProps) {
  const [value, setValue] = useState<string>(defaultValue);

  useEffect(() => {
    const configValue = SystemConfigUtils.get(configKey);
    if (configValue) {
      setValue(formatter ? formatter(configValue) : configValue);
    }
  }, [configKey, formatter]);

  return (
    <span className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

// Component để hiển thị tiền cọc
export function DepositAmountDisplay({
  className = "",
}: {
  className?: string;
}) {
  return (
    <SystemConfigDisplay
      configKey="Tiền cọc"
      className={className}
      defaultValue="0"
      formatter={(value) => {
        const num = parseFloat(value) || 0;
        return new Intl.NumberFormat("vi-VN").format(num) + "₫";
      }}
    />
  );
}
