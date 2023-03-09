import { cleanStdout } from '../utils/ueCleanStringOut'
import { useExecAsync } from '../utils/useExecAsync'

export async function getChangedFiles() {
	const { stdout } = await useExecAsync('git status --porcelain')
	return cleanStdout(stdout).map((line) => line.split(' ').at(-1))
}
