import { Role } from 'service-commons/dist';

export class UpdateUserCommand {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly rol: Role.admin | Role.member | Role.viewer,
    public readonly userId?: number,
    public readonly userRol?: string,
  ) {}
}
