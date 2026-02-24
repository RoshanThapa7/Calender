import { Button } from "@/components/ui/button";

interface HeaderProps {
  onManageSymbols: () => void;
}

function DogIllustration(): JSX.Element {
  return (
    <svg viewBox="0 0 140 60" className="h-14 w-32 text-plum/40" fill="none" aria-hidden="true">
      <path d="M22 24c0-8 8-14 18-14s18 6 18 14v8c0 9-8 16-18 16S22 41 22 32v-8Z" fill="currentColor" opacity="0.15" />
      <circle cx="28" cy="18" r="8" fill="currentColor" opacity="0.18" />
      <circle cx="52" cy="18" r="8" fill="currentColor" opacity="0.18" />
      <circle cx="35" cy="29" r="2" fill="currentColor" />
      <circle cx="45" cy="29" r="2" fill="currentColor" />
      <path d="M37 36c2 2 4 3 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M90 26c0-7 7-12 16-12 10 0 16 5 16 12v7c0 8-6 14-16 14-9 0-16-6-16-14v-7Z" fill="currentColor" opacity="0.1" />
      <circle cx="95" cy="20" r="6" fill="currentColor" opacity="0.14" />
      <circle cx="117" cy="20" r="6" fill="currentColor" opacity="0.14" />
    </svg>
  );
}

export function Header({ onManageSymbols }: HeaderProps): JSX.Element {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/70 bg-white/60 p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <DogIllustration />
        <div>
          <h1 className="text-3xl font-semibold text-plum">My Cute Tracker 🐶</h1>
          <p className="text-sm text-plum/70">A soft little diary for your everyday moments.</p>
        </div>
      </div>
      <Button onClick={onManageSymbols}>Manage Symbols</Button>
    </header>
  );
}
