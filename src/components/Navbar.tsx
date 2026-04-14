import { Button } from '@/components/ui/button';

interface NavbarProps {
  onPostJob: () => void;
}

export function Navbar({ onPostJob }: NavbarProps): JSX.Element {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm shadow-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-md shadow-primary/30">
            D
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-foreground">
              Dockera
            </span>
            <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
              Jobs
            </span>
          </div>
        </div>

        <Button onClick={onPostJob} size="sm" className="shadow-sm shadow-primary/20 gap-1">
          <span className="text-base leading-none">+</span> Post a Job
        </Button>
      </div>
    </header>
  );
}
