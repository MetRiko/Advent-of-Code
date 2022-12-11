import 'package:dartx/dartx.dart';
import 'helpers.dart';

class Monkey {
   late int id;
   late List<int> items;
   late int div;
   late int Function(int) updateItem;
   late int Function(int) nextMonkey;
   int counter = 0;

   Monkey.fromString(String str) {
      var groups = RegExp(r'(\d+).*?(\d.*)\n.*= (.*?)\n.*?(\d+).*?(\d+).*?(\d+)', dotAll: true).firstMatch(str)!.groups([1,2,3,4,5,6]);
      id = groups[0]!.toInt();
      items = groups[1]!.split(', ').map(int.parse).toList();
      var expr = groups[2]!.split(' ').toList();
      if (expr[2] == 'old') updateItem = (x) => x * x;
      else {
         var val = expr[2].toInt();
         updateItem = expr[1] == '*' ? (x) => x * val : (x) => x + val;
      }
      div = groups[3]!.toInt();
      var monkeyA = groups[4]!.toInt();
      var monkeyB = groups[5]!.toInt();
      nextMonkey = (x) => x % div == 0 ? monkeyA : monkeyB; // issue Big % Big == int
   }
}

void main() {
   var monkeys = readFile('data.txt').split('\n\n').map(Monkey.fromString).toList();

   void playRounds(int times, bool canBeBored) {
      var modulator = monkeys.map((m) => m.div).reduce((acc, v) => acc * v);
      for (var i = 0; i < times; ++i) {
         for (var monkey in monkeys) {
            for (var item in monkey.items) {
               item = monkey.updateItem(item) % modulator;
               if (canBeBored) item ~/= 3;
               var nextMonkeyIdx = monkey.nextMonkey(item);
               monkeys[nextMonkeyIdx].items.add(item);
               ++monkey.counter;
            }
            monkey.items.clear();
         }
         print("${i+1} / $times");
      }
   }

   // playRounds(20, true);
   playRounds(10000, false);

   // print(monkeys.map((m) => "${m.id}: ${m.counter}").join('\n'));
   var values = monkeys.map((m) => m.counter).toList();
   var max_1 = values.max()!;
   values.remove(max_1);
   var max_2 = values.max()!;
   print("Result: ${max_1 * max_2}");
}



