<<<<<<< HEAD
=======
// @ts-ignore The current file is a CommonJS module whose imports will produce 'require' calls;
>>>>>>> 3358e7e5a6fbaf8c83cf89acfb794df8518b0335
import { env } from '@/env.mjs';

export function buildApiUrl(endpoint: string) {
  return `${env.NEXT_PUBLIC_API_URL}${endpoint}`;
}

export function getCsrfToken() {
  const name = 'csrftoken';
  let cookieValue = null;

  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i]?.trim() || '';

      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
}
