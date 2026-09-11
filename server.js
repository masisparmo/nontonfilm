const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory cache
const memoryCache = {
  catalog: null,
  catalogTimestamp: 0,
  genres: {},
  details: {}
};

const UPSTREAM_BASE = 'https://streaming-project-eta.vercel.app';
const CINEMETA_BASE = 'https://v3-cinemeta.strem.io';

// Helper: safe fetch with timeout
async function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) YukNonton-Clone/1.0'
      }
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// Fallback initial catalog if network fails
function getFallbackCatalog() {
  const seedFile = path.join(__dirname, 'catalog-seed.json');
  if (fs.existsSync(seedFile)) {
    try {
      return JSON.parse(fs.readFileSync(seedFile, 'utf8'));
    } catch (e) {
      console.error('Error reading catalog-seed.json:', e);
    }
  }

  return {
    hero: {
      id: "tt28014327",
      title: "Mayday",
      type: "movie",
      match: "98% Match",
      year: "2026",
      rating: "13+",
      duration: "111 min",
      quality: "4K Ultra HD",
      genres: ["Action", "Adventure", "Comedy"],
      overview: "Misi pengintaian Letnan Troy Brennan di atas wilayah musuh mengalami masalah, memaksanya mendarat darurat dan bertahan hidup di hutan belantara sambil menghindari kejaran musuh.",
      backdrop: "https://images.metahub.space/background/medium/tt28014327/img",
      poster: "https://images.metahub.space/poster/small/tt28014327/img",
      top10: 1
    },
    top10: [
      {
        id: "tt28014327",
        title: "Mayday",
        type: "movie",
        match: "98% Match",
        year: "2026",
        rating: "13+",
        duration: "Movie",
        quality: "4K Ultra HD",
        poster: "https://images.metahub.space/poster/small/tt28014327/img",
        backdrop: "https://images.metahub.space/background/medium/tt28014327/img"
      },
      {
        id: "tt11561116",
        title: "The Whisper Man",
        type: "movie",
        match: "95% Match",
        year: "2026",
        rating: "13+",
        duration: "Movie",
        quality: "4K Ultra HD",
        poster: "https://images.metahub.space/poster/small/tt11561116/img",
        backdrop: "https://images.metahub.space/background/medium/tt11561116/img"
      },
      {
        id: "tt30825738",
        title: "Star Wars: The Mandalorian and Grogu",
        type: "movie",
        match: "88% Match",
        year: "2026",
        rating: "13+",
        duration: "Movie",
        quality: "4K Ultra HD",
        poster: "https://images.metahub.space/poster/small/tt30825738/img",
        backdrop: "https://images.metahub.space/background/medium/tt30825738/img"
      },
      {
        id: "tt13210838",
        title: "The Gentlemen",
        type: "series",
        match: "94% Match",
        year: "2024",
        rating: "16+",
        duration: "Series",
        quality: "4K Ultra HD",
        poster: "https://images.metahub.space/poster/small/tt13210838/img",
        backdrop: "https://images.metahub.space/background/medium/tt13210838/img"
      },
      {
        id: "tt14688458",
        title: "Silo",
        type: "series",
        match: "91% Match",
        year: "2023",
        rating: "16+",
        duration: "Series",
        quality: "4K Ultra HD",
        poster: "https://images.metahub.space/poster/small/tt14688458/img",
        backdrop: "https://images.metahub.space/background/medium/tt14688458/img"
      }
    ],
    rows: [
      {
        id: "trending-movies",
        title: "🔥 Trending Movies Hari Ini",
        items: [
          {
            id: "tt28014327",
            title: "Mayday",
            type: "movie",
            match: "98% Match",
            year: "2026",
            rating: "13+",
            poster: "https://images.metahub.space/poster/small/tt28014327/img"
          },
          {
            id: "tt11561116",
            title: "The Whisper Man",
            type: "movie",
            match: "95% Match",
            year: "2026",
            rating: "13+",
            poster: "https://images.metahub.space/poster/small/tt11561116/img"
          }
        ]
      },
      {
        id: "popular-series",
        title: "📺 Serial TV Terpopuler & Baru",
        items: [
          {
            id: "tt13210838",
            title: "The Gentlemen",
            type: "series",
            match: "94% Match",
            year: "2024",
            rating: "16+",
            poster: "https://images.metahub.space/poster/small/tt13210838/img"
          },
          {
            id: "tt14688458",
            title: "Silo",
            type: "series",
            match: "91% Match",
            year: "2023",
            rating: "16+",
            poster: "https://images.metahub.space/poster/small/tt14688458/img"
          }
        ]
      }
    ]
  };
}

