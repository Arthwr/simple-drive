import { showToastNotification } from './toast.js';

export default async function makeRequest(url: string, method: string = 'POST', body: BodyInit | null = null) {
  const headers: HeadersInit = {
    Accept: 'application/json',
  };

  if (body && typeof body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers,
      body,
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = responseData?.message || `${response.status} ${response.statusText}`;

      const errorType = responseData?.type || 'error';
      showToastNotification(errorType, errorMessage);

      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error(`API request to failed: `, error);
    throw error;
  }
}
