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
            tasks: [
              { id: 101, title: 'Old Task Title' }
            ]
          }
        ]
      }
    ];
  });

  describe('addTask', () => {
    it('adds a task with a description to the correct column', () => {
      store.addTask(1, 'New Task', 'This is a description.');
      const newTask = store.boards[0].columns[0].tasks.find(task => task.title === 'New Task');

      expect(newTask).toBeDefined(); // Check that the task was added
      expect(newTask.title).toBe('New Task'); // Check the title of the new task
      expect(newTask.description).toBe('This is a description.'); // Check the description of the new task
    });
    it('adds a task with an empty description', () => {
      store.addTask(1, 'New Task', '');
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
    it('does not update the task title if the task ID belongs to a different column', () => {
      store.boards[0].columns.push({
        id: 2,
        title: 'In Progress',
        tasks: [
          { id: 102, title: 'Another Task' }
        ]
      });

      const initialTitle = store.boards[0].columns[0].tasks[0].title;
      store.updateTask(102, 'Updated Title');

      const updatedTask = store.boards[0].columns[0].tasks.find(task => task.id === 101);
      expect(updatedTask.title).toBe(initialTitle);
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

