-- =============================================
-- SEED DATA FOR DEVELOPMENT & TESTING
-- =============================================

-- =============================================
-- 1. ROLES & PERMISSIONS
-- =============================================

-- Insert roles
INSERT INTO public.roles (id, name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'super_admin', 'Full system access'),
  ('22222222-2222-2222-2222-222222222222', 'admin', 'Administrative access'),
  ('33333333-3333-3333-3333-333333333333', 'sales', 'Sales team access'),
  ('44444444-4444-4444-4444-444444444444', 'ops', 'Operations team access'),
  ('55555555-5555-5555-5555-555555555555', 'warehouse', 'Warehouse staff access'),
  ('66666666-6666-6666-6666-666666666666', 'finance', 'Finance team access'),
  ('77777777-7777-7777-7777-777777777777', 'editor', 'Content editor access')
ON CONFLICT (id) DO NOTHING;

-- Super admin permissions (all modules, all permissions)
INSERT INTO public.permissions (role_id, module, can_read, can_create, can_update, can_delete) VALUES
  ('11111111-1111-1111-1111-111111111111', 'quotes', true, true, true, true),
  ('11111111-1111-1111-1111-111111111111', 'bookings', true, true, true, true),
  ('11111111-1111-1111-1111-111111111111', 'products', true, true, true, true),
  ('11111111-1111-1111-1111-111111111111', 'orders', true, true, true, true),
  ('11111111-1111-1111-1111-111111111111', 'partners', true, true, true, true),
  ('11111111-1111-1111-1111-111111111111', 'content', true, true, true, true),
  ('11111111-1111-1111-1111-111111111111', 'settings', true, true, true, true)
ON CONFLICT (role_id, module) DO NOTHING;

-- Admin permissions (same as super_admin)
INSERT INTO public.permissions (role_id, module, can_read, can_create, can_update, can_delete)
SELECT '22222222-2222-2222-2222-222222222222', module, can_read, can_create, can_update, can_delete
FROM public.permissions WHERE role_id = '11111111-1111-1111-1111-111111111111'
ON CONFLICT (role_id, module) DO NOTHING;

-- Sales permissions
INSERT INTO public.permissions (role_id, module, can_read, can_create, can_update, can_delete) VALUES
  ('33333333-3333-3333-3333-333333333333', 'quotes', true, true, true, false),
  ('33333333-3333-3333-3333-333333333333', 'bookings', true, true, true, false),
  ('33333333-3333-3333-3333-333333333333', 'orders', true, false, false, false),
  ('33333333-3333-3333-3333-333333333333', 'partners', true, false, false, false),
  ('33333333-3333-3333-3333-333333333333', 'products', true, false, false, false)
ON CONFLICT (role_id, module) DO NOTHING;

-- Ops permissions
INSERT INTO public.permissions (role_id, module, can_read, can_create, can_update, can_delete) VALUES
  ('44444444-4444-4444-4444-444444444444', 'bookings', true, false, true, false),
  ('44444444-4444-4444-4444-444444444444', 'orders', true, false, true, false)
ON CONFLICT (role_id, module) DO NOTHING;

-- Warehouse permissions
INSERT INTO public.permissions (role_id, module, can_read, can_create, can_update, can_delete) VALUES
  ('55555555-5555-5555-5555-555555555555', 'products', true, false, true, false),
  ('55555555-5555-5555-5555-555555555555', 'orders', true, false, true, false)
ON CONFLICT (role_id, module) DO NOTHING;

-- Finance permissions
INSERT INTO public.permissions (role_id, module, can_read, can_create, can_update, can_delete) VALUES
  ('66666666-6666-6666-6666-666666666666', 'orders', true, false, true, false),
  ('66666666-6666-6666-6666-666666666666', 'settings', true, false, true, false)
ON CONFLICT (role_id, module) DO NOTHING;

-- Editor permissions
INSERT INTO public.permissions (role_id, module, can_read, can_create, can_update, can_delete) VALUES
  ('77777777-7777-7777-7777-777777777777', 'content', true, true, true, false),
  ('77777777-7777-7777-7777-777777777777', 'partners', true, false, true, false)
ON CONFLICT (role_id, module) DO NOTHING;

-- =============================================
-- 2. PARTNERS
-- =============================================

