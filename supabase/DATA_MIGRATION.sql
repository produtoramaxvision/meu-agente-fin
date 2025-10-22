-- ============================================================================
-- MIGRAÇÃO DE DADOS - MEU AGENTE FINANCEIRO
-- ============================================================================
-- Este script SQL contém TODOS os dados existentes no banco atual:
-- - 2 clientes
-- - 78 registros financeiros
-- - 19 metas
-- - 13 tarefas
-- - 32 eventos de agenda
-- - 2 calendários
-- - 1 notificação
-- - 2 configurações de privacidade
-- - 3 tickets de suporte
--
-- IMPORTANTE:
-- 1. Execute APENAS APÓS ter executado o MIGRATION_COMPLETE.sql
-- 2. Este script deve ser executado em UMA ÚNICA TRANSAÇÃO
-- 3. Os dados incluem timestamps originais preservados
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. CLIENTES (2 registros)
-- ============================================================================

INSERT INTO public.clientes (phone, name, email, subscription_active, is_active, whatsapp_instance_url, plan_id, billing_provider, external_subscription_id, trial_ends_at, last_seen_at, created_at, updated_at, password, avatar_url, cpf, auth_user_id) VALUES
('5511949746110', 'João Silva Teste', 'produtoramaxvisionia@gmail.com', true, true, NULL, 'free', NULL, NULL, NULL, '2025-10-12 00:53:33.901+00', '2025-10-02 04:39:33.252005+00', '2025-10-17 21:25:58.927553+00', NULL, 'https://teexqwlnfdlcruqbmwuz.supabase.co/storage/v1/object/public/avatars/5511949746110/avatar.png', '11144477735', NULL),
('5511950411818', 'Daniel Abt', 'daniellabt1@gmail.com', false, true, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-20 15:16:49.037+00', '2025-10-20 15:16:49.037+00', NULL, NULL, '23632037809', NULL)
ON CONFLICT (phone) DO NOTHING;

-- ============================================================================
-- 2. CALENDARS (2 registros)
-- ============================================================================

INSERT INTO public.calendars (id, phone, name, color, timezone, is_primary, created_at, updated_at) VALUES
('a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'default', '#3b82f6', 'America/Sao_Paulo', true, '2025-10-07 19:42:17.432108+00', '2025-10-07 19:42:17.432108+00'),
('ab32dde7-abd3-4f3b-8c2e-510263ebe741'::uuid, '5511949746110', 'trabalho', '#FF6B6B', 'America/Sao_Paulo', false, '2025-10-07 19:56:27.019679+00', '2025-10-07 19:56:27.019679+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. FINANCEIRO_REGISTROS (78 registros - primeiros 50 aqui, demais logo abaixo)
-- ============================================================================

INSERT INTO public.financeiro_registros (id, phone, data_hora, categoria, tipo, valor, descricao, created_at, updated_at, status, data_vencimento, recorrente, recorrencia_fim) VALUES
(15, '5511949746110', '2025-10-02 08:00:49.667+00', 'Salário', 'entrada', 1300.00, NULL, '2025-10-02 08:01:16.297944+00', '2025-10-02 11:31:09.034104+00', 'pago', NULL, false, NULL),
(20, '5511949746110', '2025-09-29 03:00:00+00', 'Investimento', 'saida', 2100.30, NULL, '2025-10-02 14:12:11.273405+00', '2025-10-02 14:12:11.273405+00', 'pago', NULL, false, NULL),
(21, '5511949746110', '2025-09-26 03:00:00+00', 'Investimento', 'entrada', 5000.00, NULL, '2025-10-02 14:12:47.16297+00', '2025-10-02 14:12:47.16297+00', 'pago', NULL, false, NULL),
(22, '5511949746110', '2025-10-02 16:10:14.807+00', 'Alimentação', 'saida', 100.00, NULL, '2025-10-02 16:10:59.863647+00', '2025-10-02 16:10:59.863647+00', 'pago', '2025-10-02 16:10:14.807+00', true, '2025-10-09'),
(23, '5511949746110', '2025-10-08 03:00:00+00', 'Saúde', 'saida', 800.00, NULL, '2025-10-02 16:12:37.550754+00', '2025-10-07 22:33:57.306018+00', 'pago', NULL, false, NULL),
(24, '5511949746110', '2025-09-28 03:00:00+00', 'Moradia', 'saida', 43.33, NULL, '2025-10-02 16:14:49.489385+00', '2025-10-02 16:14:49.489385+00', 'pago', '2025-09-28 03:00:00+00', false, NULL),
(25, '5511949746110', '2025-10-07 03:51:39.822+00', 'Saúde', 'saida', 445.44, NULL, '2025-10-02 16:21:32.443906+00', '2025-10-07 03:51:38.622684+00', 'pago', '2025-09-30 03:00:00+00', false, NULL),
(26, '5511949746110', '2025-10-07 03:51:38.495+00', 'Saúde', 'saida', 445.44, 'dadadasd', '2025-10-02 17:11:34.364967+00', '2025-10-07 03:51:37.298968+00', 'pago', '2025-09-30 03:00:00+00', false, NULL),
(27, '5511949746110', '2025-10-07 03:51:40.593+00', 'Alimentação', 'saida', 333.33, NULL, '2025-10-02 20:31:49.574977+00', '2025-10-07 03:51:39.384304+00', 'pago', '2025-10-02 20:31:33.919+00', false, NULL),
(28, '5511949746110', '2025-10-07 18:11:47.816+00', 'Saúde', 'saida', 2222.22, NULL, '2025-10-02 20:37:41.061205+00', '2025-10-07 18:11:46.390647+00', 'pago', '2025-10-02 20:37:22.992+00', true, '2025-10-14'),
(29, '5511949746110', '2025-10-02 21:04:26.739+00', 'Freelance', 'entrada', 500.00, NULL, '2025-10-02 21:04:26.559897+00', '2025-10-02 21:04:26.559897+00', 'pendente', '2025-10-03 03:00:00+00', false, NULL),
(30, '5511949746110', '2025-10-04 09:50:00+00', 'Freelance', 'entrada', 850.00, 'trabalho freelancer', '2025-10-03 12:50:54.619994+00', '2025-10-03 12:50:54.619994+00', 'pago', NULL, false, NULL),
(31, '5511949746110', '2025-10-07 07:51:23.19+00', 'Vendas', 'entrada', 1231.23, 'vendi um drone', '2025-10-03 18:50:16.649215+00', '2025-10-07 07:51:21.979636+00', 'pago', '2025-10-03 18:49:16.768+00', false, NULL),
(32, '5511949746110', '2025-10-05 18:21:24.397+00', 'Salário', 'entrada', 10.00, 'Teste de transação', '2025-10-05 18:21:24.554827+00', '2025-10-05 18:21:24.554827+00', 'pendente', '2025-10-05 18:19:10.605+00', false, NULL),
(33, '5511949746110', '2025-10-07 07:51:33.949+00', 'Transporte', 'saida', 1.00, NULL, '2025-10-06 17:10:33.872076+00', '2025-10-07 07:51:32.746207+00', 'pago', '2025-10-06 17:08:24.061+00', false, NULL),
(34, '5511949746110', '2025-10-06 17:08:23.965+00', 'Vendas', 'entrada', 0.50, NULL, '2025-10-06 17:12:58.828186+00', '2025-10-06 17:12:58.828186+00', 'pago', NULL, false, NULL),
(35, '5511949746110', '2025-10-07 07:51:27.586+00', 'Salário', 'entrada', 10.00, NULL, '2025-10-06 18:11:00.728982+00', '2025-10-07 07:51:26.378567+00', 'pago', '2025-10-06 18:09:16.582+00', false, NULL),
(36, '5511949746110', '2025-10-07 07:51:26.051+00', 'Salário', 'entrada', 0.25, NULL, '2025-10-06 18:12:56.321521+00', '2025-10-07 07:51:24.841341+00', 'pago', '2025-10-06 18:09:15.208+00', false, NULL),
(37, '5511949746110', '2025-10-06 18:15:15.642+00', 'Freelance', 'entrada', 1315.00, NULL, '2025-10-06 18:15:15.351421+00', '2025-10-06 18:15:15.351421+00', 'pendente', '2025-10-06 17:57:24.52+00', false, NULL),
(40, '5511949746110', '2025-10-07 21:43:56.318+00', 'Salário', 'entrada', 10.00, NULL, '2025-10-07 21:43:56.556906+00', '2025-10-07 21:43:56.556906+00', 'pendente', '2025-10-07 21:42:22.724+00', false, NULL),
(41, '5511949746110', '2025-10-08 12:07:35.209+00', 'Salário', 'entrada', 15.00, NULL, '2025-10-08 12:07:35.393605+00', '2025-10-08 12:07:35.393605+00', 'pendente', '2025-10-08 12:06:36.138+00', false, NULL),
(45, '5511949746110', '2025-10-09 03:05:20.434+00', 'Transporte', 'saida', 1.00, NULL, '2025-10-09 03:05:20.688583+00', '2025-10-09 03:05:20.688583+00', 'pendente', '2025-10-09 03:04:24.001+00', false, NULL),
(46, '5511949746110', '2025-10-09 03:05:22.174+00', 'Salário', 'entrada', 100.00, NULL, '2025-10-09 03:05:22.305787+00', '2025-10-09 03:05:22.305787+00', 'pendente', '2025-10-09 03:04:23.564+00', false, NULL),
(48, '5511949746110', '2025-10-09 03:05:36.591+00', 'Transporte', 'saida', 1.00, NULL, '2025-10-09 03:05:36.839613+00', '2025-10-09 03:05:36.839613+00', 'pendente', '2025-10-09 03:04:45.489+00', false, NULL),
(49, '5511949746110', '2025-10-09 03:08:14.969+00', 'Transporte', 'saida', 0.50, NULL, '2025-10-09 03:08:15.21869+00', '2025-10-09 03:08:15.21869+00', 'pendente', '2025-10-09 03:07:17.408+00', false, NULL),
(59, '5511949746110', '2025-10-09 03:50:09.086131+00', 'Freelance', 'entrada', 11111.11, 'Teste de inserção', '2025-10-09 03:50:09.086131+00', '2025-10-09 03:50:09.086131+00', 'pendente', '2025-10-09 00:00:00+00', false, NULL),
(61, '5511949746110', '2025-10-09 03:50:44.021043+00', 'Freelance', 'entrada', 100.00, 'Teste após correção das políticas', '2025-10-09 03:50:44.021043+00', '2025-10-09 03:50:44.021043+00', 'pendente', '2025-10-09 00:00:00+00', false, NULL),
(63, '5511949746110', '2025-10-09 08:07:44.231+00', 'Transporte', 'saida', 1.00, NULL, '2025-10-09 08:07:44.357209+00', '2025-10-09 08:07:44.357209+00', 'pendente', '2025-10-09 08:06:50.2+00', false, NULL),
(64, '5511949746110', '2025-10-09 08:08:01.933+00', 'Salário', 'entrada', 1500.00, 'Recebimento de salário referente ao mês atual', '2025-10-09 08:08:02.18646+00', '2025-10-09 08:08:02.18646+00', 'pendente', '2025-10-09 08:06:50.716+00', false, NULL),
(65, '5511949746110', '2025-10-09 08:08:10.664+00', 'Transporte', 'saida', 0.10, NULL, '2025-10-09 08:08:10.794431+00', '2025-10-09 08:08:10.794431+00', 'pendente', '2025-10-09 08:06:57.107+00', false, NULL),
(66, '5511949746110', '2025-10-09 08:09:17.488+00', 'Alimentação', 'saida', 5.00, NULL, '2025-10-09 08:09:17.613392+00', '2025-10-09 08:09:17.613392+00', 'pendente', '2025-10-09 08:08:24.783+00', false, NULL),
(68, '5511949746110', '2025-10-09 08:31:53.857+00', 'Salário', 'entrada', 15.00, NULL, '2025-10-09 08:31:53.9997+00', '2025-10-09 08:31:53.9997+00', 'pendente', '2025-10-09 08:30:48.232+00', false, NULL),
(69, '5511949746110', '2025-10-09 08:31:58.73+00', 'Salário', 'entrada', 15.00, 'Recebimento de salário referente ao mês atual', '2025-10-09 08:31:58.90037+00', '2025-10-09 08:31:58.90037+00', 'pendente', '2025-10-09 08:30:47.699+00', false, NULL),
(70, '5511949746110', '2025-10-09 08:33:59.746+00', 'Alimentação', 'saida', 1.00, NULL, '2025-10-09 08:33:59.871056+00', '2025-10-09 08:33:59.871056+00', 'pendente', '2025-10-09 08:30:48.612+00', false, NULL),
(71, '5511949746110', '2025-10-09 08:34:17.954+00', 'Transporte', 'saida', 1.00, NULL, '2025-10-09 08:34:18.125125+00', '2025-10-09 08:34:18.125125+00', 'pendente', '2025-10-09 08:32:35.866+00', false, NULL),
(72, '5511949746110', '2025-10-09 09:05:32.114+00', 'Salário', 'entrada', 100.00, NULL, '2025-10-09 09:05:32.327595+00', '2025-10-09 09:05:32.327595+00', 'pendente', '2025-10-09 09:04:35.484+00', false, NULL),
(73, '5511949746110', '2025-10-09 19:37:41.879+00', 'Transporte', 'saida', 51.50, NULL, '2025-10-09 09:05:44.473926+00', '2025-10-09 19:37:41.972771+00', 'pendente', '2025-10-09 09:04:34.87+00', false, NULL),
(74, '5511949746110', '2025-10-09 09:07:15.781+00', 'Outros', 'entrada', 0.05, NULL, '2025-10-09 09:07:15.979205+00', '2025-10-09 09:07:15.979205+00', 'pendente', '2025-10-09 09:06:20.238+00', false, NULL),
(75, '5511949746110', '2025-10-09 20:24:53.582+00', 'Salário', 'entrada', 0.50, 'Teste Progresso Automático', '2025-10-09 20:24:53.158397+00', '2025-10-09 20:24:53.158397+00', 'pendente', '2025-10-09 20:24:32.424+00', false, NULL),
(76, '5511949746110', '2025-10-09 23:34:57.442+00', 'Transporte', 'saida', 1.00, NULL, '2025-10-09 23:34:57.690529+00', '2025-10-09 23:34:57.690529+00', 'pendente', '2025-10-09 23:33:48.076+00', false, NULL),
(77, '5511949746110', '2025-10-09 23:34:57.85+00', 'Salário', 'entrada', 10.00, NULL, '2025-10-09 23:34:58.071803+00', '2025-10-09 23:34:58.071803+00', 'pendente', '2025-10-09 23:34:09.116+00', false, NULL),
(78, '5511949746110', '2025-10-09 23:35:36.55+00', 'Alimentação', 'saida', 150.75, NULL, '2025-10-09 23:35:36.683802+00', '2025-10-09 23:35:36.683802+00', 'pendente', '2025-10-09 23:34:38.203+00', false, NULL),
(79, '5511949746110', '2025-10-09 23:36:35.973+00', 'Salário', 'entrada', 20.00, NULL, '2025-10-09 23:36:36.184964+00', '2025-10-09 23:36:36.184964+00', 'pendente', '2025-10-09 23:35:40.445+00', false, NULL),
(84, '5511949746110', '2025-10-12 14:58:09.103+00', 'Salário', 'entrada', 1500.00, NULL, '2025-10-12 14:58:09.23134+00', '2025-10-12 14:58:09.23134+00', 'pendente', '2025-10-12 14:56:39.719+00', false, NULL),
(85, '5511949746110', '2025-10-12 15:31:19.542+00', 'Salário', 'entrada', 1500.00, NULL, '2025-10-12 15:31:19.665993+00', '2025-10-12 15:31:19.665993+00', 'pendente', '2025-10-12 15:30:11.494+00', false, NULL),
(86, '5511949746110', '2025-10-12 15:32:58.146+00', 'Alimentação', 'saida', 200.00, NULL, '2025-10-12 15:32:58.454314+00', '2025-10-12 15:32:58.454314+00', 'pendente', '2025-10-12 15:31:56.425+00', false, NULL),
(87, '5511949746110', '2025-10-13 17:20:23.562+00', 'Alimentação', 'saida', 80.00, NULL, '2025-10-13 17:20:23.65076+00', '2025-10-13 17:20:23.65076+00', 'pendente', '2025-10-13 17:20:00.068+00', false, NULL),
(88, '5511949746110', '2025-10-14 03:18:58.99+00', 'Salário', 'entrada', 10.00, NULL, '2025-10-14 03:18:59.235508+00', '2025-10-14 03:18:59.235508+00', 'pendente', '2025-10-14 03:17:06.309+00', false, NULL),
(89, '5511949746110', '2025-10-14 04:14:14.933+00', 'Freelance', 'entrada', 500.00, NULL, '2025-10-14 04:14:15.066527+00', '2025-10-14 04:14:15.066527+00', 'pendente', '2025-10-14 04:14:06.851+00', false, NULL),
(90, '5511949746110', '2025-10-14 22:33:38.904+00', 'Salário', 'entrada', 15.00, NULL, '2025-10-14 22:33:39.159712+00', '2025-10-14 22:33:39.159712+00', 'pendente', '2025-10-14 22:31:55.36+00', false, NULL),
(91, '5511949746110', '2025-10-14 22:36:28.719+00', 'Alimentação', 'saida', 2.00, NULL, '2025-10-14 22:36:29.03998+00', '2025-10-14 22:36:29.03998+00', 'pendente', '2025-10-14 22:34:31.361+00', false, NULL);

-- Continuação dos registros financeiros (restantes 28)
INSERT INTO public.financeiro_registros (id, phone, data_hora, categoria, tipo, valor, descricao, created_at, updated_at, status, data_vencimento, recorrente, recorrencia_fim) VALUES
(92, '5511949746110', '2025-10-15 03:40:26.378+00', 'Transporte', 'saida', 1.00, '<script>alert(''XSS Test'')</script>', '2025-10-15 03:40:25.912803+00', '2025-10-15 03:40:25.912803+00', 'pendente', '2025-10-15 03:40:01.979+00', false, NULL),
(93, '5511949746110', '2025-10-15 03:40:59.342+00', 'Transporte', 'saida', 1.00, '''; DROP TABLE financeiro_registros; --', '2025-10-15 03:40:58.863569+00', '2025-10-15 03:40:58.863569+00', 'pendente', '2025-10-15 03:40:44.42+00', false, NULL),
(94, '5511949746110', '2025-10-15 03:56:59.381+00', 'Transporte', 'saida', 1.00, '<script>alert(''XSS Test After Fix'')</script>', '2025-10-15 03:56:58.914091+00', '2025-10-15 03:56:58.914091+00', 'pendente', '2025-10-15 03:56:50.012+00', false, NULL),
(95, '5511949746110', '2025-10-15 04:56:53.882+00', 'Transporte', 'saida', 100.50, NULL, '2025-10-15 04:56:53.418286+00', '2025-10-15 04:56:53.418286+00', 'pendente', '2025-10-15 04:56:37.001+00', false, NULL),
(96, '5511949746110', '2025-10-15 04:57:53.930157+00', 'Salário', 'entrada', 1500.00, 'Teste ACID Transaction', '2025-10-15 04:57:53.930157+00', '2025-10-15 04:57:53.930157+00', 'pago', NULL, false, NULL),
(98, '5511949746110', '2025-10-15 04:58:25.083579+00', 'Transporte', 'saida', 50.00, 'Teste Concorrente 1', '2025-10-15 04:58:25.083579+00', '2025-10-15 04:58:25.083579+00', 'pago', NULL, false, NULL),
(99, '5511949746110', '2025-10-15 04:58:31.904855+00', 'Freelance', 'entrada', 200.00, 'Teste Concorrente 2', '2025-10-15 04:58:31.904855+00', '2025-10-15 04:58:31.904855+00', 'pago', NULL, false, NULL),
(101, '5511949746110', '2025-10-15 06:03:03.834+00', 'Transporte', 'saida', 1.00, NULL, '2025-10-15 06:03:04.000995+00', '2025-10-15 06:03:04.000995+00', 'pendente', '2025-10-15 06:01:57.709+00', false, NULL),
(102, '5511949746110', '2025-10-15 06:03:16.417+00', 'Salário', 'entrada', 15.00, NULL, '2025-10-15 06:03:16.642264+00', '2025-10-15 06:03:16.642264+00', 'pendente', '2025-10-15 06:02:15.364+00', false, NULL),
(103, '5511949746110', '2025-10-15 06:04:04.975+00', 'Salário', 'entrada', 15.00, NULL, '2025-10-15 06:04:05.157865+00', '2025-10-15 06:04:05.157865+00', 'pendente', '2025-10-15 06:02:58.332+00', false, NULL),
(104, '5511949746110', '2025-10-15 06:04:11.425+00', 'Transporte', 'saida', 1.00, NULL, '2025-10-15 06:04:11.622507+00', '2025-10-15 06:04:11.622507+00', 'pendente', '2025-10-15 06:02:16.191+00', false, NULL),
(105, '5511949746110', '2025-10-15 06:04:19.361+00', 'Alimentação', 'saida', 1.00, NULL, '2025-10-15 06:04:19.555675+00', '2025-10-15 06:04:19.555675+00', 'pendente', '2025-10-15 06:03:23.064+00', false, NULL),
(106, '5511949746110', '2025-10-15 06:04:55.65+00', 'Transporte', 'saida', 2.00, NULL, '2025-10-15 06:04:55.882529+00', '2025-10-15 06:04:55.882529+00', 'pendente', '2025-10-15 06:03:57.091+00', false, NULL),
(107, '5511949746110', '2025-10-15 06:08:59.477+00', 'Freelance', 'entrada', 1.00, NULL, '2025-10-15 06:08:59.721214+00', '2025-10-15 06:08:59.721214+00', 'pendente', '2025-10-15 06:02:17.804+00', false, NULL),
(109, '5511949746110', '2025-10-15 07:33:54.657+00', 'Transporte', 'saida', 1.00, 'Teste de duplicata', '2025-10-15 07:33:54.273045+00', '2025-10-15 07:33:54.273045+00', 'pendente', '2025-10-15 07:33:10.992+00', false, NULL),
(110, '5511949746110', '2025-10-15 07:41:54.719+00', 'Transporte', 'saida', 1.00, 'Teste de duplicata', '2025-10-15 07:41:54.355117+00', '2025-10-15 07:41:54.355117+00', 'pendente', '2025-10-15 07:41:04.432+00', false, NULL),
(111, '5511949746110', '2025-10-15 08:06:59.552+00', 'Transporte', 'saida', 1.00, 'Teste de duplicata', '2025-10-15 08:06:59.871942+00', '2025-10-15 08:06:59.871942+00', 'pendente', '2025-10-15 07:51:15.261+00', false, NULL),
(112, '5511949746110', '2025-10-15 17:55:07.64+00', 'Transporte', 'saida', 1.00, 'Teste de duplicata', '2025-10-15 17:55:07.956289+00', '2025-10-15 17:55:07.956289+00', 'pendente', '2025-10-15 17:54:57.948+00', false, NULL),
(113, '5511949746110', '2025-10-15 19:16:23.546+00', 'Transporte', 'saida', 1.00, 'Teste de duplicata', '2025-10-15 19:16:23.845643+00', '2025-10-15 19:16:23.845643+00', 'pendente', '2025-10-15 19:16:06.63+00', false, NULL),
(114, '5511949746110', '2025-10-15 19:44:00.791+00', 'Transporte', 'saida', 1.00, 'Teste de duplicata', '2025-10-15 19:44:01.124816+00', '2025-10-15 19:44:01.124816+00', 'pendente', '2025-10-15 19:43:40.544+00', false, NULL),
(116, '5511949746110', '2025-10-15 19:44:47.53+00', 'Transporte', 'saida', 1.00, 'Teste de duplicata', '2025-10-15 19:44:47.773242+00', '2025-10-15 19:44:47.773242+00', 'pendente', '2025-10-15 19:44:35.784+00', false, NULL),
(118, '5511949746110', '2025-10-15 19:46:15.995+00', 'Alimentação', 'saida', 50.00, NULL, '2025-10-15 19:46:16.250997+00', '2025-10-15 19:46:16.250997+00', 'pendente', '2025-10-15 19:46:05.236+00', false, NULL),
(119, '5511949746110', '2025-10-15 19:48:12.956+00', 'Viagem', 'saida', 0.01, NULL, '2025-10-15 19:48:13.227182+00', '2025-10-15 19:48:13.227182+00', 'pendente', '2025-10-15 19:48:07.69+00', false, NULL),
(120, '5511949746110', '2025-10-16 02:39:31.771+00', 'Rendimentos', 'entrada', 55.55, NULL, '2025-10-16 02:39:32.408041+00', '2025-10-16 02:39:32.408041+00', 'pendente', '2025-10-16 02:39:22.351+00', false, NULL),
(121, '5511949746110', '2025-10-16 06:26:10.383+00', 'Saúde', 'saida', 10.00, NULL, '2025-10-16 06:26:10.531016+00', '2025-10-16 06:26:10.531016+00', 'pendente', '2025-10-16 06:25:56.704+00', false, NULL),
(122, '5511949746110', '2025-10-16 21:09:39.852+00', 'Viagem', 'saida', 333.33, NULL, '2025-10-16 21:09:39.909653+00', '2025-10-16 21:09:39.909653+00', 'pendente', '2025-10-16 21:09:31.623+00', false, NULL),
(123, '5511949746110', '2025-10-16 22:00:29.303+00', 'Alimentação', 'saida', 100.00, 'Teste de registro financeiro', '2025-10-16 21:54:11.607372+00', '2025-10-16 22:00:29.228502+00', 'pago', '2025-10-16 21:54:01.2+00', false, NULL)
ON CONFLICT (id) DO NOTHING;

-- Resetar sequence do financeiro_registros
SELECT setval('financeiro_registros_id_seq', (SELECT MAX(id) FROM public.financeiro_registros));

-- ============================================================================
-- 4. METAS (19 registros)
-- ============================================================================

INSERT INTO public.metas (id, phone, titulo, icone, valor_atual, valor_meta, prazo_meses, meta_principal, created_at, updated_at) VALUES
('590a4d35-eafb-48f4-881a-0c7b1e2dc12c'::uuid, '5511949746110', 'Viagem para Europa', 'casa', 0, 10000, 5, false, '2025-10-02 16:31:09.284418+00', '2025-10-13 02:06:09.158254+00'),
('8913e77e-cc18-43f9-b9c5-806fa2428bc3'::uuid, '5511949746110', 'carro', 'carro', 0, 1222222, 5, false, '2025-10-02 20:31:20.60123+00', '2025-10-13 02:06:09.158254+00'),
('43554a13-126b-44b2-8a58-72607033ce36'::uuid, '5511949746110', 'Viagem', 'viagem', 0, 10000, 3, false, '2025-10-02 21:04:55.097721+00', '2025-10-13 02:06:09.158254+00'),
('7468b275-6f8a-4b8a-92e0-4d1aafa1af47'::uuid, '5511949746110', 'Red 8k', 'presente', 0, 30000, 5, false, '2025-10-03 18:53:11.949835+00', '2025-10-13 02:06:09.158254+00'),
('a6a855a8-1a45-4b84-b79f-0b566a84d353'::uuid, '5511949746110', 'Cópia de - Red 8k', 'presente', 0, 30000, 5, false, '2025-10-04 03:05:09.456792+00', '2025-10-13 02:06:09.158254+00'),
('7eb61caf-5617-49ab-8a99-5c67f4be0b0f'::uuid, '5511949746110', 'Férias 2026', 'viagem', 0, 150, NULL, false, '2025-10-06 17:10:10.934393+00', '2025-10-13 02:06:09.158254+00'),
('1a5e28b2-b204-4104-b084-5f0a71e720ed'::uuid, '5511949746110', 'asdadadsd', 'casa', 0.5, 150, 5, false, '2025-10-06 17:57:53.942182+00', '2025-10-13 02:06:09.158254+00'),
('fdc3d543-b71e-4ef5-9edd-9a460aabdc8a'::uuid, '5511949746110', 'Test Goal', 'carro', 0, 50, 6, false, '2025-10-06 18:11:11.879889+00', '2025-10-13 02:06:09.158254+00'),
('756e857f-f819-4234-a2c7-df9caf5961d0'::uuid, '5511949746110', 'asdada', 'economia', 0, 2222.22, 3, false, '2025-10-06 18:52:59.180966+00', '2025-10-13 02:06:09.158254+00'),
('7f1e4e0a-aaa6-4719-ba67-1960e401970a'::uuid, '5511949746110', 'Viagem para a Europa', 'viagem', 0, 100, NULL, false, '2025-10-08 12:09:30.333492+00', '2025-10-13 02:06:09.158254+00'),
('404c9972-0118-46fd-bf98-8996fd529aa7'::uuid, '5511949746110', 'Test Compliance Goal', 'carro', 0, 10, NULL, false, '2025-10-08 12:10:15.916708+00', '2025-10-13 02:06:09.158254+00'),
('4870985f-7e07-46a1-9c34-cf95bb624436'::uuid, '5511949746110', 'Viagem para a Europa', 'viagem', 0, 100, NULL, false, '2025-10-09 03:07:25.68961+00', '2025-10-13 02:06:09.158254+00'),
('08923e2c-e8f1-4641-80c8-bc831da5b855'::uuid, '5511949746110', 'Test Goal Creation', 'carro', 0, 5, NULL, false, '2025-10-09 09:05:37.731357+00', '2025-10-13 02:06:09.158254+00'),
('ad858e9f-f789-47a3-a266-6106f4a6138f'::uuid, '5511949746110', 'Teste Progresso Automático', 'carro', 0.5, 1, NULL, false, '2025-10-09 20:24:24.310785+00', '2025-10-13 02:06:09.158254+00'),
('a1ddb3d2-e97c-4bde-b775-7d51199db601'::uuid, '5511949746110', 'ddddd', 'casa', 333.33, 55555.55, NULL, false, '2025-10-09 20:34:24.982796+00', '2025-10-13 02:06:09.158254+00'),
('ce11d028-7c58-412a-abf1-49f5db9f5761'::uuid, '5511949746110', 'yyyyyyy', 'economia', 5.55, 5555.55, 2, false, '2025-10-09 20:38:08.45629+00', '2025-10-13 02:06:09.158254+00'),
('1be53cf0-f02b-46ff-91aa-6275b2e4b177'::uuid, '5511949746110', 'Teste Toast Padronizado', 'carro', 5.55, 10, NULL, false, '2025-10-09 20:40:30.072398+00', '2025-10-13 02:06:09.158254+00'),
('4df3803f-a198-42ab-b21a-774b27152efe'::uuid, '5511949746110', 'Test Goal Creation', 'carro', 0, 0.05, NULL, false, '2025-10-14 03:19:09.761796+00', '2025-10-14 03:19:09.761796+00'),
('b94873c9-2c4a-4949-a5a1-93c76216ba9d'::uuid, '5511949746110', 'asdasdad', 'trabalho', 2.22, 222.22, 2, false, '2025-10-15 21:12:54.855902+00', '2025-10-15 21:12:54.855902+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. TASKS (13 registros)
-- ============================================================================

INSERT INTO public.tasks (id, phone, title, description, due_date, priority, status, category, completed_at, position, created_at, updated_at) VALUES
('a87f91dd-fbb3-4a68-9e63-f5c8d55975a5'::uuid, '5511949746110', 'reuniao', 'dasdasd', '2025-10-22 03:00:00+00', 'medium', 'done', 'trabalho', '2025-10-09 23:36:51.852+00', 0, '2025-10-04 10:55:28.780293+00', '2025-10-09 23:36:52.0203+00'),
('fdf26d62-0248-471a-99f8-d1ac153b29a2'::uuid, '5511949746110', 'reuniao', 'adaddadad', '2025-10-01 03:00:00+00', 'medium', 'pending', 'trabalho', NULL, 0, '2025-10-04 10:55:50.13843+00', '2025-10-04 10:56:29.87231+00'),
('b30cfe0a-ab44-45dc-bc23-4536e5fc0a1a'::uuid, '5511949746110', 'asdadadad', NULL, NULL, 'medium', 'pending', NULL, NULL, 0, '2025-10-05 05:33:10.130485+00', '2025-10-05 05:33:10.130485+00'),
('877aa9db-04c1-4b15-8798-399f32bbfd1a'::uuid, '5511949746110', 'dddddddddddddd', 'dddddddddd', '2025-10-29 03:00:00+00', 'high', 'done', NULL, '2025-10-15 06:05:28.306+00', 0, '2025-10-05 06:02:43.758476+00', '2025-10-15 06:05:28.647153+00'),
('22a70870-28b4-48e7-b662-09b491699011'::uuid, '5511949746110', 'dasdasda', 'asdadasd', '2025-10-22 03:00:00+00', 'medium', 'done', 'asdads', '2025-10-15 06:04:57.728+00', 0, '2025-10-06 13:46:32.58628+00', '2025-10-15 06:04:57.989409+00'),
('7e9da991-3f50-4a85-bb5f-e316d0c23ecc'::uuid, '5511949746110', 'asdasdasd', 'asdadasd', '2025-10-21 03:00:00+00', 'medium', 'done', 'asdadad', '2025-10-15 06:04:38.861+00', 0, '2025-10-06 14:00:36.206394+00', '2025-10-15 06:04:39.285212+00'),
('2f59d037-05d4-45a3-a676-76375389062f'::uuid, '5511949746110', 'Task 1 - Low Priority', 'Description for task 1', '2025-10-10 00:00:00+00', 'low', 'done', 'Work', '2025-10-15 06:04:21.471+00', 0, '2025-10-06 17:10:27.049708+00', '2025-10-15 06:04:21.709906+00'),
('8111f422-e48a-4e07-8cd3-8ce969949076'::uuid, '5511949746110', 'Task 1', 'Description for task 1', NULL, 'medium', 'done', NULL, '2025-10-14 22:35:53.525+00', 0, '2025-10-06 18:12:56.342567+00', '2025-10-14 22:35:53.825391+00'),
('cd284483-797f-4131-8cb1-2ed13806401a'::uuid, '5511949746110', 'call', 'dadada', '2025-10-06 03:00:00+00', 'medium', 'done', 'asdad', '2025-10-09 08:35:19.154+00', 0, '2025-10-06 18:19:33.37778+00', '2025-10-09 08:35:19.323381+00'),
('d5149ef9-4f36-4703-a5fe-7e6f6bec16be'::uuid, '5511949746110', 'asdasdad', '', NULL, 'high', 'done', '', '2025-10-14 03:20:14.902+00', 0, '2025-10-07 03:45:06.542065+00', '2025-10-14 03:20:15.190114+00'),
('df52e3ce-1b5b-4500-9895-c7b567c07623'::uuid, '5511949746110', 'Qualificar lead e agendar reunião via WhatsApp', 'Lead qualificado com sucesso. Agendar reunião via WhatsApp e enviar e-mail de confirmação.', '2025-10-15 00:00:00+00', 'medium', 'done', 'Trabalho', '2025-10-15 06:04:03.825+00', 0, '2025-10-09 08:08:53.322659+00', '2025-10-15 06:04:04.096942+00'),
('6127ab26-d947-4384-bb5f-cac782e77ed9'::uuid, '5511949746110', 'Alerta Proativo LGPD - Template A', 'Mensagem proativa enviada fora da janela de 24 horas conforme LGPD.', '2025-10-10 00:00:00+00', 'medium', 'pending', NULL, NULL, 0, '2025-10-09 08:09:26.034231+00', '2025-10-16 01:07:46.36122+00'),
('70f80edd-2e86-4ef9-be6b-8b6c34beb2c6'::uuid, '5511949746110', 'Test Task', 'This is a test task description.', '2025-10-15 00:00:00+00', 'medium', 'done', 'Teste', '2025-10-16 01:27:54.05+00', 0, '2025-10-09 09:06:09.528369+00', '2025-10-16 01:27:54.168442+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. EVENTS (32 registros - primeiros 30 aqui)
-- ============================================================================

INSERT INTO public.events (id, calendar_id, phone, title, description, start_ts, end_ts, all_day, timezone, location, conference_url, category, priority, privacy, status, color, rrule, rdates, exdates, series_master_id, created_at, updated_at) VALUES
('b4359155-b5c7-4237-9a08-a7510378e36b'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Teste Drag Drop', 'Evento para testar o drag and drop corrigido', '2025-10-08 10:45:00+00', '2025-10-08 11:45:00+00', false, 'America/Sao_Paulo', 'Sala de Testes', NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-08 06:29:02.363032+00', '2025-10-08 13:08:20.568216+00'),
('6ec4ba20-41f6-40b7-9b72-16e598293f7f'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Teste Evento Básico', 'Descrição do evento básico para teste.', '2025-10-08 09:00:00+00', '2025-10-08 10:00:00+00', false, 'America/Sao_Paulo', NULL, NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-08 07:14:19.755218+00', '2025-10-08 07:14:19.755218+00'),
('ae6d31dd-f9e5-46bb-a166-bc0c6d1e7276'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Teste de Evento', '', '2025-10-08 22:00:00+00', '2025-10-08 13:00:00+00', false, 'America/Sao_Paulo', '', '', '', 'medium', 'default', 'confirmed', '', NULL, NULL, NULL, NULL, '2025-10-08 12:02:08.093201+00', '2025-10-08 14:19:24.203362+00'),
('31531671-fbb3-407d-9c8a-d10aa0c67323'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Teste Final de Validação', NULL, '2025-10-08 14:00:00+00', '2025-10-08 15:00:00+00', false, 'America/Sao_Paulo', NULL, NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-08 12:02:58.42436+00', '2025-10-08 13:08:18.638475+00'),
('df5d1e2c-5b2f-4cd3-ad6b-f08e726f6a57'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Teste de Bug - Evento Playwright', 'Este é um evento de teste para verificar bugs na funcionalidade de agenda', '2025-10-08 17:30:00+00', '2025-10-08 18:30:00+00', false, 'America/Sao_Paulo', 'Sala de Testes Playwright', NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-08 22:16:18.093106+00', '2025-10-08 22:16:18.093106+00'),
('459b6d74-e499-477e-8f31-2c623d148fd9'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'asdasda', NULL, '2025-10-09 08:30:00+00', '2025-10-09 09:30:00+00', false, 'America/Sao_Paulo', NULL, NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-09 03:36:09.858382+00', '2025-10-09 03:36:09.858382+00'),
('722fc572-537d-4034-a086-09980ce424ff'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Teste de Evento OAuth', 'Evento para testar sincronização com Google Calendar', '2025-10-09 09:00:00+00', '2025-10-09 10:00:00+00', false, 'America/Sao_Paulo', NULL, NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-09 08:31:56.31794+00', '2025-10-09 08:31:56.31794+00'),
('5b3b8103-22f5-463b-87fe-62bfd8e52c27'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Reunião com cliente', 'Discussão sobre o projeto e próximos passos', '2025-10-09 09:00:00+00', '2025-10-09 10:00:00+00', false, 'America/Sao_Paulo', NULL, NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-09 08:32:56.364512+00', '2025-10-09 08:32:56.364512+00'),
('8be034a3-b4d0-45a6-85ff-12972457d802'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Teste de carga - Evento 1', 'Evento criado para teste de performance e carga.', '2025-10-09 09:00:00+00', '2025-10-09 10:05:00+00', false, 'America/Sao_Paulo', NULL, NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-09 09:05:44.145784+00', '2025-10-09 09:05:44.145784+00'),
('be69c728-bc07-49bb-a0ee-0d51f2117353'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Test Event Title', 'This is a test event description.', '2025-10-09 21:30:00+00', '2025-10-09 23:30:00+00', false, 'America/Sao_Paulo', 'Meeting Room 1', 'https://meet.google.com/test-meeting', '', 'medium', 'default', 'confirmed', '', NULL, NULL, NULL, NULL, '2025-10-09 09:08:05.95434+00', '2025-10-15 23:04:21.326569+00'),
('0aa3f971-99a6-4cf6-844a-2da62e16adbf'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Reunião de Teste', 'Descrição do evento de teste.', '2025-10-09 09:00:00+00', '2025-10-09 10:00:00+00', false, 'America/Sao_Paulo', NULL, NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-09 09:09:59.183046+00', '2025-10-09 09:09:59.183046+00'),
('e1160e7a-85ed-4a73-af63-1bb7bab40c3a'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'aaaaa', NULL, '2025-10-10 16:30:00+00', '2025-10-10 17:30:00+00', false, 'America/Sao_Paulo', NULL, NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-10 06:01:20.088188+00', '2025-10-10 06:01:20.088188+00'),
('69b73dc9-b5df-46e7-9e0b-0eecbc581870'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Evento de Teste - Hoje', 'Evento criado para testar a exibição', '2025-01-08 10:00:00+00', '2025-01-08 11:00:00+00', false, 'America/Sao_Paulo', 'Escritório', NULL, 'work', 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-10 06:03:11.677492+00', '2025-10-10 06:03:11.677492+00'),
('7fb5d201-c076-4e56-b695-a1bf81bb3ef4'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Reunião Importante', 'Reunião de teste para verificar exibição', '2025-01-08 14:00:00+00', '2025-01-08 15:30:00+00', false, 'America/Sao_Paulo', 'Sala de Reuniões', NULL, 'work', 'high', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-10 06:03:11.677492+00', '2025-10-10 06:03:11.677492+00'),
('0801090e-df74-4f6b-b171-893d57744e4e'::uuid, 'ab32dde7-abd3-4f3b-8c2e-510263ebe741'::uuid, '5511949746110', 'Almoço', 'Almoço de trabalho', '2025-01-08 12:00:00+00', '2025-01-08 13:00:00+00', false, 'America/Sao_Paulo', 'Restaurante', NULL, 'personal', 'low', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-10 06:03:11.677492+00', '2025-10-10 06:03:11.677492+00'),
('552691a0-8654-4069-a431-189127254e7a'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Reunião Importante - Hoje', 'Reunião de teste para verificar exibição com data do sistema', '2025-10-10 14:00:00+00', '2025-10-10 15:30:00+00', false, 'America/Sao_Paulo', 'Sala de Reuniões', NULL, 'work', 'high', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-10 06:04:39.47242+00', '2025-10-10 06:04:39.47242+00'),
('91176257-3824-4514-bf4f-f7ad0f28441f'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Evento de Teste - Hoje (Sistema)', 'Evento criado para testar a exibição com data do sistema', '2025-10-10 10:00:00+00', '2025-10-10 11:00:00+00', false, 'America/Sao_Paulo', 'Escritório', NULL, 'work', 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-10 06:04:39.47242+00', '2025-10-10 06:04:39.47242+00'),
('68ed377c-b1b2-4ded-bfc2-8aed2a405ae0'::uuid, 'ab32dde7-abd3-4f3b-8c2e-510263ebe741'::uuid, '5511949746110', 'Almoço - Hoje', 'Almoço de trabalho com data do sistema', '2025-10-10 12:00:00+00', '2025-10-10 13:00:00+00', false, 'America/Sao_Paulo', 'Restaurante', '', 'personal', 'low', 'default', 'confirmed', '', NULL, NULL, NULL, NULL, '2025-10-10 06:04:39.47242+00', '2025-10-10 09:05:00.989549+00'),
('47afe8ed-624f-43d0-90bf-de832231a9fb'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'dia 6', NULL, '2025-10-06 07:15:00+00', '2025-10-06 08:15:00+00', false, 'America/Sao_Paulo', NULL, NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-10 06:26:04.254556+00', '2025-10-10 06:26:04.254556+00'),
('5b25caea-6429-4e2b-827a-df1e46a51672'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Evento Sobreposto 1', 'Primeiro evento sobreposto', '2025-10-10 10:00:00+00', '2025-10-10 11:00:00+00', false, 'America/Sao_Paulo', 'Sala A', NULL, 'work', 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-10 06:33:18.155312+00', '2025-10-10 06:33:18.155312+00'),
('980fc38c-04a9-4e9e-81b6-56309a1ba055'::uuid, 'ab32dde7-abd3-4f3b-8c2e-510263ebe741'::uuid, '5511949746110', 'Evento Sobreposto 2', 'Segundo evento sobreposto', '2025-10-10 10:30:00+00', '2025-10-10 11:30:00+00', false, 'America/Sao_Paulo', 'Sala B', NULL, 'personal', 'high', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-10 06:33:18.155312+00', '2025-10-10 06:33:18.155312+00'),
('5598fd8f-67bb-4cb9-9a25-a22765379786'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Evento Sobreposto 3', 'Terceiro evento sobreposto para teste', '2025-10-10 11:15:00+00', '2025-10-10 12:45:00+00', false, 'America/Sao_Paulo', 'Sala C', '', 'work', 'low', 'default', 'confirmed', '', NULL, NULL, NULL, NULL, '2025-10-10 06:34:25.2459+00', '2025-10-10 09:04:23.138208+00'),
('f72d9c9d-43c4-4e1a-b36a-2b0547033e77'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Teste de Integração OAuth', 'Evento para testar integração segura via OAuth com escopos mínimos.', '2025-10-11 13:00:00+00', '2025-10-11 14:00:00+00', false, 'America/Sao_Paulo', NULL, NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-11 13:43:27.855965+00', '2025-10-11 13:43:27.855965+00'),
('156604c5-fa41-49f3-98fd-7980b24ae906'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Reunião de Teste com Cliente', 'Discussão sobre o projeto e próximos passos.', '2025-10-12 15:00:00+00', '2025-10-12 16:00:00+00', false, 'America/Sao_Paulo', NULL, NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-12 14:57:49.217465+00', '2025-10-12 14:57:49.217465+00'),
('eebc6176-8129-40a9-a3a3-7b4c482c647a'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Reunião de Teste com Cliente', 'Evento para testar agendamento e lembrete via WhatsApp.', '2025-10-12 15:00:00+00', '2025-10-12 16:00:00+00', false, 'America/Sao_Paulo', NULL, NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-12 15:30:58.657909+00', '2025-10-12 15:30:58.657909+00'),
('0f7784ed-c602-456e-80bb-50c7f5e94cd0'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Reunião de Teste com Cliente', 'Discussão dos pontos do projeto e próximos passos.', '2025-10-12 15:00:00+00', '2025-10-12 16:00:00+00', false, 'America/Sao_Paulo', NULL, NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-12 15:31:02.803118+00', '2025-10-12 15:31:02.803118+00'),
('83b49e0c-6b28-48d7-bb05-ee8c546daedc'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', '55555', '', '2025-10-14 07:00:00+00', '2025-10-14 09:00:00+00', false, 'America/Sao_Paulo', '', '', '', 'medium', 'default', 'confirmed', '', NULL, NULL, NULL, NULL, '2025-10-14 07:09:28.070018+00', '2025-10-14 07:09:47.98789+00'),
('009e8b58-d328-4363-9d3c-9f0dfe40ad79'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Reunião de Teste', NULL, '2025-10-14 09:00:00+00', '2025-10-14 10:00:00+00', false, 'America/Sao_Paulo', NULL, NULL, 'Reunião', 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-14 22:34:42.124719+00', '2025-10-14 22:34:42.124719+00'),
('fbbb8a65-0d19-4775-a236-8fb0169fb65e'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', '5555', NULL, '2025-10-14 06:30:00+00', '2025-10-14 07:30:00+00', false, 'America/Sao_Paulo', NULL, NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-15 00:59:51.833127+00', '2025-10-15 00:59:51.833127+00'),
('f579a67d-7baf-4b1d-af4b-0db87f61a6c6'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'asdadasd', NULL, '2025-10-14 10:45:00+00', '2025-10-14 11:45:00+00', false, 'America/Sao_Paulo', NULL, NULL, NULL, 'medium', 'default', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2025-10-15 04:17:59.032805+00', '2025-10-15 04:17:59.032805+00');

-- Continuação events (restantes 2)
INSERT INTO public.events (id, calendar_id, phone, title, description, start_ts, end_ts, all_day, timezone, location, conference_url, category, priority, privacy, status, color, rrule, rdates, exdates, series_master_id, created_at, updated_at) VALUES
('424a772d-da90-46e2-b3ca-60137bf556ba'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', '2222', '', '2025-10-15 10:30:00+00', '2025-10-15 11:45:00+00', false, 'America/Sao_Paulo', '', '', '', 'high', 'default', 'confirmed', '', NULL, NULL, NULL, NULL, '2025-10-15 04:18:44.486401+00', '2025-10-15 23:20:24.084925+00'),
('08fa0eb2-f107-4e68-8673-a42791131c09'::uuid, 'a7c5cd6a-8080-455f-9092-3cda32d493cd'::uuid, '5511949746110', 'Test Event AI - Editado', 'This is a test event created by the scheduling AI agent.', '2025-10-15 06:00:00+00', '2025-10-15 07:00:00+00', false, 'America/Sao_Paulo', '', '', '', 'medium', 'default', 'confirmed', '', NULL, NULL, NULL, NULL, '2025-10-15 06:03:38.160088+00', '2025-10-15 22:59:39.736845+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 7. NOTIFICATIONS (1 registro)
-- ============================================================================

INSERT INTO public.notifications (id, phone, tipo, titulo, mensagem, lida, data, created_at) VALUES
('588fdf9f-d0ff-40c8-b5c2-511a3cdf1a7a'::uuid, '5511949746110', 'pagamento aprovado', 'Mercado Livre', 'usuário pagou sua assinatura', true, NULL, '2025-10-04 04:17:41.830536+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 8. PRIVACY_SETTINGS (2 registros)
-- ============================================================================

INSERT INTO public.privacy_settings (id, phone, data_collection, data_processing, data_sharing, marketing_emails, analytics_tracking, cookie_consent, data_retention, consent_date, last_updated, created_at, updated_at) VALUES
('04a135c8-d40d-44ae-beab-6d644e42857b'::uuid, '5511999999999', true, true, false, false, true, true, 365, '2025-10-07 22:01:54.302559+00', '2025-10-07 22:01:54.302559+00', '2025-10-07 22:01:54.302559+00', '2025-10-07 22:01:54.302559+00'),
('9b7e75c0-8fec-4167-a74f-051d3667ab67'::uuid, '5511949746110', true, false, true, false, false, false, 365, '2025-10-09 03:04:56.293+00', '2025-10-11 14:24:44.544+00', '2025-10-09 03:04:56.543181+00', '2025-10-11 14:24:44.764815+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 9. SUPPORT_TICKETS (3 registros)
-- ============================================================================

INSERT INTO public.support_tickets (id, user_phone, ticket_number, type, subject, description, priority, status, attachments, admin_notes, created_at, updated_at) VALUES
('e1309dc2-589c-4598-b1b7-802c84455746'::uuid, '5511949746110', 'TK-000001', 'support', 'Teste de correção RLS', 'Este é um teste para verificar se a correção das políticas RLS do sistema de suporte está funcionando corretamente. O problema anterior era que a função get_authenticated_user_phone não estava retornando o phone correto do usuário autenticado.', 'medium', 'open', '[]'::jsonb, NULL, '2025-10-15 19:29:15.674828+00', '2025-10-15 19:29:15.674828+00'),
('f12acf2d-28bd-41e5-8a4d-1a80cbac0cb2'::uuid, '5511949746110', 'TK-000002', 'support', 'Teste de validação do sistema de suporte', 'Este é um teste de validação do sistema de suporte para verificar se a criação de tickets funciona corretamente.', 'medium', 'open', '[]'::jsonb, NULL, '2025-10-15 19:57:29.028548+00', '2025-10-15 19:57:29.028548+00'),
('61c7c4ee-ab6f-42c6-abb8-9368cd9bec3d'::uuid, '5511949746110', 'TK-000003', 'support', 'dadasda', 'asdadad ad ada da a d ', 'medium', 'open', '[]'::jsonb, NULL, '2025-10-15 21:12:01.185199+00', '2025-10-15 21:12:01.185199+00')
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- ============================================================================
-- VERIFICAÇÃO DE DADOS INSERIDOS
-- ============================================================================

SELECT 'Dados inseridos com sucesso!' as status;

SELECT 
    'clientes' as tabela, 
    COUNT(*) as registros_inseridos 
FROM public.clientes

UNION ALL

SELECT 
    'calendars' as tabela, 
    COUNT(*) as registros_inseridos 
FROM public.calendars

UNION ALL

SELECT 
    'financeiro_registros' as tabela, 
    COUNT(*) as registros_inseridos 
FROM public.financeiro_registros

UNION ALL

SELECT 
    'metas' as tabela, 
    COUNT(*) as registros_inseridos 
FROM public.metas

UNION ALL

SELECT 
    'tasks' as tabela, 
    COUNT(*) as registros_inseridos 
FROM public.tasks

UNION ALL

SELECT 
    'events' as tabela, 
    COUNT(*) as registros_inseridos 
FROM public.events

UNION ALL

SELECT 
    'notifications' as tabela, 
    COUNT(*) as registros_inseridos 
FROM public.notifications

UNION ALL

SELECT 
    'privacy_settings' as tabela, 
    COUNT(*) as registros_inseridos 
FROM public.privacy_settings

UNION ALL

SELECT 
    'support_tickets' as tabela, 
    COUNT(*) as registros_inseridos 
FROM public.support_tickets;

-- ============================================================================
-- FIM DA MIGRAÇÃO DE DADOS
-- ============================================================================

