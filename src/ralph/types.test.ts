/**
 * Ralph 类型定义测试
 */

import { describe, it, expect } from 'vitest';
import type { PrdJson, PrdTask, TaskStatus, TaskPhase } from './types.js';

describe('Ralph Types', () => {
	describe('TaskStatus', () => {
		it('should accept valid task status values', () => {
			const statuses: TaskStatus[] = ['pending', 'in_progress', 'completed'];
			expect(statuses).toHaveLength(3);
			expect(statuses).toContain('pending');
			expect(statuses).toContain('in_progress');
			expect(statuses).toContain('completed');
		});
	});

	describe('TaskPhase', () => {
		it('should accept valid task phase values', () => {
			const phases: TaskPhase[] = ['spec', 'plan', 'execute', 'review'];
			expect(phases).toHaveLength(4);
			expect(phases).toContain('spec');
			expect(phases).toContain('plan');
			expect(phases).toContain('execute');
			expect(phases).toContain('review');
		});
	});

	describe('PrdTask', () => {
		it('should accept valid task object', () => {
			const task: PrdTask = {
				id: 'T-1',
				title: 'Test Task',
				status: 'pending',
				nanospec_file: 'nanospec/test',
				phase: 'spec',
				progress_note: 'In progress',
			};

			expect(task.id).toBe('T-1');
			expect(task.title).toBe('Test Task');
			expect(task.status).toBe('pending');
		});

		it('should accept minimal task object', () => {
			const task: PrdTask = {
				id: 'T-2',
				title: 'Minimal Task',
				status: 'completed',
			};

			expect(task.id).toBe('T-2');
			expect(task.title).toBe('Minimal Task');
			expect(task.status).toBe('completed');
			expect(task.nanospec_file).toBeUndefined();
			expect(task.phase).toBeUndefined();
			expect(task.progress_note).toBeUndefined();
		});
	});

	describe('PrdJson', () => {
		it('should accept valid prd.json object', () => {
			const prd: PrdJson = {
				project: 'Test Project',
				version: '1.0.0',
				last_updated: '2023-01-01T00:00:00.000Z',
				ralph_instruction: 'Test instruction',
				tasks: [
					{
						id: 'T-1',
						title: 'Task 1',
						status: 'completed',
					},
					{
						id: 'T-2',
						title: 'Task 2',
						status: 'in_progress',
						phase: 'plan',
						progress_note: 'Half done',
					},
				],
			};

			expect(prd.project).toBe('Test Project');
			expect(prd.version).toBe('1.0.0');
			expect(prd.tasks).toHaveLength(2);
		});

		it('should accept prd.json with empty tasks', () => {
			const prd: PrdJson = {
				project: 'Empty Project',
				version: '1.0.0',
				last_updated: '2023-01-01T00:00:00.000Z',
				ralph_instruction: 'No tasks',
				tasks: [],
			};

			expect(prd.tasks).toHaveLength(0);
		});
	});
});