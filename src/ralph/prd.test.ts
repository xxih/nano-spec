/**
 * prd.json 读写工具函数测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
	readPrd,
	writePrd,
	getActiveTask,
	getPendingTask,
	getTaskById,
	addTask,
	updateTaskStatus,
	updateTaskProgress,
} from './prd.js';
import type { PrdJson, PrdTask } from './types.js';

// Mock fs module
vi.mock('fs/promises', () => ({
	readFile: vi.fn(),
	writeFile: vi.fn(),
}));

describe('prd.ts', () => {
	const mockPrd: PrdJson = {
		project: 'Test Project',
		version: '1.0.0',
		last_updated: '2023-01-01T00:00:00.000Z',
		ralph_instruction: 'Test instruction',
		tasks: [
			{
				id: 'T-1',
				title: 'Task 1',
				status: 'completed',
				nanospec_file: 'nanospec/task1',
			},
			{
				id: 'T-2',
				title: 'Task 2',
				status: 'in_progress',
				nanospec_file: 'nanospec/task2',
				phase: 'plan',
				progress_note: 'Half done',
			},
			{
				id: 'T-3',
				title: 'Task 3',
				status: 'pending',
			},
		],
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('readPrd', () => {
		it('should read and parse prd.json file', async () => {
			vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockPrd));

			const result = await readPrd('/test/prd.json');

			expect(fs.readFile).toHaveBeenCalledWith('/test/prd.json', 'utf-8');
			expect(result).toEqual(mockPrd);
		});

		it('should handle invalid JSON', async () => {
			vi.mocked(fs.readFile).mockResolvedValue('invalid json');

			await expect(readPrd('/test/prd.json')).rejects.toThrow();
		});
	});

	describe('writePrd', () => {
		it('should write prd.json file with updated timestamp', async () => {
			vi.mocked(fs.writeFile).mockResolvedValue(undefined);

			await writePrd('/test/prd.json', mockPrd);

			expect(fs.writeFile).toHaveBeenCalledWith(
				'/test/prd.json',
				expect.stringContaining('"last_updated"'),
				'utf-8'
			);
		});

		it('should update last_updated timestamp', async () => {
			vi.mocked(fs.writeFile).mockResolvedValue(undefined);

			const originalLastUpdated = mockPrd.last_updated;
			await writePrd('/test/prd.json', mockPrd);

			expect(mockPrd.last_updated).not.toBe(originalLastUpdated);
			expect(new Date(mockPrd.last_updated).toISOString()).toBe(mockPrd.last_updated);
		});
	});

	describe('getActiveTask', () => {
		it('should return task with in_progress status', () => {
			const activeTask = getActiveTask(mockPrd);

			expect(activeTask).toBeDefined();
			expect(activeTask?.id).toBe('T-2');
			expect(activeTask?.status).toBe('in_progress');
		});

		it('should return undefined when no active task', () => {
			const noActivePrd: PrdJson = {
				...mockPrd,
				tasks: mockPrd.tasks.map(t => ({ ...t, status: 'pending' as const })),
			};

			const activeTask = getActiveTask(noActivePrd);

			expect(activeTask).toBeUndefined();
		});
	});

	describe('getPendingTask', () => {
		it('should return first task with pending status', () => {
			const pendingTask = getPendingTask(mockPrd);

			expect(pendingTask).toBeDefined();
			expect(pendingTask?.id).toBe('T-3');
			expect(pendingTask?.status).toBe('pending');
		});

		it('should return undefined when no pending task', () => {
			const noPendingPrd: PrdJson = {
				...mockPrd,
				tasks: mockPrd.tasks.map(t => ({ ...t, status: 'completed' as const })),
			};

			const pendingTask = getPendingTask(noPendingPrd);

			expect(pendingTask).toBeUndefined();
		});
	});

	describe('getTaskById', () => {
		it('should return task by id', () => {
			const task = getTaskById(mockPrd, 'T-2');

			expect(task).toBeDefined();
			expect(task?.id).toBe('T-2');
			expect(task?.title).toBe('Task 2');
		});

		it('should return undefined for non-existent task', () => {
			const task = getTaskById(mockPrd, 'T-999');

			expect(task).toBeUndefined();
		});
	});

	describe('addTask', () => {
		it('should add new task to prd', () => {
			const newTask: PrdTask = {
				id: 'T-4',
				title: 'New Task',
				status: 'pending',
			};

			addTask(mockPrd, newTask);

			expect(mockPrd.tasks).toHaveLength(4);
			expect(mockPrd.tasks[3]).toEqual(newTask);
		});
	});

	describe('updateTaskStatus', () => {
		it('should update task status', () => {
			const result = updateTaskStatus(mockPrd, 'T-3', 'in_progress');

			expect(result).toBe(true);
			expect(mockPrd.tasks[2].status).toBe('in_progress');
		});

		it('should return false for non-existent task', () => {
			const result = updateTaskStatus(mockPrd, 'T-999', 'completed');

			expect(result).toBe(false);
		});
	});

	describe('updateTaskProgress', () => {
		it('should update task phase and progress note', () => {
			const result = updateTaskProgress(mockPrd, 'T-2', 'execute', 'Starting execution');

			expect(result).toBe(true);
			expect(mockPrd.tasks[1].phase).toBe('execute');
			expect(mockPrd.tasks[1].progress_note).toBe('Starting execution');
		});

		it('should return false for non-existent task', () => {
			const result = updateTaskProgress(mockPrd, 'T-999', 'plan', 'Test');

			expect(result).toBe(false);
		});
	});
});