export function cleanStdout(stdout: string) {
	return stdout.trim().split('\n').filter(Boolean)
}
