import fs from 'fs'

// Utils
const range = size => ([...Array(size).keys()])
Array.prototype.do = function(fun) { return fun(this) }

const hash = (x, y) => y * 100000 + x

const input = fs.readFileSync('input.txt', 'utf8').split(/\r?\n\r?\n/).do(([points, folds]) => ({
	points: Object.assign({}, ...[...points.matchAll(/(\w+),(\w+)/gm)].map(([_, x, y]) => ([+x, +y])).map(([x, y]) => ({[hash(x, y)]: {x, y}}))),
	folds: [...folds.matchAll(/fold along (\w)=([0-9]+)/gm)].map(([_, axis, val]) => ({axis, val: +val}))
}))

// console.log(input)

const foldOnce = (points, axis, foldVal) => {
	for (const {x, y} of Object.values(points)) {
		let newPoint = axis == 'x' && x > foldVal ? {x: foldVal * 2 - x, y} : (axis == 'y' && y > foldVal ? {y: foldVal * 2 - y, x} : null)
		if (newPoint) {
			delete points[hash(x, y)]
			points[hash(newPoint.x, newPoint.y)] = newPoint
		}
	}
}

const printPaper = points => {
	const width = Math.max(...Object.values(points).map(({x, y}) => x)) + 1
	const height = Math.max(...Object.values(points).map(({x, y}) => y)) + 1

	for (let y = 0; y < height; ++y) {
		let line = []
		for (let x = 0; x < width; ++x) {
			line.push(points.hasOwnProperty(hash(x, y)) ? '#' : '.')
		}
		console.log(...line)
	}

}

const task_1 = () => {
	foldOnce(input.points, input.folds[0].axis, input.folds[0].val)
	console.log(Object.values(input.points).length)
}

const task_2 = () => {
	for (const fold of input.folds) {
		foldOnce(input.points, fold.axis, fold.val)
	}
	printPaper(input.points)
}

// task_1()
task_2()
