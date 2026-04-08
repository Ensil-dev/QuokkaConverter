declare module '@edgeplus/sdk' {
  interface InitOptions {
    siteKey: string;
    endpoint?: string;
  }
  export function init(options: InitOptions): void;
}
