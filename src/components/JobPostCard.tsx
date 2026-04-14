import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type JobPost } from '@/types/jobPost';
import {
  formatDate,
  SCHEDULE_TYPE_BADGE_VARIANT,
  SCHEDULE_TYPE_LABEL,
} from '@/lib/jobPost.utils';

interface JobPostCardProps {
  jobPost: JobPost;
  onClick: (jobPost: JobPost) => void;
}

export function JobPostCard({ jobPost, onClick }: JobPostCardProps): JSX.Element {
  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50 hover:-translate-y-0.5 group"
      onClick={() => onClick(jobPost)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(jobPost)}
      aria-label={`View details for ${jobPost.jobTitle}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">
            {jobPost.jobTitle}
          </CardTitle>
          {jobPost.scheduleType && (
            <Badge variant={SCHEDULE_TYPE_BADGE_VARIANT[jobPost.scheduleType]} className="shrink-0">
              {SCHEDULE_TYPE_LABEL[jobPost.scheduleType]}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground/80">Specialty:</span>{' '}
          {jobPost.specialty}
        </p>
        <p>
          <span className="font-medium text-foreground/80">Location:</span>{' '}
          {jobPost.location}
        </p>
        {jobPost.compensation && (
          <p>
            <span className="font-medium text-foreground/80">Compensation:</span>{' '}
            {jobPost.compensation}
          </p>
        )}
        {jobPost.startDate && (
          <p>
            <span className="font-medium text-foreground/80">Start Date:</span>{' '}
            {formatDate(jobPost.startDate)}
          </p>
        )}
        <p className="pt-2 text-xs text-primary/60 font-medium group-hover:text-primary transition-colors">
          View full details →
        </p>
      </CardContent>
    </Card>
  );
}
