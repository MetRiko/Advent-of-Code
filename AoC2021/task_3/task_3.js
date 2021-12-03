import {promises as fs} from 'fs'

// Utils
const range = size => ([...Array(size).keys()])
Array.prototype.do = function(fun) { return fun(this) }

const readInput = async filename => (await fs.readFile(filename, 'utf8')).trim().split('\n').map(line => line.trim().split('').map(char => char.charCodeAt(0)-48))

const isOneDominant = (bitMatrix, columnIdx) => bitMatrix.reduce((acc, row) => acc += row[columnIdx] * 2 - 1, 0) >= 0
const bitsToNum = bits => bits.reduce((acc, bit, b) => acc += bit * Math.pow(2, bits.length - b - 1), 0)

const task_1 = async () => {
	const input = await readInput("input.txt")
	const bitsCount = input[0].length

	const mostNum = range(bitsCount).map(b => isOneDominant(input, b)).do(bitsToNum)
	const mult = mostNum * (Math.pow(2, bitsCount) - 1 - mostNum)
	console.log(mult)
}

const task_2 = async () => {
	const input = await readInput("input.txt")
	const bitsCount = input[0].length

	const [mostNum, leastNum] = [isOneDominant, (a, b) => !isOneDominant(a, b)]
		.map(checker => range(bitsCount).reduce((left, b) => left.length == 1 ? left : (checked => left.filter(row => row[b] == checked))(checker(left, b)), input)
			.do(arr => bitsToNum(arr[0])))

	const mult = leastNum * mostNum
	console.log(mult)
}

task_1()
task_2()


