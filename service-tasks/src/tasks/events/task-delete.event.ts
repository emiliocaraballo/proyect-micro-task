export class TaskDeleteEvent {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly status: string,
    public readonly deadline: Date,
    public readonly createdBy: number,
  ) {}
}
