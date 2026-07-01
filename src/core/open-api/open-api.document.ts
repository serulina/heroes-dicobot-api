export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: '히어로즈 디코봇 API',
    version: '0.1.0',
    description: 'Nexon OpenAPI에서 조회한 마비노기 영웅전 캐릭터 OCID를 D1에 캐시하는 API입니다.',
  },
  servers: [
    {
      url: '/',
    },
  ],
  paths: {
    '/health': {
      get: {
        operationId: 'getHealth',
        summary: '상태 확인',
        tags: ['시스템'],
        responses: {
          '200': {
            description: 'Worker가 정상 동작 중입니다.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['ok'],
                  properties: {
                    ok: {
                      type: 'boolean',
                      example: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/db-check': {
      get: {
        operationId: 'getDbCheck',
        summary: 'D1 연결 확인',
        tags: ['시스템'],
        responses: {
          '200': {
            description: 'D1 조회 결과입니다.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['ok', 'logs'],
                  properties: {
                    ok: {
                      type: 'boolean',
                      example: true,
                    },
                    logs: {
                      type: 'array',
                      items: {
                        type: 'object',
                        additionalProperties: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/nexon/characters/{characterName}/ocid': {
      get: {
        operationId: 'getNexonCharacterOcid',
        summary: '마비노기 영웅전 캐릭터 OCID 조회 및 캐시',
        tags: ['사용자'],
        parameters: [
          {
            name: 'characterName',
            in: 'path',
            description: '조회할 마비노기 영웅전 캐릭터명입니다.',
            required: true,
            schema: {
              type: 'string',
              minLength: 1,
              example: '시칠리아',
            },
          },
          {
            name: 'gameName',
            in: 'query',
            description: '캐시 구분에 사용할 게임 이름입니다. 기본값은 `heroes`입니다.',
            required: false,
            schema: {
              type: 'string',
              default: 'heroes',
              example: 'heroes',
            },
          },
        ],
        responses: {
          '200': {
            description: '캐시에서 조회했거나 Nexon OpenAPI에서 새로 조회한 캐릭터 OCID입니다.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/GetCharacterOcidResponse',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/ErrorResponse',
          },
          '404': {
            $ref: '#/components/responses/ErrorResponse',
          },
          '429': {
            $ref: '#/components/responses/ErrorResponse',
          },
          '500': {
            $ref: '#/components/responses/ErrorResponse',
          },
          '502': {
            $ref: '#/components/responses/ErrorResponse',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      GetCharacterOcidResponse: {
        type: 'object',
        title: '캐릭터 OCID 응답',
        description: '캐릭터명으로 조회한 OCID 응답입니다.',
        required: ['gameName', 'characterName', 'ocid'],
        properties: {
          gameName: {
            type: 'string',
            description: '캐시 구분에 사용한 게임 이름입니다.',
            example: 'heroes',
          },
          characterName: {
            type: 'string',
            description: '조회한 캐릭터명입니다.',
            example: '시칠리아',
          },
          ocid: {
            type: 'string',
            description: 'Nexon OpenAPI에서 제공하는 캐릭터 고유 식별자입니다.',
            example: '8b3b13b6a0801ffbae229e64aeca48a566169c5319cee8ec6c72df62141f9dec',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        title: '오류 응답',
        description: '요청 처리 중 오류가 발생했을 때 반환하는 응답입니다.',
        required: ['error', 'code'],
        properties: {
          error: {
            type: 'string',
            description: '오류 메시지입니다.',
          },
          code: {
            type: 'string',
            description: '애플리케이션 공통 오류 코드입니다.',
            example: 'VALIDATION_ERROR',
          },
        },
      },
    },
    responses: {
      ErrorResponse: {
        description: '오류 응답입니다.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
    },
  },
} as const;
