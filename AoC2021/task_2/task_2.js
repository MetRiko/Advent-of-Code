import {promises as fs} from 'fs'

// Utils
const range = size => ([...Array(size).keys()])
Array.prototype.do = function(fun) { return fun(this) }

const readInput = async (filename) => (await fs.readFile(filename, 'utf8')).trim().split('\n').map(line => line.split(' ').do(([command, value]) => ({command, value: parseInt(value)})))

const task_1 = async () => {
	const input = await readInput("input.txt")
	let horiz = 0, depth = 0
	const funcs = {
		'up': value => depth -= value,
		'down': value => depth += value,
		'forward': value => horiz += value
	}	
	input.forEach(line => funcs[line.command](line.value))
	console.log(horiz * depth)
}

const task_2 = async () => {
	const input = await readInput("input.txt")
	let horiz = 0, depth = 0, aim = 0
	const funcs = {
		'up': value => aim -= value,
		'down': value => aim += value,
		'forward': value => {horiz += value; depth += aim * value;}
	}
	input.forEach(line => funcs[line.command](line.value))
	console.log(horiz * depth)
}

task_1()
task_2()