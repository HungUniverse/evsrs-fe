import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { SystemConfigTypeResponse } from "@/@types/system-config";

interface SystemConfigFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<SystemConfigTypeResponse> | null;
  onSubmit: (payload: { key: string; value: string }) => Promise<void> | void;
}

const SystemConfigFormDialog: React.FC<SystemConfigFormDialogProps> = ({ 
  open, 
  onOpenChange, 
  initialData, 
  onSubmit 
}) => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [valueError, setValueError] = useState<string>("");

  useEffect(() => {
    if (open) {
      setKey(initialData?.key ?? "");
      // Parse string value to number for display in number input
      if (initialData?.value) {
        const trimmed = initialData.value.trim();
        const numValue = parseFloat(trimmed);
        // If it's a valid finite number, display it; otherwise clear the field
        if (!isNaN(numValue) && isFinite(numValue)) {
          setValue(numValue.toString());
        } else {
          setValue("");
        }
      } else {
        setValue("");
      }
      setValueError("");
    } else {
      // Reset form when dialog closes
      setKey("");
      setValue("");
      setValueError("");
    }
  }, [initialData, open]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Remove any 'e', 'E', '+' characters (scientific notation) that might have been pasted
    inputValue = inputValue.replace(/[eE+]/g, '');
    
    // Block leading decimal point (must have at least one digit before decimal)
    // Don't allow ".", "-.", or decimal point at the start
    if (inputValue === '.' || inputValue === '-.' || inputValue.match(/^-\d*\.$/)) {
      // Remove the decimal point if there's no digit before it
      inputValue = inputValue.replace(/\.$/, '');
      if (inputValue === '-') {
        setValue(inputValue);
        return;
      }
      if (inputValue === '') {
        setValue('');
        return;
      }
    }
    
    // For type="number", the value might be empty string when invalid
    // Only update if it's a valid number string or empty
    if (inputValue === '' || inputValue === '-') {
      setValue(inputValue);
    } else {
      // Validate it's a valid number format
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue) && isFinite(numValue)) {
        setValue(inputValue);
      } else if (inputValue.match(/^-?\d+\.?\d*$/)) {
        // Allow partial input like "123." or "123.45" but must start with digit
        setValue(inputValue);
      } else if (inputValue.match(/^-?\d+$/)) {
        // Allow numbers without decimal
        setValue(inputValue);
      }
      // Otherwise, don't update (ignore invalid input)
    }
    
    // Clear error when user starts typing
    if (valueError) {
      setValueError("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Block 'e', 'E', '+', 'E' (scientific notation) and other unwanted characters
    const blockedKeys = ['e', 'E', '+'];
    
    if (blockedKeys.includes(e.key)) {
      e.preventDefault();
      return;
    }
    
    // Allow control keys
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', 'Clear'
    ];
    
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // Allow numbers 0-9
    if (/[0-9]/.test(e.key)) {
      return;
    }
    
    // Allow decimal point only if there's at least one digit before it
    if (e.key === '.' || e.key === 'Decimal') {
      // Prevent multiple decimal points
      if (value.includes('.')) {
        e.preventDefault();
        return;
      }
      // Block decimal point if no digit before it (don't allow "." or "-.")
      const currentValue = value || '';
      const hasDigitBefore = /^\d/.test(currentValue) || (currentValue.startsWith('-') && /^-\d/.test(currentValue));
      if (!hasDigitBefore) {
        e.preventDefault();
        return;
      }
      return;
    }
    
    // Allow minus sign only at the start
    if (e.key === '-') {
      const input = e.currentTarget;
      const cursorPosition = input.selectionStart || 0;
      // Only allow minus at the beginning
      if (cursorPosition !== 0 || value.includes('-')) {
        e.preventDefault();
      }
      return;
    }
    
    // Block everything else (letters, special characters)
    if (e.key.length === 1 && !/[0-9.-]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    
    // Validate value
    if (!value || value.trim() === "") {
      setValueError("Vui lòng nhập giá trị");
      return;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setValueError("Vui lòng nhập một số hợp lệ");
      return;
    }
    
    try {
      setSubmitting(true);
      // Convert number to string for API
      await onSubmit({ 
        key: key.trim(), 
        value: numValue.toString()
      });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Sửa cấu hình hệ thống
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="config-key">Key</Label>
            <div className="px-3 py-2 bg-muted rounded-md text-sm font-medium">
              {key || "-"}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="config-value">Value *</Label>
            <Input
              id="config-value"
              type="number"
              step="any"
              value={value}
              onChange={handleValueChange}
              onKeyDown={handleKeyDown}
              placeholder="Nhập giá trị số"
              required
            />
            {valueError && (
              <p className="text-xs text-red-500">{valueError}</p>
            )}
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => onOpenChange(false)} 
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-200 text-emerald-900 hover:bg-emerald-300"
            >
              {submitting ? "Đang xử lý..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SystemConfigFormDialog;

