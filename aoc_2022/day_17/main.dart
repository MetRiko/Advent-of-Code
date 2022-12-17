import 'dart:math';
import 'package:dartx/dartx.dart';

import 'helpers.dart';

class Block {
   Vec2 pos = Vec2(0, 0);
   Set<Vec2> squares;
   Block(this.pos, List<List<int>> l) : squares = l.map((e) => Vec2(e[0], e[1])).toSet();
   bool isColliding(Vec2 point) => squares.any((v) => v + pos == point);
   move(Vec2 offset) => pos += offset;
   Set<Vec2> get positions => squares.map((s) => s + pos).toSet();
}

void main() {
   var data = readFile('data.txt').split('');
   
   const shapes = [
      [[0,0], [1,0], [2,0], [3,0]],
      [[1,0], [0,1], [1,1], [2,1], [1,2]],
      [[0,0], [1,0], [2,0], [2,1], [2,2]],
      [[0,0], [0,1], [0,2], [0,3]],
      [[0,0], [1,0], [0,1], [1,1]],
   ];

   var level = {for (int i = 0; i < 7; ++i) Vec2(i, 0)};

   canMove(Block block, Vec2 offset) => !block.positions.any((s) {
      var pos = s + offset;
      return level.contains(s + offset) || pos.x < 0 || pos.x >= 7;
   });
   
   findTopY(int currTopY, Set<Vec2> squaresToScan) => max(currTopY, squaresToScan.maxBy((s) => s.y)!.y);

   printLevel(int height) {
      var arr = [for (int y = height; y >= 0; --y) [for (int x = 0; x < 7; ++x) level.contains(Vec2(x, y)) ? '#' : '.'].join('')];
      print(arr.join('\n'));
   }

   var jetCount = 0;
   var topY = findTopY(0, level);
   var prevTopY = 0;
   var prevTopYPerBlock = 0;
   var hPerBlock = <int>[];
   var hPerJet1 = <int>[];
   var bPerJet1 = <int>[];
   for (var blockCount = 0; blockCount < 10000; ++blockCount) {
      var block = Block(Vec2(2, topY + 4), shapes[blockCount % shapes.length]);
      hPerBlock.add(topY - prevTopYPerBlock);
      prevTopYPerBlock = topY;
      if (jetCount % data.length == 1 && jetCount > 0) {
         var dif = topY - prevTopY;
         print("block: $blockCount | jets = $jetCount | y = $topY | dif = $dif");
         if (hPerJet1.contains(dif)) break;
         bPerJet1.add(blockCount);
         hPerJet1.add(dif);
         prevTopY = topY;
      }
      while (true) {
         // jet
         var jetDir = data[(jetCount++) % data.length] == '<' ? Vec2(-1, 0) : Vec2(1, 0);
         if (canMove(block, jetDir)) {
            block.move(jetDir);
         }
         // fall
         if (canMove(block, Vec2(0, -1))) {
            block.move(Vec2(0, -1));
         }
         else {
            var newSquares = block.positions;
            topY = findTopY(topY, newSquares);
            level.addAll(newSquares);
            break;
         }
      }
   }

   print("h/block: $hPerBlock");
   print("b/jet1: $bPerJet1");
   print("h/jet1: $hPerJet1");

   calculateHeight(int n) {
      var firstJet1Idx = bPerJet1[0];
      var secondJet1Idx = bPerJet1[1];

      var firstBlocks = hPerBlock.sublist(0, firstJet1Idx);
      if (n < firstBlocks.length) {
         return firstBlocks.sublist(0, n).sum();
      }
      else {
         var cyclingBlocks = hPerBlock.sublist(firstJet1Idx, secondJet1Idx);
         var startSum = firstBlocks.sum();
         // print(startSum);
         var cycles = (n - firstBlocks.length) ~/ cyclingBlocks.length;
         var cyclesSum = cyclingBlocks.sum() * cycles;
         // print(cyclingBlocks.sum());
         var lastCycleBlockIdx = ((n - firstBlocks.length + 1) % cyclingBlocks.length);
         var lastCycleSum = cyclingBlocks.sublist(0, lastCycleBlockIdx).sum();
         return startSum + cyclesSum + lastCycleSum;
      }
   }

   print("Part 1: ${calculateHeight(2022)}");
   print("Part 2: ${calculateHeight(1000000000000)}");




   // var a = 2022 ~/ heightUntilRepeat.length;
   // var b = 2022 % heightUntilRepeat.length;
   // var f = a * heightUntilRepeat.last + heightUntilRepeat[b];

   // print(highDiffCycle);
   // print(heightUntilRepeat);
   // print(f);

   // printLevel(topY);

   // print("Part 1: $f");
}




