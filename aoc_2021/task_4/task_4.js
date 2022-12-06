import fs from 'fs'

// Utils
const range = size => ([...Array(size).keys()])
Array.prototype.do = function(fun) { return fun(this) }
const int = v => Math.floor(v)

const readInput = filename => fs.readFileSync(filename, 'utf8').trim().split(/\s+/).do(([numbers, ...board]) => [numbers.split(',').map(Number), board.map(Number)])

const checkWin = (idx, board) => {
	const firstIdx = int(idx / 25) * 25
	const localIdx = idx - firstIdx 
	const startX = firstIdx + int(localIdx / 5) * 5
	const startY = firstIdx + localIdx % 5
	
	if (range(5).map(i => board[startX + i] === -1).every(v => v)) return true
	if (range(5).map(i => board[startY + i * 5] === -1).every(v => v)) return true
	return false
}

const findWin = (numbers, board, numToIdx, findLast = false) => {
	let boardsLeft = range(int(board.length / 25))
	for (const num of numbers) {
		for (const idx of numToIdx[num]) {
			board[idx] = -1
			if (checkWin(idx, board)) {
				const winBoardIdx = int(idx / 25)
				boardsLeft = boardsLeft.filter(boardIdx => boardIdx != winBoardIdx)
				if (boardsLeft.length == 0 || !findLast) return {winNum: num, winBoardIdx}
			} 
		}
	}
}

const task = untilLast => {
	const [numbers, board] = readInput("input.txt")
	const numToIdx = board.reduce((acc, n, i) => (acc[n] = acc[n] ? [...acc[n], i] : [i], acc), {})
	const {winNum, winBoardIdx} = findWin(numbers, board, numToIdx, untilLast)
	const boardSum = range(25).map(i => board[i + winBoardIdx * 25]).reduce((sum, v) => sum += v != -1 ? v : 0, 0)
	const score = winNum * boardSum
	console.log(score)
}

const task_1 = () => task(false)
const task_2 = () => task(true)

task_1()
task_2()


