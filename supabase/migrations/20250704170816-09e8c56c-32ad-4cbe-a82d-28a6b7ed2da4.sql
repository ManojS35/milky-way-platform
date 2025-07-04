
-- Create user profiles table to store additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'buyer', 'milkman')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create milkmen table for milkman-specific data
CREATE TABLE IF NOT EXISTS public.milkmen (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  username TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  phone TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  distance TEXT,
  available BOOLEAN DEFAULT false,
  account_number TEXT,
  ifsc_code TEXT,
  total_due DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create daily records table for transactions
CREATE TABLE IF NOT EXISTS public.daily_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL CHECK (user_role IN ('buyer', 'milkman')),
  date DATE NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  rate DECIMAL(10,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'supply')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('feed', 'dairy_product')),
  price DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create product sales table
CREATE TABLE IF NOT EXISTS public.product_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  buyer_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_role TEXT NOT NULL CHECK (buyer_role IN ('buyer', 'milkman')),
  quantity DECIMAL(10,2) NOT NULL,
  rate DECIMAL(10,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create payments table for buyer payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  buyer_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create milkman payments table
CREATE TABLE IF NOT EXISTS public.milkman_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  milkman_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  milkman_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create dairy rates table
CREATE TABLE IF NOT EXISTS public.dairy_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  milkman_rate DECIMAL(10,2) NOT NULL DEFAULT 55,
  buyer_rate DECIMAL(10,2) NOT NULL DEFAULT 70,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default dairy rates if not exists
INSERT INTO public.dairy_rates (milkman_rate, buyer_rate) 
SELECT 55, 70
WHERE NOT EXISTS (SELECT 1 FROM public.dairy_rates);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milkmen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milkman_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dairy_rates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile') THEN
    CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
    CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can view all profiles') THEN
    CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Create RLS policies for milkmen
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'milkmen' AND policyname = 'Milkmen can view their own data') THEN
    CREATE POLICY "Milkmen can view their own data" ON public.milkmen FOR SELECT USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'milkmen' AND policyname = 'Milkmen can update their own data') THEN
    CREATE POLICY "Milkmen can update their own data" ON public.milkmen FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'milkmen' AND policyname = 'Admins can manage milkmen') THEN
    CREATE POLICY "Admins can manage milkmen" ON public.milkmen FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Create RLS policies for daily records
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_records' AND policyname = 'Users can view their own records') THEN
    CREATE POLICY "Users can view their own records" ON public.daily_records FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_records' AND policyname = 'Users can insert their own records') THEN
    CREATE POLICY "Users can insert their own records" ON public.daily_records FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_records' AND policyname = 'Admins can manage all records') THEN
    CREATE POLICY "Admins can manage all records" ON public.daily_records FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Create RLS policies for products
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Anyone can view products') THEN
    CREATE POLICY "Anyone can view products" ON public.products FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admins can manage products') THEN
    CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Create RLS policies for product sales
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_sales' AND policyname = 'Users can view their own sales') THEN
    CREATE POLICY "Users can view their own sales" ON public.product_sales FOR SELECT USING (auth.uid() = buyer_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_sales' AND policyname = 'Admins can manage all sales') THEN
    CREATE POLICY "Admins can manage all sales" ON public.product_sales FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Create RLS policies for payments
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Users can view their own payments') THEN
    CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (auth.uid() = buyer_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Users can insert their own payments') THEN
    CREATE POLICY "Users can insert their own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = buyer_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Admins can view all payments') THEN
    CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Create RLS policies for milkman payments
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'milkman_payments' AND policyname = 'Milkmen can view their own payments') THEN
    CREATE POLICY "Milkmen can view their own payments" ON public.milkman_payments FOR SELECT USING (auth.uid() = milkman_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'milkman_payments' AND policyname = 'Milkmen can insert their own payments') THEN
    CREATE POLICY "Milkmen can insert their own payments" ON public.milkman_payments FOR INSERT WITH CHECK (auth.uid() = milkman_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'milkman_payments' AND policyname = 'Admins can view all milkman payments') THEN
    CREATE POLICY "Admins can view all milkman payments" ON public.milkman_payments FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Create RLS policies for dairy rates
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dairy_rates' AND policyname = 'Anyone can view dairy rates') THEN
    CREATE POLICY "Anyone can view dairy rates" ON public.dairy_rates FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dairy_rates' AND policyname = 'Admins can manage dairy rates') THEN
    CREATE POLICY "Admins can manage dairy rates" ON public.dairy_rates FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Create function to handle new user registration (replace if exists)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, phone, location, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'location',
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')
  );
  
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

-- Create trigger for new user registration (drop and recreate to avoid conflicts)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
