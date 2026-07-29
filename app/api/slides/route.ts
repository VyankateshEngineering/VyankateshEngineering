import { NextResponse } from 'next/server';
import { heroSlides } from '@/data/hero';

export async function GET() {
  try {
    return NextResponse.json(
      { slides: heroSlides },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    console.error('[Slides] Fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
