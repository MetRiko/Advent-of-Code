import 'helpers.dart';

class Instr {
   Vec2 dir; int repeats;
   Instr(this.dir, this.repeats);
}

void main() {
   var decoder = {
      'R': Vec2(1, 0), 'U': Vec2(0, 1), 'L': Vec2(-1, 0), 'D': Vec2(0, -1)
   };
   var commands = readFile('data.txt').split('\n').map((l) => l.split(' ')).map((p) => Instr(decoder[p[0]]!, int.parse(p[1])));

   void simulate(int segmentsCount) {
      var visited = <Vec2>{Vec2(0, 0)};
      var segments = range(segmentsCount).map((i) => Vec2(0, 0)).toList();

      for (var instr in commands) {
         for (var i = 0; i < instr.repeats; ++i) {
            segments[0] += instr.dir;
            for (var n = 1; n < segmentsCount; ++n) {
               var vec = segments[n - 1] - segments[n];
               if (vec.x.abs() > 1 || vec.y.abs() > 1) {
                  segments[n] += Vec2(vec.x.sign, vec.y.sign);
               }
            }
            visited.add(segments.last.clone());
         }
      }
      // print(visited);
      print(visited.length);
   }

   simulate(2);
   simulate(10);
}



