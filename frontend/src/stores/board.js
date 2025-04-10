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
    },
    getActiveTags(state) {
      const activeBoard = state.boards.find(b => b.id === state.activeBoardId);
      if (activeBoard) {
        const activeTags = activeBoard.tags.filter(tag => tag.value);
        console.log("Active Tags from Getter:", JSON.parse(JSON.stringify(activeTags)));
        return activeTags;
      }
      return [];
    },
    getTaskById: (state) => (taskId) => {
      const board = state.boards.find(b => b.id === state.activeBoardId);
      return board?.columns.flatMap(col => col.tasks).find(task => task.id === taskId);
    },
    getColumnById: (state) => (columnId) => {
      const board = state.boards.find(b => b.id === state.activeBoardId);
      return board?.columns.find(col => col.id === columnId);
    }
  },
  actions: {
    addTag(title, value, color) {
      const newTag = {
        id: crypto.randomUUID(),
        title,
        value,
        color,
      };
      const board = this.boards.find(b => b.id === this.activeBoardId);
      if (board) {
        board.tags.push(newTag);
      }
    },
    addTask(columnId, title, description = '', tags = []) {
      const column = this.getColumnById(columnId);
      if (column) {
        column.tasks.push({
          id: crypto.randomUUID(),
          title,
          description,
          tags: tags,
        });
      }
    },
    updateTask(taskId, newTitle, description) {
      const task = this.getTaskById(taskId);

      if (task) {
        if (newTitle !== undefined) {
          task.title = newTitle; // Update the title if provided
        }
        if (description !== undefined) {
          task.description = description; // Update the description if provided
        }
      }
    },
    moveTaskBetweenColumns(taskId, fromColumnId, toColumnId, newIndex) {
      // Find the source column
      const fromColumn = this.getColumnById(fromColumnId);
      const toColumn = this.getColumnById(toColumnId);

      if (fromColumn && toColumn) {
        // Find the task to move
        const taskIndex = fromColumn.tasks.findIndex(task => task.id === taskId);
        const task = fromColumn.tasks[taskIndex];

        if (task) {
          // Remove the task from the old column
          fromColumn.tasks.splice(taskIndex, 1);

          // Add the task to the new column at the specified index
          toColumn.tasks.splice(newIndex, 0, task);
        }
      }
    },
    addColumn(newTitle, newColor) {
      const newColumn = {
        id: crypto.randomUUID(),
        title: newTitle,
        color: newColor,
        tasks: [],
      };

      this.activeBoard.columns.push(newColumn);
    },
    updateColumnPosition(columnId, newIndex) {
      const board = this.activeBoard;
      if (board) {
        const columnIndex = board.columns.findIndex(col => col.id === columnId);
        if (columnIndex !== -1) {
          const [movedColumn] = board.columns.splice(columnIndex, 1);
          board.columns.splice(newIndex, 0, movedColumn);
        }
      }
    },
    updateColumn(columnId, newTitle, newColor) {
      const column = this.getColumnById(columnId);
      if (column) {
        column.title = newTitle;
        column.color = newColor;
      }
    }
  }
});
