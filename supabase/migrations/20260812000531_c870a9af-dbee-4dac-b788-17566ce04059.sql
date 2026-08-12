
-- roles
CREATE TYPE public.app_role AS ENUM ('admin','customer');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- countries
CREATE TABLE public.countries (
  code text PRIMARY KEY,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  currency text NOT NULL DEFAULT '$',
  shipping_cost numeric NOT NULL DEFAULT 0,
  sort_order int NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true
);
GRANT SELECT ON public.countries TO anon, authenticated;
GRANT ALL ON public.countries TO authenticated, service_role;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "countries public read" ON public.countries FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "countries admin write" ON public.countries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.countries (code,name_en,name_ar,currency,shipping_cost,sort_order) VALUES
 ('PS','Palestine','فلسطين','₪',0,1),
 ('JO','Jordan','الأردن','JOD',5,2),
 ('EG','Egypt','مصر','EGP',6,3);

-- products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ar text NOT NULL DEFAULT '',
  tagline_en text NOT NULL DEFAULT '',
  tagline_ar text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_ar text NOT NULL DEFAULT '',
  garment text NOT NULL DEFAULT 'tee',
  category text NOT NULL DEFAULT 'all',
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  sizes jsonb NOT NULL DEFAULT '["S","M","L","XL","XXL","XXXL"]'::jsonb,
  images jsonb NOT NULL DEFAULT '{}'::jsonb,
  print_areas jsonb NOT NULL DEFAULT '{"front":{"x":30,"y":26,"w":40,"h":46},"back":{"x":30,"y":24,"w":40,"h":50}}'::jsonb,
  size_chart jsonb NOT NULL DEFAULT '[]'::jsonb,
  enabled boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT TO anon, authenticated USING (enabled OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "products admin write" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER products_touch BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.product_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  country_code text NOT NULL REFERENCES public.countries(code) ON DELETE CASCADE,
  price numeric NOT NULL DEFAULT 0,
  sale_price numeric,
  UNIQUE (product_id, country_code)
);
GRANT SELECT ON public.product_prices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_prices TO authenticated;
GRANT ALL ON public.product_prices TO service_role;
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prices public read" ON public.product_prices FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "prices admin write" ON public.product_prices FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size text NOT NULL,
  color text NOT NULL,
  stock int NOT NULL DEFAULT 0,
  available boolean NOT NULL DEFAULT true,
  UNIQUE (product_id, size, color)
);
GRANT SELECT ON public.inventory TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory TO authenticated;
GRANT ALL ON public.inventory TO service_role;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inventory public read" ON public.inventory FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "inventory admin write" ON public.inventory FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL DEFAULT 'percent',
  discount_value numeric NOT NULL DEFAULT 0,
  min_total numeric NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.promo_codes TO authenticated;
