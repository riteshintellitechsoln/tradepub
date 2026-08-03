import {
  getDownloadsSeriesForRange,
  getDownloadsByCategory,
  getDownloadsByPublisher,
  getLeadsByIndustry,
  getLeadsByCompanySize,
  type AnalyticsRange,
} from "@/actions/admin/analytics";
import { DownloadsChart } from "@/components/admin/downloads-chart";
import { AnalyticsRangePicker } from "@/components/admin/analytics-range-picker";
import { BreakdownList } from "@/components/admin/breakdown-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { COMPANY_SIZE_OPTIONS } from "@/lib/constants";

interface AnalyticsPageProps {
  searchParams: Promise<{ range?: string }>;
}

const RANGE_LABELS: Record<AnalyticsRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

function isValidRange(value?: string): value is AnalyticsRange {
  return value === "7d" || value === "30d" || value === "90d";
}

// The real Analytics page — replacing the Module 2 stub. Everything here
// is scoped by the same `range` query param (URL-is-the-state, same
// pattern as every filterable page since Module 10), so every breakdown on
// the page always reflects one consistent window, and the whole view is a
// shareable link.
export default async function AdminAnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const sp = await searchParams;
  const range: AnalyticsRange = isValidRange(sp.range) ? sp.range : "30d";

  const [series, byCategory, byPublisher, byIndustry, byCompanySize] = await Promise.all([
    getDownloadsSeriesForRange(range),
    getDownloadsByCategory(range),
    getDownloadsByPublisher(range),
    getLeadsByIndustry(range),
    getLeadsByCompanySize(range),
  ]);

  const companySizeLabels = new Map(COMPANY_SIZE_OPTIONS.map((opt) => [opt.value, opt.label]));
  const byCompanySizeLabeled = byCompanySize.map((row) => ({
    name: companySizeLabels.get(row.companySize) ?? row.companySize,
    count: row.count,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">{RANGE_LABELS[range]}</p>
        </div>
        <AnalyticsRangePicker current={range} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Downloads over time</CardTitle>
          <CardDescription>{RANGE_LABELS[range]}, one point per day.</CardDescription>
        </CardHeader>
        <CardContent>
          <DownloadsChart data={series} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Downloads by Category</CardTitle>
            <CardDescription>
              A book counts toward every category it&apos;s tagged with.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BreakdownList rows={byCategory} emptyMessage="No downloads in this range." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Downloads by Publisher</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownList rows={byPublisher} emptyMessage="No downloads in this range." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads by Industry</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownList rows={byIndustry} emptyMessage="No leads in this range." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads by Company Size</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownList rows={byCompanySizeLabeled} emptyMessage="No leads in this range." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
