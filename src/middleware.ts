import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware للتحقق من الصلاحيات (يمكن توسيعه لاحقاً)
export function middleware(request: NextRequest) {
  // يمكن إضافة منطق التحقق من الصلاحيات هنا
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

