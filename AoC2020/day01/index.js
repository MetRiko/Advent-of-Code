let fs = require('fs')

const x = fs.readFileSync('data.txt').toString().split('\n').map(num => parseInt(num))
x.pop()

function* answer () {
	for (let i = 0; i < x.length; ++i) {
		for (let j = i+1; j < x.length; ++j) {
			for (let k = j+1; k < x.length; ++k) {
				if (x[i] + x[j] + x[k] === 2020) yield `${x[i]} + ${x[j]} + ${x[k]} == 2020 | a * b * c = ${x[i] * x[j] * x[k]}`		
			}
		}
	}
}


console.log(answer().next().value)