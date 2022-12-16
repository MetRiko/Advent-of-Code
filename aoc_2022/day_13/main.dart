import 'dart:convert';
import 'dart:math';
import 'package:dartx/dartx.dart';

import 'helpers.dart';

class Pair {
   List<dynamic> l, r;
   Pair(this.l, this.r);
   @override
   String toString() => "$l\n$r";
}

void main() {
   var pairs = readFile('data.txt').split('\n\n').map((p) {
      var ls = p.split('\n');
      return Pair(jsonDecode(ls[0]), jsonDecode(ls[1]));
   }).toList();

   int _check(List<dynamic> l, List<dynamic> r) {
      var result = 0;
      if (l.length != r.length && (l.length == 0 || r.length == 0)) return (r.length - l.length).sign;
      var m = max(l.length, r.length);
      for (var i = 0; i < m; ++i) {
         if (i == l.length && i < r.length) return 1;
         if (i < l.length && i == r.length) return -1;
         var lv = l[i];
         var rv = r[i];
         if (lv is int && rv is int) {
            if (lv != rv) {
               result = lv < rv ? 1 : -1;
            }
         }
         else if (lv is int && rv is List<dynamic>) {
            result = _check(<dynamic>[lv], rv);
         }
         else if (lv is List<dynamic> && rv is int) {
            result = _check(lv, <dynamic>[rv]);
         }
         else {
            result = _check(lv, rv);
         }
         if (result != 0) return result;
      }
      return result;
   }

   bool check(List<dynamic> l, List<dynamic> r) => _check(l, r) == 1 ? true : false;

   var checks = pairs.map((p) => check(p.l, p.r)).toList();
   var score = checks.asMap().entries.fold(0, (acc, v) => v.value ? acc + v.key + 1 : acc);
   print("Part 1: $score");

   var divPacketA = [[2]];
   var divPacketB = [[6]];
   var allPackets = [...pairs.flatMap((p) => [p.l, p.r]), divPacketA, divPacketB];

   var compatiblePairs = <int, List<int>>{};
   for (int a = 0; a < allPackets.length; ++a) {
      var ap = allPackets[a];
      for (int b = 0; b < allPackets.length; ++b) {
         if (a == b) continue;
         var bp = allPackets[b];
         if (check(ap, bp)) {
            compatiblePairs.update(a, (comps) { comps.add(b); return comps; }, ifAbsent: () => [b]);
         }
      }
   }
   var sortedCompatiblePairs = compatiblePairs.entries.sortedBy((x) => -x.value.length);
   var idxDivPacketA = sortedCompatiblePairs.indexWhere((e) => allPackets[e.key] == divPacketA) + 1;
   var idxDivPacketB = sortedCompatiblePairs.indexWhere((e) => allPackets[e.key] == divPacketB) + 1;
   // print(sortedCompatiblePairs.map((e) => "${e.value.length}\t${allPackets[e.key]} : ${e.value.map((e) => allPackets[e]).join(', ')}").join('\n'));
   // print(sortedCompatiblePairs.map((e) => "${e.value.length}\t${allPackets[e.key]}").join('\n'));
   print("Part 2: ${idxDivPacketA * idxDivPacketB}");   
}




