export class AuthLoginEvent {
  constructor(
    public readonly id: number,
    public readonly version: string,
    public readonly rol: string,
    public readonly accessToken: string,
    public readonly refreshToken: string,
  ) {}
}
