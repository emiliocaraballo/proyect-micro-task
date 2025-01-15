export class AuthRefreshEvent {
  constructor(
    public readonly userId: number,
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly rol: string,
    public readonly version: string,
  ) {}
}
