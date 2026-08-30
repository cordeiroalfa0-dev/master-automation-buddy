-- Atualiza o email público de contacto da Abael Automação.
UPDATE public.site_settings
SET value = 'abaelautomacao@gmail.com'
WHERE key = 'contact_email';

-- Garante a configuração caso a instalação tenha sido criada sem a chave inicial.
INSERT INTO public.site_settings (key, value, description)
VALUES ('contact_email', 'abaelautomacao@gmail.com', 'Email principal de contato')
ON CONFLICT (key) DO NOTHING;

-- Corrige o valor caso a chave tenha sido criada pelo bloco acima em uma instalação nova.
UPDATE public.site_settings
SET value = 'abaelautomacao@gmail.com'
WHERE key = 'contact_email';
