#include <cassert>
void by_value(int value) { ++value; assert(value == 4); }
void by_reference(int& value) { ++value; }
int main() {
  int original = 3;
  by_value(original);
  assert(original == 3);
  by_reference(original);
  assert(original == 4);
}
