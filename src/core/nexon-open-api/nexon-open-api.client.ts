import { NexonOpenApiError, mapNexonOpenApiStatusToCode } from 'src/core/nexon-open-api/nexon-open-api.errors';
import type {
  HeroesCharacterBasicResponse,
  HeroesCharacterOcidResponse,
  NexonOpenApiErrorPayload,
} from 'src/core/nexon-open-api/nexon-open-api.types';

const NEXON_OPEN_API_BASE_URL = 'https://open.api.nexon.com';

export class NexonOpenApiClient {
  constructor(
    private readonly apiKey: string,
    private readonly fetcher: typeof fetch = (input, init) => fetch(input, init),
  ) {}

  async fetchHeroesCharacterOcid(characterName: string): Promise<HeroesCharacterOcidResponse> {
    const url = new URL('/heroes/v2/id', NEXON_OPEN_API_BASE_URL);
    url.searchParams.set('character_name', characterName);

    const response = await this.fetcher(url, {
      headers: {
        'x-nxopen-api-key': this.apiKey,
      },
    });

    if (!response.ok) {
      const payload = await readErrorPayload(response);
      const message = payload?.error?.message ?? payload?.message ?? `Nexon OpenAPI request failed with status ${response.status}`;

      throw new NexonOpenApiError(message, mapNexonOpenApiStatusToCode(response.status), response.status);
    }

    const payload: unknown = await response.json();

    if (!isHeroesCharacterOcidResponse(payload)) {
      throw new NexonOpenApiError('Nexon OpenAPI returned an invalid character OCID response.', 'INVALID_RESPONSE', response.status);
    }

    return payload;
  }

  async fetchHeroesCharacterBasic(ocid: string): Promise<HeroesCharacterBasicResponse> {
    const url = new URL('/heroes/v2/character/basic', NEXON_OPEN_API_BASE_URL);
    url.searchParams.set('ocid', ocid);

    const response = await this.fetcher(url, {
      headers: {
        'x-nxopen-api-key': this.apiKey,
      },
    });

    if (!response.ok) {
      const payload = await readErrorPayload(response);
      const message = payload?.error?.message ?? payload?.message ?? `Nexon OpenAPI request failed with status ${response.status}`;

      throw new NexonOpenApiError(message, mapNexonOpenApiStatusToCode(response.status), response.status);
    }

    const payload: unknown = await response.json();

    if (!isHeroesCharacterBasicResponse(payload)) {
      throw new NexonOpenApiError('Nexon OpenAPI returned an invalid character basic response.', 'INVALID_RESPONSE', response.status);
    }

    return payload;
  }
}

const readErrorPayload = async (response: Response): Promise<NexonOpenApiErrorPayload | null> => {
  try {
    const payload: unknown = await response.json();
    return isObject(payload) ? payload : null;
  } catch {
    return null;
  }
};

const isHeroesCharacterOcidResponse = (value: unknown): value is HeroesCharacterOcidResponse => {
  return isObject(value) && typeof value.ocid === 'string' && value.ocid.length > 0;
};

const isHeroesCharacterBasicResponse = (value: unknown): value is HeroesCharacterBasicResponse => {
  return (
    isObject(value) &&
    typeof value.character_name === 'string' &&
    typeof value.character_class_name === 'string' &&
    typeof value.character_level === 'number'
  );
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};
