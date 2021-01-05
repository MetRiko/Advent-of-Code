const fs = require('fs');

const testData = `
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6
`

const testData2 = `
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
nop -4
acc +6
`

const code = fs.readFileSync('input.txt').toString().trim().split('\n').map(line => (([i, v]) => [i, parseInt(v)])(line.split(' ')))
// const code = testData.trim().split('\n').map(line => (([i, v]) => [i, parseInt(v), false])(line.split(' ')))
// const code = testData2.trim().split('\n').map(line => (([i, v]) => [i, parseInt(v), false])(line.split(' ')))

let compile = code => pointer => acc => { 
	let status = code.map(_ => false)
	const exec = ([instr, delta]) => {
		if (status[pointer] === true) return false
		status[pointer] = true
		switch (instr) {
			case 'jmp': pointer += delta; break;
			case 'acc': acc += delta; ++pointer; break; 
			case 'nop': ++pointer; break; 
		}
		return true
	}
	while(exec(code[pointer])) {
		if (pointer >= code.length) {
			console.log(acc)
			return true
		}
	}
	
	return false
}

function* nextCode() {
	const swap = (idx) => code[idx][0] === 'nop' ? code[idx][0] = 'jmp' : code[idx][0] = 'nop'
	let idx = -1
	yield code
	while (true) {
		idx = code.slice(idx + 1).findIndex(([instr, value]) => instr === 'nop' || instr === 'jmp') + idx + 1
		if (idx != -1) {
			swap(idx)
			yield code
			swap(idx)
		}
		else return null
	}
}

compile(code)(0)(0);
const gen = nextCode()
while(!compile(gen.next().value)(0)(0));

// console.log(rules)
