
-- Create user profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  phone TEXT,
  location TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'buyer', 'milkman')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create milkmen table for milkman-specific data
CREATE TABLE public.milkmen (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  phone TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  distance TEXT,
  available BOOLEAN DEFAULT false,
  account_number TEXT,
  ifsc_code TEXT,
  total_due DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create daily records table for transactions
CREATE TABLE public.daily_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL CHECK (user_role IN ('buyer', 'milkman')),
  date DATE NOT NULL,
  quantity DECIMAL(8,2) NOT NULL,
  rate DECIMAL(8,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'supply')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create products table
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('feed', 'dairy_product')),
  price DECIMAL(8,2) NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create product sales table
CREATE TABLE public.product_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  buyer_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_role TEXT NOT NULL CHECK (buyer_role IN ('buyer', 'milkman')),
  quantity DECIMAL(8,2) NOT NULL,
  rate DECIMAL(8,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create payments table for buyer payments
CREATE TABLE public.payments (
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
CREATE TABLE public.milkman_payments (
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
CREATE TABLE public.dairy_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  milkman_rate DECIMAL(8,2) NOT NULL DEFAULT 55,
  buyer_rate DECIMAL(8,2) NOT NULL DEFAULT 70,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default dairy rates
INSERT INTO public.dairy_rates (milkman_rate, buyer_rate) VALUES (55, 70);

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
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for milkmen (admins can view all, milkmen can view own)
CREATE POLICY "Admins can view all milkmen" ON public.milkmen FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Milkmen can view own data" ON public.milkmen FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Milkmen can update own data" ON public.milkmen FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Milkmen can insert own data" ON public.milkmen FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can update milkmen" ON public.milkmen FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for daily records
CREATE POLICY "Users can view own records" ON public.daily_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all records" ON public.daily_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can insert records" ON public.daily_records FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for products (admins only)
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for product sales
CREATE POLICY "Users can view own purchases" ON public.product_sales FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Admins can view all sales" ON public.product_sales FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can insert sales" ON public.product_sales FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for payments
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can insert own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Create RLS policies for milkman payments
CREATE POLICY "Milkmen can view own payments" ON public.milkman_payments FOR SELECT USING (auth.uid() = milkman_id);
CREATE POLICY "Admins can view all milkman payments" ON public.milkman_payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Milkmen can insert own payments" ON public.milkman_payments FOR INSERT WITH CHECK (auth.uid() = milkman_id);

-- Create RLS policies for dairy rates (admins only)
CREATE POLICY "Everyone can view rates" ON public.dairy_rates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage rates" ON public.dairy_rates FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')
  );
  
  -- If user is a milkman, also create milkmen record
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'buyer') = 'milkman' THEN
    INSERT INTO public.milkmen (id, name, location, phone)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'location', 'Unknown'),
      COALESCE(NEW.raw_user_meta_data->>'phone', '')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