// 1. GET /api/catalog
app.get('/api/catalog', async (req, res) => {
  const forceRefresh = req.query.refresh === 'true';
  const now = Date.now();

  // Cache for 10 minutes unless forced
  if (!forceRefresh && memoryCache.catalog && (now - memoryCache.catalogTimestamp < 600000)) {
    return res.json(memoryCache.catalog);
  }

  try {
    const upstreamRes = await fetchWithTimeout(`${UPSTREAM_BASE}/api/catalog${forceRefresh ? '?refresh=true' : ''}`, 9000);
    if (upstreamRes.ok) {
      const data = await upstreamRes.json();
      memoryCache.catalog = data;
      memoryCache.catalogTimestamp = now;

      // Persist to local disk as backup
      try {
        fs.writeFileSync(path.join(__dirname, 'catalog-seed.json'), JSON.stringify(data));
      } catch (e) {}

      return res.json(data);
    }
  } catch (err) {
    console.warn('Upstream catalog fetch warning, serving cached/fallback:', err.message);
  }

  if (memoryCache.catalog) {
    return res.json(memoryCache.catalog);
  }

  const fallback = getFallbackCatalog();
  memoryCache.catalog = fallback;
  return res.json(fallback);
});

// 2. GET /api/genre/:genre
app.get('/api/genre/:genre', async (req, res) => {
  const genre = req.params.genre;
  if (memoryCache.genres[genre]) {
    return res.json(memoryCache.genres[genre]);
  }

  try {
    const upstreamRes = await fetchWithTimeout(`${UPSTREAM_BASE}/api/genre/${encodeURIComponent(genre)}`, 8000);
    if (upstreamRes.ok) {
      const data = await upstreamRes.json();
      memoryCache.genres[genre] = data;
      return res.json(data);
    }
  } catch (err) {
    console.warn(`Upstream genre fetch error for ${genre}:`, err.message);
  }

  // Fallback Cinemeta / internal filter
  try {
    const cinemetaRes = await fetchWithTimeout(`${CINEMETA_BASE}/catalog/movie/top/genre=${encodeURIComponent(genre)}.json`, 8000);
    if (cinemetaRes.ok) {
      const cinemetaData = await cinemetaRes.json();
      const metas = (cinemetaData.metas || []).slice(0, 30).map((m, idx) => ({
        id: m.id,
        imdbId: m.id,
        title: m.name,
        type: m.type || 'movie',
        match: `${Math.floor(80 + Math.random() * 19)}% Match`,
        year: m.releaseInfo || m.year || '2024',
        rating: '13+',
        duration: 'Movie',
        quality: '4K Ultra HD',
        overview: m.description || 'Tonton tayangan menarik ini sekarang dalam kualitas Full HD.',
        poster: m.poster || (m.id ? `https://images.metahub.space/poster/small/${m.id}/img` : ''),
        backdrop: m.background || (m.id ? `https://images.metahub.space/background/medium/${m.id}/img` : '')
      }));

      const hero = metas[0] || getFallbackCatalog().hero;
      const top10 = metas.slice(0, 10);
      const rows = [
        {
          id: `genre-${genre.toLowerCase()}-1`,
          title: `🔥 Terpopuler Kategori ${genre}`,
          items: metas.slice(0, 15)
        },
        {
          id: `genre-${genre.toLowerCase()}-2`,
          title: `✨ Pilihan Terbaik ${genre}`,
          items: metas.slice(15, 30)
        }
      ];

      const result = {
        hero,
        heroTypeBadge: `YukNonton ${genre}`,
        top10,
        top10Title: `Top 10 Tayangan ${genre} Hari Ini`,
        rows
      };

      memoryCache.genres[genre] = result;
      return res.json(result);
    }
  } catch (e) {
    console.error(`Cinemeta genre fallback error:`, e.message);
  }

  return res.json(getFallbackCatalog());
});

