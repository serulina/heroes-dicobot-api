import { Hono } from 'hono';
import { createDb } from 'src/core/db';
import { toErrorResponse } from 'src/core/errors/http-error-response';
import { NexonOpenApiClient } from 'src/core/nexon-open-api/nexon-open-api.client';
import type { GetCharacterOcidRequest } from 'src/features/users/dto/request/get-character-ocid.request';
import { UsersRepository } from 'src/features/users/users.repository';
import { UsersService } from 'src/features/users/users.service';

const DEFAULT_GAME_NAME = 'heroes';

export const usersRoute = new Hono<{ Bindings: CloudflareBindings }>();

usersRoute.get('/nexon/characters/:characterName/ocid', async (c) => {
  const request: GetCharacterOcidRequest = {
    gameName: c.req.query('gameName') ?? DEFAULT_GAME_NAME,
    characterName: c.req.param('characterName'),
  };

  const db = createDb(c.env.DB);
  const usersRepository = new UsersRepository(db);
  const nexonOpenApiClient = new NexonOpenApiClient(c.env.NEXON_OPENAPI_KEY);
  const usersService = new UsersService(usersRepository, nexonOpenApiClient);

  try {
    const response = await usersService.getOrCreateCharacterOcid(request.gameName, request.characterName);
    return c.json(response);
  } catch (error) {
    const response = toErrorResponse(error);

    return c.json(response.body, response.status);
  }
});
