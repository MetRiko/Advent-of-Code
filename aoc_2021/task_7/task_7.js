import fs from 'fs'

// Utils
const range = size => ([...Array(size).keys()])
const abs = x => Math.abs(x)

const input = fs.readFileSync('input.txt', 'utf8').trim().split(',').map(v => +v)

const groups = Object.entries(input.reduce((group, v) => (group[v] = group[v] ? group[v] + 1 : 1, group), {}))

const trangular = x => x * (x + 1) * 0.5

const calculateFuel = (groups, rowX) => groups.reduce((sum, [x, n]) => sum + n * abs(x - rowX), 0)
const calculateFuelV2 = (groups, rowX) => groups.reduce((sum, [x, n]) => sum + n * trangular(abs(x - rowX)), 0)

const task_1 = () => {
	const minFuel = Math.min(...groups.map(([x, n]) => calculateFuel(groups, x)))
	console.log(minFuel)
}

const task_2 = () => {
	const minFuel = Math.min(...groups.map(([x, n]) => calculateFuelV2(groups, x)))
	console.log(minFuel)
}

task_1()
task_2()