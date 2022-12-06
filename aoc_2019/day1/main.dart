import 'dart:convert';
import 'dart:io';
import 'dart:collection';

int calcFuel(int mass) => (mass / 3).floor() - 2;
int calcFuel2(int mass) {
  var fuel = (mass / 3).floor() - 2;
  return fuel > 0 ? fuel + calcFuel2(fuel) : 0;
}

void main() {
  var masses = new File("input.txt").readAsLinesSync().map((s) => int.parse(s));

  var sum1 = masses.map(calcFuel).reduce((a, b) => a + b);
  print(sum1);

  var sum2 = masses.map(calcFuel2).reduce((a, b) => a + b);
  print(sum2);
}
