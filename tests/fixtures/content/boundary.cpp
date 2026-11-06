#include <cassert>
#include <vector>
std::size_t boundary(const std::vector<int>& values, int target) {
  std::size_t lo = 0, hi = values.size();
  while (lo < hi) {
    const auto mid = lo + (hi - lo) / 2;
    if (values[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
int main() {
  assert(boundary({}, 3) == 0);
  assert(boundary({1, 3, 3, 8}, 3) == 1);
  assert(boundary({1, 3, 3, 8}, -1) == 0);
  assert(boundary({1, 3, 3, 8}, 9) == 4);
}
