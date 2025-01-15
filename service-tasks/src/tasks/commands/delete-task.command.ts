export class DeleteTaskCommand {
  constructor(
    public readonly id: number,
    public readonly userTokenId: number,
  ) {}
}
