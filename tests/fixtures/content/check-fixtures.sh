#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
work=$(mktemp -d /tmp/gradient-content.XXXXXX)
cleanup() {
  if [[ -f "$work/db/postmaster.pid" ]]; then pg_ctl -D "$work/db" -m immediate -w stop >/dev/null; fi
  rm -rf "$work"
}
trap cleanup EXIT
for fixture in references boundary; do
  "${CXX:-c++}" -std=c++20 -Wall -Wextra -Wpedantic -Werror "$fixture.cpp" -o "$work/$fixture"
  "$work/$fixture"
done
initdb -D "$work/db" -A trust -U fixture >/dev/null
pg_ctl -D "$work/db" -l "$work/postgres.log" -o "-c listen_addresses='' -k $work" -w start >/dev/null
python3 check-isolation.py "$work"
psql -Xq -v ON_ERROR_STOP=1 -h "$work" -p 5432 -U fixture -d postgres -f engineering.sql
python3 -B test_engineering.py
echo 'Passed: value/reference, binary-search boundaries, two-session Read Committed transfer, LEFT JOIN, cited lexical search, task ownership and stream framing.'
