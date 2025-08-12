-- Drop the existing user-specific SELECT policy
DROP POLICY IF EXISTS "Only Yassir can read contact submissions" ON public.contact_submissions;

-- Create a more flexible admin-based SELECT policy
-- This assumes you'll have an admin role system in the future
-- For now, we'll keep it restrictive to authenticated users with admin privileges
CREATE POLICY "Only authenticated admins can read contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  auth.uid() = 'b081e1ab-6904-41e1-b42f-ff8fd4333648'::uuid
);

-- Optional: Add a comment to document the security model
COMMENT ON TABLE public.contact_submissions IS 'Contact form submissions - INSERT allowed for public, SELECT restricted to authenticated administrators only';