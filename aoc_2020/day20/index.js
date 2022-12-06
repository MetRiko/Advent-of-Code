const fs = require('fs');

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
	const left = tile.reduceRight((edge, row) => edge + row[0], '')
	const right = tile.reduce((edge, row) => edge + row[9], '')
	const top = tile[0]
	const down = tile[9].split('').reverse().join('')
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

// console.log(`\nTile ${tileId}`)
// console.log(tiles[tileId].join('\n'))

const printTile = tile => {
	console.log()
	console.log(tile.join('\n'))
}

const rotateTileOnce = tile => {

	let newTile = new Array(tile.length)
	for (let i = 0; i < tile.length; ++i) newTile[i] = new Array(tile[i].length)

	for (let y = 0; y < newTile.length; ++y) {
		for (let x = 0; x < newTile[y].length; ++x) {
			newTile[y][x] = tile[newTile[y].length - x - 1][y]
		}
	}
	newTile = newTile.map(row => row.join(''))
	return newTile
}

const rotrateTile = (tile, n) => {
	for (let i = 0; i < n; ++i) {
		tile = rotateTileOnce(tile)
	}
	return tile
}

const flipTileH = tile => {

	let newTile = new Array(10)
	for (let i = 0; i < 10; ++i) newTile[i] = new Array(10)

	for (let y = 0; y < 10; ++y) {
		for (let x = 0; x < 10; ++x) {
			newTile[y][x] = tile[y][9 - x]
		}
	}
	newTile = newTile.map(row => row.join(''))
	return newTile
}

const flipTileV = tile => {

	let newTile = new Array(10)
	for (let i = 0; i < 10; ++i) newTile[i] = new Array(10)

	for (let y = 0; y < 10; ++y) {
		for (let x = 0; x < 10; ++x) {
			newTile[y][x] = tile[9 - y][x]
		}
	}
	newTile = newTile.map(row => row.join(''))
	return newTile
}

const getEdge = (tile, id) => {
	if (id === 0) return tile.reduceRight((edge, row) => edge + row[0], '')
	else if (id === 1) return tile[0]
	else if (id === 2) return tile.reduce((edge, row) => edge + row[9], '')
	else if (id === 3) return tile[9].split('').reverse().join('')
	return null
}

