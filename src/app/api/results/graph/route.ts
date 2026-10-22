import {NextResponse} from 'next/server';
import {graphDataType} from '@/types/index';
import {buildForecast} from '@/lib/forecast';
import {apostleMortality} from '@/lib/mortality';
import {roster} from '@/lib/roster';

// Revalidate once per day (24 hours = 86400 seconds)
export const revalidate = 86400;

export async function GET(): Promise<NextResponse> {
  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const responseBody: graphDataType[] = buildForecast(roster.apostles, {
    start: today,
    years: 30,
    stepDays: 90,
    mortality: apostleMortality,
  });

  return NextResponse.json(responseBody, {
    headers: {
      // Cache on CDN for 24 hours, allow stale content while revalidating for 12 hours
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
