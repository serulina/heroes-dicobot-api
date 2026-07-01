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
    '/nexon/characters/{characterName}/basic': {
      get: {
        operationId: 'getNexonCharacterBasic',
        summary: '마비노기 영웅전 캐릭터 기본 정보 조회 및 단기 캐시',
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
            description: 'KV 캐시에서 조회했거나 Nexon OpenAPI에서 새로 조회한 캐릭터 기본 정보입니다. KV TTL은 10분입니다.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/GetCharacterBasicResponse',
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
      GetCharacterBasicResponse: {
        type: 'object',
        title: '캐릭터 기본 정보 응답',
        description: 'Nexon OpenAPI의 마비노기 영웅전 캐릭터 기본 정보 응답입니다.',
        required: [
          'character_name',
          'access_flag',
          'character_class_name',
          'character_gender',
          'character_exp',
          'character_level',
          'cairde_name',
          'title_count',
          'id_title_count',
          'total_title_count',
          'title_stat',
          'skill_awakening',
          'dress_point',
        ],
        properties: {
          character_name: {
            type: 'string',
            description: '캐릭터명입니다.',
            example: '시칠리아',
          },
          character_date_create: {
            type: ['string', 'null'],
            description: '캐릭터 생성일입니다. Nexon 응답에 따라 null일 수 있습니다.',
            example: null,
          },
          access_flag: {
            type: 'string',
            description: '캐릭터 정보 공개 여부입니다.',
            example: 'true',
          },
          character_class_name: {
            type: 'string',
            description: '캐릭터 클래스명입니다.',
            example: '테사',
          },
          character_gender: {
            type: 'string',
            description: '캐릭터 성별입니다.',
            example: 'F',
          },
          character_exp: {
            type: 'number',
            description: '캐릭터 경험치입니다.',
            example: 60500249,
          },
          character_level: {
            type: 'number',
            description: '캐릭터 레벨입니다.',
            example: 125,
          },
          cairde_name: {
            type: 'string',
            description: '카르제 이름입니다.',
            example: '리아',
          },
          title_count: {
            type: 'number',
            description: '일반 타이틀 개수입니다.',
            example: 800,
          },
          id_title_count: {
            type: 'number',
            description: 'ID 타이틀 개수입니다.',
            example: 132,
          },
          total_title_count: {
            type: 'number',
            description: '전체 타이틀 개수입니다.',
            example: 932,
          },
          title_stat: {
            type: 'array',
            description: '타이틀로 얻은 능력치 목록입니다.',
            items: {
              type: 'object',
              required: ['stat_name', 'stat_value'],
              properties: {
                stat_name: {
                  type: 'string',
                  example: '공격력',
                },
                stat_value: {
                  type: 'string',
                  example: '197',
                },
              },
            },
          },
          skill_awakening: {
            type: 'array',
            description: '스킬 각성 목록입니다.',
            items: {
              type: 'object',
              required: ['skill_name', 'item_name'],
              properties: {
                skill_name: {
                  type: 'string',
                  example: '에메랄드 이베이전',
                },
                item_name: {
                  type: 'string',
                  example: '각성의 돌: 대미지 증가 10%',
                },
              },
            },
          },
          dress_point: {
            type: 'object',
            description: '드레스 포인트 정보입니다.',
            required: ['total_point', 'avatar_point', 'back_point', 'tail_point', 'object_point'],
            properties: {
              total_point: {
                type: 'number',
                example: 3649,
              },
              avatar_point: {
                type: 'number',
                example: 2557,
              },
              back_point: {
                type: 'number',
                example: 231,
              },
              tail_point: {
                type: 'number',
                example: 267,
              },
              object_point: {
                type: 'number',
                example: 594,
              },
            },
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
