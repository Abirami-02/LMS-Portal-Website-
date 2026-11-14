import { useMemo } from 'react'

function youtubeEmbedUrl(value) {
  try {
    const url = new URL(value)
    if (url.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${url.pathname.slice(1)}`
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname.startsWith('/embed/')) return value
      const id = url.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
    }
  } catch { /* The server validates the URL; the player falls back to video. */ }
  return null
}

function VideoPlayer({ url, title }) {
  const embedUrl = useMemo(() => youtubeEmbedUrl(url), [url])
  if (embedUrl) return <div className="aspect-video overflow-hidden rounded-3xl bg-black"><iframe className="h-full w-full" src={embedUrl} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
  return <div className="overflow-hidden rounded-3xl bg-black"><video className="aspect-video w-full" controls preload="metadata" src={url}><track kind="captions" /></video></div>
}

export default VideoPlayer
