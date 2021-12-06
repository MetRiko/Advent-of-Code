import fs from 'fs'

// Utils
const range = size => ([...Array(size).keys()])

const input = fs.readFileSync('input.txt', 'utf8').trim().split(',').map(v => +v)

const timers = input.reduce((arr, t) => (++arr[t], arr), Array(9).fill(0))

const step = timers => {
	const newFishes = timers[0]
	for (let i = 0; i < 9; ++i) timers[i] = timers[i + 1]
	timers[8] = newFishes
	timers[6] += newFishes
}

const task_1 = () => {
	 range(80).forEach(day => step(timers))
	 const fishesCount = Object.values(timers).reduce((sum, c) => sum += c, 0)
	 console.log(fishesCount)
}

const task_2 = () => {
	 range(256).forEach(day => step(timers))
	 const fishesCount = Object.values(timers).reduce((sum, c) => sum += c, 0)
	 console.log(fishesCount)
}

// task_1()
task_2()

