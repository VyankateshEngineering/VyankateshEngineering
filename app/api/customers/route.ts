import { NextResponse } from 'next/server';
import { customers as staticCustomers } from '@/data/customers';

export const dynamic = 'force-dynamic';
import { getFolderImages } from '@/lib/images';
import path from 'path';

function cleanCustomerName(filename: string): string {
  let name = filename.substring(0, filename.lastIndexOf('.'));
  name = name.replace(/[-_]logo/gi, '');
  name = name.replace(/[-_]squarelogo.*/gi, '');
  // Only remove trailing digits (preserve digits in brand names like "3M")
  name = name.replace(/[-_]\d+$/g, '');
  name = name.replace(/[-_]+/g, ' ').trim();

  if (!name) return 'Customer';

  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export async function GET() {
  try {
    const images = getFolderImages('customers');

    if (images.length > 0) {
      const customers = images.map((img, index) => {
        const filename = path.basename(img);
        const name = cleanCustomerName(filename);
        const id = name.toLowerCase().replace(/\s+/g, '-');
        return { id, name, logoUrl: img, isVisible: true, sortOrder: index + 1 };
      });

      return NextResponse.json(
        { customers },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        },
      );
    }

    return NextResponse.json(
      { customers: staticCustomers },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    console.error('[Customers] Fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
