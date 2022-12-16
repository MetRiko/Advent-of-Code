import 'dart:math';
import 'package:dartx/dartx.dart';
import 'package:quiver/collection.dart';

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
   List<String> currentValves;
   int timeLeft;
   int score = 0;
   Set<String> openedValves = {};
   Status(this.currentValves, this.timeLeft, this.score, [this.openedValves = const {}]);
   @override
   String toString() => "$currentValves $timeLeft : ($score) ${openedValves}";
}

void main() {
   var data = readFile('data.txt').split('\n').map((l) {
      var g = RegExp(r'([A-Z][A-Z]).*?(\d+).*ve.? (.*)').regexSingle(l, [1, 2, 3]);
      return Valve(g[0], int.parse(g[1]), g[2].split(', ').toList());
   }).toDictionary((v) => v.name);

   var status = [Status(['AA', 'AA'], 26, 0)];
   while (true) {
      var nextStatus = <Status>[];
      for (var s in status) {
         if (s.timeLeft == 0) break;
         var aValves = data[s.currentValves[0]]!.valves;
         var bValves = data[s.currentValves[1]]!.valves;
         for (int a = 0; a <= aValves.length; ++a) {
            var aNextValve = data[s.currentValves[0]]!;
            for (int b = 0; b <= bValves.length; ++b) {
               var bNextValve = data[s.currentValves[1]]!;
               var openedValves = {...s.openedValves};
               var newStatus = Status([s.currentValves[0], s.currentValves[1]], s.timeLeft - 1, s.score, openedValves);

               if (a < aValves.length) {
                  newStatus.currentValves[0] = aValves[a];
               }
               else if (!openedValves.contains(s.currentValves[0]) && aNextValve.rate > 0) {
                  openedValves.add(s.currentValves[0]);
                  newStatus.score += aNextValve.rate * newStatus.timeLeft;
               }
               if (b < bValves.length) {
                  newStatus.currentValves[1] = bValves[b];
               }
               else if (!openedValves.contains(s.currentValves[1]) && bNextValve.rate > 0) {
                  openedValves.add(s.currentValves[1]);
                  newStatus.score += bNextValve.rate * newStatus.timeLeft;
               }
               nextStatus.add(newStatus);         
            }   
         }
      }
      if (nextStatus.length == 0) {
         break;
      }
      nextStatus.sort((a, b) => b.score - a.score);
      status = nextStatus.take(10000).toList();
      // print('');
      // print(status.join('\n'));
      print(status.first.timeLeft);
   }

   var bestScore = status.first.score;
   print(bestScore);
   // print(status.join('\n'));
}




