export class JsonCache {
  constructor(private readonly namespace: KVNamespace) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.namespace.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async put(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await this.namespace.put(key, JSON.stringify(value), {
      expirationTtl: ttlSeconds,
    });
  }
}
