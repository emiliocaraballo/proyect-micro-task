export class TeamAddMemberEvent {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly userId: number,
    public readonly role: string,
  ) {}
}
