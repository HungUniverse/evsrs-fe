import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string | null;
}

export function ImageModal({ isOpen, onClose, imageUrl, title }: ImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {imageUrl && (
          <div className="space-y-4">
            <img
              src={imageUrl}
              alt={title || "Image"}
              className="w-full max-h-[400px] object-contain rounded border"
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => window.open(imageUrl, "_blank")}
              >
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
