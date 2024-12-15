export function dedup<T>(arr: T[]) {
	return [...new Set(arr)];
}