// 3. GET /api/search?q=
app.get('/api/search', async (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query) {
    return res.json({ results: [] });
  }

  try {
    const upstreamRes = await fetchWithTimeout(`${UPSTREAM_BASE}/api/search?q=${encodeURIComponent(query)}`, 8000);
    if (upstreamRes.ok) {
      const data = await upstreamRes.json();
      return res.json(data);
    }
  } catch (err) {
    console.warn(`Upstream search error:`, err.message);
  }

  // Fallback to Cinemeta search
  try {
    const [moviesRes, seriesRes] = await Promise.allSettled([
      fetchWithTimeout(`${CINEMETA_BASE}/catalog/movie/top/search=${encodeURIComponent(query)}.json`, 6000),
      fetchWithTimeout(`${CINEMETA_BASE}/catalog/series/top/search=${encodeURIComponent(query)}.json`, 6000)
    ]);

    const results = [];
    if (moviesRes.status === 'fulfilled' && moviesRes.value.ok) {
      const mData = await moviesRes.value.json();
      (mData.metas || []).slice(0, 10).forEach(m => {
        results.push({
          id: m.id,
          imdbId: m.id,
          title: m.name,
          type: 'movie',
          match: '95% Match',
          year: m.releaseInfo || m.year || '2024',
          poster: m.poster || `https://images.metahub.space/poster/small/${m.id}/img`
        });
      });
    }

    if (seriesRes.status === 'fulfilled' && seriesRes.value.ok) {
      const sData = await seriesRes.value.json();
      (sData.metas || []).slice(0, 10).forEach(s => {
        results.push({
          id: s.id,
          imdbId: s.id,
          title: s.name,
          type: 'series',
          match: '95% Match',
          year: s.releaseInfo || s.year || '2024',
          poster: s.poster || `https://images.metahub.space/poster/small/${s.id}/img`
        });
      });
    }

    return res.json({ results });
  } catch (e) {
    console.error('Cinemeta search fallback error:', e.message);
    return res.json({ results: [] });
  }
});

// 4. GET /api/detail/:id
app.get('/api/detail/:id', async (req, res) => {
  const id = req.params.id;
  const type = req.query.type || 'movie';

  if (memoryCache.details[id]) {
    return res.json(memoryCache.details[id]);
  }

  try {
    const upstreamRes = await fetchWithTimeout(`${UPSTREAM_BASE}/api/detail/${id}?type=${type}`, 8000);
    if (upstreamRes.ok) {
      const data = await upstreamRes.json();
      memoryCache.details[id] = data;
      return res.json(data);
    }
  } catch (err) {
    console.warn(`Upstream detail fetch error:`, err.message);
  }

  // Cinemeta fallback
  try {
    const cinemetaRes = await fetchWithTimeout(`${CINEMETA_BASE}/meta/${type}/${id}.json`, 8000);
    if (cinemetaRes.ok) {
      const metaObj = await cinemetaRes.json();
      const m = metaObj.meta;
      if (m) {
        // Group videos into seasons if series
        const seasonsMap = {};
        if (m.videos && m.videos.length > 0) {
          m.videos.forEach(v => {
            const sNum = v.season || 1;
            if (!seasonsMap[sNum]) {
              seasonsMap[sNum] = {
                seasonNumber: sNum,
                name: `Season ${sNum}`,
                episodes: []
              };
            }
            seasonsMap[sNum].episodes.push({
              episodeNumber: v.episode || (seasonsMap[sNum].episodes.length + 1),
              title: v.title || `Episode ${v.episode || 1}`,
              duration: '45m',
              overview: v.overview || m.description || 'Saksikan episode ini selengkapnya.',
              thumbnail: v.thumbnail || m.background || `https://episodes.metahub.space/${id}/${sNum}/${v.episode || 1}/w780.jpg`
            });
          });
        }

        const seasons = Object.values(seasonsMap);

        const detail = {
          id: m.id,
          imdbId: m.id,
          tmdbId: m.moviedb_id || null,
          title: m.name,
          type: m.type || type,
          match: `${Math.floor(85 + Math.random() * 14)}% Match`,
          year: m.releaseInfo || m.year || '2024',
          rating: m.certification || '13+',
          duration: m.runtime || (m.type === 'series' ? 'Series' : '110 min'),
          quality: '4K Ultra HD',
          genres: m.genres || ['Action', 'Drama'],
          overview: m.description || 'Tayangan berkualitas tinggi sub Indo.',
          cast: m.cast || ['Pemeran Utama'],
          backdrop: m.background || `https://images.metahub.space/background/medium/${id}/img`,
          poster: m.poster || `https://images.metahub.space/poster/small/${id}/img`,
          seasons: seasons,
          similar: (memoryCache.catalog?.top10 || []).slice(0, 6)
        };

        memoryCache.details[id] = detail;
        return res.json(detail);
      }
    }
  } catch (e) {
    console.error('Cinemeta detail fallback error:', e.message);
  }

  // Generic fallback detail
  return res.json({
    id,
    imdbId: id,
    title: "Tayangan Streaming",
    type: type,
    match: "96% Match",
    year: "2024",
    rating: "13+",
    duration: "110 min",
    quality: "4K Ultra HD",
    genres: ["Action", "Adventure"],
    overview: "Saksikan tayangan streaming film dan serial TV dengan subtitle Bahasa Indonesia jernih Full HD.",
    cast: ["Aktor Utama"],
    backdrop: `https://images.metahub.space/background/medium/${id}/img`,
    poster: `https://images.metahub.space/poster/small/${id}/img`,
    seasons: [],
    similar: []
  });
});

