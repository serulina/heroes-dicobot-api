export interface HeroesCharacterOcidResponse {
  ocid: string;
}

export interface NexonOpenApiErrorPayload {
  error?: {
    name?: string;
    message?: string;
  };
  message?: string;
}
