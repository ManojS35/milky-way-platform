
-- Fix the infinite recursion issue in RLS policies by updating the admin policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create the corrected admin policy using the existing security definer function
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Create an admin user profile (this will be used when the user signs up)
-- First, let's make sure we can insert an admin profile when needed
CREATE OR REPLACE FUNCTION public.create_admin_profile(user_id uuid, user_email text)
RETURNS void AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (user_id, split_part(user_email, '@', 1), user_email, 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the handle_new_user function to check for admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'manojs030504@gmail.com' THEN
    INSERT INTO public.profiles (id, username, email, phone, location, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      NEW.email,
      NEW.raw_user_meta_data->>'phone',
      NEW.raw_user_meta_data->>'location',
      'admin'
    );
  ELSE
    INSERT INTO public.profiles (id, username, email, phone, location, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      NEW.email,
      NEW.raw_user_meta_data->>'phone',
      NEW.raw_user_meta_data->>'location',
      COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')
    );
  END IF;
  
  -- If user is a milkman, also create milkmen record
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'buyer') = 'milkman' THEN
    INSERT INTO public.milkmen (id, name, username, location, phone)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'location', 'Unknown'),
      COALESCE(NEW.raw_user_meta_data->>'phone', '')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
