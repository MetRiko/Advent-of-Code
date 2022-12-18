import 'dart:math';
import 'package:dartx/dartx.dart';

import 'helpers.dart';

void main() {
   var cubes = readFile('data.txt').split('\n').map((l) => Vec3.fromList(l.split(',').map(int.parse).toList())).toSet();
   var offsets = [Vec3(0,0,1), Vec3(0,0,-1), Vec3(0,1,0), Vec3(0,-1,0), Vec3(1,0,0), Vec3(-1,0,0)];

   // Old implementation
   // getSidesPositions(Vec3 point) => offsets.map((o) => point * 2 + o).toSet();
   // var faces = cubes.fold(<Vec3>{}, (faces, c) => faces.symmetricDifference(getSidesPositions(c)));

   var facesCount = cubes.sumBy((c) => offsets.count((o) => !cubes.contains(c + o)));
   print("Part 1: ${facesCount}");

   var minPos = Vec3.one * 1000000;
   var maxPos = Vec3.one * -1000000;
   for (var c in cubes) {
      minPos.x = min(minPos.x, c.x);
      minPos.y = min(minPos.y, c.y);
      minPos.z = min(minPos.z, c.z);
      maxPos.x = max(maxPos.x, c.x);
      maxPos.y = max(maxPos.y, c.y);
      maxPos.z = max(maxPos.z, c.z);
   }
   minPos -= Vec3(1, 1, 1);
   maxPos += Vec3(1, 1, 1);

   // Alternative
   // var minCorner = cubes.map((c) => min(c.x, min(c.y, c.z))).min()! - 1;
   // var maxCorner = cubes.map((c) => max(c.x, max(c.y, c.z))).max()! + 1;
   // var minPos = Vec3.one * minCorner;
   // var maxPos = Vec3.one * maxCorner;

   isCubeInsideRoom(Vec3 p) => p.x >= minPos.x && p.y >= minPos.y && p.z >= minPos.z && p.x <= maxPos.x && p.y <= maxPos.y && p.z <= maxPos.z;

   var queue = {minPos};
   var air = <Vec3>{minPos};
   while (queue.length > 0) {
      queue = queue.flatMap((c) => offsets.map((o) => c + o).where((c) => isCubeInsideRoom(c) && !air.contains(c) && !cubes.contains(c))).toSet();
      air = air.union(queue);
   }
   
   var outerFacesCount = air.sumBy((c) => offsets.count((o) => cubes.contains(c + o)));
   print("Part 2: $outerFacesCount");
}




