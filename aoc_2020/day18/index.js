const fs = require('fs');

const testData = `
2 * 3 + (4 * 5)
5 + (8 * 3 + 9 + 3 * 4 * 3)
5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 
`

const testData2 = `
1 + (2 * 3) + (4 * (5 + 6))
2 * 3 + (4 * 5)
5 + (8 * 3 + 9 + 3 * 4 * 3)
5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2
`

const data = fs.readFileSync('input.txt').toString().trim().split('\n').map(line => line.match(/\d+|\S/gs))
// const data = testData.trim().split('\n').map(line => line.match(/\d+|\S/g))
// const data = testData2.trim().split('\n').map(line => line.match(/\d+|\S/g))

class Node {
	constructor(parent) {
		this.elements = []
		this.parent = parent
	}
	push(el) {
		this.elements.push(el)
		return el
	}
}

const createTree = expr => {

	const tree = new Node(null)
	let pivot = tree

	const addElement = el => {
		if (el === '(') pivot = pivot.push(new Node(pivot))
		else if (el === ')') pivot = pivot.parent
		else if (el === '+') pivot.push('+')
		else if (el === '*') pivot.push('*')
		else if (/\d+/.test(el)) pivot.push(parseInt(el))
		else pivot.push(el)
	}
	expr.forEach(el => addElement(el))
	return tree
}

const evalExpr = (expr, part2 = false) => {

	const tree = createTree(expr)

	const evalTree = node => {

		let number = null
		let operator = null

		const elements = part2 ? createTree(convertSimpleExpr(node.elements)).elements : node.elements

		elements.forEach(el => {
			if (el === '+') operator = '+'
			else if (el === '*') operator = '*'
			else {
				let value = 0
				if (el instanceof Node) value = evalTree(el)
				else value = el

				if (operator === '+') number += value
				else if (operator === '*') number *= value
				else number = value
			}
		})
		return number
	}

	return evalTree(tree)
}

const convertSimpleExpr = initExpr => {
	const expr = []
	let lastOperator = null
	let openBrackets = 0
	initExpr.forEach(el => {
		if (el === '+') {
			if (lastOperator === '*') {
				const lastEl = expr.pop()
				expr.push('(', lastEl)
				++openBrackets
			}
			expr.push(el)
			lastOperator = '+'
		}
		else if (el === '*') {
			if (lastOperator === '+' && openBrackets > 0) {
				--openBrackets
				expr.push(')')
			}
			expr.push(el)
			lastOperator = '*'
		}
		else {
			expr.push(el)
		}
	})
	for (let i = 0; i < openBrackets; ++i) expr.push(')')
	return expr
}

const result = data.reduce((result, expr) => result + evalExpr(expr), 0)
const result2 = data.reduce((result, expr) => result + evalExpr(expr, true), 0)

console.log("Part 1 - Sum:", result)
console.log("Part 2 - Sum:", result2)