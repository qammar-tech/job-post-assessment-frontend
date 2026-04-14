import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JobPostForm } from "./JobPostForm";

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PostJobModal({
  isOpen,
  onClose,
  onSuccess,
}: PostJobModalProps): React.ReactElement {
  function handleSuccess(): void {
    onClose();
    onSuccess();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="pb-2 border-b border-border/60">
          <DialogTitle className="text-2xl font-bold">
            Post a New Position
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Fill in the details below to publish your job listing to the board.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4 pb-2">
          <JobPostForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
