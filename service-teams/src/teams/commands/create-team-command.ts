export class CreatedTeamCommand {
  constructor(
    public readonly name: string,
    public readonly userId: number,
  ) {}
}
