// Ambient type definitions for Supabase Edge Functions (Deno Runtime)
// Resolves TypeScript IDE errors for the global 'Deno' object and URL-based imports.

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    has(key: string): boolean;
    toObject(): Record<string, string>;
  }

  export const env: Env;

  export interface ServeOptions {
    port?: number;
    hostname?: string;
    onListen?: (params: { port: number; hostname: string }) => void;
    signal?: AbortSignal;
    onError?: (error: unknown) => Response | Promise<Response>;
  }

  export function serve(
    handler: (req: Request) => Promise<Response> | Response,
    options?: ServeOptions,
  ): void;

  export function serve(
    options: ServeOptions,
    handler: (req: Request) => Promise<Response> | Response,
  ): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2.39.8" {
  export * from "@supabase/supabase-js";
}

declare module "https://esm.sh/*" {
  const content: any;
  export default content;
  export const createClient: any;
}
