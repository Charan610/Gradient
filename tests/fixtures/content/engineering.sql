BEGIN;
CREATE TEMP TABLE projects (id integer PRIMARY KEY);
CREATE TEMP TABLE tasks (id integer PRIMARY KEY, project_id integer REFERENCES projects, status text NOT NULL);
INSERT INTO projects VALUES (1), (2), (3);
INSERT INTO tasks VALUES (1, 1, 'open'), (2, 2, 'closed');
CREATE TEMP TABLE excerpts (revision text, path text, line integer, body text);
INSERT INTO excerpts VALUES
  ('fixture-v1', 'ownership.md', 3, 'Verify ownership before reading a task'),
  ('fixture-v1', 'setup.md', 1, 'Install the local database');
DO $$
DECLARE actual integer[];
DECLARE citation text;
BEGIN
  SELECT array_agg(n ORDER BY project_id) INTO actual
  FROM (SELECT p.id AS project_id, count(t.id)::integer AS n
        FROM projects p LEFT JOIN tasks t ON p.id = t.project_id AND t.status = 'open'
        GROUP BY p.id) AS counts;
  IF actual IS DISTINCT FROM ARRAY[1,0,0] THEN RAISE EXCEPTION 'Unexpected LEFT JOIN counts: %', actual; END IF;

  SELECT revision || ':' || path || ':' || line INTO citation
  FROM excerpts
  WHERE to_tsvector('english', body) @@ plainto_tsquery('english', 'ownership')
  ORDER BY ts_rank(to_tsvector('english', body), plainto_tsquery('english', 'ownership')) DESC, revision, path, line
  LIMIT 1;
  IF citation IS DISTINCT FROM 'fixture-v1:ownership.md:3' THEN RAISE EXCEPTION 'Unexpected citation: %', citation; END IF;
  IF EXISTS (SELECT FROM excerpts WHERE to_tsvector('english', body) @@ plainto_tsquery('english', 'astronomy')) THEN
    RAISE EXCEPTION 'Unsupported query returned a match';
  END IF;
END $$;
ROLLBACK;
