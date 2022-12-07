import 'dart:convert';
import 'dart:io' as io;
import 'package:collection/collection.dart';

String readFile(String path) => io.File(path).readAsStringSync(encoding: utf8).replaceAll('\r', '');

class File {
   Dir parent; String name; int size;
   File(this.parent, this.name, this.size);
}

class Dir {
   Dir parent; String name;
   Dir(this.parent, this.name);
   Map<String, File> files = {};
   Map<String, Dir> dirs = {};
   int get totalSize => files.values.map((f) => f.size).sum + dirs.values.map((d) => d.totalSize).sum;
}

class System {
   Dir system = Dir(null, '/');
   Dir currentDir = null;

   System() {
      currentDir = system;
   }

   void addFile(String fileName, int size) => currentDir.files[fileName] = File(currentDir, fileName, size);
   void addDir(String dirName) => currentDir.dirs[dirName] = Dir(currentDir, dirName);
   void moveIn(String dirName) => currentDir = currentDir.dirs[dirName];
   void moveOut() => currentDir = currentDir.parent;

   List<int> getAllDirSizes() {
      var out = <int>[];
      _getAllDirSizes(system, out);
      return out;
   }

   void _getAllDirSizes(Dir currentDir, List<int> out) {
      out.add(currentDir.totalSize);
      currentDir.dirs.values.forEach((d) => _getAllDirSizes(d, out));
   }
}

void main() {

   var lines = readFile('data.txt').split('\n');
   // var lines = readFile('datatest.txt').split('\n');

   var system = System();
   for (var line in lines.skip(1)) {
      var code = line.split(' ').toList();
      if (code[0] == '\$') {
         if (code[1] == 'cd') {
            if (code[2] == '..') {
               system.moveOut();
            }
            else {
               system.moveIn(code[2]);
            }
         }
      }
      else if (code[0] == 'dir') {
         system.addDir(code[1]);
      }
      else {
         system.addFile(code[1], int.parse(code[0]));
      }
   }

   var sizes = system.getAllDirSizes();
   var totalToRemove = sizes.where((s) => s <= 100000).sum;
   print(totalToRemove);

   var availableSpace = 70000000 - system.system.totalSize;
   var missingSpace = 30000000 - availableSpace;
   
   var spaceToRemove = sizes.where((s) => s >= missingSpace).minOrNull;
   print(spaceToRemove);
}



