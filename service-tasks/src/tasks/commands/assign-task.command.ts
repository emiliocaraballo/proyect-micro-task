export class AssignTaskCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly teamId: number,
    public readonly userTokenId: number,
  ) {}
}
