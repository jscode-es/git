import { confirm, intro, isCancel, multiselect, outro, select, text } from '@clack/prompts'
import { useTry } from './utils/useTry'

import { getChangedFiles } from './git/getChangedFiles'
import { getStagedFiles } from './git/getStagedFiles'

import { COMMIT_TYPES } from './data/commit_types'
import { gitAdd } from './git/gitAdd'
import { gitCommit } from './git/gitCommit'
import { useExist } from './utils/useExit'

intro('🚀 Asistente para la creación de commits')

const [changedFiles, errorChangedFiles] = await useTry(getChangedFiles())
const [stagedFiles, errorStagedFiles] = await useTry(getStagedFiles())

type PropsOptionsValues = {
	value: string
	label: string
	hint?: string
}

if (errorChangedFiles ?? errorStagedFiles) {
	outro('❌ Error: Comprueba que estás en un repositorio de git')
	process.exit(1)
}

// Selecionar archivos para el commit
if (stagedFiles.length === 0 && changedFiles.length > 0) {
	const files = await multiselect({
		message: 'Selecciona los ficheros que quieres añadir al commit:',
		options: changedFiles.map((file) => ({
			value: file,
			label: file
		})) as PropsOptionsValues[]
	})

	if (isCancel(files)) useExist()

	await gitAdd(files as unknown[])
}

const commitType = (await select({
	message: 'Selecciona el tipo de commit:',
	options: Object.entries(COMMIT_TYPES).map(([key, value]) => ({
		value: key,
		label: `${value.emoji} ${key.padEnd(10, ' ')} · ${value.description}`
	}))
})) as string

if (isCancel(commitType)) useExist()

const commitMessage = (await text({
	message: 'Introduce el mensaje del commit:',
	validate: (value) => {
		if (value.length === 0) {
			return 'El mensaje no puede estar vacío'
		}

		if (value.length > 50) {
			return 'El mensaje no puede tener más de 100 caracteres'
		}
	}
})) as string

if (isCancel(commitMessage)) useExist()

const { emoji, release } = COMMIT_TYPES[commitType]

let breakingChange: boolean | symbol = false

if (release) {
	breakingChange = await confirm({
		initialValue: false,
		message: ''
	})

	if (isCancel(breakingChange)) useExist()
}

let commit = `${emoji} ${commitType}: ${commitMessage}`

commit = breakingChange ? `${commit} [breaking change]` : commit

const shouldContinue = await confirm({
	initialValue: true,
	message: `
	¿Quieres crear el commit con el siguiente mensaje?

  	${commit}

  	¿Confirmas?`
})

if (!shouldContinue) {
	outro('No se ha creado el commit')
	process.exit(0)
}

await gitCommit(commit)

outro('✔️ Commit creado con éxito. ¡Gracias por usar el asistente!')
