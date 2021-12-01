import {promises as fs} from 'fs'

const range = size => ([...Array(size).keys()])
const readInput = async (filename) => (await fs.readFile(filename, 'utf8')).trim().split('\n').map(txt => parseInt(txt))

const task_1 = async () => {
	const input = await readInput("input.txt")
	const increasesCount = range(input.length - 1).reduce((acc, i) => acc += input[i + 1] > input[i], 0)
	console.log(increasesCount)
}

const task_2 = async () => {
	const input = await readInput("input.txt")
	const increasesCount = range(input.length - 3).reduce((acc, i) => acc += input[i + 3] > input[i], 0)
	console.log(increasesCount)
}

task_1()
task_2()