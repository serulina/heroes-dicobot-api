export interface HeroesCharacterOcidResponse {
  ocid: string;
}

export interface HeroesCharacterBasicResponse {
  character_name: string;
  character_date_create: string | null;
  access_flag: string;
  character_class_name: string;
  character_gender: string;
  character_exp: number;
  character_level: number;
  cairde_name: string;
  title_count: number;
  id_title_count: number;
  total_title_count: number;
  title_stat: Array<{
    stat_name: string;
    stat_value: string;
  }>;
  skill_awakening: Array<{
    skill_name: string;
    item_name: string;
  }>;
  dress_point: {
    total_point: number;
    avatar_point: number;
    back_point: number;
    tail_point: number;
    object_point: number;
  };
}

export interface NexonOpenApiErrorPayload {
  error?: {
    name?: string;
    message?: string;
  };
  message?: string;
}
