# Heroes Dicobot

마비노기 영웅전 캐릭터 정보를 조회하고, Nexon OpenAPI에서 받은 캐릭터 `ocid`를 Cloudflare D1에 캐시하는 Hono 기반 Cloudflare Worker API입니다.

## 개발 실행

의존성을 설치합니다.

```txt
pnpm install
```

로컬 개발 서버를 실행합니다.

```txt
pnpm run dev
```

기본 로컬 주소는 다음과 같습니다.

```txt
http://localhost:8787
```

## API 문서

Scalar 문서는 로컬 개발 서버 실행 후 아래 주소에서 확인할 수 있습니다.

```txt
http://localhost:8787/docs
```

OpenAPI JSON은 아래 주소에서 제공합니다.

```txt
http://localhost:8787/openapi.json
```

## 배포

Cloudflare Workers에 배포합니다.

```txt
pnpm run deploy
```

## 타입 생성

`wrangler.jsonc`의 binding 설정이 바뀌면 Cloudflare runtime 및 binding 타입을 다시 생성합니다.

```txt
pnpm run cf-typegen
```

`Hono` 앱을 만들 때 생성된 `CloudflareBindings` 타입을 generic으로 전달합니다.

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>();
```

## 환경 변수

로컬 개발에서는 `.dev.vars`에 Nexon OpenAPI key를 설정합니다.

```txt
NEXON_OPENAPI_KEY=...
```

배포 환경에서는 secret으로 등록합니다.

```txt
wrangler secret put NEXON_OPENAPI_KEY
```

실제 secret 값은 `wrangler.jsonc`나 소스 코드에 저장하지 않습니다.

## 프로젝트 구조

```txt
.
├── drizzle/
│   └── migrations/                    # Drizzle migration 파일
├── plans/                             # 로컬 계획 문서, Git 추적 제외
├── src/
│   ├── core/                          # 여러 기능에서 공유하는 공통 모듈
│   │   ├── db/                        # D1 + Drizzle 초기화 및 schema export 진입점
│   │   │   ├── index.ts
│   │   │   └── schema.ts
│   │   ├── errors/                    # 애플리케이션 공통 에러와 HTTP 오류 응답 변환
│   │   │   ├── app-error.ts
│   │   │   └── http-error-response.ts
│   │   ├── nexon-open-api/            # Nexon OpenAPI 공통 연동 모듈
│   │   │   ├── nexon-open-api.client.ts
│   │   │   ├── nexon-open-api.errors.ts
│   │   │   └── nexon-open-api.types.ts
│   │   └── open-api/                  # Scalar에서 사용하는 OpenAPI 문서
│   │       └── open-api.document.ts
│   ├── features/                      # 도메인별 기능 모듈
│   │   └── users/
│   │       ├── dto/
│   │       │   ├── request/
│   │       │   │   └── get-character-ocid.request.ts
│   │       │   └── response/
│   │       │       └── get-character-ocid.response.ts
│   │       ├── entities/
│   │       │   └── users.schema.ts
│   │       ├── users.repository.ts
│   │       ├── users.route.ts
│   │       └── users.service.ts
│   └── index.ts                       # Worker 진입점 및 최상위 Hono 앱
├── drizzle.config.ts                  # Drizzle Kit 설정
├── package.json
├── worker-configuration.d.ts          # 생성된 Cloudflare runtime 및 binding 타입
└── wrangler.jsonc                     # Cloudflare Worker 및 binding 설정
```

## 구조 규칙

- 공통 인프라와 재사용 모듈은 `src/core` 아래에 둡니다.
- feature route에서 공통 오류 응답이 필요하면 `src/core/errors`의 변환 유틸을 사용합니다.
- 도메인별 코드는 `src/features/{domain}` 아래에 둡니다.
- feature 폴더와 route/service/repository 파일 prefix는 복수형 도메인명을 사용합니다. 예: `users/users.route.ts`
- 단일 entity 타입이나 함수 내부 변수는 필요하면 단수형을 사용합니다. 예: `user`
- Drizzle table schema는 각 도메인의 `entities/*.schema.ts`에 두고, `src/core/db/schema.ts`에서 import/export합니다.
- DTO는 요청과 응답을 분리해 `dto/request`, `dto/response` 아래에 둡니다.
- Nexon OpenAPI처럼 여러 도메인에서 재사용할 외부 API 연동 코드는 `src/core` 아래 공통 모듈로 둡니다.
- 로컬 모듈 import는 상대 경로 대신 `src/core/db` 같은 project-root import를 사용합니다.
- 로컬 계획 문서는 `plans/` 아래에 두며, 이 디렉터리는 의도적으로 Git 추적에서 제외합니다.
