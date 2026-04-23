import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type JobPost, JobPostStatus } from "@/types/jobPost";
import {
  formatDate,
  isOpenOptionDisabled,
  SCHEDULE_TYPE_BADGE_VARIANT,
  SCHEDULE_TYPE_LABEL,
  STATUS_BADGE_VARIANT,
  STATUS_LABEL,
} from "@/lib/jobPost.utils";

interface JobPostDetailModalProps {
  jobPost: JobPost | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: JobPostStatus) => void;
  onViewApplicants: (jobPost: JobPost) => void;
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-0.5 sm:grid sm:grid-cols-3 sm:gap-4 py-3 border-b border-border/50 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="col-span-2 text-sm text-foreground font-medium">
        {value}
      </span>
    </div>
  );
}

export function JobPostDetailModal({
  jobPost,
  onClose,
  onStatusChange,
  onViewApplicants,
}: JobPostDetailModalProps): React.ReactElement {
  return (
    <Dialog open={jobPost !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-xl md:max-w-2xl max-h-[92vh] overflow-y-auto">
        {jobPost && (
          <>
            <DialogHeader className="pb-4 border-b border-border/60">
              <DialogTitle className="text-2xl font-bold leading-snug pr-8">
                {jobPost.jobTitle}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={STATUS_BADGE_VARIANT[jobPost.status]}>
                  {STATUS_LABEL[jobPost.status]}
                </Badge>
                {jobPost.scheduleType && (
                  <Badge
                    variant={SCHEDULE_TYPE_BADGE_VARIANT[jobPost.scheduleType]}
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

            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm font-medium text-muted-foreground">
                Change status:
              </span>
              <Select
                value={jobPost.status}
                onValueChange={(value) =>
                  onStatusChange(jobPost.id, value as JobPostStatus)
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(JobPostStatus).map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      disabled={
                        status === JobPostStatus.OPEN &&
                        isOpenOptionDisabled(jobPost)
                      }
                    >
                      {STATUS_LABEL[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Posted on {formatDate(jobPost.createdAt)}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewApplicants(jobPost)}
              >
                View Applicants
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
