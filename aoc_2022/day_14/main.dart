import 'dart:math';
import 'package:dartx/dartx.dart';

import 'helpers.dart';

void main() {
   var cmdLines = readFile('data.txt').split('\n').map((l) {
      var x = l.split(RegExp(r'(,| -> )'));
      return [for (int i = 0; i < x.length; i += 2) Vec2(x[i].toInt(), x[i+1].toInt())];
   }).toList();

   var rocks = <Vec2>{};
   var maxY = 0;
   for (var cmd in cmdLines) {
      var prev = cmd[0];
      for (int i = 1; i < cmd.length; ++i) {
         var next = cmd[i];
         var vec = next - prev;
         var steps = vec.x.abs() + vec.y.abs();
         vec = Vec2(vec.x.sign, vec.y.sign);
         rocks.add(prev);
         maxY = max(maxY, prev.y);
         for (int s = 0; s < steps; ++s) {
            prev += vec;
            rocks.add(prev);
            maxY = max(maxY, prev.y);
         }
      }
   }

   bool isSolid(Vec2 p, bool withBottomFloor) =>
      rocks.contains(p) || (withBottomFloor && p.y >= maxY + 2);

   int playSimulation(bool withBottomFloor) {
      var sandCount = 0;
      while (true) {
         var sandPos = Vec2(500, 0);
         if (rocks.contains(sandPos)) {
            return sandCount;
         }
         while (true) {
            var below = sandPos + Vec2(0, 1);
            if (!isSolid(below, withBottomFloor)) {
               sandPos = below;
            }
            else {
               late var leftBottom = sandPos + Vec2(-1, 1); 
               late var rightBottom = sandPos + Vec2(1, 1);
               if (!isSolid(leftBottom, withBottomFloor)) {
                  sandPos = leftBottom;
               } 
               else if (!isSolid(rightBottom, withBottomFloor)) {
                  sandPos = rightBottom;
               }
               else {
                  rocks.add(sandPos);
                  break;
               }
            }
            if (sandPos.y > maxY + 2) {
               return sandCount;
            }
         }
         ++sandCount;
      }
   }

   // print("Part 1: ${playSimulation(false)}");
   print("Part 2: ${playSimulation(true)}");

   var vis = <List<String>>[];
   for (int y = -1; y < 13; ++y) {
      var row = [for (int x = 488; x < 515; ++x) rocks.contains(Vec2(x, y)) ? '#' : '.'];
      vis.add(row);
   }
   print(vis.join('\n'));

}




