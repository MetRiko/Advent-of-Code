import 'dart:convert';
import 'dart:io';

String readFile(String path) => File(path).readAsStringSync(encoding: utf8).replaceAll('\r', '');

void main() {

   // var strs = readFile('datatest.txt').split('\n\n').toList();
   var strs = readFile('data.txt').split('\n\n').toList();

   var boxesStrs = strs[0].split('\n').reversed.skip(1).map((l) => [for (var i = 1; i < l.length; i += 4) l[i]]).toList();
   var boxes = List.generate(boxesStrs[0].length, (idx) => [for (var row in boxesStrs) if (row[idx] != ' ') row[idx]]);

   var instructions = strs[1].split('\n')
      .map((l) => RegExp(r'.+ (\d+) .+ (\d+) .+ (\d+)').firstMatch(l))
      .map((g) => [int.parse(g.group(1)), int.parse(g.group(2)) - 1, int.parse(g.group(3)) - 1]);

   for (var instr in instructions) {
      var count = instr[0];
      var from = boxes[instr[1]];
      var to = boxes[instr[2]];
      var subArr = from.sublist(from.length - count);
      // to.addAll(subArr.reversed); // part 1
      to.addAll(subArr); // part 2
      from.removeRange(from.length - count, from.length);
   }

   var word = boxes.map((col) => col.last).join();
   print(word);
}



