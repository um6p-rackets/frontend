export type ProfileTabType = 'statistics' | 'history';

interface ProfileTabsProps {
  activeTab: ProfileTabType;
  onTabChange: (tab: ProfileTabType) => void;
}

export default function ProfileTabs({
  activeTab,
  onTabChange,
}: ProfileTabsProps) {
  const tabs: { id: ProfileTabType; label: string }[] = [
    { id: 'statistics', label: 'Statistics' },
    { id: 'history', label: 'History' },
  ];

  return (
    <div className="flex items-center gap-2 bg-card p-1.5 rounded-xl border border-border/80 shadow-2xs w-fit">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-5 sm:px-7 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-bold italic transition-all cursor-pointer ${
              isActive
                ? 'bg-brand-orange text-white shadow-xs'
                : 'text-muted-foreground hover:text-brand-ink dark:hover:text-white hover:bg-muted/50'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
