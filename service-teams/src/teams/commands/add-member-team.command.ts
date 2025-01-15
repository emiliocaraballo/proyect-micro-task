import { ITokenUserData } from 'service-commons/dist';
import { TeamMemberType } from 'src/model/teams/role.enum';

export class AddMemberTeamCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly role: TeamMemberType,
    public readonly userTokenData: ITokenUserData,
  ) {}
}
