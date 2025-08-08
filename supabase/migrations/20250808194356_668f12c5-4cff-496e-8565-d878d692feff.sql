-- Make explicit deny-all policies for ai_assistant_usage to satisfy linter and harden security
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_assistant_usage' AND policyname = 'Deny select to public'
  ) THEN
    CREATE POLICY "Deny select to public" ON public.ai_assistant_usage FOR SELECT TO anon, authenticated USING (false);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_assistant_usage' AND policyname = 'Deny insert to public'
  ) THEN
    CREATE POLICY "Deny insert to public" ON public.ai_assistant_usage FOR INSERT TO anon, authenticated WITH CHECK (false);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_assistant_usage' AND policyname = 'Deny update to public'
  ) THEN
    CREATE POLICY "Deny update to public" ON public.ai_assistant_usage FOR UPDATE TO anon, authenticated USING (false);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_assistant_usage' AND policyname = 'Deny delete to public'
  ) THEN
    CREATE POLICY "Deny delete to public" ON public.ai_assistant_usage FOR DELETE TO anon, authenticated USING (false);
  END IF;
END $$;