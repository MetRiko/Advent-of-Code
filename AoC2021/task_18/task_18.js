import fs from 'fs'
import { range } from './utils.js'

const isNumber = val => typeof(val) === 'number'
const isObject = val => typeof(val) === 'object'

const createNode = prev => ({prev, data: [null, null], nextFreeIdx: 0, idx: -1})

const addElement = (node, nodeOrValue, idx = -1) => {
	if (idx == -1) idx = node.nextFreeIdx++
	node.data[idx] = nodeOrValue
	if (isObject(nodeOrValue)) {
		nodeOrValue.idx = idx
		nodeOrValue.prev = node
	}
}

const parseExpr = line => {
	let root = null
	let curr = null 

	;[...line].forEach(char => {
		if (char == '[') {
			const prev = curr
			curr = createNode(prev)
			if (prev) addElement(prev, curr)
			else root = curr
		}
		else if (char == ']') curr = curr.prev
		else if (char != ',') addElement(curr, +char)
	})

	return root
}

const getNext = (idx, node) => {
	const opIdx = +!idx
	while (node) {
		if (node.idx === opIdx) {
			node = node.prev
			if (isNumber(node.data[idx])) return [node, idx]
			node = node.data[idx]
			while(isObject(node.data[opIdx])) node = node.data[opIdx]
			return [node, opIdx]
		}
		node = node.prev
	}
	return null
}

const explode = node => {
	for (const idx of [0, 1]) getNext(idx, node)?.do(([nextNode, nextIdx]) => nextNode.data[nextIdx] += node.data[idx])
	node.prev.data[node.idx] = 0
}

const split = (node, idx) => {
	const half = node.data[idx] * 0.5
	const newNode = createNode(node)
	addElement(newNode, Math.floor(half))
	addElement(newNode, Math.ceil(half))
	addElement(node, newNode, idx)
}

const globalExplode = root => {
	let exploded = false
	const _tryExplode = (node, level) => {
		if (!exploded && isObject(node)) {
			if (!exploded) _tryExplode(node.data[0], level + 1)
			if (level > 3 && isNumber(node.data[0]) && isNumber(node.data[1])) {
				explode(node)
				exploded = true
			}
			if (!exploded) _tryExplode(node.data[1], level + 1)
		}
	}
	_tryExplode(root, 0)
	return exploded
}

const globalSplit = root => {
	let splitted = false
	const _trySplit = node => {
		if (!splitted && isObject(node)) {
			for (let idx = 0; idx < 2; ++idx) {				
				if (!splitted) _trySplit(node.data[idx])
				if (!splitted && isNumber(node.data[idx]) && node.data[idx] >= 10) {
					split(node, idx)
					splitted = true
				}
			}
		}
	}
	_trySplit(root)
	return splitted
}

const addition = (rootA, rootB) => {
	const newNode = createNode(null)
	addElement(newNode, rootA)
	addElement(newNode, rootB)
	while(globalExplode(newNode) || globalSplit(newNode));
	return newNode
}

const exprToStr = expr => expr.data.do(([l, r]) => `[${isNumber(l) ? l : exprToStr(l)},${isNumber(r) ? r : exprToStr(r)}]`)

const mag = expr => expr.data.do(([l, r]) => (isNumber(l) ? l : mag(l)) * 3 + (isNumber(r) ? r : mag(r)) * 2)

const input = fs.readFileSync('input.txt', 'utf-8').split(/\r?\n/)

const task_1 = () => {
	let expr = parseExpr(input[0])
	for (let i = 1; i < input.length; ++i) {
		expr = addition(expr, parseExpr(input[i]))
	}
	console.log(mag(expr))
}

const task_2 = () => {
	let max = 0
	for (let i = 0; i < input.length; ++i) {
		for (let j = 0; j < input.length; ++j) {
			if (i != j) {
				const m = mag(addition(parseExpr(input[i]), parseExpr(input[j])))
				if (m > max) max = m
			}
		}
	}
	console.log(max)
}

task_1()
task_2()