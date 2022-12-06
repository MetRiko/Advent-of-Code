const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const fs = require('fs');
const { networkInterfaces } = require('os');
const { off } = require('process');

const testData = `
Tile 3253:
###....#..
.#..##....
##.#.#.#.#
#.#.......
#....#...#
#.##...#..
....#.....
##.##.#..#
.###...##.
##.#...##.

Tile 2843:
...#.#.#..
##.....#.#
..#...#...
#.##.##...
#......###
#..#.#.###
........##
#.....##..
........#.
..##..###.
`

// const tiles = fs.readFileSync('input.txt').toString().trim().match(/.*?(?<=\n\n?)/s)
const data = fs.readFileSync('input.txt').toString()
// const data = fs.readFileSync('test_input.txt').toString()
// const data = testData

const tiles = data.trim().match(/[#.][\.#\n]+(?=\n\n|$)/gs).map(tile => tile.split('\n'))
const idx = data.trim().match(/\d+/gm)

const edges = tiles.map(tile => {
	const left = tile.reduce((edge, row) => edge + row[0], '')
	const right = tile.reduce((edge, row) => edge + row[9], '')
	const top = tile[0]
	const down = tile[9]
	return [left, top, right, down]
})

const compareNormalEdge = (e1, e2) => {
	for (let i = 0; i < 10; ++i) if (e1[i] !== e2[i]) return false
	return true
}

const compareFlippedEdge = (e1, e2) => {
	for (let i = 0; i < 10; ++i) if (e1[i] !== e2[9 - i]) return false
	return true
}

const compareEdge = (e1, e2) => {
	return compareNormalEdge(e1, e2) || compareFlippedEdge(e1, e2)
}

const compareEdges = (ltrd1, ltrd2) => {
	let count = 0
	for (let i = 0; i < 4; ++i) {
		for (let j = 0; j < 4; ++j) {
			if (compareEdge(ltrd1[i], ltrd2[j])) {
				if (ltrd2[j] === '..#.#..#..') {
					console.log(ltrd1[i], ltrd2[j])
				}
				// console.log(ltrd1[i], ltrd2[j])
				++count
				if (count >= 4) return count
			}
		}
	}
	return count
}

const findCorners = edges => {

	const corners = []

	for (let i = 0; i < edges.length; ++i) {
		// console.log(edges[i])
		let count = 0
		for (let j = 0; j < edges.length; ++j) {
			if (i !== j) {
				count += compareEdges(edges[i], edges[j])
			}
		}
		if (count === 2) corners.push(i)
		if (count === 2) console.log(count)
	}

	return corners
}

// const corners = findCorners(edges)

// const answer = corners.reduce((acc, id) => acc *= BigInt(idx[id]), BigInt(1))
// console.log('Part 1 - corners:', answer)

// console.log(tiles.length, 12 * 12)


const createImage = (edges) => {

	const image = new Array(30)
	for (let i = 0; i < 30; ++i) image[i] = new Array(30).fill(undefined)

	let leftTiles = new Array(edges.length - 1).fill(0).map((_, i) => i + 1)

	image[14][14] = 0
	const [l, t, r, b] = edges[0]
	let queuedEdges = [
		{ target: [13, 14], edge: l, src: 'r' },
		{ target: [14, 13], edge: t, src: 'b' },
		{ target: [15, 14], edge: r, src: 'l' },
		{ target: [14, 15], edge: b, src: 't' }
	]

	const isQueuedEdge = target => queuedEdges.some(({ target: t }) => t[0] === target[0] && t[1] === target[1])

	const queueEdge = (target, edge, src) => {
		if (!isQueuedEdge(target) && image[target[1]][target[0]] === undefined) queuedEdges.push({ target, edge, src })
	}

	const compareEdgeToEdges = (edge, edges) => {
		for (let i = 0; i < 4; ++i) {
			if (compareEdge(edge, edges[i])) return true
		}
		return false
	}

	const findSecondEdge = edge => {
		for (let i = 0; i < leftTiles.length; ++i) {
			const tileId = leftTiles[i]
			if (compareEdgeToEdges(edge, edges[tileId])) return tileId
		}
		return null
	}

	const offsets = [
		[-1, 0],
		[0, -1],
		[1, 0],
		[0, 1]
	]

	// console.log(findSecondEdge('..#.#..#..'))

	const printTile = tileId => {
		console.log(`\nTile ${tileId}`)
		console.log(tiles[tileId].join('\n'))
	}

	printTile(0)
	printTile(22)
	// printTile(101)

	// for (let e = 0; e < queuedEdges.length; ++e) {
	for (let e = 0; e < 3; ++e) {

		const { target, edge, src } = queuedEdges[e]
		const tileIdx = findSecondEdge(edge)

		console.log()
		console.log(target, edge, src, tileIdx)


		if (tileIdx === null) continue

		const tileId = tileIdx

		queuedEdges[e].found = true

		image[target[1]][target[0]] = tileId
		leftTiles = leftTiles.filter(id => id !== tileId)

		if (tileId === 133) {
			console.log(tileId, target)
		}

		let rotation = 0
		let flipped = null

		const [l, t, r, b] = edges[tileId]

		if (compareNormalEdge(edge, l)) {
			if (src === 'l') { rotation = 0; flipped = null }
			else if (src === 't') { rotation = 1; flipped = 'h' }
			else if (src === 'r') { rotation = 0; flipped = 'h' }
			else if (src === 'b') { rotation = 3; flipped = null }
		}
		else if (compareFlippedEdge(edge, l)) {
			if (src === 'l') { rotation = 0; flipped = 'v' }
			else if (src === 't') { rotation = 1; flipped = null }
			else if (src === 'r') { rotation = 2; flipped = null }
			else if (src === 'b') { rotation = 3; flipped = 'h' }
		}
		else if (compareNormalEdge(edge, t)) {
			if (src === 't') { rotation = 0; flipped = null }
			else if (src === 'r') { rotation = 1; flipped = 'v' }
			else if (src === 'b') { rotation = 0; flipped = 'v' }
			else if (src === 'l') { rotation = 3; flipped = null }
		}
		else if (compareFlippedEdge(edge, t)) {
			if (src === 't') { rotation = 0; flipped = 'h' }
			else if (src === 'r') { rotation = 1; flipped = null }
			else if (src === 'b') { rotation = 2; flipped = null }
			else if (src === 'l') { rotation = 3; flipped = 'v' }
		}
		else if (compareNormalEdge(edge, r)) {
			if (src === 'r') { rotation = 0; flipped = null }
			else if (src === 'b') { rotation = 1; flipped = 'h' }
			else if (src === 'l') { rotation = 0; flipped = 'h' }
			else if (src === 't') { rotation = 3; flipped = null }
		}
		else if (compareFlippedEdge(edge, r)) {
			if (src === 'r') { rotation = 0; flipped = 'v' }
			else if (src === 'b') { rotation = 1; flipped = null }
			else if (src === 'l') { rotation = 2; flipped = null }
			else if (src === 't') { rotation = 3; flipped = 'h' }
		}
		else if (compareNormalEdge(edge, b)) {
			if (src === 'b') { rotation = 0; flipped = null }
			else if (src === 'l') { rotation = 1; flipped = 'v' }
			else if (src === 't') { rotation = 0; flipped = 'v' }
			else if (src === 'r') { rotation = 3; flipped = null }
		}
		else if (compareFlippedEdge(edge, b)) {
			if (src === 'b') { rotation = 0; flipped = 'h' }
			else if (src === 'l') { rotation = 1; flipped = null }
			else if (src === 't') { rotation = 2; flipped = null }
			else if (src === 'r') { rotation = 3; flipped = 'v' }
		}

		// let offsets = []
		let edgesOrder = [0, 1, 2, 3]
		let srcs = ['l', 't', 'r', 'b']
		if (flipped === 'h') {
			// offsets = [[1, 0], [0, -1], [-1, 0], [0, 1]]
			// dirs = ['r', 't', 'l', 'b']
			edgesOrder = [2, 1, 0, 3]
		}
		else if (flipped === 'v') {
			// offsets = [[-1, 0], [0, 1], [1, 0], [0, -1]]
			// dirs = ['l', 'b', 'r', 't']
			edgesOrder = [0, 3, 2, 1]
		}
		edgesOrder = edgesOrder.map(o => (o + rotation + 2) % 4)

		console.log(rotation, flipped)
		console.log(offsets, srcs)
		console.log(edgesOrder)


		for (let o = 0; o < 4; ++o) {
			const newTarget = [target[0] + offsets[o][0], target[1] + offsets[o][1]]
			let newEdge = edges[tileId][edgesOrder[o]]
			const newSrc = srcs[(o + 2) % 4]
			// const rotationOffset = (rotation + o) % 4
			const rotationOffset = (edgesOrder[o] + o) % 4
			// const rotationOffset = rotation

			if (flipped === null) {
				if (edgesOrder[o] === 1 || o === 2)
			}
			else if (flipped === 'h') {

			}
			else if (flipped === 'v') {

			}


			// if (rotationOffset === 2 || (rotationOffset === 1 && !flipped) || (rotationOffset === 3 && !flipped)) {
			if (rotationOffset === 1 || rotationOffset === 2) {
				newEdge = newEdge.split('').reverse().join('')
			}
			console.log(o, newTarget, newEdge, newSrc)

			queueEdge(newTarget, newEdge, newSrc)
			// console.log(o, newTarget, newEdge, newSrc)
			// queueEdge([target[0] + offsets[o][0], target[1] + offsets[o][1]], edges[tileId][o])
			// queueEdge([target[0] + offsets[o][0], target[1] + offsets[o][1]], edges[tileId][(rotation + o + 2) % 4], dirs[(rotation + o + 2) % 4])
			// if (tileId === 133) {
			// 	console.log([target[0] + offsets[o][0], target[1] + offsets[o][1]])
			// }
			// queuedEdges.push({ target: [target[0] + offsets[o][0], target[1] + offsets[o][1]], edge: edges[tileId][o] })
		}
		// break
		// break

		// console.log(queuedEdges.length - e)
		// console.log(leftTiles.length)

	}

	for (let i = 0; i < queuedEdges.length; ++i) {
		const { target, found } = queuedEdges[i]
		if (!image[target[1]][target[0]]) {
			if (found) {
				image[target[1]][target[0]] = 'x'
			}
			else {
				image[target[1]][target[0]] = 'o'
			}
		}
	}

	for (let i = 0; i < image.length; ++i) {
		// console.log(image[i].map(id => id.toString().padStart(4, ' ')).join(''))
		console.log(image[i].map(id => id !== undefined ? id.toString().padStart(4, ' ') : '    ').join(''))
	}

}

createImage(edges)