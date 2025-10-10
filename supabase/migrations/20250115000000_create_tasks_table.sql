-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone varchar(15) NOT NULL REFERENCES public.clientes(phone) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date timestamptz,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'overdue')),
  category text,
  completed_at timestamptz,
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_phone ON public.tasks(phone);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_position ON public.tasks(position);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own tasks"
  ON public.tasks FOR SELECT
  USING (phone = current_setting('request.jwt.claims', true)::json->>'phone');

CREATE POLICY "Users can insert their own tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (phone = current_setting('request.jwt.claims', true)::json->>'phone');

CREATE POLICY "Users can update their own tasks"
  ON public.tasks FOR UPDATE
  USING (phone = current_setting('request.jwt.claims', true)::json->>'phone');

CREATE POLICY "Users can delete their own tasks"
  ON public.tasks FOR DELETE
  USING (phone = current_setting('request.jwt.claims', true)::json->>'phone');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_tasks_updated_at();

-- Create function to auto-update overdue tasks
CREATE OR REPLACE FUNCTION update_overdue_tasks()
RETURNS void AS $$
BEGIN
  UPDATE public.tasks
  SET status = 'overdue'
  WHERE status = 'pending'
    AND due_date IS NOT NULL
    AND due_date < now()
    AND completed_at IS NULL;
END;
$$ LANGUAGE plpgsql;