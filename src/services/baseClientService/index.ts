const FALLBACK_CLIENT_DB_USER_ID = 'DEFAULT_LOBE_CHAT_USER';

export class BaseClientService {
  protected readonly userId: string;

  constructor(userId?: string) {
    this.userId = userId || FALLBACK_CLIENT_DB_USER_ID;
  }

  protected async _fetch<T = any>(url: string, options?: globalThis.RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