GRANT ALL ON public.promo_codes TO service_role;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "promo admin all" ON public.promo_codes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value_en text NOT NULL DEFAULT '',
  value_ar text NOT NULL DEFAULT '',
  group_name text NOT NULL DEFAULT 'general',
  kind text NOT NULL DEFAULT 'text',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content public read" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "content admin write" ON public.site_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL DEFAULT to_char(now(),'YYMMDD') || lpad((floor(random()*100000))::text,5,'0'),
  user_id uuid,
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  country_code text NOT NULL,
  currency text NOT NULL DEFAULT '$',
  subtotal numeric NOT NULL DEFAULT 0,
  shipping numeric NOT NULL DEFAULT 0,
  discount numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  promo_code text,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders own read" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "orders admin write" ON public.orders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid,
  product_name text NOT NULL,
  garment text NOT NULL DEFAULT 'tee',
  color text NOT NULL,
  size text NOT NULL,
  qty int NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  design jsonb NOT NULL DEFAULT '{}'::jsonb
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order items read" ON public.order_items FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "order items admin write" ON public.order_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- seed products
INSERT INTO public.products (slug,name_en,name_ar,tagline_en,tagline_ar,description_en,description_ar,garment,category,colors,images,print_areas,size_chart,featured,sort_order) VALUES
('jannar-tee','JANNAR TEE','تيشيرت جنار','Heavyweight 240gsm','قطن ثقيل 240 غرام','Boxy heavyweight cotton tee cut for a relaxed streetwear fit. Printed in Palestine with durable DTG ink on front, back, or both.','تيشيرت قطن ثقيل بقصة واسعة مريحة. مطبوع في فلسطين بحبر عالي الجودة على الأمام أو الخلف أو كليهما.','tee','tees',
 '[{"key":"black","name":"Black","swatch":"#141414"},{"key":"cream","name":"Cream","swatch":"#efe6cf"}]',
 '{"black":{"front":"/mockups/tee-black-front.jpg","back":"/mockups/tee-black-back.jpg"},"cream":{"front":"/mockups/tee-cream-front.jpg","back":"/mockups/tee-cream-back.jpg"}}',
 '{"front":{"x":32,"y":27,"w":36,"h":44},"back":{"x":31,"y":24,"w":38,"h":50}}',
 '[{"size":"S","a":68,"b":52},{"size":"M","a":70,"b":55},{"size":"L","a":72,"b":58},{"size":"XL","a":74,"b":61},{"size":"XXL","a":76,"b":64},{"size":"XXXL","a":78,"b":67}]', true, 1),
('jannar-hoodie','JANNAR HOODIE','هودي جنار','Brushed fleece 400gsm','صوف مكشط 400 غرام','Oversized brushed-fleece hoodie with kangaroo pocket and heavy ribbed cuffs. Built to carry a full back print.','هودي واسع من الصوف المكشط بجيب أمامي وأساور مضلعة. مصمم ليحمل طباعة خلفية كاملة.','hoodie','hoodies',
 '[{"key":"black","name":"Black","swatch":"#141414"},{"key":"cream","name":"Cream","swatch":"#efe6cf"}]',
 '{"black":{"front":"/mockups/hoodie-black-front.jpg","back":"/mockups/hoodie-black-back.jpg"},"cream":{"front":"/mockups/hoodie-cream-front.jpg","back":"/mockups/hoodie-cream-back.jpg"}}',
 '{"front":{"x":34,"y":30,"w":32,"h":26},"back":{"x":30,"y":26,"w":40,"h":46}}',
 '[{"size":"S","a":58,"b":54},{"size":"M","a":60,"b":57},{"size":"L","a":62,"b":60},{"size":"XL","a":65,"b":63},{"size":"XXL","a":68,"b":66},{"size":"XXXL","a":70,"b":69}]', true, 2),
('oversized-tee','OVERSIZED DROP TEE','تيشيرت أوفرسايز','Drop shoulder','كتف منسدل','Extra-wide drop shoulder tee with a longer body. Maximum print area for large graphics and text.','تيشيرت أوفرسايز بكتف منسدل وجسم أطول. مساحة طباعة أكبر للتصاميم الكبيرة.','tee','tees',
 '[{"key":"black","name":"Black","swatch":"#141414"},{"key":"cream","name":"Cream","swatch":"#efe6cf"}]',
 '{"black":{"front":"/mockups/tee-black-front.jpg","back":"/mockups/tee-black-back.jpg"},"cream":{"front":"/mockups/tee-cream-front.jpg","back":"/mockups/tee-cream-back.jpg"}}',
 '{"front":{"x":32,"y":27,"w":36,"h":44},"back":{"x":31,"y":24,"w":38,"h":50}}',
 '[{"size":"S","a":68,"b":52},{"size":"M","a":70,"b":55},{"size":"L","a":72,"b":58},{"size":"XL","a":74,"b":61},{"size":"XXL","a":76,"b":64},{"size":"XXXL","a":78,"b":67}]', false, 3),
