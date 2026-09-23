import React, { useState, useEffect } from 'react';
import { MEDIA_RESOURCES } from '../data/vishudaData';
import { MediaResource } from '../types';
import {
  Headphones,
  Play,
  Video,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Plus,
  Trash2,
  RefreshCw,
  Youtube,
  Check,
} from 'lucide-react';

interface MediaLibraryProps {
  onBack: () => void;
  onGoAi?: () => void;
}

const STORAGE_KEY = 'vishuda_user_videos';

export const MediaLibrary: React.FC<MediaLibraryProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'med' | 'short'>('med');
  const [playingItem, setPlayingItem] = useState<MediaResource | null>(null);

  // Custom videos added by creator or persisted
  const [customVideos, setCustomVideos] = useState<MediaResource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync / Add modal state
  const [showAddForm, setShowAddForm] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoTitleInput, setVideoTitleInput] = useState('');
  const [videoCategoryInput, setVideoCategoryInput] = useState<'med' | 'short'>('med');
  const [addSuccess, setAddSuccess] = useState(false);

  // Save custom videos on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customVideos));
    } catch {
      // ignore
    }
  }, [customVideos]);

  // Combine default resources with user custom videos
  const allResources = [...customVideos, ...MEDIA_RESOURCES];
  const filtered = allResources.filter((m) => m.category === activeTab);

  const getItemVideoId = (item: MediaResource | null): string => {
    if (!item) return '';
    return (item as any).videoId || (item as any).youtubeId || '';
  };

  const extractYoutubeId = (url: string): string => {
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = trimmed.match(regExp);
    return match && match[2].length === 11 ? match[2] : trimmed;
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractYoutubeId(videoUrlInput);
    if (!id) return;

    const newVideo: MediaResource = {
      id: `custom-${Date.now()}`,
      title: videoTitleInput.trim() || 'Nuevo Video de Vishuda',
      desc: 'Subido recientemente a tu canal de YouTube.',
      videoId: id,
      category: videoCategoryInput,
      duration: videoCategoryInput === 'med' ? '15-20 min' : '1-3 min',
    };

    setCustomVideos([newVideo, ...customVideos]);
    setVideoUrlInput('');
    setVideoTitleInput('');
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setShowAddForm(false);
    }, 1500);
  };

  const handleDeleteCustom = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomVideos(customVideos.filter((v) => (v as any).id !== id));
  };

  return (
    <div className="space-y-5 pb-8 animate-fadeIn text-[#1d2924]">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onBack()}
          className="text-xs font-bold text-[#144436] hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs font-bold text-white bg-[#cc0000] hover:bg-[#aa0000] flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-xs transition-all cursor-pointer"
          >
            <Youtube className="w-3.5 h-3.5 text-white" />
            <span>+ Sincronizar Video</span>
          </button>
        </div>
      </div>

      {/* Title section */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] tracking-widest uppercase text-[#1b5e4b] font-extrabold block">
            Biblioteca de Audio y Video
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1b5e4b] text-white">
            {allResources.length} contenidos
          </span>
        </div>
        <h1 className="text-2xl font-serif font-extrabold text-[#0e2721] mt-1">
          Tus Meditaciones y Videos
        </h1>
        <p className="text-xs text-[#52665e] mt-1 leading-relaxed">
          Meditaciones guiadas y cápsulas audiovisuales para calmar tu sistema nervioso y reconectar con tu cuerpo.
        </p>
      </div>

      {/* YouTube Synchronization / Add Video Panel */}
      {showAddForm && (
        <div className="bg-[#f5f8f6] border-2 border-[#144436] rounded-3xl p-5 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-[#cc0000]" />
              <b className="text-sm font-bold text-[#0c221c]">
                Añadir nuevos videos de tu canal
              </b>
            </div>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-xs text-[#5d736b] hover:text-[#0c221c]"
            >
              Cerrar ✕
            </button>
          </div>

          <p className="text-xs text-[#4b6058] leading-relaxed">
            Pega el enlace o ID de tu nuevo video de YouTube (Short o Meditación). Se guardará al instante en tu aplicación:
          </p>

          <form onSubmit={handleAddVideo} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#144436] mb-1">
                Enlace de YouTube o ID del video:
              </label>
              <input
                type="text"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="Ej: https://youtube.com/watch?v=... o https://youtu.be/..."
                required
                className="w-full text-xs p-2.5 rounded-xl border border-[#bcd7cb] bg-white text-[#0c221c] focus:outline-none focus:border-[#144436]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#144436] mb-1">
                Título del Video o Meditación:
              </label>
              <input
                type="text"
                value={videoTitleInput}
                onChange={(e) => setVideoTitleInput(e.target.value)}
                placeholder="Ej: Meditación para dormir profundamente"
                required
                className="w-full text-xs p-2.5 rounded-xl border border-[#bcd7cb] bg-white text-[#0c221c] focus:outline-none focus:border-[#144436]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#144436] mb-1">
                Categoría:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVideoCategoryInput('med')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                    videoCategoryInput === 'med'
                      ? 'bg-[#144436] text-white border-[#144436]'
                      : 'bg-white text-[#144436] border-[#bcd7cb]'
                  }`}
                >
                  🧘‍♀️ Meditación Guiada
                </button>
                <button
                  type="button"
                  onClick={() => setVideoCategoryInput('short')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                    videoCategoryInput === 'short'
                      ? 'bg-[#144436] text-white border-[#144436]'
                      : 'bg-white text-[#144436] border-[#bcd7cb]'
                  }`}
                >
                  ⚡ Momento Breve / Short
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#144436] text-[#ead08f] font-bold text-xs shadow-xs hover:bg-[#0b201a] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {addSuccess ? (
                <>
                  <Check className="w-4 h-4 text-[#ead08f]" />
                  <span>¡Video guardado con éxito!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Guardar e Integrar en la Biblioteca</span>
                </>
              )}
            </button>
          </form>

          {/* Explanation on automated backend sync */}
          <div className="bg-white/80 p-3 rounded-2xl border border-[#d2dfd8] text-[11px] text-[#4f645b] space-y-1">
            <b className="text-[#144436] block">¿Cómo automatizarlo 100% en tiempo real?</b>
            <p>
              Para que los videos se listen solos en cuanto los subas a YouTube sin pegar el enlace, se utiliza la API oficial de YouTube (YouTube Data API v3). Con el ID de tu canal, la aplicación puede sincronizar automáticamente tu lista de subidas cada vez que se abra.
            </p>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex bg-[#e4ede8] p-1 rounded-2xl border border-[#bcd7cb]">
        <button
          onClick={() => {
            setActiveTab('med');
            setPlayingItem(null);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'med'
              ? 'bg-[#0e2721] text-[#ead08f] shadow-sm'
              : 'text-[#364b42] hover:bg-white/40'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Meditaciones Guiadas ({allResources.filter((m) => m.category === 'med').length})</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('short');
            setPlayingItem(null);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'short'
              ? 'bg-[#0e2721] text-[#ead08f] shadow-sm'
              : 'text-[#364b42] hover:bg-white/40'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Momentos Breves ({allResources.filter((m) => m.category === 'short').length})</span>
        </button>
      </div>

      {/* Video Player Card */}
      {playingItem && (
        <div className="bg-[#0b201a] text-white rounded-3xl p-4 shadow-xl border border-[#c5a059]/40 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ead08f] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#ead08f]" />
              <span>{playingItem.category === 'med' ? 'Meditación en Reproducción' : 'Cápsula de Consciencia'}</span>
            </span>
            <button
              onClick={() => setPlayingItem(null)}
              className="text-xs text-[#ead08f] hover:underline px-2 py-1 bg-white/10 rounded-lg cursor-pointer"
            >
              Cerrar visor ✕
            </button>
          </div>

          <div className="w-full rounded-2xl overflow-hidden aspect-video bg-black shadow-inner">
            <iframe
              src={`https://www.youtube.com/embed/${getItemVideoId(playingItem)}?autoplay=1&rel=0&modestbranding=1`}
              title={playingItem.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white">{playingItem.title}</h3>
              <p className="text-xs text-[#c0d4cb] mt-0.5">{playingItem.desc}</p>
            </div>

            <a
              href={`https://www.youtube.com/watch?v=${getItemVideoId(playingItem)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#ead08f] text-xs font-bold transition-all flex-shrink-0 self-start sm:self-center"
            >
              <span>Abrir en YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="space-y-2.5">
        {filtered.map((item, idx) => {
          const videoId = getItemVideoId(item);
          const isPlaying = getItemVideoId(playingItem) === videoId && videoId !== '';
          const isCustom = Boolean((item as any).id?.startsWith('custom-'));

          return (
            <div
              key={(item as any).id || videoId || `media-${idx}`}
              onClick={() => setPlayingItem(item)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                isPlaying
                  ? 'bg-[#e4ede8] border-[#0e2721] shadow-md'
                  : 'bg-[#fcfdfa] border-[#d2dfd8] hover:border-[#144436] hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-xs ${
                    isPlaying ? 'bg-[#0e2721] text-[#ead08f]' : 'bg-[#e7f0ec] text-[#144436]'
                  }`}
                >
                  <Play className="w-5 h-5 ml-0.5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <b className="text-xs font-bold text-[#0e2721] block truncate group-hover:text-[#1b5e4b] transition-colors">
                      {item.title}
                    </b>
                    {isCustom && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#dbebe2] text-[#144436] rounded-md">
                        Nuevo
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#52665e] mt-0.5 line-clamp-1">
                    {item.desc}
                  </p>
                  <span className="text-[10px] font-bold text-[#1b5e4b] mt-1 block">
                    ⏱️ {item.duration || (item.category === 'med' ? '12-20 min' : '1-3 min')} · Audio y Video
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-2 flex-shrink-0">
                {isCustom && (
                  <button
                    onClick={(e) => handleDeleteCustom((item as any).id, e)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Eliminar de mi lista"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="text-xs font-bold text-[#144436]">
                  {isPlaying ? 'Reproduciendo' : 'Reproducir ▶'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
