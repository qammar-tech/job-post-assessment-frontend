import { useEffect, useState } from "react";
import { getJobPosts, updateJobPostStatus } from "@/api/jobPosts";
import { Navbar } from "@/components/Navbar";
import { JobPostList } from "@/components/JobPostList";
import { PostJobModal } from "@/components/PostJobModal";
import { JobPostDetailModal } from "@/components/JobPostDetailModal";
import { type JobPost, JobPostStatus } from "@/types/jobPost";

export function JobPostsPage(): React.ReactElement {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(
    null,
  );
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedJobPost, setSelectedJobPost] = useState<JobPost | null>(null);

  async function fetchJobPosts(): Promise<void> {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await getJobPosts();
      setJobPosts(response.data);
    } catch (error) {
      setFetchError(
        error instanceof Error ? error.message : "Failed to load job posts.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(
    id: string,
    newStatus: JobPostStatus,
  ): Promise<void> {
    setStatusUpdateError(null);
    try {
      await updateJobPostStatus(id, { status: newStatus });
      await fetchJobPosts();
    } catch (error) {
      setStatusUpdateError(
        error instanceof Error ? error.message : "Failed to update status.",
      );
    }
  }

  function handleJobPostCreated(): void {
    fetchJobPosts();
  }

  function handleCardClick(jobPost: JobPost): void {
    setSelectedJobPost(jobPost);
  }

  function handleDetailModalClose(): void {
    setSelectedJobPost(null);
  }

  useEffect(() => {
    fetchJobPosts();
  }, []);

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar onPostJob={() => setIsPostModalOpen(true)} />

      <div className="border-b border-border/60 bg-gradient-to-r from-primary/5 via-background to-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Open Positions
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            {jobPosts?.length > 0
              ? `${jobPosts?.length} position${jobPosts?.length === 1 ? "" : "s"} available — click any card to view details`
              : "No listings yet. Be the first to post a position."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {fetchError && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800 mb-6">
            {fetchError}
          </div>
        )}
        {statusUpdateError && (
          <p className="text-red-500 text-sm mt-2 mb-4">{statusUpdateError}</p>
        )}

        <JobPostList
          jobPosts={jobPosts}
          isLoading={isLoading}
          onCardClick={handleCardClick}
          onStatusChange={handleStatusChange}
        />
      </div>

      <PostJobModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSuccess={handleJobPostCreated}
      />

      <JobPostDetailModal
        jobPost={selectedJobPost}
        onClose={handleDetailModalClose}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
