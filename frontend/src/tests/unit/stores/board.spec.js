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
              { id: 101, title: 'Old Task Title', tags: [] }
            ]
          },
          {
            id: 1, title: 'In Progress', tasks: [
              { id: 201, title: 'Task Title2', tags: [] }

            ]
          }
        ],
        tags: [
          {
            id: 1,
            title: 'bug',
            value: true,
            color: '#FF5733'
          },
          {
            id: 2,
            title: 'feature',
            value: true,
            color: '#33FF57'
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
    it('adds a task with a single tag to the correct column', () => {
      store.addTask(0, 'Task with Tag', 'This task has a tag.', [1]);
      const newTask = store.boards[0].columns[0].tasks.find(task => task.title === 'Task with Tag');

      expect(newTask).toBeDefined(); // Check that the task was added
      expect(newTask.tags).toContain(1); // Check that the tag ID 1 is associated with the task
    });
    it('adds a task with multiple tags to the correct column', () => {
      store.addTask(0, 'Task with Multiple Tags', 'This task has multiple tags.', [1, 2]);
      const newTask = store.boards[0].columns[0].tasks.find(task => task.title === 'Task with Multiple Tags');

      expect(newTask).toBeDefined(); // Check that the task was added
      expect(newTask.tags).toEqual([1, 2]); // Check that both tags are associated with the task
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
  describe('moveTaskBetweenColumns', () => {
    it('moves a task from one column to another', () => {
      // Move Task 1 from 'To Do' to 'In Progress'
      store.moveTaskBetweenColumns(101, 0, 1, 0, 0);

      // Check the tasks in 'To Do' column
      const toDoColumn = store.boards[0].columns.find(col => col.id === 0);
      expect(toDoColumn.tasks).toHaveLength(0); // Should have 1 task left
      expect(toDoColumn.tasks.find(task => task.id === 101)).toBeUndefined(); // Task 1 should be removed

      // Check the tasks in 'In Progress' column
      const inProgressColumn = store.boards[0].columns.find(col => col.id === 1);
      expect(inProgressColumn.tasks).toHaveLength(2); // Should have 1 task
      expect(inProgressColumn.tasks.find(task => task.id === 101)).toBeDefined(); // Task 1 should be present
    });

    it('does not move a non-existent task', () => {
      const initialTasksCount = store.boards[0].columns[0].tasks.length;

      // Attempt to move a task that does not exist
      store.moveTaskBetweenColumns(999, 0, 1, 0, 0); // Invalid task ID

      // Check that the number of tasks in 'To Do' column is unchanged
      const toDoColumn = store.boards[0].columns.find(col => col.id === 0);
      expect(toDoColumn.tasks).toHaveLength(initialTasksCount); // Should still have the same number of tasks
    });

    it('does not move if the source or destination column does not exist', () => {
      const initialTasksCount = store.boards[0].columns[0].tasks.length;

      // Attempt to move a task with invalid column IDs
      store.moveTaskBetweenColumns(101, 999, 1, 0, 0); // Invalid source column ID
      store.moveTaskBetweenColumns(101, 0, 999, 0, 0); // Invalid destination column ID

      // Check that the number of tasks in 'To Do' column is unchanged
      const toDoColumn = store.boards[0].columns.find(col => col.id === 0);
      expect(toDoColumn.tasks).toHaveLength(initialTasksCount); // Should still have the same number of tasks
    });

    it('handles moving tasks to the same column', () => {
      // Move Task 1 to the same column at the same index
      store.moveTaskBetweenColumns(101, 0, 0, 0, 0); // Move Task 1 to the same position in the same column

      // Check the tasks in 'To Do' column
      const toDoColumn = store.boards[0].columns.find(col => col.id === 0);
      expect(toDoColumn.tasks).toHaveLength(1); // Should still have both tasks
      expect(toDoColumn.tasks[0].id).toBe(101); // Task 1 should still be first
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
  describe('updateColumn', () => {
    it('updates the column title correctly', () => {
      store.updateColumn(1, 'Updated Title');
      expect(store.boards[0].columns[1].title).toBe('Updated Title');
    });

    it('does not update the title for a non-existent column', () => {
      const initialTitle = store.boards[0].columns[0].title;
      store.updateColumn(999, 'Invalid Title');
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

