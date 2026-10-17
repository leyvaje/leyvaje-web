'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AudioPad } from '@/components/audio-pad';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type Post = {
  id?: number;
  type: 'thought' | 'link' | 'photo' | 'music';
  content: string | null;
  media_url: string | null;
  created_at: string;
};

function safeLink(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

function PostCard({ post }: { post: Post }) {
  const link = post.type === 'link' ? safeLink(post.content) : null;
  const media = safeLink(post.media_url);
  const video = media && /\.(?:mp4|m4v|mov|webm)(?:$|\?)/i.test(media);

  return (
    <article className="frame feed-card">
      <div className="titlebar"><span>LEYVAJE // {post.type.toUpperCase()}</span><span>{formatDate(post.created_at)}</span></div>
      <div className="feed-card-body">
        {post.type === 'photo' && media ? <div className="feed-image-wrap"><Image className="feed-image" src={media} alt={post.content || 'Photo from Jose Leyva'} fill sizes="(max-width: 680px) 100vw, 50vw" unoptimized /></div> : null}
        {post.type === 'music' && media && video ? <video className="feed-video" controls preload="none" src={media}>Your browser does not support video playback.</video> : null}
        {post.type === 'music' && media && !video ? <audio className="feed-audio" controls preload="none" src={media}>Your browser does not support audio playback.</audio> : null}
        {post.type === 'link' && link ? <a className="feed-link" href={link} target="_blank" rel="noreferrer">{post.content}</a> : null}
        {post.type !== 'link' && post.content ? <p>{post.content}</p> : null}
        {post.type === 'link' && !link ? <p>{post.content}</p> : null}
      </div>
      <div className="feed-card-foot"><span>{post.type === 'photo' ? 'SNAPSHOT' : post.type === 'music' ? 'AUDIO' : 'FIELD NOTES'}</span><span>LEYVAJE.COM</span></div>
    </article>
  );
}

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!supabaseUrl || !supabaseAnon) return;

    fetch(`${supabaseUrl}/rest/v1/posts?select=id,type,content,media_url,created_at&order=created_at.desc&limit=8`, {
      headers: { apikey: supabaseAnon, Authorization: `Bearer ${supabaseAnon}` },
    })
      .then((response) => response.ok ? response.json() as Promise<Post[]> : [])
      .then((data) => setPosts(data.filter((post) => ['thought', 'link', 'photo', 'music'].includes(post.type))))
      .finally(() => setLoaded(true));
  }, []);

  const feedReady = loaded || !supabaseUrl || !supabaseAnon;

  return (
    <div className="feed-grid">
      {posts.map((post, index) => <PostCard key={post.id ?? `${post.created_at}-${index}`} post={post} />)}
      {!posts.length && feedReady ? <article className="frame feed-card feed-placeholder"><div className="titlebar"><span>LEYVAJE // FIELD NOTES</span><span>THE LIVE FEED</span></div><div className="feed-card-body"><p>Notes and snapshots will appear here when published.</p><a className="text-link" href="https://github.com/leyvaje" target="_blank" rel="noreferrer">Browse my work on GitHub ↗</a></div><div className="feed-card-foot"><span>PERSONAL STREAM</span><span>ATTENDORN</span></div></article> : null}
      <article className="frame feed-card audio-card">
        <div className="titlebar"><span><i className="status-dot status-dot-green" /> LEYVAJE // AUDIO LAB</span><span>INTERACTIVE</span></div>
        <div className="audio-card-body">
          <p className="eyebrow">MUSIC & SOUND</p>
          <h3>Tap a beat.</h3>
          <AudioPad />
        </div>
        <div className="feed-card-foot"><span>PLAY SOUNDCLOUD</span><a href="https://soundcloud.com/leyvaje" target="_blank" rel="noreferrer">OPEN PROFILE ↗</a></div>
      </article>
    </div>
  );
}
