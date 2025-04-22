import { defineStore } from 'pinia'

export const useBoardStore = defineStore('board', {
  state: () => ({
    activeBoardId: null,
    boards: [],
    columns: [],
    tasks: [],
    tags: [],
    localMode: false,
  }),
  getters: {
    getBoardNameByBoardId(boardId) {
      const board = this.boards.find(board => board.id === boardId);
      console.log("board", { board })
      return board ? board.name : null;
    },
    getColumnsByBoardId(boardId) {
      return this.columns
        .filter(column => column.boardId === boardId)
        .sort((a, b) => a.order - b.order)
    },
    getActiveBoard: (state) => state.boards.find(b => b.id === state.activeBoardId),
    getActiveColumns: (state) => {
      return state.columns.filter(col => col.boardId === state.activeBoardId);
    },
    getActiveTags: (state) => {
      return state.tags.filter(tag => tag.boardId === state.activeBoardId);
    },
    getTagById: (state) => {
      return (id) => state.tags.find(tag => tag.id === id);
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
    getTaskById: (state) => (id) => {
      return state.tasks.find(task => task.id === id)
    }
  },
  actions: {
    loadFromStorage() {
      console.log("start load");

      // Only load from localStorage if localMode is true
      const saved = localStorage.getItem('taskforge-data');

      if (saved) {
        const parsed = JSON.parse(saved);
        this.localMode = parsed.localMode ?? false;  // Set localMode properly
        console.log("in load", { localMode: this.localMode });

        if (this.localMode) {
          this.boards = parsed.boards || [];
          this.columns = parsed.columns || [];
          this.tasks = parsed.tasks || [];
          this.tags = parsed.tags || [];
          this.activeBoardId = parsed.activeBoardId || this.boards[0]?.id || null;
        }
      } else {
        console.log("No data found in localStorage");
      }
    },
    saveToStorage() {
      console.log("start save");
      if (!this.localMode) return;  // Only save to storage if localMode is true

      localStorage.setItem('taskforge-data', JSON.stringify({
        boards: this.boards,
        columns: this.columns,
        tasks: this.tasks,
        tags: this.tags,
        activeBoardId: this.activeBoardId,
        localMode: this.localMode,  // Make sure localMode is saved
      }));
    },
    // Board actions
    setActiveBoard(id) {
      this.activeBoardId = id;
      this.saveToStorage()
    },
    createBoard(name) {
      this.boards.push({ id: crypto.randomUUID(), name });
      this.saveToStorage()
    },

    // Column actions
    createColumn(title, color) {
      const boardId = this.activeBoardId;

      const order = this.columns
        .filter(col => col.boardId === boardId)
        .reduce((max, col) => Math.max(max, col.order), 0) + 100;

      this.columns.push({
        id: crypto.randomUUID(),
        boardId,
        title,
        color,
        order,
      });

      this.saveToStorage()
    },
    updateColumn(id, updates) {
      const index = this.columns.findIndex(c => c.id === id);
      if (index !== -1) {
        // Create a new column object with the updates applied
        const updatedColumn = { ...this.columns[index], ...updates };
        // Replace the old column with the new updated column
        this.columns.splice(index, 1, updatedColumn);
        this.saveToStorage()
      }
    },
    moveColumn(id, order) {
      const column = this.columns.find(c => c.id === id);
      if (!column) return;
      column.order = order;
      this.saveToStorage()
      this.loadFromStorage()
    },
    deleteColumn(id) {
      this.columns = this.columns.filter(c => c.id !== id);
      this.tasks = this.tasks.filter(t => t.columnId !== id);
      this.saveToStorage()
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
      this.saveToStorage()
    },
    updateTask(id, updates) {
      const task = this.tasks.find(t => t.id === id);
      if (task) {
        Object.assign(task, updates);
        this.saveToStorage()
      }
    },
    moveTask(taskId, order, columnId) {
      const column = this.columns.find(c => c.id === columnId);
      const task = this.tasks.find(t => t.id === taskId);

      if (!column || !task) {
        console.warn("Column or task not found.", { taskId, columnId });
        return;
      }

      task.order = order;
      task.columnId = columnId;

      this.saveToStorage();
      this.loadFromStorage();
    },
    deleteTask(id) {
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.saveToStorage()
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
      this.saveToStorage()
    },
    updateTag(id, updates) {
      const tag = this.tags.find(tag => tag.id === id);
      if (tag) {
        Object.assign(tag, updates);
        this.saveToStorage()
      }
    },
    deleteTag(tagId) {
      // Remove the tag itself
      this.tags = this.tags.filter(tag => tag.id !== tagId)

      // Remove tag from all tasks
      this.tasks.forEach(task => {
        task.tags = task.tags.filter(tid => tid !== tagId)
      })

      this.saveToStorage()
    },
    updateBoard(boardId, updatedFields) {
      const board = this.boards.find(b => b.id === boardId)
      if (!board) return

      Object.assign(board, updatedFields)
      this.saveToStorage()
    },
    deleteBoard(boardId) {
      // Delete all columns belonging to this board
      const columnIds = this.columns
        .filter(c => c.boardId === boardId)
        .map(c => c.id)

      columnIds.forEach(this.deleteColumn)

      // Delete the board
      this.boards = this.boards.filter(b => b.id !== boardId)
      this.saveToStorage()
    },
  }
});
