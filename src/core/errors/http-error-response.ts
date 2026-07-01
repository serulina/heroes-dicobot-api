import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { isAppError } from 'src/core/errors/app-error';

export interface ErrorResponseBody {
  error: string;
  code: string;
}

export interface ErrorResponse {
  body: ErrorResponseBody;
  status: ContentfulStatusCode;
}

export const toErrorResponse = (error: unknown): ErrorResponse => {
  if (isAppError(error)) {
    return {
      body: {
        error: error.message,
        code: error.code,
      },
      status: error.status,
    };
  }

  return {
    body: {
      error: error instanceof Error ? error.message : 'Unexpected error.',
      code: 'INTERNAL_SERVER_ERROR',
    },
    status: 500,
  };
};
