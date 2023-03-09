import { cleanStdout } from '../utils/ueCleanStringOut'
import { useExecAsync } from '../utils/useExecAsync'

export async function gitCommit(commit: string) {
	if (!commit.length) throw 'Required commit'
	const { stdout } = await useExecAsync(`git commit -m "${commit}"`)
	return cleanStdout(stdout)
}
