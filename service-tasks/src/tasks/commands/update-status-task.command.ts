import { TaskStatus } from 'src/model/task/task.enum';

export class UpdateStatusTaskCommand {
  constructor(
    public readonly id: number,
    public readonly status: TaskStatus,
    public readonly userTokenId: number,
  ) {}
}
