import { defineStore } from 'pinia'
import defaultBoards from '@/data/defaultBoard.json'

export const useBoardStore = defineStore('board', {
  state: () => ({
    activeBoardId: null,
    boards: [],
    columns: [],
    tasks: [],
    tags: [],
  }),
  getters: {
    getActiveBoard(state) {
      return state.boards.find(b => b.id === state.activeBoardId);
    },
    getActiveColumns: (state) => {
      return state.columns.filter(col => col.boardId === state.activeBoardId);
    },
    getActiveTags: (state) => {
      return state.tags.filter(tag => tag.boardId === state.activeBoardId);
    },
    getActiveTasks: (state) => {
      const activeBoardId = state.activeBoardId;
      const columnIds = state.columns
        .filter(col => col.boardId === activeBoardId)
        .map(col => col.id);

      return state.tasks.filter(task =>
        columnIds.includes(task.columnId)
      );
    },
  },
  actions: {
    // dev init
    initializeFromDefault() {
      this.boards = defaultBoards.boards;
      this.columns = defaultBoards.columns;
      this.tasks = defaultBoards.tasks;
      this.tags = defaultBoards.tags;
      this.activeBoardId = this.boards[0]?.id || null;
    },

    // Board actions
    setActiveBoard(id) {
      this.activeBoardId = id;
    },
    createBoard(name) {
      this.boards.push({ id: crypto.randomUUID(), name });
    },

    // Column actions
    createColumn(title, color) {
      const id = crypto.randomUUID();
      const boardId = this.activeBoardId;
      const order = this.columns.filter(c => c.boardId === boardId).length;

      this.columns.push({
        id,
        boardId,
        title,
        color,
        order,
      });
    },
    updateColumn(id, updates) {
      const index = this.columns.findIndex(c => c.id === id);
      if (index !== -1) {
        // Create a new column object with the updates applied
        const updatedColumn = { ...this.columns[index], ...updates };
        // Replace the old column with the new updated column
        this.columns.splice(index, 1, updatedColumn);
      }
    },
    updateColumnOrder(id, order) {
      const column = this.columns.find(c => c.id === id);
      if (!column) return;
      column.order = order;
    },
    moveColumn(oldIndex, newIndex) {
      if (oldIndex === newIndex) return;

      // Only work with columns from the active board
      const boardColumns = this.columns
        .filter(col => col.boardId === this.activeBoardId)
        .sort((a, b) => a.order - b.order);

      // Ensure indices are within range
      if (
        oldIndex < 0 || newIndex < 0 ||
        oldIndex >= boardColumns.length ||
        newIndex >= boardColumns.length
      ) return;

      const columnToMove = boardColumns[oldIndex];
      const columnToSwap = boardColumns[newIndex];

      if (!columnToMove || !columnToSwap) return;

      // Swap order values
      const temp = columnToMove.order;
      columnToMove.order = columnToSwap.order;
      columnToSwap.order = temp;

      this.columns = [...this.columns]; // Trigger reactivity
    },
    deleteColumn(id) {
      this.columns = this.columns.filter(c => c.id !== id);
      this.tasks = this.tasks.filter(t => t.columnId !== id);
    },

    // Task actions
    createTask(columnId, title, description = '', tags = [], dueDate = null) {
      const id = crypto.randomUUID();
      this.tasks.push({
        id,
        columnId,
        title,
        description,
        tags,
        dueDate,
        order: this.tasks.filter(t => t.columnId === columnId).length,
      });
    },
    updateTask(id, updates) {
      const task = this.tasks.find(t => t.id === id);
      if (task) {
        Object.assign(task, updates);
      }
    },
    moveTask(taskId, newIndex, columnId) {
      // Find the task to move
      const taskToMove = this.tasks.find(t => t.id === taskId);
      if (!taskToMove) return;

      // If the column changed, update the columnId and adjust the old column's task orders
      if (taskToMove.columnId !== columnId) {
        const oldColumnTasks = this.tasks
          .filter(t => t.columnId === taskToMove.columnId)
          .sort((a, b) => a.order - b.order)
          .filter(t => t.id !== taskId);

        oldColumnTasks.forEach((t, idx) => {
          t.order = idx;
        });

        taskToMove.columnId = columnId;
      }

      // Reorder tasks in the target column
      const targetTasks = this.tasks
        .filter(t => t.columnId === columnId && t.id !== taskId)
        .sort((a, b) => a.order - b.order);

      targetTasks.splice(newIndex, 0, taskToMove);

      targetTasks.forEach((t, idx) => {
        t.order = idx;
      });

      // Apply changes to main task list (reassign to trigger reactivity)
      this.tasks = [...this.tasks];
    },
    deleteTask(id) {
      this.tasks = this.tasks.filter(task => task.id !== id);
    },

    // Tag actions
    createTag(title, color) {
      const id = crypto.randomUUID();
      const newTag = {
        id,
        boardId: this.activeBoardId,
        title,
        color,
      };
      this.tags.push(newTag);
    },
    updateTag(id, updates) {
      const tag = this.tags.find(tag => tag.id === id);
      if (tag) {
        Object.assign(tag, updates);
      }
    },
    deleteTag(id) {
      // Remove the tag from the tags array
      this.tags = this.tags.filter(tag => tag.id !== id);

      // Remove the tag from all tasks
      for (const task of this.tasks) {
        task.tags = task.tags.filter(tid => tid !== id);
      }
    },
  }
});
