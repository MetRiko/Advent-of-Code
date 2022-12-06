library intcode;

import 'dart:convert';
import 'dart:io';
import 'dart:collection';

class _CodeIterator {
  int _itr = -1;
  int call() => _itr;
  void inc(int n) => _itr += n;
  int next() => ++_itr;
}

class IntcodeInterpreter {
  var itr = _CodeIterator();
  var mem = Map<int, int>();
  var stopped = true;

  void replace(int index, int value) => mem[index] = value;
  int read(int index) => mem[index]!;

  void loadCode(List<int> code) {
    mem = Map<int, int>.from(code.asMap());
  }

  void _runOp_Sum() {
    var p1 = mem[itr.next()]!;
    var p2 = mem[itr.next()]!;
    var p3 = mem[itr.next()]!;
    mem[p3] = mem[p1]! + mem[p2]!;
  }

  void _runOp_Mul() {
    var p1 = mem[itr.next()]!;
    var p2 = mem[itr.next()]!;
    var p3 = mem[itr.next()]!;
    mem[p3] = mem[p1]! * mem[p2]!;
  }

  void run() {
    stopped = false;
    var opcodes = {1: _runOp_Sum, 2: _runOp_Mul, 99: () => stopped = true};

    itr = _CodeIterator();
    while (itr.next() < mem.length && !stopped) {
      opcodes[mem[itr()]!]!();
    }
  }
}
