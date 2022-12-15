import 'dart:math';
import 'package:dartx/dartx.dart';

import 'helpers.dart';

class Pair {
   Vec2 sensor, beacon;
   int range;
   Pair(this.sensor, this.beacon, this.range);
   @override
  String toString() {
      return "$sensor|$beacon";
  }
}

class HLine {
   int y, l, r;
   HLine(this.y, this.l, this.r);
   static HLine? merge(HLine a, HLine b) {
      if (a.l <= b.l && b.l - a.r <= 1) {
         return HLine(a.y, a.l, max(a.r, b.r));
      }
      else if (a.l > b.l && a.l - b.r <= 1) {
         return HLine(a.y, b.l, max(a.r, b.r));
      }
      return null;
   }   
   bool contains(Vec2 p) => y == p.y && p.x >= l && p.x <= r;
   @override
   String toString() => "L($y, $l, $r)";
}

void main() {
   var data = readFile('data.txt').split('\n').map((l) {
      var g = RegExp(r'-?\d+').allMatches(l).map((e) => e.group(0)!).toList();
      var sen = Vec2(g[0].toInt(), g[1].toInt());
      var bea = Vec2(g[2].toInt(), g[3].toInt());
      return Pair(sen, bea, (sen - bea).manhDis);
   }).toList();

   int countForY(int targetY) {
      var minPairX = data.minBy((p) => p.sensor.x - p.range)!;
      var maxPairX = data.maxBy((p) => p.sensor.x + p.range)!;
      var minX = minPairX.sensor.x - minPairX.range;
      var maxX = maxPairX.sensor.x + maxPairX.range;

      var noBeaconPos = <Vec2>{};
      for (var x = minX; x <= maxX; ++x) {
         var pos = Vec2(x, targetY);
         for (var pair in data) {
            var dis = (pos - pair.sensor).manhDis;
            if (pos != pair.beacon && dis <= pair.range) {
               noBeaconPos.add(pos);
            } 
         }
      }
      return noBeaconPos.length;
   }

   // Part 1
   // print(countForY(10));
   // print(countForY(2000000));


   var lines = <int, List<HLine>>{}; 
   // var limit = 20;
   var limit = 4000000;

   for (var pair in data) {
      for (int dy = -pair.range; dy <= pair.range; ++dy) {
         var y = pair.sensor.y + dy;
         if (y < 0 || y > limit) continue;
         var l = pair.sensor.x - (pair.range - dy.abs());
         var r = pair.sensor.x + (pair.range - dy.abs());
         // if (l >= 0 && r <= limit) {
            lines.update(y, (list) { list.add(HLine(y, l, r)); return list; }, ifAbsent: () => [HLine(y, l, r)]);
         // }
      }
   }

   mergeLines(List<HLine> lines) {
      for (int i = 0; i < lines.length; ++i) {
         for (int j = i + 1; j < lines.length; ++j) {
            var a = lines[i];
            var b = lines[j];
            var m = HLine.merge(a, b);
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

   getPossiblePoints(List<HLine> lines) {
      var possiblePoints = <Vec2>[];
      for (var i = 0; i < lines.length; ++i) {
         for (var j = i+1; j < lines.length; ++j) {
            var a = lines[i];
            var b = lines[j];
            if ((a.r - b.l).abs() == 2) {
               possiblePoints.add(Vec2((a.r + b.l) ~/ 2, a.y));
            }
            else if ((a.l - b.r).abs() == 2) {
               possiblePoints.add(Vec2((a.l + b.r) ~/ 2, a.y));
            }
         }
      }
      return possiblePoints;
   }

   // print(lines.values.join('\n'));
   // print('');
   for (var ls in lines.values) {
      lines[ls.first.y] = mergeLines(ls);
   }

   var possiblePointsList = lines.values.flatMap((lst) => getPossiblePoints(lst));
   // var beaconPoints = possiblePointsList.where((point) {
   //    var top = Vec2(point.x, point.y - 1);
   //    var isTopFilled = lines[top.y]!.any((l) => l.contains(top));
   //    var bottom = Vec2(point.x, point.y + 1);
   //    var isBottomFilled = lines[bottom.y]!.any((l) => l.contains(bottom));
   //    return isTopFilled && isBottomFilled;
   // }).toList();

   // print(beaconPoints);


   print(lines.values.where((l) => l.length > 1).join('\n'));

   var missingBeaconPos = possiblePointsList.first;
   var freq = missingBeaconPos.x * 4000000 + missingBeaconPos.y;
   
   print(possiblePointsList);
   print(freq);


}




