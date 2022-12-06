import fs from 'fs'

// Utils

const input = [...fs.readFileSync('input.txt', 'utf8').matchAll(/(\w+)-(\w+)/gm)].reduce((obj, [_, l, r]) => {
	if (obj[l]) obj[l].push(r); else obj[l] = [r]
	if (obj[r]) obj[r].push(l); else obj[r] = [l]
	return obj
}, {})

const isSmallState = state => /[a-z]/.test(state)

let count = 0

const step = (visitedStates, additionalVisitsAmount) => {
	const newVisitedStates = []
	for (const visitedState of visitedStates) {
		const canGoMultiple = Object.values(visitedState.visitedSmallStates).every(visited => visited <= 1)
		const possibleStates = canGoMultiple 
			? input[visitedState.state].filter(state => (visitedState.visitedSmallStates[state] ?? 0) < additionalVisitsAmount && state != 'start')
			: input[visitedState.state].filter(state => (visitedState.visitedSmallStates[state] ?? 0) == 0 && state != 'start')
			
		for (const possibleState of possibleStates) {
			const visitedSmallStates = {...visitedState.visitedSmallStates}
			if (isSmallState(possibleState)) {
				visitedSmallStates[possibleState] = (visitedSmallStates[possibleState] ?? 0) + 1
			}
			const newVisitedState = { path: [...visitedState.path, possibleState], visitedSmallStates, state: possibleState }
			if (possibleState !== 'end') {
				newVisitedStates.push(newVisitedState)
			}
			else {
				count++
				// console.log(...newVisitedState.path)
			}
		}		
	}
	return newVisitedStates
}

const task_1 = () => {
	let visitedStates = [{ path: ['start'], visitedSmallStates: {}, state: 'start' }]
	while (visitedStates.length > 0) {
		visitedStates = step(visitedStates, 1)
	}
	console.log(count)
}

const task_2 = () => {
	let visitedStates = [{ path: ['start'], visitedSmallStates: {}, state: 'start' }]
	while (visitedStates.length > 0) {
		visitedStates = step(visitedStates, 2)
	}
	console.log(count)
}

// task_1()
task_2()
