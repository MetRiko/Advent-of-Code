import fs from 'fs'

// Utils

const input = fs.readFileSync('input.txt', 'utf8').trim().split(/\r?\n/).map(line => line.split('').map(v => +v))

const coords = [
	[0, -1], [0, 1], [-1, 0], [1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]
]

const getNeighbours = (x, y) => coords.map(([dx, dy]) => ([x + dx, y + dy])).filter(([nx, ny]) => input?.[ny]?.[nx] != null)

const step = () => {
	const height = input.length
	const width = input[0].length
	let flashes = 0
	let flashed = []

	for (let y = 0; y < height; ++y) {
		for (let x = 0; x < width; ++x) {
			if (input[y][x] == 9) flashed.push([x, y])
			else input[y][x] += 1
		}
	}
		
	while (flashed.length > 0) {
		const newFlashed = []
		for (const [x, y] of flashed) {
			input[y][x] += 1
			if (input[y][x] == 10) {
				newFlashed.push(...getNeighbours(x, y))
			}
		}
		flashed = newFlashed
	}
	

	for (let y = 0; y < height; ++y) {
		for (let x = 0; x < width; ++x) {
			if (input[y][x] > 9) {
				input[y][x] = 0
				flashes += 1
			}
		}
	}

	return flashes
}

const task_1 = () => {
	const flashes = [...Array(100).keys()].reduce((sum, i) => sum + step(), 0)
	console.log(flashes)
}

const task_2 = () => {
	let n = 0
	const cellsAmount = input.length * input[0].length
	while (true) {
		++n
		const flashes = step()
		if (flashes == cellsAmount) {
			console.log(n)
			return
		}
	}
}

// task_1()
task_2()