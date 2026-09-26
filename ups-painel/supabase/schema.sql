-- Schema do Painel de Execução da Nova UPS (modo sincronizado).
-- Rode isto uma vez no SQL Editor do seu projeto Supabase.
--
-- Modelo: o estado inteiro do painel vive numa única linha (id = 'singleton'),
-- como um blob JSON. Simples e suficiente para dois fundadores (last-write-wins).

create table if not exists public.painel_estado (
  id text primary key,
  data jsonb not null,
  atualizado_em timestamptz not null default now()
);

-- Realtime: publica mudanças desta tabela pro canal que o app assina.
alter publication supabase_realtime add table public.painel_estado;

-- RLS ligado, com acesso liberado para a chave anon (o app usa a chave pública).
-- ATENÇÃO: isto significa que qualquer um com a URL + chave anon pode ler e
-- escrever nesta tabela via API, contornando a senha do app (que é só trava de
-- interface). Para dois fundadores e dados de operação, tudo bem começar assim.
-- Se um dia os dados forem sensíveis, troque por Supabase Auth + policies por
-- usuário.
alter table public.painel_estado enable row level security;

drop policy if exists "acesso_anon_leitura" on public.painel_estado;
create policy "acesso_anon_leitura"
  on public.painel_estado for select
  using (true);

drop policy if exists "acesso_anon_escrita" on public.painel_estado;
create policy "acesso_anon_escrita"
  on public.painel_estado for insert
  with check (true);

drop policy if exists "acesso_anon_update" on public.painel_estado;
create policy "acesso_anon_update"
  on public.painel_estado for update
  using (true)
  with check (true);
