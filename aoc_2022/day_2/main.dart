import 'dart:convert';
import 'dart:io';

String readFile(String path) => File(path).readAsStringSync(encoding: utf8).replaceAll('\r', '');

void main() {
   var decoder = {
      'A': 0, 'B': 1, 'C': 2,
      'X': 0, 'Y': 1, 'Z': 2
   };
   var pairs = readFile('data.txt').split('\n').map((l) => l.split(' ').map((p) => decoder[p]).toList());
   resolve(pairs);
   pairs.forEach((p) => p[1] = (p[0] + [2, 0, 1][p[1]]) % 3);
   resolve(pairs);
}

void resolve(Iterable<List<int>> pairs) {
   var score = pairs.fold(0, (sum, p) {
      var result = (p[1] - p[0] + 3) % 3;
      return sum + [3, 6, 0][result] + p[1] + 1; 
   });
   print(score);
}