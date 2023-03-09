import { cleanStdout } from '../utils/ueCleanStringOut'
import { useExecAsync } from '../utils/useExecAsync'

export async function gitAdd(files = [] as unknown[]) {
	const filesLine = files.join(' ')
	const { stdout } = await useExecAsync(`git add ${filesLine}`)
	return cleanStdout(stdout)
}
