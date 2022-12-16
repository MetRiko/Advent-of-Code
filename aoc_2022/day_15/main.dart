import 'dart:math';
import 'package:dartx/dartx.dart';

import 'helpers.dart';

class Pair {
   Vec2 sensor, beacon;
   int range;
   Pair(this.sensor, this.beacon) : range = (sensor - beacon).manhDis;
   @override
   String toString() => "$sensor|$beacon";
}

class Range {
   int l, r;
   Range(this.l, this.r);
   static Range? merge(Range a, Range b) {
      if (a.l <= b.l && b.l - a.r <= 1) {
         return Range(a.l, max(a.r, b.r));
      }
      else if (a.l > b.l && a.l - b.r <= 1) {
         return Range(b.l, max(a.r, b.r));
      }
      return null;
   }   
   bool contains(int p) => p >= l && p <= r;
   @override
   String toString() => "L($l, $r)";
}

void main() {
   var data = readFile('data.txt').split('\n').map((l) {
      var g = RegExp(r'-?\d+').regexGlobal(l).map(int.parse).toList();
      return Pair(Vec2(g[0], g[1]), Vec2(g[2], g[3]));
   }).toList();

   getLinesForAllYs(int limit) {
      var lines = <int, List<Range>>{}; 
      for (var pair in data) {
         for (int dy = -pair.range; dy <= pair.range; ++dy) {
            var y = pair.sensor.y + dy;
            if (y < 0 || y > limit) continue;
            var l = pair.sensor.x - (pair.range - dy.abs());
            var r = pair.sensor.x + (pair.range - dy.abs());
            lines.update(y, (list) { list.add(Range(y, l)); return list; }, ifAbsent: () => [Range(y, l)]);
         }
      }
      return lines;
   }

   mergeLines(List<Range> lines) {
      for (int i = 0; i < lines.length; ++i) {
         for (int j = i + 1; j < lines.length; ++j) {
            var m = Range.merge(lines[i], lines[j]);
            if (m != null) {
               lines[i] = m;
               lines.removeAt(j);
               --i;
               break;
            }
         }
      }
      return lines;
   }

   // Test data
   // var testY = 10; 
   // var limit = 20;

   // Final data
   var testY = 2000000; 
   var limit = 4000000;

   var linesMap = getLinesForAllYs(limit);
   linesMap.updateAll((y, lines) => mergeLines(lines));

   var testYLine = linesMap[testY]![0];
   var noBeaconCount = [for (var x = testYLine.l; x <= testYLine.r; ++x) Vec2(x, testY)].count((b) => !data.any((pair) => b == pair.beacon));
   print("Part 1: $noBeaconCount");

   var beaconRow = linesMap.entries.firstWhere((e) => e.value.length > 1);
   var y = beaconRow.key;
   var a = beaconRow.value[0];
   var b = beaconRow.value[1];
   var beaconPos = Vec2((a.r - b.l).abs() == 2 ? (a.r + b.l) ~/ 2 : (a.l + b.r) ~/ 2, y);

   // print(beaconLines);
   // print(beaconPos);
   print("Part 2: ${beaconPos.x * 4000000 + beaconPos.y}");


}




