export function lightenColor(hex, percent) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  r = Math.min(255, Math.floor(r + (255 - r) * percent));
  g = Math.min(255, Math.floor(g + (255 - g) * percent));
  b = Math.min(255, Math.floor(b + (255 - b) * percent));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function computeOrder(before, after) {
  if (before !== undefined && after !== undefined) {
    return (before + after) / 2
  } else if (before === undefined && after !== undefined) {
    return after - 100
  } else if (before !== undefined && after === undefined) {
    return before + 100
  } else {
    return 1000
  }
}

import { useBoardStore } from '@/stores/board'

export function getExportData(boardId) {
  const store = useBoardStore()

  const board = store.boards.find(b => b.id === boardId)
  const columns = store.columns
    .filter(c => c.boardId === boardId)
    .sort((a, b) => a.order - b.order)
  const columnIds = columns.map(c => c.id)

  const tasks = store.tasks.filter(t => columnIds.includes(t.columnId))
  const tags = store.tags.filter(t => t.boardId === boardId)

  return {
    boards: [board],
    columns,
    tasks,
    tags,
  }
}

export function downloadJson(data, filename) {
  const jsonStr = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function importBoardData(data) {
  const store = useBoardStore();

  // Create board
  const newBoard = store.createBoard(data.boards[0].name);
  store.setActiveBoard(newBoard.id);

  // Maps to track old to new IDs
  const columnIdMap = {};
  const tagIdMap = {};

  // Create columns and map old IDs to new
  data.columns.forEach(col => {
    const newCol = store.createColumn(col.title, col.color);
    newCol.boardId = newBoard.id;
    columnIdMap[col.id] = newCol.id;
  });

  // Create tags and map old IDs to new
  data.tags.forEach(tag => {
    const newTag = store.createTag(tag.title, tag.color);
    newTag.boardId = newBoard.id;
    tagIdMap[tag.id] = newTag.id;
  });

  // Create tasks with mapped columnId and tag IDs
  data.tasks.forEach(task => {
    const newColumnId = columnIdMap[task.columnId];
    const newTagIds = task.tags.map(oldTagId => tagIdMap[oldTagId] || null).filter(Boolean);

    store.createTask(
      newColumnId,
      task.title,
      task.description || '',
      newTagIds,
      task.dueDate || null
    );
  });
}

