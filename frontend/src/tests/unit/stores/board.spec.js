import { setActivePinia, createPinia } from 'pinia';
import { useBoardStore } from '@/stores/board';
import defaultBoard from '@/data/defaultBoard.json'

describe('Board Store', () => {
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useBoardStore();
    store.activeBoardId = defaultBoard.id;
    store.boards = [defaultBoard];
    store.columns = [...defaultBoard.columns];
    store.tasks = [...defaultBoard.tasks];
    store.tags = [...defaultBoard.tags];
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
      it('reorders a task within the same column', () => {
        // Task 1 (order 0) and Task 2 (order 1) are in column 1
        store.moveTask(1, 1, 1); // Move Task 1 from index 0 to 1

        const colTasks = store.tasks
          .filter(t => t.columnId === 1)
          .sort((a, b) => a.order - b.order);

        expect(colTasks[0].id).toBe(2); // Task 2 should now be first
        expect(colTasks[1].id).toBe(1); // Task 1 should now be second
        expect(colTasks[0].order).toBe(0);
        expect(colTasks[1].order).toBe(1);
      });
      it('moves a task to a different column', () => {
        // Move Task 1 (originally in column 1) to index 0 of column 2
        store.moveTask(1, 0, 2);

        const col1Tasks = store.tasks
          .filter(t => t.columnId === 1)
          .sort((a, b) => a.order - b.order);

        const col2Tasks = store.tasks
          .filter(t => t.columnId === 2)
          .sort((a, b) => a.order - b.order);

        expect(col1Tasks.some(t => t.id === 1)).toBe(false); // Task 1 should be gone from column 1
        expect(col2Tasks[0].id).toBe(1); // Task 1 should be first in column 2
        expect(col2Tasks[0].order).toBe(0);
      });

      it('does nothing if task is not found', () => {
        const originalTasks = [...store.tasks];
        store.moveTask(999, 0, 1); // Non-existent task ID
        expect(store.tasks).toEqual(originalTasks);
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
        expect(newColumn.order).toBe(initialColumnCount);
      });
      it('adds multiple columns and assigns correct orders', () => {
        const initialColumnCount = store.columns.filter(c => c.boardId === store.activeBoardId).length;
        store.createColumn('Column 1', '#ff0000');
        store.createColumn('Column 2', '#00ff00');
        store.createColumn('Column 3', '#0000ff');
        const columns = store.columns.filter(c => c.boardId === store.activeBoardId);
        expect(columns[0].order).toBe(initialColumnCount);
        expect(columns[1].order).toBe(initialColumnCount + 1);
        expect(columns[2].order).toBe(initialColumnCount + 2);
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
      it('does nothing if oldIndex === newIndex', () => {
        const before = JSON.stringify(
          store.columns.filter(c => c.boardId === store.activeBoardId).sort((a, b) => a.order - b.order)
        );

        store.moveColumn(0, 0);

        const after = JSON.stringify(
          store.columns.filter(c => c.boardId === store.activeBoardId).sort((a, b) => a.order - b.order)
        );

        expect(after).toBe(before);
      });
      it('only updates columns from the active board', () => {
        // Add columns from another board
        store.columns.push(
          { id: 99, boardId: 2, title: 'Other Board', order: 0, color: '#000' },
        );

        store.moveColumn(0, 1); // Should ignore column 99
        const otherBoardCol = store.columns.find(c => c.id === 99);
        expect(otherBoardCol.order).toBe(0); // Unchanged
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