const createImage = (edges) => {

	const image = new Array(30)
	for (let i = 0; i < 30; ++i) image[i] = new Array(30).fill(undefined)

	let leftTiles = new Array(edges.length - 1).fill(0).map((_, i) => i + 1)

	image[14][14] = 0
	const [l, t, r, b] = edges[0]
	let queuedEdges = [
		{ target: [13, 14], edge: l, side: 2 },
		{ target: [14, 13], edge: t, side: 3 },
		{ target: [15, 14], edge: r, side: 0 },
		{ target: [14, 15], edge: b, side: 1 }
	]

	const isQueuedEdge = target => queuedEdges.some(({ target: t }) => t[0] === target[0] && t[1] === target[1])

	const queueEdge = (target, edge, side) => {
		if (!isQueuedEdge(target) && image[target[1]][target[0]] === undefined) queuedEdges.push({ target, edge, side })
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

	// printTile(0)
	// printTile(22)
	// printTile(101)

	const tlCorner = [14, 14]
	const brCorner = [14, 14]

	for (let e = 0; e < queuedEdges.length; ++e) {
		// for (let e = 0; e < 70; ++e) {

		const { target, edge, side } = queuedEdges[e]
		const tileId = findSecondEdge(edge)

		// console.log()
		// console.log(target, edge, side, tileId)

		if (tileId === null) continue

		queuedEdges[e].found = true

		image[target[1]][target[0]] = tileId
		leftTiles = leftTiles.filter(id => id !== tileId)

		if (target[0] < tlCorner[0]) tlCorner[0] = target[0]
		else if (target[0] > brCorner[0]) brCorner[0] = target[0]
		if (target[1] < tlCorner[1]) tlCorner[1] = target[1]
		else if (target[1] > brCorner[1]) brCorner[1] = target[1]

		for (let r = 0; r < 4; ++r) {
			const tileEdge = getEdge(tiles[tileId], side)
			if (compareNormalEdge(edge, tileEdge)) {
				tiles[tileId] = side % 2 === 1 ? flipTileH(tiles[tileId]) : flipTileV(tiles[tileId])
				break
			}
			else if (compareFlippedEdge(edge, tileEdge)) {
				break
			}
			tiles[tileId] = rotateTileOnce(tiles[tileId])
		}

		// printTile(tileId)

		for (let o = 0; o < 4; ++o) {
			const newTarget = [target[0] + offsets[o][0], target[1] + offsets[o][1]]
			const newSide = (o + 2) % 4
			const newEdge = getEdge(tiles[tileId], o)
			queueEdge(newTarget, newEdge, newSide)
		}
	}

	// for (let i = 0; i < queuedEdges.length; ++i) {
	// 	const { target, found } = queuedEdges[i]
	// 	if (!image[target[1]][target[0]]) {
	// 		if (found) {
	// 			image[target[1]][target[0]] = 'x'
	// 		}
	// 		else {
	// 			image[target[1]][target[0]] = 'o'
	// 		}
	// 	}
	// }

	const printImage = image => {
		for (let i = 0; i < image.length; ++i) {
			// console.log(image[i].map(id => id.toString().padStart(4, ' ')).join(''))
			console.log(image[i].map(id => id !== undefined ? id.toString().padStart(4, ' ') : '    ').join(''))
		}
	}

	// printImage(image)

	const croppedImage = image.filter((row, y) => row.filter((cell, x) => cell).length > 0).map((row, y) => row.filter((cell, x) => cell !== undefined))
	printImage(croppedImage)

	return croppedImage

}

const mergeTiles = image => {

	let pixels = new Array(image.length * 10).fill(null)
	for (let i = 0; i < pixels.length; ++i)
		pixels[i] = new Array(image[0].length * 10).fill(null)

	let px = 0
	let py = 0

	for (let y = 0; y < pixels.length; ++y) {
		px = 0

		const pixelY = y % 10
		if (pixelY === 0 || pixelY === 9) continue
		if (py >= image.length * (10 - 2)) break

		for (let x = 0; x < pixels[y].length; ++x) {

			const tileX = Math.floor(x / 10)
			const tileY = Math.floor(y / 10)

			const tileId = image[tileY][tileX]

			const pixelX = x % 10
			if (pixelX === 0 || pixelX === 9) continue

			// pixels[py][px] = tileX//tiles[tileId][pixelY][pixelX]
			// pixels[py][px] = tileY//tiles[tileId][pixelY][pixelX]
			pixels[py][px] = tiles[tileId][pixelY][pixelX]
			++px
		}
		pixels[py] = pixels[py].join('')
		// pixels[py] = pixels[py].filter(v => v !== null)
		++py
	}

	pixels = pixels.filter(row => row[0] !== null)

	// pixels = pixels.

	return pixels

}

const findPatterns = (pixels, pattern) => {

	// console.log(pattern)

	const findPattern = (sx, sy) => {
		for (let y = 0; y < pattern.length; ++y) {
			for (let x = 0; x < pattern[y].length; ++x) {
				const sign = pattern[y][x]
				if (sign === ' ') continue
				if (sign == '#' && pixels?.[sy + y]?.[sx + x] != '#') return false
				// let row = pixels[sy + y].split('')
				// row[sx + x] = '@'
				// pixels[sy + y] = row.join('')

			}
		}
		return true
	}

	let counter = 0
	for (let y = 0; y < pixels.length; ++y) {
		for (let x = 0; x < pixels[y].length; ++x) {

			counter += findPattern(x, y) ? 1 : 0

		}
	}

	console.log(counter)
	return counter

}

const countHashes = (pixels) => {
	let counter = 0
	for (let y = 0; y < pixels.length; ++y) {
		for (let x = 0; x < pixels[y].length; ++x) {
			counter += pixels[y][x] === '#' ? 1 : 0
		}
	}
	return counter
}

let pattern =
	`                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `.split('\n').map(row => row.split(''))

// tiles[0] = rotrateTile(tiles[0], 1)

const image = createImage(edges)
let pixels = mergeTiles(image)

// console.log(pixels.join('\n'))

let monsers = 0
findPatterns(pixels, pattern)
// console.log(pixels.join('\n'))

pixels = rotateTileOnce(pixels)
findPatterns(pixels, pattern)
// console.log(pixels.join('\n'))

pixels = rotateTileOnce(pixels)
monsters = findPatterns(pixels, pattern)
// console.log(pixels.join('\n'))

pixels = rotateTileOnce(pixels)
findPatterns(pixels, pattern)
// console.log(pixels.join('\n'))

const hashes = countHashes(pixels)
const answer2 = hashes - monsters * 15

console.log("Part 2 - Water roughness:", answer2)