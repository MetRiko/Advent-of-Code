import fs from 'fs'
import PriorityQueue from './priority_queue.js'
import { range, hash, dehash } from './utils.js'

const input = Object.assign({}, ...fs.readFileSync('input.txt', 'utf8').split(/\r?\n/).map((line, y) => line.split('').reduce((map, char, x) => (map[hash(x, y)] = +char, map), {})))

const task = grid => {

	const getNeighboursCoords = (x, y) => [[0, -1], [-1, 0], [0, 1], [1, 0]].map(([dx, dy]) => [x + dx, y + dy]).filter(([x, y]) => grid[hash(x, y)] != null)
	
	const visited = {}	
	let queue = new PriorityQueue((a, b) => a.totalRisk <= b.totalRisk)
	queue.push({x: 0, y: 0, totalRisk: 0, prevHash: null})

	while (queue.size() > 0) {
		const el = queue.pop()
		const hashEl = hash(el.x, el.y)
		if (visited[hashEl] == null || visited[hashEl].totalRisk > el.totalRisk) visited[hashEl] = el
		else continue
		const neighbourEls = getNeighboursCoords(el.x, el.y).map(([x, y]) => ({x, y, prevHash: hashEl, totalRisk: el.totalRisk + grid[hash(x, y)]}))
		queue.push(...neighbourEls)
	}

	console.log(visited[Math.max(Object.keys(grid))].totalRisk)
}

const task_1 = () => {
	task(input)
}

const task_2 = () => {

	const grid = {}
	const [width, height] = dehash(Math.max(Object.keys(input))).do(([x, y]) => [x + 1, y + 1])

	for (const [cellHash, riskLevel] of Object.entries(input)) {
		const [x, y] = dehash(cellHash)
		range(5).forEach(tx => range(5).forEach(ty => grid[hash(width * tx + x, height * ty + y)] = (tx + ty + riskLevel - 1) % 9 + 1))
	}

	task(grid)
}

task_1()
task_2()