import fs from 'fs'

// Utils

const input = fs.readFileSync('input.txt', 'utf8').trim().split(/\r?\n/).map(line => line.split('').map(v => +v))

const coords = [
	[0, -1], [0, 1], [-1, 0], [1, 0]
]

const getNeighbours = (x, y) => coords.map(([dx, dy]) => input?.[y + dy]?.[x + dx] == null ? null : [x + dx, y + dy]).filter(x => x != null)

const getLowPoints = () => {
	const lowPoints = []
	for (let y = 0; y < input.length; ++y) {
		for (let x = 0; x < input[y].length; ++x) {
			const height = input[y][x]
			const isLowPoint = getNeighbours(x, y).every(([nx, ny]) => input[ny][nx] > height)
			if (isLowPoint) lowPoints.push([x, y, height])
		}
	}
	return lowPoints
}

const task_1 = () => {
	const lowPoints = []
	for (let y = 0; y < input.length; ++y) {
		for (let x = 0; x < input[y].length; ++x) {
			const height = input[y][x]
			const isLowPoint = getNeighbours(x, y).every(([nx, ny]) => input[ny][nx] > height)
			if (isLowPoint) lowPoints.push([x, y, height])
		}
	}
	
	const totalRiskLevel = lowPoints.reduce((sum, point) => sum + point[2] + 1, 0) 
	console.log(totalRiskLevel)
}

const task_2 = () => {
	const hash = (x, y) => y * 1000000 + x

	const cells = {}
	let currPool = 1

	const calculatePool = (cells, x, y, poolId) => {
		cells[hash(x, y)] = {x, y, poolId}
		getNeighbours(x, y)
			.filter(([nx, ny]) => cells[hash(nx, ny)] == null && input[ny][nx] < 9)
			.forEach(([nx, ny]) => calculatePool(cells, nx, ny, poolId))
	}

	const lowPoints = getLowPoints()
	for (const [x, y] of lowPoints) {
		const hashCell = hash(x, y)
		if (cells[hashCell] == null) {
			calculatePool(cells, x, y, currPool)
			++currPool
		}
	}

	// console.log(cells)

	const pools = Object.values(cells).reduce((pools, cell) => (pools[cell.poolId] ? pools[cell.poolId].push(cell) : pools[cell.poolId] = [cell], pools), {})
	const biggest3Pools = Object.values(pools).sort((poolA, poolB) => poolB.length - poolA.length).filter((_, i) => i < 3)

	const answer = biggest3Pools.reduce((sum, pool) => sum * pool.length, 1)

	// console.log(biggest3Pools)
	console.log(answer)
}

// task_1()
task_2()

// const lowPoints = input.reduce((sum, line, y) => sum + line.reduce((sum, v, x) => coords.every(([dx, dy]) => input[y + dy][x + dx] > input[y][x]), []))

// console.log(input)
