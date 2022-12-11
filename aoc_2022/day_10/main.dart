import 'helpers.dart';

class System {
   int cycle = 0;
   int reg = 1;
   int nextCheck = 20;
   int sum = 0;
   List<String> screen = [];
   var sprite = '█' * 3 + ' ' * 37;

   void runProgram(Iterable<Cmd> cmds) {
      cmds.forEach(runCmd);
      print("Part 1: $sum");
      print("Part 2:");
      for (var y = 0; y < 6; ++y) {
         var line = screen.sublist(y * 40, (y + 1) * 40);
         print(line.join(''));
      }
   }
   void runCmd(Cmd cmd) {
      cycle += cmd.cost;
      for (int i = 0; i < cmd.cost; ++i) screen.add(sprite[(sprite.length - reg + 1 + screen.length) % sprite.length]);
      if (cycle >= nextCheck) {
         // print("$cycle -> $reg");
         sum += (cycle + 1) ~/ 10 * 10 * reg;
         nextCheck += 40;
      }
      cmd.run(this);
   }
}

class Cmd {
   int get cost => 0;
   void run(System sys) {}
   factory Cmd.create(List<String> args) {
      if (args[0] == 'addx') return CmdAdd(int.parse(args[1]));
      else return CmdNoop();
   }
}

class CmdAdd implements Cmd {
   int get cost => 2;
   int value;
   CmdAdd(this.value);
   void run(System sys) => sys.reg += value;
}

class CmdNoop implements Cmd {
   int get cost => 1;
   void run(System sys) {}
}

void main() {
   var commands = readFile('data.txt').split('\n').map((l) => l.split(' ').toList()).map(Cmd.create);

   var sys = System();
   sys.runProgram(commands);
}



