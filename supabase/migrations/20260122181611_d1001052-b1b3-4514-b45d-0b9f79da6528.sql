-- Atualizar bucket blog-images para público
UPDATE storage.buckets 
SET public = true 
WHERE id = 'blog-images';

-- Criar política para leitura pública de arquivos
CREATE POLICY "Public read access for blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- Criar política para upload autenticado
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Criar política para delete autenticado
CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');