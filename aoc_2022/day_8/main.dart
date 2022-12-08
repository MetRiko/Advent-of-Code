import 'dart:math';
import 'package:dartx/dartx.dart';
import 'helpers.dart';

void main() {

   var grid = readFile('data.txt').split('\n').map((l) => l.split('').map(int.parse).toList()).toList();

   var width = grid[0].length;
   var height = grid.length;
   var dirs = [Vec2(-1, 0), Vec2(0, -1), Vec2(1, 0), Vec2(0, 1)];

   getScore(Vec2 pos) {
      var h = grid.getV2(pos);
      var maxSteps = [pos.x, pos.y, width - pos.x - 1, height - pos.y - 1];

      var dirSteps = range(4).map((idx) => 
         range(1, maxSteps[idx] + 1).takeWhile((s) => grid.getV2(pos + dirs[idx] * s) < h).length
      ).toList();

      var isVisible = range(4).any((idx) => dirSteps[idx] == maxSteps[idx]);
      return isVisible ? range(4).map((idx) => min(dirSteps[idx] + 1, maxSteps[idx])).reduce((v, e) => v * e) : 0;
   };

   var scores = range2(1, width - 1, 1, height - 1).map(getScore).toList();
   var visibleCount = scores.where((s) => s > 0).length + width * 2 + height * 2 - 4;
   print(visibleCount);
   print(scores.max());
}



