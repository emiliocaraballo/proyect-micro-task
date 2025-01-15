import { Role } from 'service-commons/dist';

export class CreateUserCommand {
  constructor(
    public readonly name: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly rol: Role.admin | Role.member,
    public readonly userId?: number,
  ) {}
}
