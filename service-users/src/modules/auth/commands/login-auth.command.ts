import { Role } from 'service-commons/dist';

export class LoginAuthCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly rol: Role.admin | Role.member | Role.viewer,
  ) {}
}
