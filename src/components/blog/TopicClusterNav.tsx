import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, ArrowRight } from 'lucide-react';

interface ClusterPost {
  id: string;
  title: string;
  slug: string;
  is_pillar: boolean;
}

interface TopicClusterNavProps {
  postId: string;
  clusterId: string | null;
  isPillar: boolean;
}

export function TopicClusterNav({ postId, clusterId, isPillar }: TopicClusterNavProps) {
  const [clusterPosts, setClusterPosts] = useState<ClusterPost[]>([]);
  const [pillarPost, setPillarPost] = useState<ClusterPost | null>(null);

  useEffect(() => {
    if (isPillar) {
      // This IS the pillar — fetch cluster posts that point to it
      fetchClusterPosts(postId);
    } else if (clusterId) {
      // This is a cluster post — fetch the pillar and siblings
      fetchPillarAndSiblings(clusterId, postId);
    }
  }, [postId, clusterId, isPillar]);

  const fetchClusterPosts = async (pillarId: string) => {
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, is_pillar')
      .eq('cluster_id', pillarId)
      .eq('status', 'published')
      .order('published_at', { ascending: true })
      .limit(10);

    if (data) setClusterPosts(data as ClusterPost[]);
  };

  const fetchPillarAndSiblings = async (pillarId: string, currentId: string) => {
    // Fetch pillar
    const { data: pillar } = await supabase
      .from('blog_posts')
      .select('id, title, slug, is_pillar')
      .eq('id', pillarId)
      .eq('status', 'published')
      .maybeSingle();

    if (pillar) setPillarPost(pillar as ClusterPost);

    // Fetch siblings
    const { data: siblings } = await supabase
      .from('blog_posts')
      .select('id, title, slug, is_pillar')
      .eq('cluster_id', pillarId)
      .eq('status', 'published')
      .neq('id', currentId)
      .order('published_at', { ascending: true })
      .limit(8);

    if (siblings) setClusterPosts(siblings as ClusterPost[]);
  };

  if (!isPillar && !clusterId) return null;
  if (clusterPosts.length === 0 && !pillarPost) return null;

  return (
    <nav className="my-8 rounded-xl border border-primary/20 bg-primary/5 overflow-hidden" aria-label="Artigos do mesmo tema">
      <div className="px-5 py-4 border-b border-primary/10">
        <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          {isPillar ? 'Artigos deste guia' : 'Série completa'}
        </h3>
      </div>

      <div className="px-5 py-4 space-y-2">
        {/* Link to pillar (if this is a cluster post) */}
        {pillarPost && (
          <Link
            to={`/blog/${pillarPost.slug}`}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors py-1"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            📖 {pillarPost.title}
          </Link>
        )}

        {/* Cluster posts */}
        {clusterPosts.map((cp) => (
          <Link
            key={cp.id}
            to={`/blog/${cp.slug}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            <ArrowRight className="h-3 w-3" />
            {cp.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
