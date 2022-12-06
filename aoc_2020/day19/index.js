const fs = require('fs');

const testData = `
0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb
`

// const data = [...testData.trim().match(/^(.*?)\n\n(.*)$/s)].slice(1, 3)
// const data = [...fs.readFileSync('input.txt').toString().trim().match(/^(.*?)\n\n(.*)$/s)].slice(1, 3)
const data = [...fs.readFileSync('input2.txt').toString().trim().match(/^(.*?)\n\n(.*)$/s)].slice(1, 3)

const rules = data[0].trim().split('\n').sort((a, b) => a.match(/^(\d+):/)[1] - b.match(/^(\d+):/)[1]).map((line, idx) => {
	let test = null
	const ts = seq => seq.trim().split(' ').map(x => parseInt(x))
	if (test = line.match(/^\d+:((?:\s\d+)+)\s\|((?:\s\d+)+)$/)) return { idx: idx, type: "or", left: ts(test[1]), right: ts(test[2]) }
	else if (test = line.match(/^\d+:((?:\s\d+)+)$/)) return { idx: idx, type: "and", seq: ts(test[1]) }
	else if (test = line.match(/^\d+:\s"(\w+)"$/)) return { idx: idx, type: "char", char: test[1] }
	return line
})

const msgs = data[1].trim().split('\n')

const genRgx = rules => {

	const next = rule => {
		let rgx = ''
		if (rule.type === 'char') rgx = rule.char
		else if (rule.type === 'and') rgx = '(' + rule.seq.map(id => next(rules[id])).join('') + ')'
		else if (rule.type === 'or') rgx = '(' + rule.left.map(id => next(rules[id])).join('') + '|' + rule.right.map(id => next(rules[id])).join('') + ')'
		else rgx = ''
		return rgx
	}
	return `^${next(rules[0])}$`
}

const genRgx2 = (rules, loop8, loop11) => {

	const next = rule => {

		if (rule.idx === 8 && --loop8 < 0) return ''
		if (rule.idx === 11 && --loop11 < 0) return ''

		let rgx = ''
		if (rule.type === 'char') rgx = rule.char
		else if (rule.type === 'and') rgx = '(' + rule.seq.map(id => next(rules[id])).join('') + ')'
		else if (rule.type === 'or') rgx = '(' + rule.left.map(id => next(rules[id])).join('') + '|' + rule.right.map(id => next(rules[id])).join('') + ')'
		else rgx = ''
		return rgx
	}
	return `^${next(rules[0])}$`
}


const getValidMsgs = () => {
	const rgx = RegExp(genRgx(rules))
	return msgs.filter(msg => rgx.test(msg))
}

const getValidMsgs2 = () => {
	const rgx = RegExp(genRgx2(rules, 5, 5))
	return msgs.filter(msg => rgx.test(msg))
}

// console.log("Part 1 - valid messages:", getValidMsgs().length)
console.log("Part 2 - valid messages:", getValidMsgs2().length)

// 4 1 5


// ["a"]
// [[4 4 | 5 5] [4 5 | 5 4] | [4 5 | 5 4] [4 4 | 5 5]]
// ["b"]


// ["a"]
// [["a" "a" | "b" "b"] ["a" "b" | "b" "a"] | ["a" "b" | "b" "a"] ["a" "a" | "b" "b"]]
// ["b"]



// /^a((aa|bb)(ab|ba)|((ab|ba)(aa|bb))b$/