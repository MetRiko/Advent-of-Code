const fs = require('fs');
const FastMap = require('collections/map')

const testData = `
class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12
`

const testData2 = `
class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9
`

const splitRanges = block => Object.assign(...[...block.matchAll(/^([\w\s]*)[^\d]*([\s\S]*?)$/gm)].map(x => ({ [x[1]]: [...x[2].matchAll(/(\d+)-(\d+)/g)].map(x => [parseInt(x[1]), parseInt(x[2])]) })))
const splitTicket = block => block.split(',').map(x => parseInt(x))

const sections = (([ranges, ticket, otherTickets]) => ({
	ranges: splitRanges(ranges),
	ticket: splitTicket(ticket),
	otherTickets: otherTickets.split('\n').map(splitTicket)
}))(fs.readFileSync('input.txt').toString().trim().match(/(^|\d)[\s\S]*?(?<=\n\n|$)/gs).map(x => x.trim()))

const isInRange = (value, range) => value >= range[0] && value <= range[1]
const isInAnyRange = value => Object.values(sections.ranges).flat().some(range => isInRange(value, range))
const isInRanges = (value, ranges) => ranges.some(range => isInRange(value, range))
const areInRanges = (values, ranges) => values.every(value => isInRanges(value, ranges))

const errorSum = sections.otherTickets.flat().filter(v => !isInAnyRange(v)).reduce((sum, val) => sum + val, 0)

console.log(`Part 1: ${errorSum}`)

const resolveFields = () => {

	const validTickets = sections.otherTickets.filter(ticket => ticket.every(isInAnyRange))
	const ticketsColumns = validTickets.map((_, col) => validTickets.map(ticket => ticket[col]))
	let possibleFields = ticketsColumns.map(column => Object.entries(sections.ranges).map(([key, ranges]) => areInRanges(column, ranges) ? key : null).filter(x => x))

	let resolvedFields = new Array(sections.ticket.length)

	while (possibleFields.some(fields => fields.length > 0)) {
		const fieldToRemoveIdx = (possibleFields.findIndex(fields => fields.length === 1))
		const fieldToRemove = possibleFields[fieldToRemoveIdx][0]
		resolvedFields[fieldToRemoveIdx] = fieldToRemove
		possibleFields = possibleFields.map(fields => fields.filter(field => field !== fieldToRemove))
	}

	return resolvedFields
}

const departures = resolveFields().map((field, idx) => [field, sections.ticket[idx]]).filter(([name, value]) => name.split(' ')[0] === 'departure')
const departuresMulti = departures.reduce((acc, [_, value]) => value * acc, 1)

console.log(`Part 2 - Departures multi: ${departuresMulti}`)