INSERT INTO public.partners (id, name, slug, logo_url, website_url, description, display_order, is_published) VALUES
  ('p1111111-1111-1111-1111-111111111111', 'Electric Castle Festival', 'electric-castle', 'https://via.placeholder.com/200x100/4F46E5/FFFFFF?text=Electric+Castle', 'https://electriccastle.ro', 'Leading music & arts festival in Romania', 1, true),
  ('p2222222-2222-2222-2222-222222222222', 'Untold Festival', 'untold-festival', 'https://via.placeholder.com/200x100/EC4899/FFFFFF?text=Untold', 'https://untold.com', 'Largest electronic music festival in Romania', 2, true),
  ('p3333333-3333-3333-3333-333333333333', 'Teatrul Național București', 'tnb', 'https://via.placeholder.com/200x100/10B981/FFFFFF?text=TNB', 'https://tnb.ro', 'National Theatre of Bucharest', 3, true),
  ('p4444444-4444-4444-4444-444444444444', 'Arena Națională', 'arena-nationala', 'https://via.placeholder.com/200x100/F59E0B/FFFFFF?text=Arena', 'https://arenanationala.ro', 'National Arena - Sports & Events venue', 4, true),
  ('p5555555-5555-5555-5555-555555555555', 'Romexpo', 'romexpo', 'https://via.placeholder.com/200x100/8B5CF6/FFFFFF?text=Romexpo', 'https://romexpo.ro', 'Premier exhibition & conference center', 5, true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 3. PRODUCT CATEGORIES
-- =============================================

INSERT INTO public.product_categories (id, name_ro, name_en, slug, description_ro, description_en, display_order, is_active) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Token-uri și Bilete', 'Tokens & Tickets', 'tokens-tickets', 'Token-uri numerotate pentru garderobă și bilete pentru evenimente', 'Numbered tokens for cloakroom and event tickets', 1, true),
  ('c2222222-2222-2222-2222-222222222222', 'Echipamente de Imprimare', 'Printing Equipment', 'printing-equipment', 'Imprimante termice, imprimante pentru etichete și consumabile', 'Thermal printers, label printers and supplies', 2, true),
  ('c3333333-3333-3333-3333-333333333333', 'Etichete și Consumabile', 'Labels & Supplies', 'labels-supplies', 'Role de etichete, hârtie termică, ribbon-uri', 'Label rolls, thermal paper, ribbons', 3, true),
  ('c4444444-4444-4444-4444-444444444444', 'Infrastructură Garderobă', 'Cloakroom Infrastructure', 'infrastructure', 'Rack-uri, ghișee, bariere, semnalistică pentru evenimente', 'Racks, counters, barriers, signage for events', 4, true),
  ('c5555555-5555-5555-5555-555555555555', 'Accesorii și Diverse', 'Accessories & Misc', 'accessories', 'Lanyard-uri, folii protecție, organizatoare, ustensile', 'Lanyards, protective covers, organizers, tools', 5, true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 4. PRODUCTS (10 products with variants)
-- =============================================

-- Product 1: Numbered Cloakroom Tokens
INSERT INTO public.products (id, category_id, name_ro, name_en, slug, sku, description_ro, description_en, features_ro, features_en, base_price, tax_rate, has_variants, track_inventory, stock_quantity, is_active, is_featured, is_returnable) VALUES
  ('pr111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 
   'Token-uri Numerotate Garderobă', 'Numbered Cloakroom Tokens', 'cloakroom-tokens-numbered', 'TOK-NUM-001',
   'Token-uri numerotate premium pentru sistem de garderobă profesională. Material durabil, numere mari vizibile.', 
   'Premium numbered tokens for professional cloakroom system. Durable material, large visible numbers.',
   E'- Material: plastic dur rezistent\n- Numere: 1-1000\n- Dimensiune: 38mm\n- Culori disponibile: 5 variante\n- Garanție: 2 ani',
   E'- Material: durable hard plastic\n- Numbers: 1-1000\n- Size: 38mm\n- Colors available: 5 variants\n- Warranty: 2 years',
   450.00, 19.00, true, true, 0, true, true, false)
ON CONFLICT (id) DO NOTHING;

-- Product 1 Variants
INSERT INTO public.product_variants (id, product_id, sku, name_ro, name_en, attributes, price, stock_quantity, is_active) VALUES
  ('pv11111-1111-1111-1111-111111111111', 'pr111111-1111-1111-1111-111111111111', 'TOK-NUM-001-RED', 'Set 1-1000 Roșu', 'Set 1-1000 Red', '{"color": "red", "range": "1-1000"}', 450.00, 50, true),
  ('pv11112-1111-1111-1111-111111111111', 'pr111111-1111-1111-1111-111111111111', 'TOK-NUM-001-BLUE', 'Set 1-1000 Albastru', 'Set 1-1000 Blue', '{"color": "blue", "range": "1-1000"}', 450.00, 35, true),
  ('pv11113-1111-1111-1111-111111111111', 'pr111111-1111-1111-1111-111111111111', 'TOK-NUM-001-GREEN', 'Set 1-1000 Verde', 'Set 1-1000 Green', '{"color": "green", "range": "1-1000"}', 450.00, 40, true),
  ('pv11114-1111-1111-1111-111111111111', 'pr111111-1111-1111-1111-111111111111', 'TOK-NUM-001-YELLOW', 'Set 1-1000 Galben', 'Set 1-1000 Yellow', '{"color": "yellow", "range": "1-1000"}', 450.00, 28, true),
  ('pv11115-1111-1111-1111-111111111111', 'pr111111-1111-1111-1111-111111111111', 'TOK-NUM-001-BLACK', 'Set 1-1000 Negru', 'Set 1-1000 Black', '{"color": "black", "range": "1-1000"}', 450.00, 45, true)
ON CONFLICT (id) DO NOTHING;

-- Product 2: Thermal Printer for Tokens
INSERT INTO public.products (id, category_id, name_ro, name_en, slug, sku, description_ro, description_en, features_ro, features_en, base_price, tax_rate, has_variants, track_inventory, stock_quantity, is_active, is_featured, is_returnable) VALUES
  ('pr222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222',
   'Imprimantă Termică TSC TE200', 'TSC TE200 Thermal Printer', 'tsc-te200-printer', 'PRINT-TSC-TE200',
   'Imprimantă termică profesională pentru etichete și token-uri. Viteză mare, rezoluție 203 DPI.',
   'Professional thermal printer for labels and tokens. High speed, 203 DPI resolution.',
   E'- Rezoluție: 203 DPI\n- Viteză: 6 ips\n- Lățime maximă: 110mm\n- Interfață: USB, Serial, Ethernet\n- Compatibilă cu token-uri și etichete standard',
   E'- Resolution: 203 DPI\n- Speed: 6 ips\n- Max width: 110mm\n- Interface: USB, Serial, Ethernet\n- Compatible with standard tokens and labels',
   1850.00, 19.00, false, true, 15, true, true, true)
ON CONFLICT (id) DO NOTHING;

-- Product 3: Thermal Paper Rolls
INSERT INTO public.products (id, category_id, name_ro, name_en, slug, sku, description_ro, description_en, features_ro, features_en, base_price, tax_rate, has_variants, track_inventory, stock_quantity, is_active, is_featured, is_returnable) VALUES
  ('pr333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333',
   'Role Hârtie Termică 80mm', 'Thermal Paper Rolls 80mm', 'thermal-paper-80mm', 'PAPER-THERM-80',
   'Role de hârtie termică premium, compatibile cu majoritatea imprimantelor. Calitate superioară, rezistentă la estompare.',
   'Premium thermal paper rolls, compatible with most printers. Superior quality, fade-resistant.',
   E'- Dimensiune: 80mm x 80m\n- Culoare: alb\n- Gramaj: 55g/m²\n- Conținut: pachet 50 role\n- Fără BPA',
   E'- Size: 80mm x 80m\n- Color: white\n- Weight: 55g/m²\n- Contents: 50 roll pack\n- BPA-free',
   280.00, 19.00, true, true, 0, true, false, true)
ON CONFLICT (id) DO NOTHING;

-- Product 3 Variants
INSERT INTO public.product_variants (id, product_id, sku, name_ro, name_en, attributes, price, stock_quantity, is_active) VALUES
  ('pv33111-3333-3333-3333-333333333333', 'pr333333-3333-3333-3333-333333333333', 'PAPER-THERM-80-50', 'Pachet 50 role', 'Pack of 50 rolls', '{"quantity": 50}', 280.00, 120, true),
  ('pv33112-3333-3333-3333-333333333333', 'pr333333-3333-3333-3333-333333333333', 'PAPER-THERM-80-100', 'Pachet 100 role', 'Pack of 100 rolls', '{"quantity": 100}', 520.00, 85, true),
  ('pv33113-3333-3333-3333-333333333333', 'pr333333-3333-3333-3333-333333333333', 'PAPER-THERM-80-250', 'Pachet 250 role (Bulk)', 'Pack of 250 rolls (Bulk)', '{"quantity": 250}', 1200.00, 40, true)
ON CONFLICT (id) DO NOTHING;

-- Product 4: Mobile Cloakroom Counter
INSERT INTO public.products (id, category_id, name_ro, name_en, slug, sku, description_ro, description_en, features_ro, features_en, base_price, tax_rate, has_variants, track_inventory, stock_quantity, is_active, is_featured, is_returnable) VALUES
  ('pr444444-4444-4444-4444-444444444444', 'c4444444-4444-4444-4444-444444444444',
   'Ghișeu Mobil pentru Garderobă', 'Mobile Cloakroom Counter', 'mobile-cloakroom-counter', 'COUNTER-MOB-01',
   'Ghișeu mobil pliabil, perfect pentru evenimente. Structură metalică robustă, blat durabil, ușor de transportat și montat.',
   'Foldable mobile counter, perfect for events. Robust metal structure, durable countertop, easy to transport and assemble.',
   E'- Dimensiuni: 120cm x 60cm x 90cm (L x l x H)\n- Material: aluminiu + blat melaminat\n- Greutate: 18kg\n- Capacitate încărcare: 80kg\n- Pliabil pentru transport\n- Include geantă transport',
   E'- Dimensions: 120cm x 60cm x 90cm (W x D x H)\n- Material: aluminum + melamine top\n- Weight: 18kg\n- Load capacity: 80kg\n- Foldable for transport\n- Includes carrying bag',
   1250.00, 19.00, false, true, 8, true, true, false)
ON CONFLICT (id) DO NOTHING;

-- Product 5: Heavy-Duty Garment Rack
INSERT INTO public.products (id, category_id, name_ro, name_en, slug, sku, description_ro, description_en, features_ro, features_en, base_price, tax_rate, has_variants, track_inventory, stock_quantity, is_active, is_featured, is_returnable) VALUES
  ('pr555555-5555-5555-5555-555555555555', 'c4444444-4444-4444-4444-444444444444',
   'Rack Profesional Heavy-Duty', 'Heavy-Duty Professional Garment Rack', 'heavy-duty-rack', 'RACK-HD-150',
   'Rack pentru haine de înaltă rezistență, ideal pentru volume mari. Construcție din oțel cromat, reglabil în înălțime.',
   'Heavy-duty garment rack, ideal for high volumes. Chrome steel construction, height adjustable.',
   E'- Lungime: 150cm\n- Înălțime reglabilă: 120-200cm\n- Capacitate: până la 150kg\n- Material: oțel cromat\n- Rotile cu blocare\n- Montaj rapid fără unelte',
   E'- Length: 150cm\n- Height adjustable: 120-200cm\n- Capacity: up to 150kg\n- Material: chrome steel\n- Lockable wheels\n- Quick assembly without tools',
   680.00, 19.00, true, true, 0, true, true, false)
ON CONFLICT (id) DO NOTHING;

-- Product 5 Variants
INSERT INTO public.product_variants (id, product_id, sku, name_ro, name_en, attributes, price, stock_quantity, is_active) VALUES
  ('pv55111-5555-5555-5555-555555555555', 'pr555555-5555-5555-5555-555555555555', 'RACK-HD-150', 'Rack 150cm', 'Rack 150cm', '{"length": "150cm"}', 680.00, 22, true),
  ('pv55112-5555-5555-5555-555555555555', 'pr555555-5555-5555-5555-555555555555', 'RACK-HD-180', 'Rack 180cm', 'Rack 180cm', '{"length": "180cm"}', 780.00, 18, true),
  ('pv55113-5555-5555-5555-555555555555', 'pr555555-5555-5555-5555-555555555555', 'RACK-HD-200', 'Rack 200cm', 'Rack 200cm', '{"length": "200cm"}', 850.00, 12, true)
ON CONFLICT (id) DO NOTHING;

-- Product 6: Label Printer Zebra ZD421
INSERT INTO public.products (id, category_id, name_ro, name_en, slug, sku, description_ro, description_en, features_ro, features_en, base_price, tax_rate, has_variants, track_inventory, stock_quantity, is_active, is_featured, is_returnable) VALUES
  ('pr666666-6666-6666-6666-666666666666', 'c2222222-2222-2222-2222-222222222222',
   'Imprimantă Etichete Zebra ZD421', 'Zebra ZD421 Label Printer', 'zebra-zd421', 'PRINT-ZEB-ZD421',
   'Imprimantă de etichete Zebra de ultimă generație. Conectivitate multiplă, interfață intuitivă, fiabilitate maximă.',
   'Next-generation Zebra label printer. Multiple connectivity, intuitive interface, maximum reliability.',
   E'- Rezoluție: 203/300 DPI (variante)\n- Viteză: 152mm/s\n- Lățime: până la 108mm\n- Conectivitate: USB, Ethernet, Bluetooth, Wi-Fi\n- Ecran color LCD\n- Garantie extinsă 2 ani',
   E'- Resolution: 203/300 DPI (variants)\n- Speed: 152mm/s\n- Width: up to 108mm\n- Connectivity: USB, Ethernet, Bluetooth, Wi-Fi\n- Color LCD display\n- Extended 2-year warranty',
   2150.00, 19.00, true, true, 0, true, true, true)
ON CONFLICT (id) DO NOTHING;

-- Product 6 Variants
INSERT INTO public.product_variants (id, product_id, sku, name_ro, name_en, attributes, price, stock_quantity, is_active) VALUES
  ('pv66111-6666-6666-6666-666666666666', 'pr666666-6666-6666-6666-666666666666', 'PRINT-ZEB-ZD421-203', 'ZD421 203DPI', 'ZD421 203DPI', '{"resolution": "203dpi"}', 2150.00, 10, true),
  ('pv66112-6666-6666-6666-666666666666', 'pr666666-6666-6666-6666-666666666666', 'PRINT-ZEB-ZD421-300', 'ZD421 300DPI', 'ZD421 300DPI', '{"resolution": "300dpi"}', 2450.00, 7, true)
ON CONFLICT (id) DO NOTHING;

-- Product 7: Barrier System with Retractable Belt
INSERT INTO public.products (id, category_id, name_ro, name_en, slug, sku, description_ro, description_en, features_ro, features_en, base_price, tax_rate, has_variants, track_inventory, stock_quantity, is_active, is_featured, is_returnable) VALUES
  ('pr777777-7777-7777-7777-777777777777', 'c4444444-4444-4444-4444-444444444444',
   'Sistem Barieră cu Bandă Retractabilă', 'Barrier System with Retractable Belt', 'retractable-barrier', 'BARRIER-RET-01',
   'Sistem de bariere profesionale pentru organizarea fluxului la evenimente. Bandă retractabilă 3m, bază greoaie stabilă.',
   'Professional barrier system for crowd management at events. 3m retractable belt, heavy stable base.',
   E'- Lungime bandă: 3m\n- Material bandă: nylon rezistent\n- Greutate bază: 13kg\n- Înălțime: 95cm\n- Finisaj: crom lucios sau negru mat\n- Include sistem conectare',
   E'- Belt length: 3m\n- Belt material: durable nylon\n- Base weight: 13kg\n- Height: 95cm\n- Finish: polished chrome or matte black\n- Includes connection system',
   420.00, 19.00, true, true, 0, true, false, false)
ON CONFLICT (id) DO NOTHING;

-- Product 7 Variants
INSERT INTO public.product_variants (id, product_id, sku, name_ro, name_en, attributes, price, stock_quantity, is_active) VALUES
  ('pv77111-7777-7777-7777-777777777777', 'pr777777-7777-7777-7777-777777777777', 'BARRIER-RET-CHR', 'Barieră Crom', 'Chrome Barrier', '{"finish": "chrome"}', 420.00, 30, true),
  ('pv77112-7777-7777-7777-777777777777', 'pr777777-7777-7777-7777-777777777777', 'BARRIER-RET-BLK', 'Barieră Negru Mat', 'Matte Black Barrier', '{"finish": "matte-black"}', 450.00, 25, true)
ON CONFLICT (id) DO NOTHING;

-- Product 8: Self-Adhesive Label Rolls
INSERT INTO public.products (id, category_id, name_ro, name_en, slug, sku, description_ro, description_en, features_ro, features_en, base_price, tax_rate, has_variants, track_inventory, stock_quantity, is_active, is_featured, is_returnable) VALUES
  ('pr888888-8888-8888-8888-888888888888', 'c3333333-3333-3333-3333-333333333333',
   'Role Etichete Autoadezive', 'Self-Adhesive Label Rolls', 'self-adhesive-labels', 'LABEL-SELF-5738',
   'Etichete autoadezive pentru imprimantă termică. Rezistente, adeziv permanent, compatibile cu majoritatea imprimantelor.',
   'Self-adhesive labels for thermal printers. Durable, permanent adhesive, compatible with most printers.',
   E'- Dimensiune: 57x38mm\n- Material: semi-gloss\n- Adeziv: permanent\n- Role: 1000 etichete/rolă\n- Compatibilitate: universală\n- Pachet: 10 role',
   E'- Size: 57x38mm\n- Material: semi-gloss\n- Adhesive: permanent\n- Rolls: 1000 labels/roll\n- Compatibility: universal\n- Package: 10 rolls',
   180.00, 19.00, true, true, 0, true, false, true)
ON CONFLICT (id) DO NOTHING;

-- Product 8 Variants
INSERT INTO public.product_variants (id, product_id, sku, name_ro, name_en, attributes, price, stock_quantity, is_active) VALUES
  ('pv88111-8888-8888-8888-888888888888', 'pr888888-8888-8888-8888-888888888888', 'LABEL-SELF-5738-10', 'Pachet 10 role', 'Pack of 10 rolls', '{"quantity": 10}', 180.00, 150, true),
  ('pv88112-8888-8888-8888-888888888888', 'pr888888-8888-8888-8888-888888888888', 'LABEL-SELF-5738-50', 'Pachet 50 role', 'Pack of 50 rolls', '{"quantity": 50}', 820.00, 60, true)
ON CONFLICT (id) DO NOTHING;

-- Product 9: Signage Stand with Graphics
INSERT INTO public.products (id, category_id, name_ro, name_en, slug, sku, description_ro, description_en, features_ro, features_en, base_price, tax_rate, has_variants, track_inventory, stock_quantity, is_active, is_featured, is_returnable) VALUES
  ('pr999999-9999-9999-9999-999999999999', 'c4444444-4444-4444-4444-444444444444',
   'Stand Semnalistică Personalizabil', 'Customizable Signage Stand', 'signage-stand', 'SIGN-STAND-A1',
   'Stand pentru semnalistică profesională, personalizabil cu grafică client. Ideal pentru direcționare și informare la evenimente.',
   'Professional signage stand, customizable with client graphics. Ideal for wayfinding and information at events.',
   E'- Format: A1 (594x841mm)\n- Suport: aluminiu\n- Înălțime: reglabilă 100-180cm\n- Bază: antiglisantă cu greutate\n- Include folie printabilă\n- Montaj rapid',
   E'- Format: A1 (594x841mm)\n- Support: aluminum\n- Height: adjustable 100-180cm\n- Base: non-slip weighted\n- Includes printable film\n- Quick assembly',
   320.00, 19.00, false, true, 20, true, false, false)
ON CONFLICT (id) DO NOTHING;

-- Product 10: Professional Lanyard Set
INSERT INTO public.products (id, category_id, name_ro, name_en, slug, sku, description_ro, description_en, features_ro, features_en, base_price, tax_rate, has_variants, track_inventory, stock_quantity, is_active, is_featured, is_returnable) VALUES
  ('pr000000-0000-0000-0000-000000000000', 'c5555555-5555-5555-5555-555555555555',
   'Set Lanyard-uri Profesionale', 'Professional Lanyard Set', 'professional-lanyards', 'LANY-PROF-100',
   'Set de lanyard-uri de calitate premium pentru staff și VIP. Material durabil, sistem detașare siguranță, cleme metalice.',
   'Premium quality lanyard set for staff and VIP. Durable material, safety release system, metal clips.',
   E'- Material: poliester\n- Lățime: 20mm\n- Lungime: 90cm\n- Cleme: metalice rezistente\n- Sistem detașare siguranță\n- Pachet: 100 bucăți',
   E'- Material: polyester\n- Width: 20mm\n- Length: 90cm\n- Clips: durable metal\n- Safety release system\n- Package: 100 pieces',
   95.00, 19.00, true, true, 0, true, false, true)
ON CONFLICT (id) DO NOTHING;

-- Product 10 Variants
INSERT INTO public.product_variants (id, product_id, sku, name_ro, name_en, attributes, price, stock_quantity, is_active) VALUES
  ('pv00111-0000-0000-0000-000000000000', 'pr000000-0000-0000-0000-000000000000', 'LANY-PROF-100', 'Set 100 buc', 'Set of 100 pcs', '{"quantity": 100}', 95.00, 200, true),
  ('pv00112-0000-0000-0000-000000000000', 'pr000000-0000-0000-0000-000000000000', 'LANY-PROF-500', 'Set 500 buc', 'Set of 500 pcs', '{"quantity": 500}', 420.00, 80, true),
  ('pv00113-0000-0000-0000-000000000000', 'pr000000-0000-0000-0000-000000000000', 'LANY-PROF-1000', 'Set 1000 buc (Bulk)', 'Set of 1000 pcs (Bulk)', '{"quantity": 1000}', 750.00, 35, true)
ON CONFLICT (id) DO NOTHING;

-- Product Images (sample for first 3 products)
INSERT INTO public.product_images (product_id, image_url, alt_text_ro, alt_text_en, display_order, is_primary) VALUES
  ('pr111111-1111-1111-1111-111111111111', 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Tokens', 'Token-uri numerotate garderobă', 'Numbered cloakroom tokens', 1, true),
  ('pr222222-2222-2222-2222-222222222222', 'https://via.placeholder.com/800x600/10B981/FFFFFF?text=TSC+Printer', 'Imprimantă termică TSC', 'TSC thermal printer', 1, true),
  ('pr333333-3333-3333-3333-333333333333', 'https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Thermal+Paper', 'Role hârtie termică', 'Thermal paper rolls', 1, true)
ON CONFLICT DO NOTHING;

-- =============================================
-- 5. FAQS
-- =============================================

INSERT INTO public.faqs (question_ro, question_en, answer_ro, answer_en, category, display_order, is_published) VALUES
  ('Care sunt serviciile pe care le oferiți?', 'What services do you offer?',
   'Oferim servicii complete de garderobă profesională pentru evenimente: garderobă cu personal dedicat, servicii VIP și backstage, bag check, lost & found, plus infrastructură completă (rack-uri, ghișee, bariere, semnalistică). Acoperim evenimente de toate dimensiunile, de la 100 până la 12.000+ participanți.',
   'We offer complete professional cloakroom services for events: staffed cloakroom, VIP and backstage services, bag check, lost & found, plus full infrastructure (racks, counters, barriers, signage). We cover events of all sizes, from 100 to 12,000+ participants.',
   'services', 1, true),
  
  ('Cum funcționează sistemul de token-uri numerotate?', 'How does the numbered token system work?',
   'Sistemul nostru folosește token-uri numerotate unice pentru fiecare haine/bagaj. La predare, clientul primește un token cu număr, iar articolul este organizat corespunzător. La ridicare, clientul prezintă token-ul și primește instant articolul său. Simplu, rapid, sigur.',
   'Our system uses unique numbered tokens for each garment/bag. Upon check-in, the client receives a numbered token, and the item is organized accordingly. Upon pick-up, the client presents the token and instantly receives their item. Simple, fast, secure.',
   'services', 2, true),
  
  ('Cât de rapid este procesul de preluare și returnare?', 'How fast is the check-in and pick-up process?',
   'Viteza depinde de volumul de participanți și configurația evenimentului. Procesul nostru optimizat și personalul experimentat minimizează timpii de așteptare. La evenimente cu flux mare, organizăm multiple puncte de lucru și sistem de zonare pentru maximă eficiență.',
   'Speed depends on participant volume and event configuration. Our optimized process and experienced staff minimize wait times. At high-flow events, we organize multiple service points and zoning system for maximum efficiency.',
   'services', 3, true),
  
  ('Ce zone geografice acoperiți?', 'What geographic areas do you cover?',
   'Operăm la nivel național în România. Acoperim toate orașele majore și zone rurale pentru festivaluri și evenimente speciale. Avem echipamente mobile și echipe flexibile pentru orice locație.',
   'We operate nationwide in Romania. We cover all major cities and rural areas for festivals and special events. We have mobile equipment and flexible teams for any location.',
   'coverage', 4, true),
  
  ('Ce se întâmplă dacă se pierde un token?', 'What happens if a token is lost?',
   'Avem proceduri clare pentru token-uri pierdute. Clientul trebuie să furnizeze detalii despre articol (descriere, brand, culoare) și un document de identitate. Verificăm informațiile și eliberăm articolul în siguranță. Pentru protecție maximă, recomandăm păstrarea atentă a token-ului.',
   'We have clear procedures for lost tokens. The client must provide item details (description, brand, color) and an ID document. We verify the information and release the item safely. For maximum protection, we recommend careful token custody.',
   'lost-found', 5, true)
ON CONFLICT DO NOTHING;

-- =============================================
-- 6. CONTENT BLOCKS
-- =============================================

INSERT INTO public.content_blocks (key, title_ro, title_en, content_ro, content_en, is_published) VALUES
  ('home_hero_title', 'Garderobă Profesională pentru Evenimente', 'Professional Cloakroom for Events',
   'Soluții complete de garderobă pentru evenimente de orice dimensiune. Rapid. Sigur. Profesionist.',
   'Complete cloakroom solutions for events of any size. Fast. Safe. Professional.',
   true),
  
  ('home_hero_subtitle', NULL, NULL,
   'Sistem cu token-uri numerotate, personal dedicat, infrastructură completă. De la 100 la 12.000+ participanți.',
   'Numbered token system, dedicated staff, complete infrastructure. From 100 to 12,000+ participants.',
   true),
  
  ('about_company', 'Despre Noi', 'About Us',
   'Suntem furnizorul principal de servicii de garderobă profesională pentru evenimente în România. Cu experiență la festivaluri majore, concerte, conferințe și evenimente corporate, oferim soluții complete adaptate fiecărui client.',
   'We are the leading provider of professional cloakroom services for events in Romania. With experience at major festivals, concerts, conferences and corporate events, we offer complete solutions tailored to each client.',
   true),
  
  ('safety_procedures', 'Proceduri de Siguranță', 'Safety Procedures',
   'Implementăm proceduri stricte de siguranță: zonare clară, control acces, personal instruit, sistem numeric duplicat pentru verificare, camere supraveghere (unde disponibil). Planuri pentru perioade de rush și situații de urgență (power outage).',
   'We implement strict safety procedures: clear zoning, access control, trained staff, duplicate numeric system for verification, surveillance cameras (where available). Plans for rush periods and emergency situations (power outage).',
   true)
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- 7. LEGAL PAGES
-- =============================================

INSERT INTO public.legal_pages (slug, title_ro, title_en, content_ro, content_en, version, effective_date, is_published) VALUES
  ('terms', 'Termeni și Condiții', 'Terms and Conditions',
   E'# Termeni și Condiții\n\n## 1. Acceptarea Termenilor\nAccesând și utilizând acest site, acceptați să respectați acești termeni și condiții.\n\n## 2. Servicii\nFurnizăm servicii de garderobă profesională pentru evenimente, comercializare echipamente și consumabile.\n\n## 3. Comenzi\nComenzile sunt procesate după confirmare și plată. Prețurile includ TVA 19%.\n\n## 4. Livrare\nLivrarea se face prin curier. Termene estimate: 2-5 zile lucrătoare în România.\n\n## 5. Retur\nProdusele marcate ca returnable pot fi returnate în 14 zile de la livrare, în ambalaj original.',
   E'# Terms and Conditions\n\n## 1. Acceptance of Terms\nBy accessing and using this site, you agree to comply with these terms and conditions.\n\n## 2. Services\nWe provide professional cloakroom services for events, equipment and supplies sales.\n\n## 3. Orders\nOrders are processed after confirmation and payment. Prices include 19% VAT.\n\n## 4. Delivery\nDelivery is by courier. Estimated timeframe: 2-5 business days in Romania.\n\n## 5. Returns\nProducts marked as returnable can be returned within 14 days of delivery, in original packaging.',
   '1.0', '2026-01-01', true),
  
  ('privacy', 'Politica de Confidențialitate', 'Privacy Policy',
   E'# Politica de Confidențialitate\n\n## Colectarea Datelor\nColectăm date personale necesare pentru procesarea comenzilor și oferirea serviciilor: nume, email, telefon, adresă.\n\n## Utilizarea Datelor\nDatele sunt folosite exclusiv pentru: procesarea comenzilor, comunicare, îmbunătățirea serviciilor.\n\n## Protecția Datelor\nImplementăm măsuri de securitate pentru protejarea datelor dumneavoastră.\n\n## Drepturile Dumneavoastră\nAveți dreptul de acces, rectificare, ștergere a datelor personale conform GDPR.',
   E'# Privacy Policy\n\n## Data Collection\nWe collect personal data necessary for order processing and service delivery: name, email, phone, address.\n\n## Data Usage\nData is used exclusively for: order processing, communication, service improvement.\n\n## Data Protection\nWe implement security measures to protect your data.\n\n## Your Rights\nYou have the right to access, rectify, delete personal data according to GDPR.',
   '1.0', '2026-01-01', true),
  
  ('returns', 'Politica de Retur', 'Returns Policy',
   E'# Politica de Retur\n\n## Termene\nProdusele eligibile pot fi returnate în 14 zile de la livrare.\n\n## Condiții\n- Produs în ambalaj original\n- Nefolosit, în stare impecabilă\n- Cu toate accesoriile și documentele\n\n## Procedură\n1. Contactați-ne pentru autorizarea returului\n2. Trimiteți produsul la adresa indicată\n3. Rambursarea se face în 5-7 zile lucrătoare după primire\n\n## Excepții\nProdusele personalizate sau consumabilele deschise nu pot fi returnate.',
   E'# Returns Policy\n\n## Timeframe\nEligible products can be returned within 14 days of delivery.\n\n## Conditions\n- Product in original packaging\n- Unused, in perfect condition\n- With all accessories and documents\n\n## Procedure\n1. Contact us for return authorization\n2. Send product to indicated address\n3. Refund processed within 5-7 business days after receipt\n\n## Exceptions\nCustomized products or opened consumables cannot be returned.',
   '1.0', '2026-01-01', true)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 8. QUOTES (3 sample quotes)
-- =============================================

INSERT INTO public.quotes (id, quote_number, client_name, client_email, client_phone, client_company, event_name, event_type, location, start_date, end_date, estimated_participants, needs_cloakroom, needs_vip, needs_backstage, needs_bag_check, needs_infrastructure, constraints, notes, status) VALUES
  ('q1111111-1111-1111-1111-111111111111', 'QT-2026-001', 'Ana Popescu', 'ana.popescu@musicfest.ro', '+40722111222', 'Music Fest SRL',
   'Summer Music Festival 2026', 'festival', 'Baza Sportivă Mangalia', '2026-07-15 18:00:00+00', '2026-07-17 04:00:00+00', 8000,
   true, true, true, true, true,
   'Necesită 3 puncte separate pentru garderobă generală și 1 punct VIP. Zone outdoor, necesită acoperire pentru ploaie.',
   'Client existent, colaborare bună anul trecut. Prioritate mare.',
   'offer_sent'),
  
  ('q2222222-2222-2222-2222-222222222222', 'QT-2026-002', 'Mihai Ionescu', 'office@techconf.ro', '+40733222333', 'TechConf Romania',
   'TechConf Romania 2026', 'conference', 'Romexpo București, Pavilion B2', '2026-03-20 09:00:00+00', '2026-03-22 19:00:00+00', 2500,
   true, false, false, true, true,
   'Conferință corporate, necesită aspect profesional. Setup în ajun (19 martie seara).',
   NULL,
   'negotiation'),
  
  ('q3333333-3333-3333-3333-333333333333', 'QT-2026-003', 'Elena Dumitrescu', 'elena.d@gmail.com', '+40744333444', NULL,
   'Concert Caritabil', 'concert', 'Sala Palatului București', '2026-02-14 19:00:00+00', '2026-02-14 23:00:00+00', 1200,
   true, false, false, false, false,
   'Eveniment caritabil, necesită ofertă preferențială.',
   'Eveniment nou, fără colaborare anterioară.',
   'in_review')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 9. ORDERS (2 sample orders)
-- =============================================

INSERT INTO public.orders (id, order_number, customer_email, customer_name, customer_phone, billing_company, billing_cui, billing_address, billing_city, billing_county, billing_postal_code, shipping_address, shipping_city, shipping_county, shipping_postal_code, subtotal, tax_amount, shipping_cost, total_amount, payment_method, payment_status, status, shipping_method) VALUES
  ('o1111111-1111-1111-1111-111111111111', 'ORD-2026-001', 'office@eventpro.ro', 'EventPro SRL', '+40722555666',
   'EventPro Solutions SRL', 'RO12345678', 'Str. Aviatorilor nr. 15', 'București', 'București', '010051',
   'Str. Aviatorilor nr. 15', 'București', 'București', '010051',
   1850.00, 351.50, 0.00, 2201.50, 'card', 'paid', 'delivered', 'Curier Standard'),
  
  ('o2222222-2222-2222-2222-222222222222', 'ORD-2026-002', 'procurement@festivalcompany.ro', 'Festival Company', '+40733777888',
   'Festival Company SRL', 'RO87654321', 'Calea Victoriei nr. 200', 'Cluj-Napoca', 'Cluj', '400001',
   'Calea Victoriei nr. 200', 'Cluj-Napoca', 'Cluj', '400001',
   3260.00, 619.40, 50.00, 3929.40, 'bank_transfer', 'paid', 'processing', 'Curier Standard')
ON CONFLICT (id) DO NOTHING;

-- Order 1 Items
INSERT INTO public.order_items (order_id, product_id, variant_id, product_name, product_sku, unit_price, quantity, tax_rate, subtotal, tax_amount, total) VALUES
  ('o1111111-1111-1111-1111-111111111111', 'pr222222-2222-2222-2222-222222222222', NULL, 'Imprimantă Termică TSC TE200', 'PRINT-TSC-TE200', 1850.00, 1, 19.00, 1850.00, 351.50, 2201.50)
ON CONFLICT DO NOTHING;

-- Order 2 Items
INSERT INTO public.order_items (order_id, product_id, variant_id, product_name, product_sku, unit_price, quantity, tax_rate, subtotal, tax_amount, total) VALUES
  ('o2222222-2222-2222-2222-222222222222', 'pr555555-5555-5555-5555-555555555555', 'pv55111-5555-5555-5555-555555555555', 'Rack Profesional Heavy-Duty 150cm', 'RACK-HD-150', 680.00, 4, 19.00, 2720.00, 516.80, 3236.80),
  ('o2222222-2222-2222-2222-222222222222', 'pr000000-0000-0000-0000-000000000000', 'pv00111-0000-0000-0000-000000000000', 'Set Lanyard-uri Profesionale 100 buc', 'LANY-PROF-100', 95.00, 2, 19.00, 190.00, 36.10, 226.10),
  ('o2222222-2222-2222-2222-222222222222', 'pr999999-9999-9999-9999-999999999999', NULL, 'Stand Semnalistică Personalizabil', 'SIGN-STAND-A1', 320.00, 1, 19.00, 320.00, 60.80, 380.80),
  ('o2222222-2222-2222-2222-222222222222', 'pr777777-7777-7777-7777-777777777777', 'pv77111-7777-7777-7777-777777777777', 'Sistem Barieră cu Bandă Retractabilă Crom', 'BARRIER-RET-CHR', 420.00, 1, 19.00, 420.00, 79.80, 499.80)
ON CONFLICT DO NOTHING;

-- =============================================
-- 10. SETTINGS
-- =============================================

INSERT INTO public.settings (key, value, description) VALUES
  ('company_info', 
   '{"name": "Garderobă profesională", "cui": "RO12345678", "reg_com": "J40/1234/2020", "address": "Str. Exemplu nr. 1, București, România", "phone": "+40 700 000 000", "email": "office@cloakroom.ro", "website": "https://cloakroom.ro"}',
   'Company identification and contact information'),
  
  ('bank_details',
   '{"bank_name": "Banca Transilvania", "iban": "RO49AAAA1B31007593840000", "swift": "BTRLRO22", "beneficiary": "Garderobă profesională SRL"}',
   'Bank account details for bank transfer payments'),
  
  ('tax_settings',
   '{"default_tax_rate": 19.0, "tax_name": "TVA", "tax_included_in_prices": false}',
   'Tax configuration settings'),
  
  ('email_settings',
   '{"from_name": "Garderobă profesională", "reply_to": "office@cloakroom.ro", "support_email": "support@cloakroom.ro"}',
   'Email configuration'),
  
  ('invoice_settings',
   '{"prefix": "INV", "starting_number": 1001, "series": "2026", "footer_text": "Mulțumim pentru încredere! | Thank you for your trust!"}',
   'Invoice generation settings')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- 11. SHIPPING METHODS
-- =============================================

INSERT INTO public.shipping_methods (name_ro, name_en, code, description_ro, description_en, base_cost, free_shipping_threshold, estimated_days_min, estimated_days_max, zones, is_active, display_order) VALUES
  ('Curier Standard', 'Standard Courier', 'standard_ro',
   'Livrare standard prin curier în România', 'Standard courier delivery in Romania',
   25.00, 500.00, 2, 5, ARRAY['RO'], true, 1),
  
  ('Curier Express', 'Express Courier', 'express_ro',
   'Livrare rapidă 1-2 zile în orașele mari', 'Fast delivery 1-2 days in major cities',
   50.00, 1000.00, 1, 2, ARRAY['RO'], true, 2),
  
  ('Ridicare Personală', 'Personal Pickup', 'pickup',
   'Ridicare de la sediu (cu programare)', 'Pickup from office (by appointment)',
   0.00, NULL, 0, 0, ARRAY['RO'], true, 3)
ON CONFLICT DO NOTHING;

-- =============================================
-- 12. TESTIMONIALS
-- =============================================

INSERT INTO public.testimonials (client_name, client_company, client_role, testimonial_ro, testimonial_en, rating, event_type, display_order, is_published) VALUES
  ('Ana Popescu', 'Electric Castle Festival', 'Event Manager',
   'Echipa de la Garderobă profesională a fost excelentă! Au gestionat peste 10.000 de participanți fără probleme. Sistem rapid, personal prietenos, zero reclamații. Recomand cu încredere!',
   'The team from Professional Cloakroom was excellent! They handled over 10,000 participants without issues. Fast system, friendly staff, zero complaints. Highly recommended!',
   5, 'festival', 1, true),
  
  ('Mihai Ionescu', 'TechConf Romania', 'Operations Director',
   'Profesionalism ireproșabil la conferința noastră anuală. Setup rapid, aspect impecabil, personal discret. Exact ce aveam nevoie pentru un eveniment corporate de nivel înalt.',
   'Impeccable professionalism at our annual conference. Quick setup, perfect appearance, discreet staff. Exactly what we needed for a high-level corporate event.',
   5, 'conference', 2, true),
  
  ('Elena Dumitrescu', 'Teatrul Național București', 'Artistic Director',
   'Colaborare excelentă de 3 ani. Servicii VIP impecabile pentru premierele noastre. Întotdeauna punctuali, întotdeauna profesioniști.',
   'Excellent 3-year collaboration. Impeccable VIP services for our premieres. Always on time, always professional.',
   5, 'theater', 3, true)
ON CONFLICT DO NOTHING;
