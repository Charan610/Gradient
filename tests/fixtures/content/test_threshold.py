import unittest
from threshold import count_at_least


def strict_comparison_bug(values, threshold):
    return sum(value > threshold for value in values)


class ThresholdTests(unittest.TestCase):
    def test_counts_each_qualifying_occurrence(self):
        self.assertEqual(count_at_least([-3, -2, 0, -2], -2), 3)

    def test_empty_and_no_match(self):
        self.assertEqual(count_at_least([], 0), 0)
        self.assertEqual(count_at_least([1, 2], 3), 0)

    def test_boundary_exposes_mutation(self):
        def assert_boundary(implementation):
            self.assertEqual(implementation([-2], -2), 1)
        assert_boundary(count_at_least)
        with self.assertRaises(AssertionError):
            assert_boundary(strict_comparison_bug)


if __name__ == "__main__":
    unittest.main()
