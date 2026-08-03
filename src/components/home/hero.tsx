interface HeroStat {
  label: string;
  value: string;
}

export function Hero({ stats }: { stats: HeroStat[]; coverImages: string[] }) {
  return (
    <section className="border-b border-[#d5dbe1] bg-white">
      <div className="container py-12 text-center sm:py-14">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#06396d] sm:text-5xl">
          The Professional Research Library
        </h1>
        <p className="mt-2 text-sm text-[#06396d] sm:text-base">
          The top resource for free professional and technical research, white papers, case studies, magazines, and eBooks.
        </p>
        <div className="mx-auto mt-5 h-1 w-8 rounded-full bg-[#ef4444]" />
        <dl className="mx-auto mt-7 hidden max-w-md grid-cols-3 gap-5 text-left sm:grid">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{stat.label}</dt>
              <dd className="font-display text-xl font-bold text-[#06396d]">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
