import 'dart:convert';
import 'dart:io' as io;

String readFile(String path) => io.File(path).readAsStringSync(encoding: utf8).replaceAll('\r', '');

Iterable<int> range(int start, [int end = 0]) sync* {
   if (end <= 0) {
      for (int i = 0; i < start; ++i) yield i;
   }
   else {
      for (int i = start; i < end; ++i) yield i;
   }
}

class Vec2 { 
   int x; int y; 
   Vec2(this.x, this.y);
   Vec2 operator-(Vec2 v) => Vec2(x - v.x, y - v.y);
   Vec2 operator+(Vec2 v) => Vec2(x + v.x, y + v.y);
   Vec2 operator*(int v) => Vec2(x * v, y * v);
   @override
   String toString() => "Vec2($x, $y)"; 
}

Iterable<Vec2> range2(int startX, int endX, int startY, endY) sync* {
   for (int y = startY; y < endY; ++y) 
      for (int x = startX; x < endX; ++x) yield Vec2(x, y);
}

extension ArrayElementFromVec2<T> on List<List<T>> {
  T getV2(Vec2 pos) => this[pos.y][pos.x];
}