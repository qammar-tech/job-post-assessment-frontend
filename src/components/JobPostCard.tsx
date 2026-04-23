import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface JobPostCardProps {
  jobPost: JobPost;
  onClick: (jobPost: JobPost) => void;
  onStatusChange: (id: string, newStatus: JobPostStatus) => void;
  onViewApplicants: (jobPost: JobPost) => void;
}

export function JobPostCard({
  jobPost,
  onClick,
  onStatusChange,
  onViewApplicants,
}: JobPostCardProps): React.ReactElement {
  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50 hover:-translate-y-0.5 group"
      onClick={() => onClick(jobPost)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(jobPost)}
      aria-label={`View details for ${jobPost.jobTitle}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">
            {jobPost.jobTitle}
          </CardTitle>
          <div className="flex items-center gap-1.5 shrink-0">
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
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground/80">Specialty:</span>{" "}
          {jobPost.specialty}
        </p>
        <p>
          <span className="font-medium text-foreground/80">Location:</span>{" "}
          {jobPost.location}
        </p>
        {jobPost.compensation && (
          <p>
            <span className="font-medium text-foreground/80">
              Compensation:
            </span>{" "}
            {jobPost.compensation}
          </p>
        )}
        {jobPost.startDate && (
          <p>
            <span className="font-medium text-foreground/80">Start Date:</span>{" "}
            {formatDate(jobPost.startDate)}
          </p>
        )}
        <p className="pt-2 text-xs text-primary/60 font-medium group-hover:text-primary transition-colors">
          View full details →
        </p>
        <div
          className="flex items-center gap-2 flex-wrap"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Select
            value={jobPost.status}
            onValueChange={(value) =>
              onStatusChange(jobPost.id, value as JobPostStatus)
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(JobPostStatus).map((status) =>
                status === JobPostStatus.OPEN ? (
                  <SelectItem
                    key={status}
                    value={status}
                    disabled={isOpenOptionDisabled(jobPost)}
                  >
                    {STATUS_LABEL[status]}
                  </SelectItem>
                ) : (
                  <SelectItem key={status} value={status}>
                    {STATUS_LABEL[status]}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewApplicants(jobPost)}
          >
            View Applicants
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
