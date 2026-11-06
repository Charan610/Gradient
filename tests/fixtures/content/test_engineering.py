import unittest


def read_task(rows, verified_owner, task_id):
    record = rows.get((verified_owner, task_id))
    return (404, {"error": "Task not found"}) if record is None else (200, record)


def decode_frames(chunks):
    remaining = b""
    for chunk in chunks:
        remaining += chunk
        while b"\n" in remaining:
            word, remaining = remaining.split(b"\n", 1)
            if not word or not word.isalpha():
                raise ValueError("Expected a nonempty ASCII word")
            yield word.decode("ascii")
    if remaining:
        raise ValueError("Incomplete frame")


class EngineeringTests(unittest.TestCase):
    def test_scope_boundary(self):
        rows = {("alice", 1): {"title": "Write tests"}}
        self.assertEqual(read_task(rows, "alice", 1), (200, {"title": "Write tests"}))
        self.assertEqual(read_task(rows, "bob", 1), (404, {"error": "Task not found"}))
        self.assertEqual(read_task(rows, "bob", 1), read_task(rows, "bob", 999))

    def test_stream_chunking(self):
        expected = ["hello", "world"]
        self.assertEqual(list(decode_frames([b"he", b"llo\nwo", b"rld\n"])), expected)
        self.assertEqual(list(decode_frames([b"hello\nworld\n"])), expected)
        with self.assertRaises(ValueError):
            list(decode_frames([b"unfinished"]))
        with self.assertRaises(ValueError):
            list(decode_frames([b"\n"]))


if __name__ == "__main__":
    unittest.main()
