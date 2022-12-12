import 'helpers.dart';


void main() {
   var map = readFile('data.txt').split('\n').map((l) => l.split('').map((e) => e.codeUnitAt(0) - 97).toList()).toList();
   
   var start = Vec2(0, 0);
   var end = Vec2(0, 0);
   map.forEachV2((vec, h) {
      if (map.getV2(vec) == -14) {
         start = vec;
         map.setV2(vec, 0);
      }
      else if (map.getV2(vec) == -28) {
         end = vec;
         map.setV2(vec, 25);
      }
   });

   int findPath(List<List<int>> map, Vec2 start, bool endCond(Vec2), bool stepCond(ph, h)) {
      var offsets = [Vec2(0, 1), Vec2(0, -1), Vec2(1, 0), Vec2(-1, 0)];
      var queue = {start};
      var visited = <Vec2>{};
      var steps = 0;
      while (queue.length > 0) {
         var newQueue = <Vec2>{};
         for (var p in queue) {
            if (endCond(p)) return steps;
            visited.add(p);
            for (var off in offsets) {
               var next = p + off;
               var h = map.tryGetV2(next);
               if (h != null && stepCond(map.getV2(p), h) && !visited.contains(next)) {
                  newQueue.add(next);
               }
            }
         }
         queue = newQueue;
         ++steps;
         // print('\n');
         // print(map.mapIndexed((y, l) => l.mapIndexed((x, h) => visited.contains(Vec2(x, y)) ? "#" : '.').join('')).join('\n'));
      }
      return -1;
   }

   print("Part 1: ${findPath(map, start, (p) => p == end, (ph, h) => h - ph <= 1)}");
   print("Part 2: ${findPath(map, end, (p) => map.getV2(p) == 0, (ph, h) => ph - h <= 1)}");
}



