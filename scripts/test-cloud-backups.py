"""Run cloud snapshot RLS/quota/race checks in a disposable local PostgreSQL.

Never reads project credentials or connects to Supabase/production.
Requires initdb, pg_ctl and psql on PATH. No Docker or Python packages needed.
"""
import concurrent.futures
import json
import pathlib
import shutil
import subprocess
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
for executable in ('initdb', 'pg_ctl', 'psql'):
    if not shutil.which(executable):
        raise SystemExit(f'{executable} is required for the disposable PostgreSQL test.')

with tempfile.TemporaryDirectory(prefix='gradient-db-', dir='/tmp') as temporary:
    folder = pathlib.Path(temporary)
    database, socket = folder / 'data', folder / 'socket'
    socket.mkdir()
    subprocess.run(['initdb', '-D', str(database), '-U', 'postgres', '--auth=trust', '--no-locale', '--encoding=UTF8'], check=True, stdout=subprocess.DEVNULL)
    with (database / 'postgresql.conf').open('a') as config:
        config.write(f"\nlisten_addresses = ''\nunix_socket_directories = '{socket}'\nport = 55439\n")
    subprocess.run(['pg_ctl', '-D', str(database), '-l', str(folder / 'server.log'), '-w', 'start'], check=True, stdout=subprocess.DEVNULL)
    command = ['psql', '-X', '-h', str(socket), '-p', '55439', '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1']
    def sql(source):
        return subprocess.run(command, input=source, text=True, capture_output=True)
    try:
        bootstrap = """
        create role anon; create role authenticated;
        create schema auth;
        create table auth.users(id uuid primary key);
        insert into auth.users values ('11111111-1111-4111-8111-111111111111'),('22222222-2222-4222-8222-222222222222');
        create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
        grant usage on schema auth to authenticated;
        """
        migrations = sorted((ROOT / 'supabase/migrations').glob('*_study_backup_snapshots.sql'))
        assert len(migrations) == 1
        for source in (bootstrap, migrations[0].read_text(), (ROOT / 'supabase/tests/study_backup_snapshots.sql').read_text()):
            result = sql(source)
            if result.returncode:
                raise RuntimeError(result.stderr)
        def racing_copy(label):
            source = json.dumps({'format_version': 1, 'storage_mode': 'local', 'copy': label})
            return sql("set role authenticated;select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);insert into public.gradient_study_backups(user_id,slot,source) values ('11111111-1111-4111-8111-111111111111',1,'" + source + "');")
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            outcomes = list(pool.map(racing_copy, ('first', 'second')))
        assert sum(result.returncode == 0 for result in outcomes) == 1, 'Racing snapshots did not produce one success and one conflict'
        rejected = next(result for result in outcomes if result.returncode)
        assert 'duplicate key' in rejected.stderr, rejected.stderr
        result = sql("select count(*) from public.gradient_study_backups;")
        assert result.returncode == 0 and '1' in result.stdout
        print('PASS: owner RLS, foreign/anonymous denial, immutable snapshots, quota, size, and concurrent insert conflict.')
    finally:
        subprocess.run(['pg_ctl', '-D', str(database), '-m', 'fast', '-w', 'stop'], check=True, stdout=subprocess.DEVNULL)
