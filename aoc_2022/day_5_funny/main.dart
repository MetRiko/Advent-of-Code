import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'package:collection/collection.dart';
import 'package:vector_math/vector_math.dart';

bool isLetter(String l) {
   var code = l.codeUnitAt(0);
   return code >= 65 && code <= 90; // A-Z
}

class Letter { 
   String char; int idx; double len;
   Letter(this.char, this.idx, this.len);
}

Vector2 getCenter(List<String> rawLines) {
   var c = Vector2(0, 0);
   var height = rawLines.length;
   for (var y = 0; y < height; ++y) {
      var width = rawLines[y].length;
      for (var x = 0; x < width; ++x) {
         if (rawLines[y][x] == '1') {
            c.x = x.toDouble();
            if (c.x > 0 && c.y > 0) return c;
         }
         else if (rawLines[y][x] == '7') {
            c.y = y.toDouble();
            if (c.x > 0 && c.y > 0) return c;
         }
      }
   }
   return null;
}

void main() {

   var rawLines = File("data.txt").readAsStringSync(encoding: utf8).replaceAll('\r', '').split('\n').toList();
   
   var center = getCenter(rawLines);
   var letters = <Letter>[];
   var decoder = Map<int, int>();
   
   var height = rawLines.length;
   for (var y = 0; y < height; ++y) {
      var width = rawLines[y].length;
      for (var x = 0; x < width; ++x) {
         var c = rawLines[y][x];
         if (c == '#' || c == ' ') continue;
         var vec = Vector2(x.toDouble(), y.toDouble()) - center;
         var idx = ((atan2(vec.y, vec.x) - 0.05 * pi) / 0.1 * pi).floor();
         if (isLetter(c)) {
            letters.add(Letter(c, idx, vec.length2));
         }
         else {
            decoder[idx] = c.codeUnitAt(0) - 49;
         }
      }
   }

   var boxes = List<List<String>>.generate(decoder.length, (i) => []);
   letters.groupListsBy((l) => l.idx).forEach((idx, col) {
      col.sort((a, b) => (a.len < b.len ? 0 : 1));
      boxes[decoder[idx]] = col.map((l) => l.char).toList();
   });

   print(boxes.join('\n'));
}



