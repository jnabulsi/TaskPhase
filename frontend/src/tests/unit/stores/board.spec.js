import { setActivePinia, createPinia } from 'pinia';
import { useBoardStore } from '@/stores/board';
import defaultBoard from '@/data/defaultBoard.json'

describe('Board Store', () => {
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useBoardStore();
    store.clearStorage();
    store.activeBoardId = defaultBoard.id;
    store.boards = [defaultBoard];
    store.columns = [...defaultBoard.columns];
    store.tasks = [...defaultBoard.tasks];
    store.tags = [...defaultBoard.tags];
  });

  describe('Data Actions', () => {
    describe('loadFromStorage', () => {
      it('loads data from localStorage when localMode is true', () => {
        const mockData = {
          localMode: true,
          boards: [{ id: 99, name: 'Test Board' }],
          columns: [],
          tasks: [],
          tags: [],
          activeBoardId: 99
        };
        localStorage.setItem('taskforge-data', JSON.stringify(mockData));

        store.loadFromStorage();

        expect(store.localMode).toBe(true);
        expect(store.boards).toEqual(mockData.boards);
        expect(store.activeBoardId).toBe(99);
      });
      it('does not load anything if localStorage is empty', () => {
        localStorage.removeItem('taskforge-data');

        store.loadFromStorage();

        // Default untouched state
        expect(store.localMode).toBe(false);
        expect(store.boards.length).toBeGreaterThan(0); // from defaultBoard
      });
      it('does not load data if localMode is false in storage', () => {
        const mockData = {
          localMode: false,
          boards: [{ id: 42, name: 'Should Not Load' }]
        };
        localStorage.setItem('taskforge-data', JSON.stringify(mockData));

        store.loadFromStorage();

        expect(store.boards.some(b => b.id === 42)).toBe(false);
      });
    });

    describe('saveToStorage', () => {
      it('does not save if localMode is false', () => {
        store.localMode = false;
        store.saveToStorage();

        expect(localStorage.getItem('taskforge-data')).toBeNull();
      });
      it('saves store data to localStorage when localMode is true', () => {
        store.localMode = true;
        store.saveToStorage();

        const saved = JSON.parse(localStorage.getItem('taskforge-data'));

        expect(saved.localMode).toBe(true);
        expect(saved.boards).toEqual(store.boards);
        expect(saved.columns).toEqual(store.columns);
        expect(saved.tasks).toEqual(store.tasks);
        expect(saved.tags).toEqual(store.tags);
      });
    });
    describe('clearStorage', () => {
      it('removes data from localStorage', () => {
        store.clearStorage();

        expect(localStorage.getItem('taskforge-data')).toBeNull();
      });
      it('resets store values to default', () => {
        store.clearStorage();

        expect(store.localMode).toBe(false);
        expect(store.boards).toEqual([]);
        expect(store.columns).toEqual([]);
        expect(store.tasks).toEqual([]);
        expect(store.tags).toEqual([]);
        expect(store.activeBoardId).toBeNull();
      });
    });
  });
  describe('Task Actions', () => {
    describe('createTask', () => {
      it('creates a task with title only', () => {
        store.createTask(1, 'New Task');
        const task = store.tasks.find(task => task.title === 'New Task');
        expect(task).toBeDefined();
        expect(task.title).toBe('New Task');
        expect(task.description).toBe('');
        expect(task.tags).toEqual([]);
        expect(task.order).toBe(2); // Assuming it's the 3rd task in the "To-Do" column
        expect(task.columnId).toBe(1); // Ensure it's in the correct column
      });
      it('creates a task with a description', () => {
        store.createTask(1, 'Task with Description', 'This is a description.');
        const task = store.tasks.find(task => task.title === 'Task with Description');
        expect(task).toBeDefined();
        expect(task.description).toBe('This is a description.');
      });
      it('creates a task with tags', () => {
        store.createTask(1, 'Task with Tag', '', [1]); // Assuming tag ID 1 exists
        const task = store.tasks.find(task => task.title === 'Task with Tag');
        expect(task).toBeDefined();
        expect(task.tags).toContain(1);
      });
      it('creates a task in the correct column', () => {
        store.createTask(2, 'Task for In Progress Column');
        const task = store.tasks.find(task => task.title === 'Task for In Progress Column');
        expect(task).toBeDefined();
        expect(task.columnId).toBe(2);
      });
    });
    describe('updateTask', () => {
      it('updates the title and description of a task', () => {
        store.updateTask(1, {
          title: 'Updated Title',
          description: 'Updated Description',
        });
        const task = store.tasks.find(t => t.id === 1);
        expect(task.title).toBe('Updated Title');
        expect(task.description).toBe('Updated Description');
      });
      it('updates tags and dueDate of a task', () => {
        store.updateTask(2, {
          tags: [1],
          dueDate: '2025-04-20',
        });
        const task = store.tasks.find(t => t.id === 2);
        expect(task.tags).toEqual([1]);
        expect(task.dueDate).toBe('2025-04-20');
      });
      it('updates multiple fields without affecting others', () => {
        const originalTask = { ...store.tasks.find(t => t.id === 3) };
        store.updateTask(3, {
          title: 'New Title',
          tags: [],
        });
        const updatedTask = store.tasks.find(t => t.id === 3);
        expect(updatedTask.title).toBe('New Title');
        expect(updatedTask.tags).toEqual([]);
        expect(updatedTask.description).toBe(originalTask.description); // untouched
      });
      it('does nothing if task with given id does not exist', () => {
        const before = JSON.stringify(store.tasks);
        store.updateTask(999, { title: 'Should Not Exist' });
        const after = JSON.stringify(store.tasks);
        expect(after).toBe(before); // No change
      });
    });
    describe('moveTask', () => {
      it('should not change anything if the task does not exist', () => {
        store.moveTask(999, 150, 2); // invalid task

        const unchanged = store.tasks.map(t => ({ id: t.id, columnId: t.columnId, order: t.order }));
        expect(unchanged).toEqual([
          { id: 1, columnId: 1, order: 200 },
          { id: 2, columnId: 1, order: 100 },
          { id: 3, columnId: 2, order: 100 },
        ]);
      });

      it('should not change anything if the column does not exist', () => {
        store.moveTask(1, 150, 999); // invalid column

        const task = store.tasks.find(t => t.id === 1);
        expect(task.columnId).toBe(1);
        expect(task.order).toBe(200);
      });

      it('should allow moving to the same column with a new order', () => {
        store.moveTask(2, 300, 1); // move task 2 within the same column

        const task = store.tasks.find(t => t.id === 2);
        expect(task.columnId).toBe(1);
        expect(task.order).toBe(300);
      });
    });
    describe('deleteTask', () => {
      it('deletes a task by id', () => {
        const initialTaskCount = store.tasks.length;
        store.deleteTask(2);
        const task = store.tasks.find(t => t.id === 2);
        expect(task).toBeUndefined();
        expect(store.tasks.length).toBe(initialTaskCount - 1);
      });
      it('does nothing when trying to delete a non-existent task', () => {
        const initialTaskCount = store.tasks.length;
        store.deleteTask(999);
        expect(store.tasks.length).toBe(initialTaskCount);
      });
      it('does nothing when deleting a task from an empty column', () => {
        store.tasks = store.tasks.filter(t => t.columnId !== 3);
        store.deleteTask(3);
        const task = store.tasks.find(t => t.id === 3);
        expect(task).toBeUndefined();
      });
    });
  });
  describe('Column Actions', () => {
    describe('addColumn', () => {
      it('adds a new column with title and color', () => {
        const initialColumnCount = store.columns.length;
        store.createColumn('New Column', '#123456');
        const newColumn = store.columns.find(c => c.title === 'New Column');
        expect(newColumn).toBeDefined();
        expect(newColumn.title).toBe('New Column');
        expect(newColumn.color).toBe('#123456');
        expect(store.columns.length).toBe(initialColumnCount + 1);
      });
      it('assigns the correct order to the new column', () => {
        const initialColumnCount = store.columns.filter(c => c.boardId === store.activeBoardId).length;
        store.createColumn('New Column', '#123456');
        const newColumn = store.columns.find(c => c.title === 'New Column');
        expect(newColumn.order).toBe(initialColumnCount + 100);
      });
      it('adds multiple columns and assigns correct orders', () => {
        const initialColumnCount = store.columns.filter(c => c.boardId === store.activeBoardId).length;
        store.createColumn('Column 1', '#ff0000');
        store.createColumn('Column 2', '#00ff00');
        store.createColumn('Column 3', '#0000ff');
        const columns = store.columns.filter(c => c.boardId === store.activeBoardId);
        expect(columns[0].order).toBe(initialColumnCount + 100);
        expect(columns[1].order).toBe(initialColumnCount + 200);
        expect(columns[2].order).toBe(initialColumnCount + 300);
      });
      it('creates a new column with correct properties', () => {
        store.createColumn('New Column', '#123456');
        const newColumn = store.columns.find(c => c.title === 'New Column');
        expect(newColumn).toBeDefined();
        expect(newColumn.title).toBe('New Column');
        expect(newColumn.color).toBe('#123456');
        expect(newColumn.boardId).toBe(store.activeBoardId);
      });
      it('creates a column with empty title and color', () => {
        store.createColumn('', '');
        const newColumn = store.columns.find(c => c.title === '');
        expect(newColumn).toBeDefined();
        expect(newColumn.title).toBe('');
        expect(newColumn.color).toBe('');
      });
    });
    describe('updateColumn', () => {
      it('updates a column with new title and color', () => {
        const columnId = store.columns[0].id;
        store.updateColumn(columnId, { title: 'Updated Column', color: '#123456' });
        const updatedColumn = store.columns.find(c => c.id === columnId);
        expect(updatedColumn).toBeDefined();
        expect(updatedColumn.title).toBe('Updated Column');
        expect(updatedColumn.color).toBe('#123456');
      });
      it('updates only the title of the column', () => {
        const columnId = store.columns[0].id;
        const originalColor = store.columns[0].color;
        store.updateColumn(columnId, { title: 'New Title' });
        const updatedColumn = store.columns.find(c => c.id === columnId);
        expect(updatedColumn.title).toBe('New Title');
        expect(updatedColumn.color).toBe(originalColor);
      });
      it('updates only the color of the column', () => {
        const columnId = store.columns[0].id;
        const originalTitle = store.columns[0].title;
        store.updateColumn(columnId, { color: '#654321' });
        const updatedColumn = store.columns.find(c => c.id === columnId);
        expect(updatedColumn.color).toBe('#654321');
        expect(updatedColumn.title).toBe(originalTitle);
      });
      it('does not update if the column does not exist', () => {
        const initialColumnCount = store.columns.length;
        store.updateColumn('non-existing-id', { title: 'New Title' });
        expect(store.columns.length).toBe(initialColumnCount);
      });
      it('does not change the column order when updating other properties', () => {
        const columnId = store.columns[0].id;
        const originalOrder = store.columns[0].order;
        store.updateColumn(columnId, { title: 'Updated Column', color: '#123456' });
        const updatedColumn = store.columns.find(c => c.id === columnId);
        expect(updatedColumn.order).toBe(originalOrder);
      });
    });
    describe('moveColumn', () => {
      it('should update the order of an existing column', () => {
        store.moveColumn(1, 150);
        const column = store.columns.find(c => c.id === 1);
        expect(column.order).toBe(150);
      });
    });
    describe('deleteColumn', () => {
      it('removes the column from the columns array', () => {
        store.deleteColumn(1); // Delete the "To-Do" column
        const remainingColumns = store.columns.filter(col => col.boardId === 1);
        expect(remainingColumns).toHaveLength(2); // Should have 2 columns left
        expect(remainingColumns.some(col => col.id === 1)).toBe(false); // "To-Do" column should not be present
      });
      it('removes the tasks associated with the deleted column', () => {
        store.deleteColumn(1); // Delete the "To-Do" column
        const remainingTasks = store.tasks.filter(task => task.columnId === 1);
        expect(remainingTasks).toHaveLength(0); // No tasks should be associated with the deleted column
      });
      it('does not remove columns or tasks from other boards', () => {
        store.columns.push({ id: 4, boardId: 2, title: 'External Column', order: 0, color: '#000' });
        store.tasks.push({ id: 4, columnId: 4, title: 'External Task', order: 0, description: '' });
        store.deleteColumn(1); // Delete the "To-Do" column from board 1
        const remainingColumns = store.columns.filter(col => col.boardId === 2);
        expect(remainingColumns).toHaveLength(1); // The external column should still exist
        const remainingTasks = store.tasks.filter(task => task.columnId === 4);
        expect(remainingTasks).toHaveLength(1); // The external task should still exist
      });
      it('does nothing if the column does not exist', () => {
        const before = JSON.stringify(store.columns);
        store.deleteColumn(999); // Non-existing column ID
        expect(JSON.stringify(store.columns)).toBe(before); // Ensure columns are unchanged
      });
    });
  });
  describe('Tag Actions', () => {
    describe('createTag', () => {
      it('creates and adds a new tag to the tags array', () => {
        const title = 'feature';
        const color = '#33FF57';

        store.createTag(title, color);

        // Check if the new tag has been added to the tags array
        const newTag = store.tags.find(tag => tag.title === title);
        expect(newTag).toBeTruthy(); // Ensure the tag exists
        expect(newTag.title).toBe(title); // Check title
        expect(newTag.color).toBe(color); // Check color
        expect(newTag.boardId).toBe(store.activeBoardId); // Check that the boardId is correct
        expect(newTag.id).toBeDefined(); // Ensure the id is defined (should be a unique value)
      });
      it('generates a unique ID for each tag', () => {
        const title1 = 'urgent';
        const color1 = '#FF0000';
        const title2 = 'enhancement';
        const color2 = '#0000FF';

        store.createTag(title1, color1);
        store.createTag(title2, color2);

        const newTag1 = store.tags.find(tag => tag.title === title1);
        const newTag2 = store.tags.find(tag => tag.title === title2);

        expect(newTag1.id).not.toBe(newTag2.id); // Ensure the IDs are unique
      });
      it('creates a tag even if other tags already exist', () => {
        const initialTagCount = store.tags.length;

        store.createTag('new feature', '#00FF00');

        expect(store.tags.length).toBe(initialTagCount + 1); // Ensure the tag count has increased by 1
      });
    });
  });
});
