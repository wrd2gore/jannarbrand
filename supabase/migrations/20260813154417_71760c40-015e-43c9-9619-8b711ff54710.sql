
CREATE POLICY "orders public create" ON public.orders FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "order items public create" ON public.order_items FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id));

GRANT INSERT ON public.orders TO anon;
GRANT INSERT ON public.order_items TO anon;
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT SELECT, INSERT ON public.order_items TO authenticated;

CREATE OR REPLACE FUNCTION public.check_promo(_code text, _subtotal numeric)
RETURNS TABLE (code text, discount numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.code,
         LEAST(
           CASE WHEN p.discount_type = 'percent'
                THEN _subtotal * p.discount_value / 100
                ELSE p.discount_value END,
           _subtotal)
  FROM public.promo_codes p
  WHERE upper(p.code) = upper(_code)
    AND p.active
    AND (p.expires_at IS NULL OR p.expires_at > now())
    AND _subtotal >= p.min_total
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.check_promo(text, numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_promo(text, numeric) TO anon, authenticated;
