"""Use only the disposable Unix socket passed by check-fixtures.sh."""
import subprocess
import sys

command = ["psql", "-XqAt", "-v", "ON_ERROR_STOP=1", "-h", sys.argv[1],
           "-p", "5432", "-U", "fixture", "-d", "postgres"]
balances = "SELECT string_agg(balance::text, ',' ORDER BY id) FROM accounts;"

def statement(session, sql):
    session.stdin.write(sql + "\n")
    session.stdin.flush()
    return session.stdout.readline().strip()

with (
    subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True) as writer,
    subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True) as reader,
):
    try:
        assert statement(writer, "CREATE TABLE accounts (id int PRIMARY KEY, balance int); "
                         "INSERT INTO accounts VALUES (1,100),(2,100); SELECT 'seeded';") == "seeded"
        assert statement(writer, "BEGIN; UPDATE accounts SET balance=90 WHERE id=1; "
                         "UPDATE accounts SET balance=110 WHERE id=2; SELECT 'ready';") == "ready"
        assert statement(reader, "BEGIN ISOLATION LEVEL READ COMMITTED; " + balances) == "100,100"
        assert statement(writer, "COMMIT; SELECT 'committed';") == "committed"
        assert statement(reader, balances) == "90,110"
        assert statement(reader, "ROLLBACK; SELECT 'done';") == "done"
    finally:
        writer.terminate()
        reader.terminate()
