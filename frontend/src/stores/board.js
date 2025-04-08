import { defineStore } from 'pinia'
import defaultBoards from '@/data/defaultBoard.json'

export const useBoardStore = defineStore('board', {
  state: () => ({
    activeBoardId: 1,
    boards: defaultBoards
  }),
  getters: {
    activeBoard(state) {
      return state.boards.find(b => b.id === state.activeBoardId);
    }
  },
  actions: {
    findTaskById(taskId) {
      return this.activeBoard.columns
        .flatMap(column => column.tasks)
        .find(task => task.id === taskId);
    },
    findColumnById(columnId) {
      return this.activeBoard.columns.find(column => column.id === columnId);
    },
    addTask(columnId, title, description = '') {
      const column = this.findColumnById(columnId);
      if (column) {
        column.tasks.push({
          id: crypto.randomUUID(),
          title,
          description,
        });
      }
    },
    updateTask(taskId, newTitle, description) {
      const task = this.findTaskById(taskId);
      if (task) {
        if (newTitle !== undefined) {
          task.title = newTitle; // Update the title if provided
        }
        if (description !== undefined) {
          task.description = description; // Update the description if provided
        }
      }
    },
    updateColumnTitle(columnId, newTitle) {
      const board = this.activeBoard;
      const column = board?.columns.find(c => c.id === columnId);

      if (column) {
        column.title = newTitle;  // Update the column's title
        console.log(this.boards);
      }
    }
  }
});
