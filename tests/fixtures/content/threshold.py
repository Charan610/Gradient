def count_at_least(values: list[int], threshold: int) -> int:
    count = 0
    for value in values:
        if value >= threshold:
            count += 1
    return count


if __name__ == "__main__":
    print(count_at_least([2, 5, 5, 8], 5))
