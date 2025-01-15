import { TaskStatus } from 'src/model/task/task.enum';

export class CreatedTaskCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly deadline: Date,
    public readonly status: TaskStatus,
    public readonly userTokenId: number,
  ) {}
}