// 5. GET /api/stream/:type/:id
app.get('/api/stream/:type/:id', (req, res) => {
  const { type, id } = req.params;
  const season = parseInt(req.query.season) || 1;
  const episode = parseInt(req.query.episode) || 1;

  // Generate multi-server stream urls
  // 1. VidLink Pro
  const vidlinkUrl = type === 'series'
    ? `https://vidlink.pro/tv/${id}/${season}/${episode}`
    : `https://vidlink.pro/movie/${id}`;

  // 2. MultiEmbed
  const multiembedUrl = type === 'series'
    ? `https://multiembed.mov/?video_id=${id}&s=${season}&e=${episode}`
    : `https://multiembed.mov/?video_id=${id}`;

  // 3. AutoEmbed
  const autoembedUrl = type === 'series'
    ? `https://autoembed.co/tv/imdb/${id}-${season}-${episode}`
    : `https://autoembed.co/movie/imdb/${id}`;

  // 4. Stremio app protocol
  const stremioUrl = `stremio:///detail/${type}/${id}`;

  // 5. Test HLS Stream
  const hlsUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

  res.json({
    id,
    type,
    title: req.query.title || id,
    imdbId: id,
    season,
    episode,
    streams: [
      {
        id: "vidlink",
        name: "Server HD 1 (VidLink Full HD)",
        type: "embed",
        url: vidlinkUrl,
        description: "Film & Series Asli 1080p/4K dengan Subtitle"
      },
      {
        id: "multiembed",
        name: "Server HD 2 (MultiEmbed VIP)",
        type: "embed",
        url: multiembedUrl,
        description: "Server Cadangan Cepat Bebas Buffering"
      },
      {
        id: "autoembed",
        name: "Server HD 3 (AutoEmbed Ultra)",
        type: "embed",
        url: autoembedUrl,
        description: "Server Tambahan Kualitas Tinggi"
      },
      {
        id: "stremio",
        name: "Buka di Aplikasi Stremio (Torrentio Stream)",
        type: "app",
        url: stremioUrl,
        description: "Nonton langsung via Stremio Desktop"
      },
      {
        id: "hls",
        name: "Demo HLS Player (Uji Coba Kontrol)",
        type: "hls",
        url: hlsUrl,
        description: "Player Uji Coba Internal",
        subtitles: [
          { lang: "id", label: "Bahasa Indonesia", url: "/api/subtitles/id" },
          { lang: "en", label: "English [CC]", url: "/api/subtitles/en" }
        ]
      }
    ]
  });
});

// 6. Subtitles endpoints
app.get('/api/subtitles/id', (req, res) => {
  res.setHeader('Content-Type', 'text/vtt');
  res.send(`WEBVTT\n\n1\n00:00:02.000 --> 00:00:06.000\nHalo! Selamat datang di Website Streaming YukNonton.\n\n2\n00:00:07.000 --> 00:00:12.000\nSelamat menikmati tayangan dengan resolusi Full HD.\n`);
});

app.get('/api/subtitles/en', (req, res) => {
  res.setHeader('Content-Type', 'text/vtt');
  res.send(`WEBVTT\n\n1\n00:00:02.000 --> 00:00:06.000\nHello! Welcome to YukNonton Streaming Platform.\n\n2\n00:00:07.000 --> 00:00:12.000\nEnjoy your movie in high definition.\n`);
});

// SPA catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server if not running in serverless environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🎬 YukNonton Streaming Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
