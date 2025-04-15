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
      const boardId = this.activeBoardId;
      const maxId = this.columns
        .filter(col => col.boardId === boardId)
        .reduce((max, col) => Math.max(max, col.id), 0);

      const id = maxId + 1;

      const maxOrder = this.columns
        .filter(col => col.boardId === boardId)
        .reduce((max, col) => Math.max(max, col.order), 0);

      const order = maxOrder + 100;

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
    moveTask(taskId, order, columnId) {
      const column = this.columns.find(c => c.id === columnId);
      const task = this.tasks.find(t => t.id === taskId)
      if (!column || !task) return;
      task.order = order;
      task.columnId = columnId;
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
