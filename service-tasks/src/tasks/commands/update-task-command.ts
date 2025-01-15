import { TaskStatus } from 'src/model/task/task.enum';

export class UpdatedTaskCommand {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly deadline: Date,
    public readonly status: TaskStatus,
    public readonly userTokenId: number,
  ) {}
}
