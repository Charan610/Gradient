\set ON_ERROR_STOP on
begin;
set role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);
insert into public.gradient_study_backups(user_id,slot,source)
values ('11111111-1111-4111-8111-111111111111',1,'{"format_version":1,"storage_mode":"local"}');
do $$begin
 if (select count(*) from public.gradient_study_backups)<>1 then raise exception 'Owner cannot read own copy';end if;
 begin
  insert into public.gradient_study_backups(user_id,slot,source) values ('22222222-2222-4222-8222-222222222222',1,'{"format_version":1,"storage_mode":"local"}');
  raise exception 'Foreign insert was allowed';
 exception when insufficient_privilege then null;end;
 begin
  update public.gradient_study_backups set source='{"format_version":1,"storage_mode":"local","changed":true}';
  raise exception 'Snapshot update was allowed';
 exception when insufficient_privilege then null;end;
end$$;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',false);
do $$declare affected integer;begin
 if (select count(*) from public.gradient_study_backups)<>0 then raise exception 'Foreign copy exposed';end if;
 delete from public.gradient_study_backups where user_id='11111111-1111-4111-8111-111111111111';get diagnostics affected=row_count;
 if affected<>0 then raise exception 'Foreign copy deleted';end if;
end$$;
insert into public.gradient_study_backups(user_id,slot,source) values ('22222222-2222-4222-8222-222222222222',1,'{"format_version":1,"storage_mode":"local"}');
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);
insert into public.gradient_study_backups(user_id,slot,source)
select '11111111-1111-4111-8111-111111111111',n,'{"format_version":1,"storage_mode":"local"}' from generate_series(2,10)n;
do $$begin
 begin
  insert into public.gradient_study_backups(user_id,slot,source) values ('11111111-1111-4111-8111-111111111111',11,'{"format_version":1,"storage_mode":"local"}');
  raise exception 'Eleventh slot allowed';exception when check_violation then null;end;
 begin
  insert into public.gradient_study_backups(user_id,slot,source) values ('11111111-1111-4111-8111-111111111111',1,'{"format_version":1,"storage_mode":"local"}');
  raise exception 'Duplicate snapshot replaced data';exception when unique_violation then null;end;
 if (select count(*) from public.gradient_study_backups)<>10 then raise exception 'Snapshot lost';end if;
 delete from public.gradient_study_backups where slot=10;
 begin
  insert into public.gradient_study_backups(user_id,slot,source) values ('11111111-1111-4111-8111-111111111111',10,'{"format_version":1,"storage_mode":"local","payload":"'||repeat('x',3145728)||'"}');
  raise exception 'Oversized source allowed';exception when check_violation then null;end;
 if (select count(*) from public.gradient_study_backups)<>9 then raise exception 'Quota rejection changed prior records';end if;
end$$;
reset role;
set role anon;
do $$begin
 begin perform * from public.gradient_study_backups;raise exception 'Anonymous read allowed';exception when insufficient_privilege then null;end;
end$$;
reset role;
rollback;
