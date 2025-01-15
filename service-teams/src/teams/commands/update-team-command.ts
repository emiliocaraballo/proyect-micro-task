export class UpdateTeamCommand {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly userId: number,
  ) {}
}
