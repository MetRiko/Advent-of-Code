import {promises as fs} from 'fs'

// Utils
const range = size => ([...Array(size).keys()])
const countAll = arr => arr.reduce((obj, el) => (obj[el] == null ? obj[el] = 1 : ++obj[el], obj), {})

const readInput = async filename => (await fs.readFile(filename, 'utf8')).trim().split(/\r?\n/)

const countPerCol = input => range(input[0].length).map(b => countAll(input.map(row => row[b])))

const task_1 = async () => {
	const input = await readInput("input.txt")
	const most = parseInt(countPerCol(input).reduce((num, pair) => num += '01'[+(pair['1'] > pair['0'])], ''), 2)
	const mult = (2 ** input[0].length - 1 - most) * most
	console.log(mult)
}

const task_2 = async () => {
	const input = await readInput("input.txt")

	const [most, least] = [true, false].map(c => range(input[0].length).reduce((left, b) => 
		left.length == 1 ? left : (common => left.filter(row => row[b] == '01'[+(common[b]['1'] < common[b]['0'] ^ c)]))(countPerCol(left)), input))

	const mult = parseInt(most, 2) * parseInt(least, 2)
	console.log(mult)
}

task_1()
task_2()
