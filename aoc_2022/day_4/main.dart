import 'dart:convert';
import 'dart:io';

String readFile(String path) => File(path).readAsStringSync(encoding: utf8).replaceAll('\r', '');

void main() {

   var lines = readFile('data.txt').split('\n')
      .map((l) => l.split(new RegExp(r'[-,]')).map(int.parse).toList())
      .toList();

   var count = lines.fold(0, (count, l) => count + (checkFullOverlap(l[0], l[1], l[2], l[3]) ? 1 : 0));
   print(count);

   var count2 = lines.fold(0, (count, l) => count + (checkAnyOverlap(l[0], l[1], l[2], l[3]) ? 1 : 0));
   print(count2);

}

bool checkFullOverlap(int l1, int r1, int l2, int r2) {
   if (l1 >= l2 && r1 <= r2) return true;
   if (l2 >= l1 && r2 <= r1) return true;
   return false;
}

bool checkAnyOverlap(int l1, int r1, int l2, int r2) {
   if (r1 < l2 || r2 < l1) return false;
   return true;
}