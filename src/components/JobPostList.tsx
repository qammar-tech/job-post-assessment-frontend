import { type JobPost } from '@/types/jobPost';
import { JobPostCard } from './JobPostCard';

interface JobPostListProps {
  jobPosts: JobPost[];
  isLoading: boolean;
  onCardClick: (jobPost: JobPost) => void;
}

function LoadingState(): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((key) => (
        <div
          key={key}
          className="rounded-lg border bg-card p-6 space-y-3 animate-pulse"
        >
          <div className="h-5 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

function EmptyState(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
      <div className="text-5xl mb-4">📋</div>
      <p className="text-lg font-medium">No job posts yet.</p>
      <p className="text-sm mt-1">
        Use the <span className="font-semibold">+ Post a Job</span> button to publish the first listing.
      </p>
    </div>
  );
}

export function JobPostList({
  jobPosts,
  isLoading,
  onCardClick,
}: JobPostListProps): JSX.Element {
  if (isLoading) {
    return (
      <section aria-label="Job posts list">
        <LoadingState />
      </section>
    );
  }

  if (jobPosts.length === 0) {
    return (
      <section aria-label="Job posts list">
        <EmptyState />
      </section>
    );
  }

  return (
    <section
      aria-label="Job posts list"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {jobPosts.map((jobPost) => (
        <JobPostCard key={jobPost.id} jobPost={jobPost} onClick={onCardClick} />
      ))}
    </section>
  );
}
