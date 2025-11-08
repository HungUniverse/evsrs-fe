import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, ZoomIn } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string | null;
}

export function ImageModal({ isOpen, onClose, imageUrl, title }: ImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <ZoomIn className="size-5 text-muted-foreground" />
            {title || "Xem ảnh tài liệu"}
          </DialogTitle>
        </DialogHeader>
        {imageUrl && (
          <div className="flex-1 min-h-0 flex flex-col space-y-4">
            <div className="flex-1 min-h-0 rounded-lg border bg-muted/20 overflow-hidden">
              <img
                src={imageUrl}
                alt={title || "Image"}
                className="w-full h-full object-contain"
              />
            </div>
            <DialogFooter className="flex-shrink-0">
              <Button variant="outline" onClick={() => window.open(imageUrl, "_blank")}>
                <ExternalLink className="size-4 mr-2" />
                Mở trong tab mới
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

