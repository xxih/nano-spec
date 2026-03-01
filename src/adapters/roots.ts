import {homedir} from 'os';
import {join} from 'path';
import type {AdapterScope} from './index.js';

function resolveScopedRoot(cwd: string, dotDir: string, scope?: AdapterScope): string {
	if (scope === 'user') {
		const homeDir = process.env.NANOSPEC_HOME_DIR || homedir();
		return join(homeDir, dotDir);
	}

	return join(cwd, dotDir);
}

export function resolveCodexRoot(cwd: string, scope?: AdapterScope): string {
	return resolveScopedRoot(cwd, '.codex', scope);
}

export function resolveClaudeRoot(cwd: string, scope?: AdapterScope): string {
	return resolveScopedRoot(cwd, '.claude', scope);
}

export function resolveGeminiRoot(cwd: string, scope?: AdapterScope): string {
	return resolveScopedRoot(cwd, '.gemini', scope);
}
