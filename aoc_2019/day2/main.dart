import 'dart:convert';
import 'dart:io';
import 'dart:collection';
import 'intcode.dart';

void task_1() {
  var ints = new File("input.txt").readAsStringSync().split(',').map(int.parse).toList();
  // var ints = [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50];

  var interpreter = IntcodeInterpreter()..loadCode(ints);
  interpreter.replace(1, 12);
  interpreter.replace(2, 2);
  interpreter.run();
  print(interpreter.read(0));
}

void task_2() {
  var ints = new File("input.txt").readAsStringSync().split(',').map(int.parse).toList();
  // var ints = [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50];

  for (var noun = 0; noun < 100; ++noun) {
    for (var verb = 0; verb < 100; ++verb) {
      var interpreter = IntcodeInterpreter()..loadCode(ints);
      interpreter.replace(1, noun);
      interpreter.replace(2, verb);
      interpreter.run();
      if (interpreter.read(0) == 19690720) {
        print(100 * noun + verb);
        return;
      }
    }
  }
}

void main() {
  task_1();
  task_2();
}
