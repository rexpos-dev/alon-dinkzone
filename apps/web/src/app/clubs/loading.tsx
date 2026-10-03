import { Page } from '@/components/ui/Page';
import { Skeleton } from '@/components/ui/Feedback';

export default function Loading() {
  return (
    <Page width="lg">
      <Skeleton className="mb-8 h-12 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    </Page>
  );
}
