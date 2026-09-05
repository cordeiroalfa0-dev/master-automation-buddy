insert into public.site_settings (key, value, description) values
  ('social_instagram', '', 'Link do perfil no Instagram'),
  ('social_facebook', '', 'Link da página no Facebook'),
  ('social_tiktok', '', 'Link do perfil no TikTok'),
  ('social_youtube', '', 'Link do canal no YouTube'),
  ('social_linkedin', '', 'Link da página no LinkedIn'),
  ('social_google_business', '', 'Link da ficha no Google Meu Negócio')
on conflict (key) do nothing;