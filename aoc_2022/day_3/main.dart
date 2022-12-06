import 'dart:convert';
import 'dart:io';

String readFile(String path) => File(path).readAsStringSync(encoding: utf8).replaceAll('\r', '');

void main() {
   var decoder = (String char) {
      var code = char.codeUnitAt(0);
      return code >= 97 ? code - 96 : code - 65 + 27;
   };

   var lines = readFile('data.txt').split('\n')
      .map((l) => l.split('').map(decoder).toList())
      .map((l) => [l.sublist(0, l.length~/2), l.sublist(l.length~/2)])
      .toList();

   part_1(lines);
   part_2(lines);
}

void part_1(List<List<List<int>>> lines) {
   var commonsSum = lines.fold(0, (sum, line) => sum + findCommon(line[0], line[1]));
   print(commonsSum);
}

void part_2(List<List<List<int>>> lines) {
   var sum = 0;
   var groupCount = lines.length ~/ 3;
   for (int i = 0; i < groupCount; ++i) {
      var idx = i * 3;
      sum += findCommonInLines([idx, idx + 1, idx + 2].map((idx) => [...lines[idx][0], ...lines[idx][1]].toSet()));
   }
   print(sum);
}

int findCommonInLines(Iterable<Set<int>> lines) {
   var result = lines.reduce((ss, s) => ss.intersection(s));
   return result.first;
}

int findCommon(List<int> line_1, List<int> line_2) {
   var s = line_1.toSet();
   return line_2.firstWhere((c) => s.contains(c));
}