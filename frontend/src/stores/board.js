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
    addTask(columnId, title) {
      const board = this.activeBoard;
      const column = board?.columns.find(c => c.id === columnId);

      if (column) {
        column.tasks.push({
          id: crypto.randomUUID(),
          title
        })
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