('heavy-hoodie','HEAVY BLOCK HOODIE','هودي هيفي بلوك','Boxed fit 450gsm','قصة مربعة 450 غرام','The heaviest piece we make. Dense fleece, squared silhouette, and a print area that runs shoulder to shoulder.','أثقل قطعة نصنعها. صوف كثيف وقصة مربعة ومساحة طباعة من كتف إلى كتف.','hoodie','hoodies',
 '[{"key":"black","name":"Black","swatch":"#141414"},{"key":"cream","name":"Cream","swatch":"#efe6cf"}]',
 '{"black":{"front":"/mockups/hoodie-black-front.jpg","back":"/mockups/hoodie-black-back.jpg"},"cream":{"front":"/mockups/hoodie-cream-front.jpg","back":"/mockups/hoodie-cream-back.jpg"}}',
 '{"front":{"x":34,"y":30,"w":32,"h":26},"back":{"x":30,"y":26,"w":40,"h":46}}',
 '[{"size":"S","a":58,"b":54},{"size":"M","a":60,"b":57},{"size":"L","a":62,"b":60},{"size":"XL","a":65,"b":63},{"size":"XXL","a":68,"b":66},{"size":"XXXL","a":70,"b":69}]', false, 4);

INSERT INTO public.product_prices (product_id, country_code, price)
SELECT p.id, c.code,
  CASE WHEN p.garment='hoodie' THEN
    CASE c.code WHEN 'PS' THEN 190 WHEN 'JO' THEN 38 ELSE 1400 END
  ELSE
    CASE c.code WHEN 'PS' THEN 100 WHEN 'JO' THEN 20 ELSE 750 END
  END
FROM public.products p CROSS JOIN public.countries c;

INSERT INTO public.inventory (product_id, size, color, stock)
SELECT p.id, s.size, cl.color, 25
FROM public.products p
CROSS JOIN LATERAL jsonb_array_elements_text(p.sizes) AS s(size)
CROSS JOIN LATERAL (SELECT jsonb_array_elements(p.colors)->>'key' AS color) cl;

INSERT INTO public.site_content (key, value_en, value_ar, group_name, kind) VALUES
('home.hero.eyebrow','Streetwear made in Palestine','ستريت وير صنع في فلسطين','home','text'),
('home.hero.title','PRINT YOUR OWN','اطبع تصميمك','home','text'),
('home.hero.subtitle','Upload your image, add your text, and wear it. Heavyweight tees and hoodies printed to order.','ارفع صورتك، أضف نصك، والبسه. تيشيرتات وهوديز ثقيلة تُطبع حسب الطلب.','home','text'),
('home.hero.cta','Start customizing','ابدأ التصميم','home','text'),
('home.drops.title','Latest drops','أحدث الإصدارات','home','text'),
('home.banner','Free shipping inside Palestine','شحن مجاني داخل فلسطين','home','text'),
('contact.email','hello@jannar.brand','hello@jannar.brand','contact','text'),
('contact.phone','+970 000 0000','+970 000 0000','contact','text'),
('contact.instagram','https://www.instagram.com/jannar.brand/?hl=en','https://www.instagram.com/jannar.brand/?hl=en','contact','url'),
('contact.tiktok','https://www.tiktok.com/@jannar24','https://www.tiktok.com/@jannar24','contact','url'),
('policy.shipping','Orders are printed within 2-3 business days and delivered in 3-7 days.','تُطبع الطلبات خلال 2-3 أيام عمل وتُسلم خلال 3-7 أيام.','policies','textarea'),
('policy.returns','Custom printed items are final sale unless the item arrives damaged.','القطع المطبوعة حسب الطلب غير قابلة للإرجاع إلا في حال وصولها تالفة.','policies','textarea'),
('footer.tagline','Streetwear made in Palestine','ستريت وير صنع في فلسطين','footer','text');
