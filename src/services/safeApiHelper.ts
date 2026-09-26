/**
 * SAFE API & JSON RESPONSE PARSER HELPER
 * Ensures all HTTP responses from backend/proxy endpoints are safely parsed
 * without ever crashing on unexpected HTML, text, or 404/500 responses.
 */

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
  [key: string]: any;
}

/**
 * Safely parses any fetch Response into JSON or returns a clean structured error
 */
export async function safeParseResponse<T = any>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.toLowerCase().includes('application/json');

  let rawText = '';
  try {
    rawText = await res.text();
  } catch (err: any) {
    throw new Error(`Failed to read response stream: ${err?.message || 'Network error'}`);
  }

  // Attempt JSON parse if content-type is JSON or if the text looks like JSON
  const trimmed = rawText.trim();
  const looksLikeJson = (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
                        (trimmed.startsWith('[') && trimmed.endsWith(']'));

  let parsedData: any = null;
  if (isJson || looksLikeJson) {
    try {
      parsedData = JSON.parse(trimmed);
    } catch {
      parsedData = null;
    }
  }

  // If HTTP status is NOT ok (4xx or 5xx)
  if (!res.ok) {
    if (parsedData && typeof parsedData === 'object') {
      const errMsg = parsedData.error || parsedData.message || parsedData.err;
      if (errMsg) {
        throw new Error(errMsg);
      }
    }

    // If it's HTML (like 404 "The page could not be found" or 502 Bad Gateway)
    if (trimmed.includes('<html') || trimmed.includes('<!DOCTYPE') || trimmed.includes('The page could not be found')) {
      if (res.status === 404) {
        throw new Error('Requested service endpoint was not found (404). Please try again or refresh.');
      } else if (res.status === 502 || res.status === 503) {
        throw new Error('Service is temporarily unavailable (503). Please try again shortly.');
      } else {
        throw new Error(`Server returned status ${res.status}. Please check your connection and retry.`);
      }
    }

    // If plain text error message
    if (trimmed.length > 0 && trimmed.length < 200) {
      throw new Error(trimmed);
    }

    throw new Error(`Server request failed with status ${res.status}`);
  }

  // If response is OK but failed to parse as JSON
  if (parsedData === null) {
    // If it's HTML or text when expecting JSON
    if (trimmed.includes('<html') || trimmed.includes('The page could not be found')) {
      throw new Error('Unexpected non-JSON response received from server. Please try again.');
    }
    if (trimmed.length === 0) {
      return {} as T;
    }
    throw new Error('Invalid response format received from server.');
  }

  return parsedData as T;
}

/**
 * Universal safe fetch helper with built-in timeout, error handling, and JSON safety
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit,
  timeoutMs: number = 20000
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const fetchOptions: RequestInit = {
      ...options,
      signal: options?.signal || controller.signal,
    };

    const res = await fetch(url, fetchOptions);
    return await safeParseResponse<T>(res);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection and try again.');
    }
    // Re-throw our cleaned error or network error
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
