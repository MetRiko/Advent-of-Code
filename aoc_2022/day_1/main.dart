import 'dart:convert';
import 'dart:io';
import 'package:collection/src/priority_queue.dart';
import 'package:dartx/dartx.dart';

String readFile(String path) => File(path).readAsStringSync(encoding: utf8).replaceAll('\r', '');

void main() {
   var data = readFile('data.txt').split('\n\n')
      .map((l) => l.split('\n').map(int.parse));
   
   var sums = data.map((vs) => vs.sum());
   var max = sums.max();
   print(max);

   var buffer = PriorityQueue<int>((a, b) => a-b);
   buffer.add(0);
   
   sums.forEach((sum) {
      if (sum > buffer.first) {
         buffer.add(sum);
         if (buffer.length > 3) {
            buffer.removeFirst();
         }
      }
   });

   print(buffer.unorderedElements);
   var sum3 = buffer.unorderedElements.sum();
   print(sum3);
}
