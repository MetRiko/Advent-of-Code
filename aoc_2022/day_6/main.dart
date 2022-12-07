import 'dart:convert';
import 'dart:io';
import 'package:quiver/iterables.dart';

void main() {
   var data = File('data.txt').readAsStringSync(encoding: utf8).split('');
   // var findIdx = (int count) => 1 + range(count - 1, data.length).firstWhere((i) => range(count).map((off) => data[i - off]).toSet().length == count);
   var findIdx = (int count) => 1 + range(count - 1, data.length).firstWhere((i) => data.sublist(i - count + 1, i + 1).toSet().length == count);
   var endIdx = findIdx(4);
   var startIdx = findIdx(14);
   print("$endIdx $startIdx");
}


