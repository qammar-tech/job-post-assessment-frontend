import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { type JobPost } from '@/types/jobPost';
import {
  formatDate,
  SCHEDULE_TYPE_BADGE_VARIANT,
  SCHEDULE_TYPE_LABEL,
} from '@/lib/jobPost.utils';

interface JobPostDetailModalProps {
  jobPost: JobPost | null;
  onClose: () => void;
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps): JSX.Element {
  return (
    <div className="flex flex-col gap-0.5 sm:grid sm:grid-cols-3 sm:gap-4 py-3 border-b border-border/50 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="col-span-2 text-sm text-foreground font-medium">{value}</span>
    </div>
  );
}

export function JobPostDetailModal({
  jobPost,
  onClose,
}: JobPostDetailModalProps): JSX.Element {
  return (
    <Dialog open={jobPost !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-xl md:max-w-2xl max-h-[92vh] overflow-y-auto">
        {jobPost && (
          <>
            <DialogHeader className="pb-4 border-b border-border/60">
              <div className="flex items-start gap-3 flex-wrap pr-8">
                <DialogTitle className="text-2xl font-bold leading-snug flex-1">
                  {jobPost.jobTitle}
                </DialogTitle>
                {jobPost.scheduleType && (
                  <Badge
                    variant={SCHEDULE_TYPE_BADGE_VARIANT[jobPost.scheduleType]}
                    className="mt-1 shrink-0"
                  >
                    {SCHEDULE_TYPE_LABEL[jobPost.scheduleType]}
                  </Badge>
                )}
              </div>
            </DialogHeader>

            <div className="mt-2 space-y-0">
              <DetailRow label="Specialty" value={jobPost.specialty} />
              <DetailRow label="Location" value={jobPost.location} />
              {jobPost.compensation && (
                <DetailRow label="Compensation" value={jobPost.compensation} />
              )}
              {jobPost.startDate && (
                <DetailRow
                  label="Start Date"
                  value={formatDate(jobPost.startDate)}
                />
              )}
              {jobPost.description && (
                <div className="py-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Description
                  </p>
                  <p className="text-sm whitespace-pre-line leading-relaxed text-foreground/90">
                    {jobPost.description}
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground pt-4 border-t border-border/50">
              Posted on {formatDate(jobPost.createdAt)}
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
