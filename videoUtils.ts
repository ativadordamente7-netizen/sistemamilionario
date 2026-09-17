/**
 * Utility functions for parsing and transforming video embed URLs
 * (Vimeo, YouTube, PandaVideo, VTurb, Wistia, MP4)
 */

export interface ParsedVideo {
  embedUrl: string;
  isDirectVideo: boolean;
  videoType: string;
  youtubeId?: string;
  fallbackEmbedUrl?: string;
}

export function parseAndSanitizeVideoUrl(inputUrl: string): ParsedVideo {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { embedUrl: '', isDirectVideo: false, videoType: 'none' };
  }

  let cleanUrl = inputUrl.trim();

  // If the user pasted an entire HTML <iframe> snippet, extract the src="..."
  if (cleanUrl.includes('<iframe') && cleanUrl.includes('src=')) {
    const srcMatch = cleanUrl.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      cleanUrl = srcMatch[1];
    }
  }

  // Handle Vimeo links
  if (cleanUrl.includes('vimeo.com') && !cleanUrl.includes('player.vimeo.com')) {
    const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:\/([\w]+))?/;
    const match = cleanUrl.match(vimeoRegex);

    if (match && match[3]) {
      const videoId = match[3];
      const privacyHash = match[4] ? `?h=${match[4]}&` : '?';
      return {
        embedUrl: `https://player.vimeo.com/video/${videoId}${privacyHash}autoplay=0&muted=1&playsinline=1&preload=auto&dnt=1&title=0&byline=0&portrait=0&controls=0&keyboard=0&pip=0&badge=0&transparent=0&autopause=0&api=1&player_id=vsl-player`,
        isDirectVideo: false,
        videoType: 'vimeo',
      };
    }
  }

  // If it's already player.vimeo.com, ensure autoplay, muted initial, and no-controls parameters if missing
  if (cleanUrl.includes('player.vimeo.com')) {
    let finalUrl = cleanUrl;
    if (!finalUrl.includes('controls=')) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'controls=0&title=0&byline=0&portrait=0&badge=0';
    }
    if (!finalUrl.includes('autoplay=')) {
      finalUrl += '&autoplay=0';
    }
    if (!finalUrl.includes('muted=')) {
      finalUrl += '&muted=1';
    }
    if (!finalUrl.includes('playsinline=')) {
      finalUrl += '&playsinline=1';
    }
    if (!finalUrl.includes('preload=')) {
      finalUrl += '&preload=auto';
    }
    if (!finalUrl.includes('api=1')) {
      finalUrl += '&api=1&player_id=vsl-player';
    }
    return {
      embedUrl: finalUrl,
      isDirectVideo: false,
      videoType: 'vimeo',
    };
  }

  // Handle YouTube links (youtu.be, youtube.com/watch, youtube.com/embed, youtube.com/shorts)
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
    let youtubeId = '';

    if (cleanUrl.includes('youtu.be/')) {
      youtubeId = cleanUrl.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0] || '';
    } else if (cleanUrl.includes('watch?v=')) {
      youtubeId = cleanUrl.split('watch?v=')[1]?.split('&')[0]?.split('?')[0] || '';
    } else if (cleanUrl.includes('/embed/')) {
      youtubeId = cleanUrl.split('/embed/')[1]?.split('?')[0]?.split('&')[0] || '';
    } else if (cleanUrl.includes('/shorts/')) {
      youtubeId = cleanUrl.split('/shorts/')[1]?.split('?')[0]?.split('&')[0] || '';
    }

    // Clean any trailing hash or slash
    youtubeId = youtubeId.replace(/[\/\?#].*$/, '').trim();

    if (youtubeId) {
      return {
        embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=0&mute=1&playsinline=1&enablejsapi=1&rel=0&modestbranding=1&controls=1&iv_load_policy=3`,
        isDirectVideo: false,
        videoType: 'youtube',
        youtubeId,
        fallbackEmbedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=0&mute=1&playsinline=1&enablejsapi=1&rel=0&modestbranding=1&controls=1&iv_load_policy=3`,
      };
    }
  }

  // Handle Google Drive video links (Transform to direct clean stream MP4 without Google Drive UI / arrows / play buttons)
  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com') || cleanUrl.includes('drive.usercontent.google.com')) {
    let driveId = '';
    const fileMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch && fileMatch[1]) {
      driveId = fileMatch[1];
    } else {
      const idMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        driveId = idMatch[1];
      }
    }

    if (driveId) {
      return {
        embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
        isDirectVideo: false,
        videoType: 'googledrive',
        fallbackEmbedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      };
    }
  }

  // Handle direct MP4 / WebM video files
  if (cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm') || cleanUrl.endsWith('.m3u8')) {
    return {
      embedUrl: cleanUrl,
      isDirectVideo: true,
      videoType: 'mp4',
    };
  }

  // Default: return as is
  return {
    embedUrl: cleanUrl,
    isDirectVideo: false,
    videoType: 'other',
  };
}
