import { setActivePinia, createPinia } from 'pinia';
import { useBoardStore } from '@/stores/board';

describe('Board Store', () => {
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useBoardStore();
    store.boards = [
      {
        id: 1,
        name: 'Test Project',
        columns: [
          {
            id: 1,
            title: 'To Do',
            tasks: []
          }
        ]
      }
    ];
  });

  describe('addTask', () => {
    it('adds a task to the correct column', () => {
      store.addTask(1, 'New Task');
      expect(store.boards[0].columns[0].tasks).toHaveLength(1);
      expect(store.boards[0].columns[0].tasks[0].title).toBe('New Task');
      expect(store.boards[0].columns[0].tasks[0].id).toMatch(/^[\w-]{36}$/); // Example for UUID check
    });

    it('does not add a task to a non-existent column', () => {
      store.addTask(999, 'Task in Non-existent Column');
      expect(store.boards[0].columns[0].tasks).toHaveLength(0);
    });

  });

  describe('updateColumnTitle', () => {
    it('updates the column title correctly', () => {
      store.updateColumnTitle(1, 'Updated Title');
      expect(store.boards[0].columns[0].title).toBe('Updated Title');
    });

    it('does not update the title for a non-existent column', () => {
      const initialTitle = store.boards[0].columns[0].title;
      store.updateColumnTitle(999, 'Invalid Title');
      expect(store.boards[0].columns[0].title).toBe(initialTitle);
    });

  });
});

