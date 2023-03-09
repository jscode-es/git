import { cleanStdout } from '../utils/ueCleanStringOut'
import { useExecAsync } from '../utils/useExecAsync'

export async function getStagedFiles() {
	const { stdout } = await useExecAsync('git diff --cached --name-only')
	return cleanStdout(stdout)
}
