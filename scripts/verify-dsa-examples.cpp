// Standalone verification of the original curriculum examples; not a learner grader.
// clang++ -std=c++17 -Wall -Wextra -Werror -pedantic scripts/verify-dsa-examples.cpp -o /tmp/verify-dsa-examples
#include <algorithm>
#include <cassert>
#include <iostream>
#include <numeric>
#include <optional>
#include <queue>
#include <stack>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <vector>

using Vec = std::vector<int>;
using Wide = long long;

Wide sum(const Vec& a) {
    Wide result = 0;
    for (int x : a) result += x;
    return result;
}
void addToAll(Vec& a, int delta) {
    for (int& x : a) x += delta;
}
Wide pairVisits(int n) {
    Wide count = 0;
    for (int i = 0; i < n; ++i)
        for (int j = i + 1; j < n; ++j) ++count;
    return count;
}
std::vector<Wide> prefixes(const Vec& a) {
    std::vector<Wide> p(a.size() + 1, 0);
    for (std::size_t i = 0; i < a.size(); ++i) p[i + 1] = p[i] + a[i];
    return p;
}
Wide rangeSum(const std::vector<Wide>& p, int l, int r) {
    if (l < 0 || r < l || r >= static_cast<int>(p.size()))
        throw std::invalid_argument("range");
    return p[r] - p[l];
}
bool hasPair(const Vec& a, Wide target) {
    if (a.size() < 2) return false;
    std::size_t l = 0, r = a.size() - 1;
    while (l < r) {
        Wide s = static_cast<Wide>(a[l]) + a[r];
        if (s == target) return true;
        if (s < target) ++l;
        else --r;
    }
    return false;
}
bool contains(const Vec& a, int target, Vec* trace = nullptr) {
    std::size_t lo = 0, hi = a.size();
    while (lo < hi) {
        auto mid = lo + (hi - lo) / 2;
        if (trace) trace->push_back(a[mid]);
        if (a[mid] == target) return true;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return false;
}
std::size_t firstAtLeast(const Vec& a, int target) {
    std::size_t lo = 0, hi = a.size();
    while (lo < hi) {
        auto mid = lo + (hi - lo) / 2;
        if (a[mid] >= target) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}
std::size_t sortDistinct(Vec& a) {
    std::sort(a.begin(), a.end());
    std::size_t count = 0;
    for (std::size_t i = 0; i < a.size(); ++i)
        if (i == 0 || a[i] != a[i - 1]) ++count;
    return count;
}
Vec mergeSorted(const Vec& a, const Vec& b) {
    Vec out;
    std::size_t i = 0, j = 0;
    while (i < a.size() && j < b.size()) {
        if (a[i] <= b[j]) out.push_back(a[i++]);
        else out.push_back(b[j++]);
    }
    while (i < a.size()) out.push_back(a[i++]);
    while (j < b.size()) out.push_back(b[j++]);
    return out;
}
using Counts = std::unordered_map<int, int>;
Counts frequencies(const Vec& a) {
    Counts f;
    for (int x : a) ++f[x];
    return f;
}
int frequency(const Counts& f, int x) {
    auto it = f.find(x);
    return it == f.end() ? 0 : it->second;
}
std::optional<Wide> bestFixedSum(const Vec& a, int k) {
    if (k <= 0 || k > static_cast<int>(a.size())) return std::nullopt;
    Wide current = std::accumulate(a.begin(), a.begin() + k, Wide{0});
    Wide best = current;
    for (std::size_t r = static_cast<std::size_t>(k); r < a.size(); ++r) {
        current += static_cast<Wide>(a[r]) - a[r - k];
        best = std::max(best, current);
    }
    return best;
}
std::size_t longestBudget(const Vec& a, Wide budget) {
    if (budget < 0 || std::any_of(a.begin(), a.end(), [](int x) { return x < 0; }))
        throw std::invalid_argument("nonnegative values and budget required");
    std::size_t left = 0, best = 0;
    Wide current = 0;
    for (std::size_t right = 0; right < a.size(); ++right) {
        current += a[right];
        while (current > budget) current -= a[left++];
        // right+1-left also represents an empty window without unsigned wrap.
        best = std::max(best, right + 1 - left);
    }
    return best;
}
bool balanced(const std::string& s) {
    std::stack<char> opened;
    for (char c : s) {
        if (c == '(') opened.push(c);
        else if (c == ')') {
            if (opened.empty()) return false;
            opened.pop();
        } else return false;
    }
    return opened.empty();
}
std::optional<int> serve(std::queue<int>& q) {
    if (q.empty()) return std::nullopt;
    int value = q.front();
    q.pop();
    return value;
}
struct ListNode { int value; int next; };
// Contract: pool links are valid indices or -1 and the reachable chain is acyclic.
Vec listValues(const std::vector<ListNode>& pool, int head) {
    Vec out;
    for (int i = head; i != -1; i = pool.at(i).next) out.push_back(pool.at(i).value);
    return out;
}
void popHead(const std::vector<ListNode>& pool, int& head) {
    if (head != -1) head = pool.at(head).next;
}
void subsetsVisit(const Vec& a, std::size_t i, Vec& path, std::vector<Vec>& out) {
    if (i == a.size()) { out.push_back(path); return; }
    subsetsVisit(a, i + 1, path, out);
    path.push_back(a[i]);
    subsetsVisit(a, i + 1, path, out);
    path.pop_back();
}
std::vector<Vec> subsets(const Vec& a) {
    Vec path;
    std::vector<Vec> out;
    subsetsVisit(a, 0, path, out);
    assert(path.empty());
    return out;
}
struct TreeNode { int value; int left; int right; };
// Contract: valid tree indices, no cycles, and no child shared by two parents.
void traverse(const std::vector<TreeNode>& tree, int root, Vec& pre, Vec& in, Vec& post) {
    if (root == -1) return;
    const auto& node = tree.at(root);
    pre.push_back(node.value);
    traverse(tree, node.left, pre, in, post);
    in.push_back(node.value);
    traverse(tree, node.right, pre, in, post);
    post.push_back(node.value);
}
std::vector<Vec> graph(int n, const std::vector<std::pair<int, int>>& edges) {
    if (n < 0) throw std::invalid_argument("vertex count");
    std::vector<Vec> adj(n);
    for (auto [u, v] : edges) {
        if (u < 0 || v < 0 || u >= n || v >= n) throw std::invalid_argument("endpoint");
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    return adj;
}
Vec components(const std::vector<Vec>& adj, bool bfs) {
    std::vector<bool> seen(adj.size(), false);
    Vec sizes;
    for (std::size_t start = 0; start < adj.size(); ++start) {
        if (seen[start]) continue;
        seen[start] = true;
        int size = 0;
        std::queue<int> queue;
        std::stack<int> stack;
        if (bfs) queue.push(static_cast<int>(start));
        else stack.push(static_cast<int>(start));
        while (bfs ? !queue.empty() : !stack.empty()) {
            int u = bfs ? queue.front() : stack.top();
            if (bfs) queue.pop(); else stack.pop();
            ++size;
            for (int v : adj[u]) {
                if (seen[v]) continue;
                seen[v] = true;
                if (bfs) queue.push(v); else stack.push(v);
            }
        }
        sizes.push_back(size);
    }
    return sizes;
}
Wide ways(int n) {
    if (n < 0 || n > 40) throw std::invalid_argument("step count");
    std::vector<Wide> dp(n + 1, 0);
    dp[0] = 1;
    if (n >= 1) dp[1] = 1;
    for (int i = 2; i <= n; ++i) dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}
class ReadingLog {
    std::vector<Wide> prefix_;
    Vec sorted_;
    Counts counts_;
public:
    explicit ReadingLog(const Vec& pages) {
        if (pages.size() > 100 || std::any_of(pages.begin(), pages.end(),
                [](int x) { return x < 0 || x > 1000; }))
            throw std::invalid_argument("pages");
        prefix_ = prefixes(pages);
        sorted_ = pages;
        std::sort(sorted_.begin(), sorted_.end());
        counts_ = frequencies(pages);
    }
    Wide total(int l, int r) const { return rangeSum(prefix_, l, r); }
    std::optional<int> firstValueAtLeast(int x) const {
        auto i = firstAtLeast(sorted_, x);
        if (i == sorted_.size()) return std::nullopt;
        return sorted_[i];
    }
    int count(int x) const { return frequency(counts_, x); }
};
template<class F> void rejects(F f) {
    bool threw = false;
    try { f(); } catch (const std::invalid_argument&) { threw = true; }
    assert(threw);
}
void checkLog(const Vec& a) {
    ReadingLog log(a);
    for (int l = 0; l <= static_cast<int>(a.size()); ++l)
        for (int r = l; r <= static_cast<int>(a.size()); ++r) {
            Wide direct = 0;
            for (int i = l; i < r; ++i) direct += a[i];
            assert(log.total(l, r) == direct);
        }
    for (int x : {-2, 0, 1, 2, 3, 4, 5, 6, 1001}) {
        std::optional<int> direct;
        int count = 0;
        for (int v : a) {
            if (v >= x && (!direct || v < *direct)) direct = v;
            if (v == x) ++count;
        }
        assert(log.firstValueAtLeast(x) == direct);
        assert(log.count(x) == count);
    }
    rejects([&] { log.total(-1, 0); });
    rejects([&] { log.total(1, 0); });
    rejects([&] { log.total(0, static_cast<int>(a.size()) + 1); });
}
int main() {
    // D01-D04: vector, references, complexity, prefix boundaries.
    Vec a{4, -2}; a.push_back(7);
    assert((a == Vec{4, -2, 7})); assert(sum(a) == 9);
    assert(sum({}) == 0 && sum({-8}) == -8 && sum({6, -3, 2}) == 5);
    Vec mutableValues{3, -1}; addToAll(mutableValues, 2);
    assert((mutableValues == Vec{5, 1})); assert(sum(mutableValues) == 6);
    Vec empty; addToAll(empty, 2); assert(empty.empty());
    Vec shifted{0, 4}; addToAll(shifted, -2); assert((shifted == Vec{-2, 2}));
    for (int n = 0; n <= 10; ++n) assert(pairVisits(n) == n * (n - 1) / 2);
    auto p = prefixes({5, -2, 4, 1});
    assert((p == std::vector<Wide>{0, 5, 3, 7, 8})); assert(rangeSum(p, 1, 4) == 3);
    auto q = prefixes({2, -5, 6, 0});
    assert(rangeSum(q, 0, 4) == 3 && rangeSum(q, 1, 3) == 1 && rangeSum(q, 2, 2) == 0);
    assert(rangeSum(prefixes({}), 0, 0) == 0);
    rejects([&] { rangeSum(p, -1, 2); }); rejects([&] { rangeSum(p, 2, 1); });
    rejects([&] { rangeSum(p, 0, 5); });

    // D05-D10: sorted algorithms, merge, and hashing.
    assert(hasPair({-4, 1, 3, 8}, 4));
    assert(hasPair({-3, 0, 2, 6}, 3) && !hasPair({-3, 0, 2, 6}, 12));
    assert(!hasPair({}, 0) && !hasPair({6}, 12) && hasPair({6, 6}, 12));
    assert(hasPair({-5, -2, 1}, -7));
    Vec trace; assert(contains({-5, 0, 4, 9, 12}, 9, &trace));
    assert((trace == Vec{4, 12, 9}));
    assert(firstAtLeast({-2, 3, 3, 3, 8}, 3) == 1);
    assert(firstAtLeast({-2, 3, 3, 3, 8}, 9) == 5);
    for (Vec sorted : std::vector<Vec>{{}, {4}, {4, 4}, {-2, 1, 1, 7}, {1, 4, 4, 9}}) {
        for (int x = -4; x <= 12; ++x) {
            assert(contains(sorted, x) == (std::find(sorted.begin(), sorted.end(), x) != sorted.end()));
            auto expected = std::lower_bound(sorted.begin(), sorted.end(), x) - sorted.begin();
            assert(firstAtLeast(sorted, x) == static_cast<std::size_t>(expected));
            bool directPair = false;
            for (std::size_t i = 0; i < sorted.size(); ++i)
                for (std::size_t j = i + 1; j < sorted.size(); ++j)
                    directPair = directPair || static_cast<Wide>(sorted[i]) + sorted[j] == x;
            assert(hasPair(sorted, x) == directPair);
        }
    }
    Vec sortExample{7, -1, 7, 2}; assert(sortDistinct(sortExample) == 3);
    assert((sortExample == Vec{-1, 2, 7, 7}));
    Vec sortExercise{3, -2, 3, 0, -2}; assert(sortDistinct(sortExercise) == 3);
    assert((sortExercise == Vec{-2, -2, 0, 3, 3}));
    assert(sortDistinct(empty) == 0);
    Vec equal{2, 2}; assert(sortDistinct(equal) == 1);
    assert((mergeSorted({-3, 2, 2}, {-1, 2, 5}) == Vec{-3, -1, 2, 2, 2, 5}));
    assert((mergeSorted({-4, 6}, {-4, 0, 8}) == Vec{-4, -4, 0, 6, 8}));
    assert(mergeSorted({}, {}).empty());
    assert((mergeSorted({}, {1}) == Vec{1}) && (mergeSorted({1}, {}) == Vec{1}));
    assert((mergeSorted({1, 2}, {3}) == Vec{1, 2, 3}));
    auto f = frequencies({4, -1, 4, 2, -1, 4});
    assert(frequency(f, -1) == 2 && frequency(f, 2) == 1 && frequency(f, 4) == 3);
    auto g = frequencies({5, 0, 5, -2, 0});
    assert(frequency(g, -2) == 1 && frequency(g, 0) == 2 && frequency(g, 5) == 2);
    assert(frequency(g, 9) == 0 && g.size() == 3 && frequency(frequencies({}), 1) == 0);

    // D11-D12: compare moving windows against independent nested-loop sums.
    assert(bestFixedSum({-4, 6, -1, 3, -5}, 2) == 5);
    assert(bestFixedSum({-7, -2, -5}, 2) == -7);
    assert(bestFixedSum({-7, -2, -5}, 1) == -2 && bestFixedSum({-7, -2, -5}, 3) == -14);
    for (const Vec& values : std::vector<Vec>{{}, {-7, -2, -5}, {0}, {2, -1, 3, -4}}) {
        for (int k = 0; k <= static_cast<int>(values.size()) + 1; ++k) {
            std::optional<Wide> best;
            if (k > 0) for (int l = 0; l + k <= static_cast<int>(values.size()); ++l) {
                Wide s = 0;
                for (int i = l; i < l + k; ++i) s += values[i];
                if (!best || s > *best) best = s;
            }
            assert(bestFixedSum(values, k) == best);
        }
    }
    assert(longestBudget({2, 0, 3, 1, 2}, 4) == 3);
    assert(longestBudget({1, 2, 0, 1, 5}, 3) == 3);
    for (const Vec& values : std::vector<Vec>{{}, {0, 0}, {5}, {2, 0, 3, 1, 2}}) {
        for (int budget = 0; budget <= 9; ++budget) {
            std::size_t best = 0;
            for (std::size_t l = 0; l < values.size(); ++l) {
                Wide s = 0;
                for (std::size_t r = l; r < values.size(); ++r) {
                    s += values[r];
                    if (s <= budget) best = std::max(best, r + 1 - l);
                }
            }
            assert(longestBudget(values, budget) == best);
        }
    }
    rejects([] { longestBudget({5, -4}, 1); }); rejects([] { longestBudget({}, -1); });

    // D13-D16: containers, owned linked nodes, recursive state restoration.
    assert(balanced("(()())") && balanced("(())") && balanced(""));
    for (const std::string s : {")", "(", "())(", "(a)"}) assert(!balanced(s));
    std::queue<int> queue;
    queue.push(8); queue.push(3); assert(serve(queue) == 8); queue.push(5);
    assert(serve(queue) == 3 && serve(queue) == 5 && !serve(queue));
    queue.push(2); assert(serve(queue) == 2); queue.push(-1); queue.push(4);
    assert(serve(queue) == -1 && serve(queue) == 4 && !serve(queue));
    queue.push(0); assert(serve(queue) == 0 && !serve(queue));
    std::vector<ListNode> pool{{7, 2}, {9, -1}, {4, 1}}; int head = 0;
    assert((listValues(pool, head) == Vec{7, 4, 9})); popHead(pool, head);
    assert(head == 2 && (listValues(pool, head) == Vec{4, 9}) && pool.size() == 3);
    std::vector<ListNode> smallPool{{5, 1}, {-2, -1}}; head = 0;
    assert((listValues(smallPool, head) == Vec{5, -2})); popHead(smallPool, head);
    assert((listValues(smallPool, head) == Vec{-2})); popHead(smallPool, head); popHead(smallPool, head);
    assert(head == -1 && listValues(smallPool, head).empty() && smallPool.size() == 2);
    assert((subsets({2, 5}) == std::vector<Vec>{{}, {5}, {2}, {2, 5}}));
    assert((subsets({}) == std::vector<Vec>{{}}));
    auto generated = subsets({-1, 3, 6});
    assert(generated.size() == 8 && generated.front().empty() && (generated.back() == Vec{-1, 3, 6}));
    auto unique = generated; std::sort(unique.begin(), unique.end());
    assert(std::adjacent_find(unique.begin(), unique.end()) == unique.end());

    // D17-D19: tree order, graph components, and bounded DP.
    Vec pre, in, post;
    traverse({{4, 1, 3}, {7, -1, 2}, {1, -1, -1}, {9, -1, -1}}, 0, pre, in, post);
    assert((pre == Vec{4, 7, 1, 9}) && (in == Vec{7, 1, 4, 9}) && (post == Vec{1, 7, 9, 4}));
    pre.clear(); in.clear(); post.clear();
    traverse({{3, 1, 2}, {-2, -1, -1}, {8, 3, -1}, {5, -1, -1}}, 0, pre, in, post);
    assert((pre == Vec{3, -2, 8, 5}) && (in == Vec{-2, 3, 5, 8}) && (post == Vec{-2, 5, 8, 3}));
    pre.clear(); in.clear(); post.clear(); traverse({}, -1, pre, in, post);
    assert(pre.empty() && in.empty() && post.empty());
    traverse({{6, -1, -1}}, 0, pre, in, post);
    assert((pre == Vec{6}) && pre == in && in == post);
    for (bool bfs : {false, true}) {
        assert((components(graph(6, {{0, 1}, {1, 2}, {3, 4}}), bfs) == Vec{3, 2, 1}));
        assert((components(graph(5, {{0, 1}, {1, 2}, {2, 0}, {3, 4}}), bfs) == Vec{3, 2}));
        assert((components(graph(3, {}), bfs) == Vec{1, 1, 1}));
        assert(components(graph(0, {}), bfs).empty());
        assert((components(graph(2, {{0, 1}, {0, 1}, {1, 1}}), bfs) == Vec{2}));
    }
    rejects([] { graph(2, {{-1, 0}}); }); rejects([] { graph(2, {{0, 2}}); });
    rejects([] { graph(-1, {}); });
    assert(ways(0) == 1 && ways(1) == 1 && ways(2) == 2 && ways(4) == 5);
    assert(ways(6) == 13 && ways(40) == 165580141);
    // Independent enumeration of move strings for small n checks the DP recurrence.
    for (int n = 0; n <= 8; ++n) {
        Wide enumerated = 0;
        for (int length = 0; length <= n; ++length)
            for (int mask = 0; mask < (1 << length); ++mask) {
                int reached = 0;
                for (int i = 0; i < length; ++i) reached += (mask & (1 << i)) ? 2 : 1;
                if (reached == n) ++enumerated;
            }
        assert(ways(n) == enumerated);
    }
    rejects([] { ways(-1); }); rejects([] { ways(41); });

    // D20: report and direct-scan query oracles on independent tiny datasets.
    ReadingLog example({3, 0, 3, 5, 1});
    assert(example.total(1, 4) == 8 && example.firstValueAtLeast(2) == 3 && example.count(3) == 2);
    ReadingLog exercise({2, 4, 0, 2});
    assert(exercise.total(1, 4) == 6 && exercise.firstValueAtLeast(3) == 4 && exercise.count(2) == 2);
    for (const Vec& values : std::vector<Vec>{{}, {0}, {3, 3, 3}, {3, 0, 3, 5, 1}, {2, 4, 0, 2}, {1000, 0}})
        checkLog(values);
    rejects([] { ReadingLog bad({-1}); }); rejects([] { ReadingLog bad({1001}); });
    rejects([] { ReadingLog bad(Vec(101, 0)); });
    std::cout << "Verified all 20 lesson examples, bounded exercises, and edge checks.\n";
}
