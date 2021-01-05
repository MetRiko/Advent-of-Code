const fs = require('fs')

// const rawdata = fs.readFileSync('input.txt').toString().split('\n')
// rawdata.pop()

// 2-7 p: pbhhzpmppb

// const data = rawdata.map(str => str.split(/[- :]+/g).map((v,i) => i < 2 ? parseInt(v) : v))

let data = fs.readFileSync('input.txt').toString().split('\n').map(row => [...row])
data.pop()

// console.log(data[0].length)

const size = {x: data[0].length, y: data.length}
const deltas = [
	{dx: 1, dy: 1},
	{dx: 3, dy: 1},
	{dx: 5, dy: 1},
	{dx: 7, dy: 1},
	{dx: 1, dy: 2},
]

const move = ({x, y}, {dx, dy}) => ({x: (x + dx)%size.x, y: (y + dy)})

// let delta = {dx: 3, dy: 1}

const countTrees = (delta) => {
	let trees = 0
	let pos = {x: 0, y: 0}
	while (pos.y < size.y) {
		if (data[pos.y][pos.x] === '#') trees += 1; 
		pos = move(pos, delta)
	}
	return trees
}

const allTrees = deltas.map(delta => countTrees(delta)).reduce((acc, trees) => acc *= trees, 1)
const allTrees2 = deltas.map(delta => countTrees(delta))
// console.log(countTrees(deltas[1]))
console.log(allTrees2)
console.log(allTrees)


// console.log(data.map(row => row.join('')))