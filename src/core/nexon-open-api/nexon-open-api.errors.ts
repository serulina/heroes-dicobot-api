import { AppError } from 'src/core/errors/app-error';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export type NexonOpenApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'UPSTREAM_ERROR'
  | 'INVALID_RESPONSE';

export class NexonOpenApiError extends AppError {
  constructor(
    message: string,
    code: NexonOpenApiErrorCode,
    public readonly upstreamStatus: number,
  ) {
    super(message, code, mapNexonOpenApiCodeToHttpStatus(code));
    this.name = 'NexonOpenApiError';
  }
}

export const mapNexonOpenApiStatusToCode = (status: number): NexonOpenApiErrorCode => {
  if (status === 400) {
    return 'BAD_REQUEST';
  }

  if (status === 401) {
    return 'UNAUTHORIZED';
  }

  if (status === 403) {
    return 'FORBIDDEN';
  }

  if (status === 404) {
    return 'NOT_FOUND';
  }

  if (status === 429) {
    return 'RATE_LIMITED';
  }

  return 'UPSTREAM_ERROR';
};

const mapNexonOpenApiCodeToHttpStatus = (code: NexonOpenApiErrorCode): ContentfulStatusCode => {
  if (code === 'BAD_REQUEST') {
    return 400;
  }

  if (code === 'NOT_FOUND') {
    return 404;
  }

  if (code === 'RATE_LIMITED') {
    return 429;
  }

  return 502;
};
