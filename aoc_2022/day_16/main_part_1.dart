import 'dart:math';
import 'package:dartx/dartx.dart';

import 'helpers.dart';

class Valve {
   String name;
   int rate;
   List<String> valves;
   Valve(this.name, this.rate, this.valves);
   @override
   String toString() => "$name $rate $valves";
}

class Status {
   String currentValve;
   int timeLeft;
   int score = 0;
   Set<String> openedValves = {};
   Status(this.currentValve, this.timeLeft, this.score, [this.openedValves = const {}]);
   @override
   String toString() => "$currentValve $timeLeft : ($score) ${openedValves}";
}

void main() {
   var data = readFile('data.txt').split('\n').map((l) {
      var g = RegExp(r'([A-Z][A-Z]).*?(\d+).*ve.? (.*)').regexSingle(l, [1, 2, 3]);
      return Valve(g[0], int.parse(g[1]), g[2].split(', ').toList());
   }).toDictionary((v) => v.name);

   var status = [Status('AA', 30, 0)];
   while (true) {
      var nextStatus = <Status>[];
      for (var s in status) {
         var valve = data[s.currentValve]!;
         var time = s.timeLeft - 1;
         if (s.timeLeft > 0) {
            for (var v in valve.valves) {
               nextStatus.add(Status(v, time, s.score, {...s.openedValves}));
            }
            if (!s.openedValves.contains(s.currentValve) && valve.rate > 0) {
               nextStatus.add(Status(s.currentValve, time, s.score + time * valve.rate, {...s.openedValves, s.currentValve}));
            }
         }
      }
      if (nextStatus.length == 0) {
         break;
      }
      nextStatus.sort((a, b) => b.score - a.score);
      status = nextStatus.take(1000).toList();
      // print('');
      // print(status.join('\n'));
   }

   var bestScore = status.first.score;
   print(bestScore);
   // print(status.join('\n'));
}




