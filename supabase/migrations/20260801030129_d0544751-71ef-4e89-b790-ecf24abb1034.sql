CREATE POLICY "Admins manage blog images"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::app_role));