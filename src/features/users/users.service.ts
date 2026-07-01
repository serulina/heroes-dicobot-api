import { AppError } from 'src/core/errors/app-error';
import { JsonCache } from 'src/core/cache/json-cache';
import type { NexonOpenApiClient } from 'src/core/nexon-open-api/nexon-open-api.client';
import type { GetCharacterBasicResponse } from 'src/features/users/dto/response/get-character-basic.response';
import type { GetCharacterOcidResponse } from 'src/features/users/dto/response/get-character-ocid.response';
import type { User } from 'src/features/users/entities/users.schema';
import type { UsersRepository } from 'src/features/users/users.repository';

const CHARACTER_BASIC_CACHE_TTL_SECONDS = 600;

export class UsersValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'UsersValidationError';
  }
}

export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly nexonOpenApiClient: NexonOpenApiClient,
    private readonly cache?: JsonCache,
  ) {}

  async getOrCreateCharacterOcid(gameName: string, characterName: string): Promise<GetCharacterOcidResponse> {
    const trimmedGameName = gameName.trim();
    const trimmedCharacterName = characterName.trim();

    if (!trimmedGameName) {
      throw new UsersValidationError('gameName is required.');
    }

    if (!trimmedCharacterName) {
      throw new UsersValidationError('characterName is required.');
    }

    const cachedUser = await this.usersRepository.findByGameNameAndCharacterName(trimmedGameName, trimmedCharacterName);

    if (cachedUser) {
      return toGetCharacterOcidResponse(cachedUser);
    }

    const { ocid } = await this.nexonOpenApiClient.fetchHeroesCharacterOcid(trimmedCharacterName);

    try {
      const createdUser = await this.usersRepository.create({
        gameName: trimmedGameName,
        characterName: trimmedCharacterName,
        ocid,
      });

      return toGetCharacterOcidResponse(createdUser);
    } catch (error) {
      const existingUser =
        (await this.usersRepository.findByGameNameAndCharacterName(trimmedGameName, trimmedCharacterName)) ??
        (await this.usersRepository.findByGameNameAndOcid(trimmedGameName, ocid));

      if (existingUser) {
        return toGetCharacterOcidResponse(existingUser);
      }

      throw error;
    }
  }

  async getCharacterBasic(gameName: string, characterName: string): Promise<GetCharacterBasicResponse> {
    const characterOcid = await this.getOrCreateCharacterOcid(gameName, characterName);
    const cacheKey = createCharacterBasicCacheKey(characterOcid.gameName, characterOcid.ocid);
    const cachedBasic = await this.cache?.get<GetCharacterBasicResponse>(cacheKey);

    if (cachedBasic) {
      return cachedBasic;
    }

    const basic = await this.nexonOpenApiClient.fetchHeroesCharacterBasic(characterOcid.ocid);

    await this.cache?.put(cacheKey, basic, CHARACTER_BASIC_CACHE_TTL_SECONDS);

    return basic;
  }
}

const createCharacterBasicCacheKey = (gameName: string, ocid: string): string => {
  return `${gameName}:character-basic:${ocid}`;
};

const toGetCharacterOcidResponse = (user: User): GetCharacterOcidResponse => {
  return {
    gameName: user.gameName,
    characterName: user.characterName,
    ocid: user.ocid,
  };
};
