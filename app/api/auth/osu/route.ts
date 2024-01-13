<<<<<<< HEAD
=======
// @ts-ignore The current file is a CommonJS module whose imports will produce 'require' calls;
>>>>>>> 3358e7e5a6fbaf8c83cf89acfb794df8518b0335
import { env } from '@/env.mjs';
import { redirects } from '@/utils/server/api';
import { redirect } from 'next/navigation';

export function GET() {
  const url = redirects.promptLogin('osu', env.NEXT_PUBLIC_ORIGIN + '/api/auth/discord');
  redirect(url);
}
