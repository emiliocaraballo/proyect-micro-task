export class TeamUpdatedEvent {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly userId: number,
  ) {}
}
