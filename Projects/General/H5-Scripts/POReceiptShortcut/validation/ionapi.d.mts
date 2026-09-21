/**
 * Types for the parts of ionapi.mjs that the Vitest suite exercises.
 *
 * Hand-written rather than generated: the harness is plain Node ESM with no
 * build step, and only the pure guards are imported from TypeScript. TS
 * resolves `./ionapi.mjs` to this file, so the test is typechecked against a
 * declared contract instead of `any`.
 */

export declare const DENIED_TRANSACTIONS: readonly string[];
export declare const ALLOWED_ENVIRONMENTS: readonly string[];

export declare class DeniedTransactionError extends Error {
  program: string;
  transaction: string;
}
export declare class ProductionGuardError extends Error {}
export declare class AppTypeError extends Error {}

export declare function assertTransactionAllowed(program: string, transaction: string): void;

export declare function assertEnvironmentSafe(options: {
  ionApiUrl?: string;
  environment?: string;
  tenant?: string;
  allowProduction?: boolean;
}): { declared: string; looksLikeProduction: boolean };

export declare function classifyIonApiConfig(raw: Record<string, unknown>): {
  appName: string;
  tenant: string;
  appType: string;
  hasServiceAccount: boolean;
};

export declare function buildRequestUrl(options: {
  ionApiUrl: string;
  tenant: string;
  program: string;
  transaction: string;
  record?: Record<string, string>;
  outputFields?: string[];
  maxReturnedRecords?: number;
}): string;

export declare function applyCompanyScope(
  record: Record<string, string>,
  scope: string | undefined,
  context: { company?: string; division?: string }
): Record<string, string>;

export declare function normalizeResponse(json: unknown): {
  ok: boolean;
  records: Record<string, string>[];
  shape: string;
  errorMessage?: string | null;
  errorCode?: string | null;
  errorField?: string | null;
  errorType?: string | null;
  raw: unknown;
};

export declare class MiClient {
  constructor(options: Record<string, unknown>);
  transcript: Record<string, unknown>[];
  call(spec: Record<string, unknown>): Promise<Record<string, unknown>>;
}
