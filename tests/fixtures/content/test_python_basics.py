import unittest


def values_in_range(values, lower, upper):
    selected = []
    for value in values:
        if lower <= value <= upper:
            selected.append(value)
    return selected


class PythonBasicsTests(unittest.TestCase):
    def test_position_and_key(self):
        topics = ["loops", "functions"]
        counts = {"loops": 2}
        self.assertEqual((topics[0], counts[topics[0]]), ("loops", 2))
        counts["loops"] = 3
        self.assertEqual(counts, {"loops": 3})
        self.assertEqual(topics, ["loops", "functions"])

    def test_inclusive_boundaries_order_and_duplicates(self):
        self.assertEqual(values_in_range([4, 5, 8, 9, 5], 5, 8), [5, 8, 5])
        self.assertEqual(values_in_range([-3, -2, 0, 1], -2, 0), [-2, 0])
        self.assertEqual(values_in_range([], -2, 0), [])


if __name__ == "__main__":
    unittest.main()
