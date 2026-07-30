begin;
create table public.english_test_questions(
 id uuid primary key default gen_random_uuid(), section text not null check(section in('listening','writing')),
 question_type text not null check(question_type in('multiple_choice','true_false','short_answer','writing_prompt')),
 question_text text not null,audio_url text, audio_group text, options jsonb,correct_answer jsonb,
 explanation text,weight numeric not null default 1,display_order integer not null,is_active boolean not null default true,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table public.english_test_attempts(
 id uuid primary key default gen_random_uuid(),user_id uuid references auth.users(id),anonymous_token_hash text,
 status text not null default 'created' check(status in('created','in_progress','submitted','processing','completed','expired','failed')),
 started_at timestamptz not null,expires_at timestamptz not null,submitted_at timestamptz,current_section text not null default 'listening',
 listening_play_counts jsonb not null default '{}',created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table public.english_test_answers(
 id uuid primary key default gen_random_uuid(),attempt_id uuid not null references public.english_test_attempts on delete cascade,
 question_id uuid not null references public.english_test_questions,answer_value jsonb not null,saved_at timestamptz not null default now(),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(attempt_id,question_id)
);
create table public.english_test_results(
 id uuid primary key default gen_random_uuid(),attempt_id uuid unique not null references public.english_test_attempts on delete cascade,
 listening_score numeric not null,writing_score numeric not null,overall_score numeric not null,estimated_level text not null,
 writing_breakdown jsonb not null default '{}',strengths jsonb not null default '[]',improvements jsonb not null default '[]',
 recommendations jsonb not null default '[]',scoring_method text not null,is_provisional boolean not null default true,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
alter table public.student_requests add column if not exists source text;
alter table public.student_requests add column if not exists assessment_attempt_id uuid references public.english_test_attempts(id);
alter table public.english_test_questions enable row level security;
alter table public.english_test_attempts enable row level security;
alter table public.english_test_answers enable row level security;
alter table public.english_test_results enable row level security;
create policy english_questions_admin_all on public.english_test_questions for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy english_attempts_admin_all on public.english_test_attempts for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy english_answers_admin_all on public.english_test_answers for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy english_results_admin_all on public.english_test_results for all to authenticated using(public.is_admin()) with check(public.is_admin());
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('english-test-audio','english-test-audio',false,10485760,array['audio/mpeg','audio/wav','audio/x-m4a','audio/mp4']) on conflict(id) do update set public=false;
create policy english_audio_admin_all on storage.objects for all to authenticated using(bucket_id='english-test-audio' and public.is_admin()) with check(bucket_id='english-test-audio' and public.is_admin());

create or replace function public.english_attempt_allowed(p_id uuid,p_token text) returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from english_test_attempts a where a.id=p_id and (a.user_id=auth.uid() or a.anonymous_token_hash=encode(digest(p_token,'sha256'),'hex') or public.is_admin()))
$$;
revoke all on function public.english_attempt_allowed(uuid,text) from public;
grant execute on function public.english_attempt_allowed(uuid,text) to anon,authenticated;

create or replace function public.start_english_test(p_anonymous_token text)
returns table(attempt_id uuid,started_at timestamptz,expires_at timestamptz) language plpgsql security definer set search_path=public as $$
declare a english_test_attempts;
begin
 if length(p_anonymous_token)<32 then raise exception 'invalid token';end if;
 if auth.uid() is not null and exists(select 1 from english_test_attempts where user_id=auth.uid() and created_at>now()-interval '24 hours' and status in('in_progress','submitted','processing','completed')) and not public.is_admin() then raise exception 'يمكن إعادة الاختبار بعد 24 ساعة.';end if;
 insert into english_test_attempts(user_id,anonymous_token_hash,status,started_at,expires_at) values(auth.uid(),encode(digest(p_anonymous_token,'sha256'),'hex'),'in_progress',clock_timestamp(),clock_timestamp()+interval '8 minutes') returning * into a;
 return query select a.id,a.started_at,a.expires_at;
end$$;

create or replace function public.get_english_test_questions(p_attempt_id uuid,p_anonymous_token text)
returns table(id uuid,section text,question_type text,question_text text,audio_url text,audio_group text,options jsonb,display_order integer)
language plpgsql security definer set search_path=public as $$
begin
 if not english_attempt_allowed(p_attempt_id,p_anonymous_token) then raise exception 'unauthorized';end if;
 return query select q.id,q.section,q.question_type,q.question_text,
 q.audio_url,
 q.audio_group,q.options,q.display_order from english_test_questions q where q.is_active order by q.display_order;
end$$;

create or replace function public.save_english_test_answer(p_attempt_id uuid,p_anonymous_token text,p_question_id uuid,p_answer_value jsonb)
returns void language plpgsql security definer set search_path=public as $$
begin
 if not english_attempt_allowed(p_attempt_id,p_anonymous_token) then raise exception 'unauthorized';end if;
 if not exists(select 1 from english_test_attempts where id=p_attempt_id and status='in_progress' and expires_at>clock_timestamp()) then raise exception 'attempt unavailable';end if;
 if not exists(select 1 from english_test_questions where id=p_question_id and is_active) then raise exception 'invalid question';end if;
 insert into english_test_answers(attempt_id,question_id,answer_value)values(p_attempt_id,p_question_id,p_answer_value)
 on conflict(attempt_id,question_id)do update set answer_value=excluded.answer_value,saved_at=now(),updated_at=now();
end$$;

create or replace function public.record_listening_play(p_attempt_id uuid,p_anonymous_token text,p_question_id uuid)
returns integer language plpgsql security definer set search_path=public as $$
declare n int;
begin
 if not english_attempt_allowed(p_attempt_id,p_anonymous_token) then raise exception 'unauthorized';end if;
 if not exists(select 1 from english_test_questions where id=p_question_id and section='listening' and is_active) then raise exception 'invalid question';end if;
 select coalesce((listening_play_counts->>p_question_id::text)::int,0) into n from english_test_attempts where id=p_attempt_id and status='in_progress' and expires_at>clock_timestamp() for update;
 if n is null or n>=2 then raise exception 'play limit reached';end if;n:=n+1;
 update english_test_attempts set listening_play_counts=jsonb_set(listening_play_counts,array[p_question_id::text],to_jsonb(n),true),updated_at=now() where id=p_attempt_id;return n;
end$$;

create or replace function public.submit_english_test(p_attempt_id uuid,p_anonymous_token text)
returns uuid language plpgsql security definer set search_path=public as $$
declare ls numeric:=0; lw numeric:=0; ws numeric:=0; words int:=0; overall numeric; lvl text; writing text;
begin
 if not english_attempt_allowed(p_attempt_id,p_anonymous_token) then raise exception 'unauthorized';end if;
 if exists(select 1 from english_test_results where attempt_id=p_attempt_id) then return p_attempt_id;end if;
 select coalesce(sum(q.weight)filter(where lower(trim(a.answer_value->>'value'))=lower(trim(q.correct_answer->>'value'))),0),coalesce(sum(q.weight),0)
 into ls,lw from english_test_questions q left join english_test_answers a on a.question_id=q.id and a.attempt_id=p_attempt_id where q.section='listening' and q.is_active;
 ls:=case when lw=0 then 0 else round(ls/lw*100,2)end;
 select coalesce(a.answer_value->>'value','') into writing from english_test_questions q left join english_test_answers a on a.question_id=q.id and a.attempt_id=p_attempt_id where q.section='writing' and q.is_active order by q.display_order limit 1;
 words:=coalesce(array_length(regexp_split_to_array(trim(coalesce(writing,'')),'\s+'),1),0);
 -- Transparent deterministic fallback: length is capped at 40%; structure signals provide the rest, never length alone.
 ws:=least(40,words*0.5)+case when writing~'[.!?]' then 15 else 0 end+case when writing~*'\m(because|therefore|however|first|finally)\M' then 15 else 0 end+case when writing~*'\m(will|want|plan|important)\M' then 15 else 0 end+case when words>=70 then 15 else 0 end;
 ws:=least(100,round(ws,2));overall:=round((ls+ws)/2,2);
 lvl:=case when overall<25 then 'A1 — مبتدئ' when overall<45 then 'A2 — أساسي' when overall<65 then 'B1 — متوسط' when overall<80 then 'B2 — فوق المتوسط' when overall<92 then 'C1 — متقدم' else 'C2 — متقدم جدًا' end;
 update english_test_attempts set status='completed',submitted_at=clock_timestamp(),updated_at=now() where id=p_attempt_id and status in('in_progress','submitted','processing');
 insert into english_test_results(attempt_id,listening_score,writing_score,overall_score,estimated_level,writing_breakdown,strengths,improvements,recommendations,scoring_method,is_provisional)
 values(p_attempt_id,ls,ws,overall,lvl,jsonb_build_object('task_completion',least(20,words/4),'grammar',case when writing~'[.!?]'then 12 else 5 end,'vocabulary',case when writing~*'\m(because|therefore|however)\M'then 15 else 8 end,'coherence',case when writing~*'\m(first|finally)\M'then 15 else 8 end,'clarity',case when words>=50 then 15 else 8 end),'["إكمال مهام الاختبار"]','["مواصلة التدريب على الدقة والطلاقة"]','["تدرب على الاستماع اليومي والكتابة المنظمة"]','fallback_rubric_v1',true);
 return p_attempt_id;
end$$;

create or replace function public.get_english_test_result(p_attempt_id uuid,p_anonymous_token text)
returns table(attempt_id uuid,listening_score numeric,writing_score numeric,overall_score numeric,estimated_level text,writing_breakdown jsonb,strengths jsonb,improvements jsonb,recommendations jsonb,scoring_method text,is_provisional boolean,started_at timestamptz,submitted_at timestamptz)
language plpgsql security definer set search_path=public as $$
begin if not english_attempt_allowed(p_attempt_id,p_anonymous_token)then raise exception 'unauthorized';end if;
 return query select r.attempt_id,r.listening_score,r.writing_score,r.overall_score,r.estimated_level,r.writing_breakdown,r.strengths,r.improvements,r.recommendations,r.scoring_method,r.is_provisional,a.started_at,a.submitted_at from english_test_results r join english_test_attempts a on a.id=r.attempt_id where r.attempt_id=p_attempt_id;end$$;

revoke all on function public.start_english_test(text),public.get_english_test_questions(uuid,text),public.save_english_test_answer(uuid,text,uuid,jsonb),public.record_listening_play(uuid,text,uuid),public.submit_english_test(uuid,text),public.get_english_test_result(uuid,text) from public;
grant execute on function public.start_english_test(text),public.get_english_test_questions(uuid,text),public.save_english_test_answer(uuid,text,uuid,jsonb),public.record_listening_play(uuid,text,uuid),public.submit_english_test(uuid,text),public.get_english_test_result(uuid,text) to anon,authenticated;

insert into public.english_test_questions(section,question_type,question_text,audio_group,options,correct_answer,weight,display_order) values
('listening','multiple_choice','Why is Maya calling the community center?','clip-1','["To change a booking","To join a class","To report a problem"]','{"value":"To join a class"}',1,1),
('listening','true_false','The class starts at half past six.','clip-1','["True","False"]','{"value":"True"}',1,2),
('listening','short_answer','What should Maya bring to the first class?','clip-1',null,'{"value":"a notebook"}',1,3),
('listening','multiple_choice','How will Daniel travel to the meeting?','clip-2','["By bus","By train","By bicycle"]','{"value":"By train"}',1,4),
('listening','true_false','Daniel has already printed the report.','clip-2','["True","False"]','{"value":"False"}',1,5),
('listening','short_answer','Where will they meet?','clip-2',null,'{"value":"the main entrance"}',1,6),
('writing','writing_prompt','Describe a goal you want to achieve in the next two years. Explain why it is important to you and what steps you will take.',null,null,null,1,7);
insert into public.site_settings(setting_key,setting_value) values('public.english_test',jsonb_build_object('duration_minutes',8,'plays_per_clip',2,'audio_scripts',jsonb_build_array(
'Hello, I’m Maya. I’m calling because I’d like to join the evening photography class. I saw that it starts at half past six on Tuesdays. Could you confirm there is still a place? I was told that I only need to bring a notebook to the first class because the center provides cameras for beginners.',
'Hi Sara, it’s Daniel. I’ll take the train to tomorrow’s meeting because the buses are often late in the morning. I have finished the report, but I still need to print it at the office. Let’s meet by the main entrance at nine fifteen so we can prepare the room together.'
))) on conflict(setting_key)do update set setting_value=excluded.setting_value,updated_at=now();
commit;
