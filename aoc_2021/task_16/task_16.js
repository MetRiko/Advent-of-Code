import fs from 'fs'
import { range, hash, dehash } from './utils.js'

// const input = "8A004A801A8002F478"
// const input = "620080001611562C8802118E34"
// const input = "C0015000016115A2E0802F182340"
// const input = "A0016C880162017C3686B18A3D4780"

// const input = "D2FE28"
// const input = "38006F45291200"
// const input = "EE00D40C823060"

// const input = "8A004A801A8002F478" // 16
// const input = "620080001611562C8802118E34" // 12
// const input = "C0015000016115A2E0802F182340" // 23
// const input = "A0016C880162017C3686B18A3D4780" // 31

const input = fs.readFileSync('input.txt', 'utf8')

const hexToBits = hex => {
	const map = {
		'0': '0000', '1': '0001', '2': '0010', '3': '0011',
		'4': '0100', '5': '0101', '6': '0110', '7': '0111',
		'8': '1000', '9': '1001', 'A': '1010', 'B': '1011',
		'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111'
	}
	const bits = hex.split('').reduce((bits, hexChar) => bits += map[hexChar], '')
	return bits
}

const readTransmission = transmission => {
	const bits = hexToBits(transmission)

	const continueToReadOperatorPacket = (packet, bits, pointer) => {
		packet.lengthTypeId = +bits.slice(pointer, pointer += 1)

		const subPackets = []
		packet.subPackets = subPackets

		const addNextSubPacket = () => {			
			const {pointer: nextPointer, packet: newSubpacket} = readPacket(bits, pointer, true)
			pointer = nextPointer
			subPackets.push(newSubpacket)
		}

		if (packet.lengthTypeId == 0) {
			packet.subPacketsTotalLength = parseInt(bits.slice(pointer, pointer += 15), 2)
			const firstSubpacketPointer = pointer
			while (pointer - firstSubpacketPointer < packet.subPacketsTotalLength) addNextSubPacket()
		}
		else {
			packet.subPacketsTotalAmount = parseInt(bits.slice(pointer, pointer += 11), 2)
			range(packet.subPacketsTotalAmount).forEach(addNextSubPacket)
		}

		return {packet, pointer}
	}

	const continueToReadValuePacket = (packet, bits, pointer, ignoreLeadingZeros = false) => {
		let valueBits = ''
		let isLastGroup = false
		while (isLastGroup == false) {
			isLastGroup = bits.slice(pointer, pointer += 1) == '0'
			valueBits += bits.slice(pointer, pointer += 4)
		}
		packet.value = parseInt(valueBits, 2)
		if (ignoreLeadingZeros == false) {
			pointer += 4 - (6 + valueBits.length) % 4
		}
		return {packet, pointer}
	}

	const readPacket = (bits, pointer = 0, ignoreLeadingZeros = false) => {
		const packet = {}

		packet.packetVersion = parseInt(bits.slice(pointer, pointer += 3), 2)
		packet.packetTypeId = parseInt(bits.slice(pointer, pointer += 3), 2)

		const result = packet.packetTypeId == 4
			? continueToReadValuePacket(packet, bits, pointer, ignoreLeadingZeros)
			: continueToReadOperatorPacket(packet, bits, pointer)

		return {packet, pointer: result.pointer}
	}

	const {packet} = readPacket(bits)

	const sumPacketVersions = packet => packet.packetVersion + (packet.subPackets ?? []).reduce((sum, packet) => sum + sumPacketVersions(packet), 0)

	const calculatePacketValue = packet => {
		switch (packet.packetTypeId) {
			case 0: return packet.subPackets.reduce((total, packet) => total + calculatePacketValue(packet), 0)
			case 1: return packet.subPackets.reduce((total, packet) => total * calculatePacketValue(packet), 1)
			case 2: return Math.min(...packet.subPackets.map(packet => calculatePacketValue(packet)))
			case 3: return Math.max(...packet.subPackets.map(packet => calculatePacketValue(packet)))
			case 4: return packet.value
			case 5: return calculatePacketValue(packet.subPackets[0]) > calculatePacketValue(packet.subPackets[1])
			case 6: return calculatePacketValue(packet.subPackets[0]) < calculatePacketValue(packet.subPackets[1])
			case 7: return calculatePacketValue(packet.subPackets[0]) == calculatePacketValue(packet.subPackets[1])
		}
	}

	const versionSum = sumPacketVersions(packet)
	console.log("Version sum: ", versionSum)

	const totalValue = calculatePacketValue(packet)
	console.log("Total value: ", totalValue)

}

const task_1_and_2 = () => {
	readTransmission(input)
}

task_1_and_2()