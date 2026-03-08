UPDATE public.indexing_queue 
SET status = 'pending', 
    retry_count = 0, 
    url = REPLACE(url, 'https://contabilidadezen.com.br', 'https://www.contabilidadezen.com.br') 
WHERE url LIKE 'https://contabilidadezen.com.br%' 
AND url NOT LIKE 'https://www.contabilidadezen.com.br%';