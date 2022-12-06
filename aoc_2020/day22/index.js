const fs = require('fs');
const Set = require('collections/set');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

const testData = `
Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10
`.trim()

const inputData = fs.readFileSync('input.txt').toString().trim() //^(\w+\s[^(])*(\w+)

// const decks = [...testData.matchAll(/Player \d:\n(.*?)(\n\n|$)/gs)].map(group => group[1].split('\n').map(v => parseInt(v)))
const decks = [...inputData.matchAll(/Player \d:\n(.*?)(\n\n|$)/gs)].map(group => group[1].split('\n').map(v => parseInt(v)))


const playGame = decks => {
	const next = decks => {
		const p1 = decks[0].shift()
		const p2 = decks[1].shift()

		if (p1 > p2) decks[0].push(p1, p2)
		else decks[1].push(p2, p1)
	}

	while (decks[0].length > 0 && decks[1].length > 0) {
		next(decks)
	}

	if (decks[0].length > 0) return { winner: 0 }
	else return { winnner: 1 }

	// const score = decks.filter(deck => deck.length > 0)[0].reduce((score, value, idx, deck) => score + value * (deck.length - idx), 0)
	// console.log("Part 1 - Score:", score)
}

const playGame2 = decks => {
	// const makeDecksCopy = decks => [[...decks[0]], [...decks[1]]]

	const drawCards = decks => {
		const p1 = decks[0].shift()
		const p2 = decks[1].shift()
		return [p1, p2]
	}

	checkSubGameCondition = (decks, [p1, p2]) => decks[0].length >= p1 && decks[1].length >= p2

	// const roundsLog = {}
	const roundsLog = []

	let subGameCounter = 0
	// const updateRoundsLog = (decks, subGameNumber, subGameIdx) => {
	// 	const newEntry = [subGameIdx, decks[0].join(','), decks[1].join(',')].join('|')
	// 	console.log(subGameNumber, newEntry)
	// 	// if (Object.values(roundsLog).some(log => log.has(newEntry))) {
	// 	if (roundsLog.has(newEntry)) {
	// 		// console.log("DUP:", newEntry)
	// 		return false
	// 	}
	// 	roundsLog.push(newEntry)
	// 	// roundsLog[subGameIdx] = roundsLog[subGameIdx] || []
	// 	// roundsLog[subGameIdx].push(newEntry)
	// 	return true
	// }

	const updateLog = (log, decks, subGameNumber) => {
		const newEntry = [decks[0].join(','), decks[1].join(',')].join('|')
		// if (log.length % 5000 === 0)
		console.log(subGameNumber, log.length, newEntry)
		if (log.has(newEntry)) {
			// console.log("DUP:", newEntry)
			return false
		}
		log.push(newEntry)
		return true
	}

	const log = []

	const createLogEntry = decks => [decks[0].join(','), decks[1].join(',')].join(' | ')

	const playSubGame = (decks, subGameNumber = 1, subGameIdx = 0, log = []) => {
		// decks = makeDecksCopy(decks)

		// console.log("--------------Start of sub game-------------")

		// if (updateLog(log, decks, subGameNumber) === false) return { winner: 0 }

		// log.push([decks[0].join(','), decks[1].join(',')].join('|'))

		// console.log(subGameNumber, subGameIdx, [decks[0].join(','), decks[1].join(',')].join('|'))

		log = [...log]

		while (decks[0].length > 0 && decks[1].length > 0) {

			const newEntry = createLogEntry(decks)
			if (log.has(newEntry)) return { winner: 0, duplicatedEntry: newEntry }
			else log.push(newEntry)

			// if (subGameIdx % 50 === 0)
			if (subGameIdx === 0)
				console.log(subGameNumber, subGameIdx, newEntry)

			const [p1, p2] = drawCards(decks)

			// if (log.has([decks[0].join(','), decks[1].join(',')].join('|'))) return { winner: 0 }

			// console.log("Game ", subGameNumber)
			// console.log("Player 1:", ...decks[0])
			// console.log("Player 2:", ...decks[1])
			// console.log(p1, p2)
			// console.log()

			if (checkSubGameCondition(decks, [p1, p2])) {

				const deck1 = decks[0].slice(0, p1)
				const deck2 = decks[1].slice(0, p2)
				++subGameCounter
				const { winner, duplicatedEntry } = playSubGame([deck1, deck2], subGameNumber + 1, subGameCounter, log)

				if (duplicatedEntry) {
					if (log.has(duplicatedEntry)) return { winner, duplicatedEntry }
				}
				// if (Number.isInteger(instaWinner)) return { winner, winnerDeck, instaWinner }

				if (winner === 0) decks[0].push(p1, p2)
				else decks[1].push(p2, p1)
			}
			else {
				if (p1 > p2) decks[0].push(p1, p2)
				else decks[1].push(p2, p1)
			}
		}

		// console.log("Winner deck:", ...(decks[0].length > 0 ? decks[0] : decks[1]))
		// console.log("--------------End of sub game-------------")

		if (decks[0].length > 0) return { winner: 0, winnerDeck: decks[0] }
		else return { winner: 1, winnerDeck: decks[1] }
	}

	const result = playSubGame(decks)

	return result

}

const recursiveGameResult = playGame2(decks)
console.log("Final result")
console.log(recursiveGameResult)

const score = recursiveGameResult.winnerDeck.reduce((score, value, idx, deck) => score + value * (deck.length - idx), 0)
console.log("Part 2 - Score:", score)
