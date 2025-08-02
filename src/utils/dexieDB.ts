import Dexie from "dexie";

// 定义一个TodoDatabase类，继承自Dexie类
class TodoDatabase extends Dexie {
  public tasks: Dexie.Table<Task, number>;
  public categories: Dexie.Table<Category, string>;
  public todayTasks: Dexie.Table<Task, number>;
  public allTasks: Dexie.Table<Task, number>;
  public overdueTasks: Dexie.Table<Task, number>;

  public constructor() {
    super("TodoDatabase");
    this.version(1).stores({
      tasks:
        "++id, title, note, dueDate, dueTime, group, priority, repeatType, repeatValue, archived",
      categories: "&name, color, archived",
      todayTasks:
        "++id, &taskId, title, note, dueDate, dueTime, priority, repeatType, repeatValue, archived",
      allTasks:
        "++id, title, note, dueDate, dueTime, priority, repeatType, repeatValue, archived",
      overdueTasks:
        "++id, &taskId, title, note, dueDate, dueTime, priority, repeatType, repeatValue, archived",
    });
    this.tasks = this.table("tasks");
    this.categories = this.table("categories");
    this.todayTasks = this.table("todayTasks");
    this.allTasks = this.table("allTasks");
    this.overdueTasks = this.table("overdueTasks");
  }
}

export interface Task {
  id?: number;
  // 标题
  title: string;
  // 备注
  note?: string;
  // 截止日期
  dueDate?: string;
  // 截止时间
  dueTime?: string;
  // 分类
  group?: string;
  // 优先级等级 1-4级
  priority?: 1 | 2 | 3 | 4;
  // 重复类型
  repeatType?: "none" | "daily" | "weekly" | "monthly";
  // 重复值
  repeatValue?: number | string;
  // 归档状态
  archived?: boolean;
  // 是否完成
  completed?: boolean;
  taskId?: number;
}

export interface Category {
  name: string;
  // 颜色
  color?: string;
  // 归档状态
  archived?: boolean;
}

export const db = new TodoDatabase();

// 存到数据库中
export async function saveTasks(tasks: Task[]) {
  // 确保新任务默认为未完成状态
  const tasksWithDefaults = tasks.map((task) => ({
    ...task,
    completed: task.completed ?? false,
  }));
  await db.tasks.bulkPut(tasksWithDefaults);
}

// 加载所有任务
export async function loadTasks(): Promise<Task[]> {
  return await db.allTasks.toArray();
}

// 加载特定分类的任务
export async function loadTasksByCategory(
  categoryName: string
): Promise<Task[]> {
  return await db.tasks
    .where("group")
    .equals(categoryName)
    .and((task) => !task.completed)
    .toArray();
}

// 加载所有分类
export async function loadCategories(): Promise<Category[]> {
  return await db.categories.toArray();
}

// 加载今日任务表
export async function loadTodayTasks(): Promise<Task[]> {
  await updateTodayTasks();
  return await db.todayTasks.filter((task) => !task.completed).toArray();
}

// 加载特定分类的所有任务（包括已完成的）
export async function loadAllTasksByCategory(
  categoryName: string
): Promise<Task[]> {
  if (!categoryName || typeof categoryName !== "string") {
    return [];
  }

  return await db.tasks.where("group").equals(categoryName).toArray();
}

// 切换任务的归档状态。
export async function toggleTaskArchive(id: number) {
  const task = await db.tasks.get(id);
  if (task) {
    task.archived = !task.archived;
    await db.tasks.put(task);
  }
}

export async function updateTodayTasks() {
  const today = new Date().toISOString().split("T")[0];
  const tasks = await db.tasks.where("dueDate").equals(today).toArray();
  for (const task of tasks) {
    const todayTask = await db.todayTasks
      .where("taskId")
      .equals(task.id!)
      .first();
    if (!todayTask) {
      await db.todayTasks.add({ ...task, taskId: task.id });
    } else {
      todayTask.completed = task.completed;
      // 移除这行：todayTask.group = "今日任务";
      // 保持原始分类信息，只更新必要字段
      todayTask.title = task.title;
      todayTask.note = task.note;
      todayTask.dueDate = task.dueDate;
      todayTask.dueTime = task.dueTime;
      todayTask.priority = task.priority;
      todayTask.group = task.group; // 保持原始分类
      await db.todayTasks.put(todayTask);
    }
  }
}

export async function toggleTaskComplete(id: number) {
  const task = await db.tasks.get(id);
  if (task) {
    task.completed = !task.completed;
    await db.tasks.put(task);

    // 同时更新今日任务表中的完成状态
    const todayTask = await db.todayTasks.where("taskId").equals(id).first();
    if (todayTask) {
      todayTask.completed = task.completed;
      await db.todayTasks.put(todayTask);
    }

    // 更新所有任务表
    const allTask = await db.allTasks.where("id").equals(id).first();
    if (allTask) {
      if (task.completed) {
        // 如果任务完成，从 allTasks 表中删除
        await db.allTasks.where("id").equals(id).delete();
      } else {
        // 如果任务未完成，更新状态
        allTask.completed = task.completed;
        await db.allTasks.put(allTask);
      }
    } else if (!task.completed) {
      // 检查任务是否过期
      const today = new Date().toISOString().split("T")[0];
      // 修复：确保 dueDate 不为空且确实过期
      if (task.dueDate && task.dueDate.trim() !== "" && task.dueDate < today) {
        await db.overdueTasks.add({ ...task, taskId: task.id });
      }
    }

    // 更新过期任务表
    const overdueTask = await db.overdueTasks
      .where("taskId")
      .equals(id)
      .first();
    if (overdueTask) {
      if (task.completed) {
        // 如果任务完成，从 overdueTasks 表中删除
        await db.overdueTasks.where("taskId").equals(id).delete();
      } else {
        // 如果任务未完成，更新状态
        overdueTask.completed = task.completed;
        await db.overdueTasks.put(overdueTask);
      }
    } else if (!task.completed) {
      // 检查任务是否过期
      const today = new Date().toISOString().split("T")[0];
      if (task.dueDate && task.dueDate < today) {
        // 如果任务从完成变为未完成且已过期，添加到 overdueTasks
        await db.overdueTasks.add({ ...task, taskId: task.id });
      }
    }

    await updateTodayTasks();
    await updateOverdueTasks();
  }
}

// 获取过期的任务
export async function loadOverdueTasks(): Promise<Task[]> {
  const today = new Date().toISOString().split("T")[0];
  return await db.tasks
    .filter((task) => {
      // 确保有有效的截止日期且未完成且确实过期
      return !!(
        task.dueDate &&
        task.dueDate.trim() !== "" &&
        task.dueDate < today &&
        !task.completed
      );
    })
    .toArray();
}

// 更新过期任务表
// 更新过期任务表
export async function updateOverdueTasks() {
  const today = new Date().toISOString().split("T")[0];
  const tasks = await db.tasks
    .filter((task) => {
      // 使用相同的过期判断逻辑
      return !!(
        task.dueDate &&
        task.dueDate.trim() !== "" &&
        task.dueDate < today &&
        !task.completed
      );
    })
    .toArray();

  // 清空并重新填充过期任务表
  await db.overdueTasks.clear();
  const overdueTasks = tasks.map((task) => ({ ...task, taskId: task.id }));
  if (overdueTasks.length > 0) {
    await db.overdueTasks.bulkAdd(overdueTasks);
  }
}

// 从过期任务表中加载任务
export async function loadOverdueTasksFromDB(): Promise<Task[]> {
  return await db.overdueTasks.filter((task) => !task.completed).toArray();
}
