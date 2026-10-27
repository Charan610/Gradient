-- Identity lives in Supabase Auth. Passwords are hashed by GoTrue, never stored here.
CREATE TABLE public.gradient_accounts (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 username text NOT NULL UNIQUE CHECK (username ~ '^[a-z][a-z0-9_.]{2,23}$'),
 has_password boolean NOT NULL DEFAULT false,
 semester text NOT NULL DEFAULT '2-2' CHECK (semester IN ('1-1','1-2','2-1','2-2','3-1','3-2','4-1','4-2')),
 daily_minutes integer NOT NULL DEFAULT 90 CHECK (daily_minutes IN (45,60,90,120,150)),
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.gradient_accounts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gradient_accounts FROM anon,authenticated;
GRANT SELECT ON public.gradient_accounts TO authenticated;
GRANT ALL ON public.gradient_accounts TO service_role;
CREATE POLICY "Read own account" ON public.gradient_accounts FOR SELECT TO authenticated USING ((SELECT auth.uid())=user_id);
CREATE TABLE public.gradient_account_limits (
 bucket text PRIMARY KEY,
 attempts integer NOT NULL,
 window_started timestamptz NOT NULL
);
ALTER TABLE public.gradient_account_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gradient_account_limits FROM anon,authenticated;
GRANT ALL ON public.gradient_account_limits TO service_role;
CREATE INDEX gradient_account_limits_expiry ON public.gradient_account_limits(window_started);
CREATE FUNCTION public.gradient_account_allow(p_bucket text,p_limit integer,p_seconds integer)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE hits integer;
BEGIN
 DELETE FROM public.gradient_account_limits WHERE window_started<now()-interval '1 day';
 INSERT INTO public.gradient_account_limits(bucket,attempts,window_started) VALUES(p_bucket,1,now())
 ON CONFLICT(bucket) DO UPDATE SET
 attempts=CASE WHEN gradient_account_limits.window_started<now()-make_interval(secs=>p_seconds) THEN 1 ELSE gradient_account_limits.attempts+1 END,
 window_started=CASE WHEN gradient_account_limits.window_started<now()-make_interval(secs=>p_seconds) THEN now() ELSE gradient_account_limits.window_started END
 RETURNING attempts INTO hits;
 RETURN hits<=p_limit;
END;
$$;
REVOKE ALL ON FUNCTION public.gradient_account_allow(text,integer,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.gradient_account_allow(text,integer,integer) TO service_role;
