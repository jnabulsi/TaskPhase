import { setActivePinia, createPinia } from 'pinia';
import { useBoardStore } from '@/stores/board';

describe('Board Store', () => {
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useBoardStore();
    store.activeBoardId = 1;
    store.boards = [
      {
        id: 1,
        name: 'Test Project',
        columns: [
          {
            id: 0,
            title: 'To Do',
            tasks: [
              { id: 101, title: 'Old Task Title' }
            ]
          },
          {
            id: 1, title: 'In Progress', tasks: [
              { id: 201, title: 'Task Title2' }

            ]
          }
        ]
      }
    ];
  });


  describe('addTask', () => {
    it('adds a task with a description to the correct column', () => {
      store.addTask(0, 'New Task', 'This is a description.');
      const newTask = store.boards[0].columns[0].tasks.find(task => task.title === 'New Task');

      expect(newTask).toBeDefined(); // Check that the task was added
      expect(newTask.title).toBe('New Task'); // Check the title of the new task
      expect(newTask.description).toBe('This is a description.'); // Check the description of the new task
    });
    it('adds a task with an empty description', () => {
      store.addTask(0, 'New Task', '');
      const newTask = store.boards[0].columns[0].tasks.find(task => task.title === 'New Task');

      expect(newTask).toBeDefined(); // Check that the task was added
      expect(newTask.title).toBe('New Task'); // Check the title of the new task
      expect(newTask.description).toBe(''); // Check the description of the new task
    });
    it('does not add a task to a non-existent column', () => {
      store.addTask(999, 'Task in Non-existent Column');
      expect(store.boards[0].columns[0].tasks).toHaveLength(1);
    });

  });

  describe('updateTask', () => {
    it('updates the task title successfully', () => {
      store.updateTask(101, 'Updated Task Title');

      const updatedTask = store.boards[0].columns[0].tasks.find(task => task.id === 101);
      expect(updatedTask).toBeDefined();
      expect(updatedTask.title).toBe('Updated Task Title');
    });
    it('updates the task description successfully', () => {
      store.updateTask(101, 'Updated Task Title', 'Updated description');

      const updatedTask = store.boards[0].columns[0].tasks.find(task => task.id === 101);
      expect(updatedTask).toBeDefined();
      expect(updatedTask.title).toBe('Updated Task Title');
      expect(updatedTask.description).toBe('Updated description'); // Check the updated description
    });
    it('does not update the task title for a non-existent task', () => {
      const initialTitle = store.boards[0].columns[0].tasks[0].title;
      store.updateTask(999, 'Invalid Task Title');

      const updatedTask = store.boards[0].columns[0].tasks.find(task => task.id === 101);
      expect(updatedTask.title).toBe(initialTitle);
    });
  });
  describe('addColumn', () => {
    it('adds a new column with the specified title', () => {
      store.addColumn('New Column');

      const columns = store.boards[0].columns;
      const newColumn = columns.find(col => col.title === 'New Column');

      expect(newColumn).toBeDefined();
      expect(newColumn.title).toBe('New Column');
      expect(newColumn.tasks).toEqual([]);
    });

    it('adds a new column with an empty string title', () => {
      store.addColumn('');

      const columns = store.boards[0].columns;
      const newColumn = columns.find(col => col.title === '');

      expect(newColumn).toBeDefined();
      expect(newColumn.tasks).toEqual([]);
    });

    it('generates a unique ID for each new column', () => {
      store.addColumn('First Column');
      store.addColumn('Second Column');

      const [col1, col2] = store.boards[0].columns.slice(-2);

      expect(col1.id).not.toBe(col2.id);
      expect(typeof col1.id).toBe('string');
      expect(typeof col2.id).toBe('string');
    });

    it('only adds columns to the active board', () => {
      store.boards.push({
        id: 2,
        name: 'Inactive Project',
        columns: []
      });

      store.activeBoardId = 1;
      store.addColumn('Active Column');

      expect(store.boards[0].columns.find(col => col.title === 'Active Column')).toBeDefined();
      expect(store.boards[1].columns.find(col => col.title === 'Active Column')).toBeUndefined();
    });
  });
  describe('updateColumnTitle', () => {
    it('updates the column title correctly', () => {
      store.updateColumnTitle(1, 'Updated Title');
      expect(store.boards[0].columns[1].title).toBe('Updated Title');
    });

    it('does not update the title for a non-existent column', () => {
      const initialTitle = store.boards[0].columns[0].title;
      store.updateColumnTitle(999, 'Invalid Title');
      expect(store.boards[0].columns[0].title).toBe(initialTitle);
    });

  });
  describe('updateColumnPosition', () => {
    it('moves a column to a new index', () => {
      store.updateColumnPosition(1, 0); // Move "In Progress" to index 0

      const columns = store.activeBoard.columns;
      expect(columns[0].title).toBe('In Progress'); // Now the first column should be "In Progress"
      expect(columns[1].title).toBe('To Do'); // Second column should be "To Do"
    });

    it('does nothing if the column ID does not exist', () => {
      const initialOrder = [...store.activeBoard.columns]; // Store the initial order
      store.updateColumnPosition(999, 1); // Try to move a non-existent column

      const columns = store.activeBoard.columns;
      expect(columns).toEqual(initialOrder); // Order should remain unchanged
    });

    it('moves a column to the same index', () => {
      store.updateColumnPosition(0, 0); // Move "To Do" to index 1 (same position)

      const columns = store.activeBoard.columns;
      expect(columns[0].title).toBe('To Do'); // Order should remain the same
      expect(columns[1].title).toBe('In Progress');
    });

    it('moves a column to the end of the array', () => {
      store.updateColumnPosition(0, 1); // Move "To Do" to the end

      const columns = store.activeBoard.columns;
      expect(columns[1].title).toBe('To Do'); // "To Do" should now be at index 2
      expect(columns[0].title).toBe('In Progress'); // Index 0 should be "In Progress"
    });

    it('moves a column to the start of the array', () => {
      store.updateColumnPosition(1, 0); // Move "In Progress" to index 0

      const columns = store.activeBoard.columns;
      expect(columns[0].title).toBe('In Progress'); // Index 2 should be "In Progress"
      expect(columns[1].title).toBe('To Do'); // Index 1 should be "To Do"
    });
  });
});

