declare module 'node-mocks-http' {
  export function createRequest(opts?: any): any;
  export function createResponse(opts?: any): any;
  export function createMocks(opts?: any): { req: any; res: any };
}
