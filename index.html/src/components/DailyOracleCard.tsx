import React, { useState, useRef, useEffect } from 'react';
import { isOracleDrawnToday, setOracleDrawnToday } from '../utils/storage';
import {
  savePostcardImage,
  loadPostcardImage,
  removePostcardImage,
} from '../utils/mediaStorage';
import vishudaOracleArt from '../assets/images/vishuda_oracle_art_1789514157178.jpg';
import vishudaAmanecer from '../assets/images/vishuda_amanecer_meditacion_1789822987234.jpg';
import espejoBotanico from '../assets/images/espejo_botanico_alma_1789823013814.jpg';
import somaticWatercolor from '../assets/images/somatic_meditation_watercolor_1789678226410.jpg';
import weeklyReleaseCover from '../assets/images/weekly_release_cover_1789514168770.jpg';
import {
  Sparkles,
  RefreshCw,
  Share2,
  ArrowLeft,
  Check,
  Download,
  Camera,
  X,
  Copy,
  User,
  Heart,
  Sliders,
  Image as ImageIcon,
  Flame,
  Upload,
  Trash2,
  Sun,
  Eye,
} from 'lucide-react';

interface DailyOracleCardProps {
  onGoHome?: () => void;
  inlineTeaser?: boolean;
  onOpenFull?: () => void;
}

export interface OracleCardData {
  id: string;
  theme: string;
  quote: string;
  archetype: string;
  practice: string;
}

const EXTENDED_ORACLE_CARDS: OracleCardData[] = [
  {
    id: '1',
    theme: 'Voz Auténtica',
    quote: 'Lo que callas para no incomodar, tu cuerpo lo acumula como tensión. Habla con calma y firmeza.',
    archetype: 'El Guerrero Sereno',
    practice: 'Hoy expresa una verdad simple sin pedir disculpas por sentirla.',
  },
  {
    id: '2',
    theme: 'Soltar el Control',
    quote: 'Controlar todo es miedo disfrazado de eficiencia. Confía en lo que la vida ya está organizando.',
    archetype: 'El Observador Sabio',
    practice: 'Elige un detalle que no dependa de ti y decide no intervenir hoy.',
  },
  {
    id: '3',
    theme: 'Presencia & Descanso',
    quote: 'Tu valor no sube ni baja según lo productivo que hayas sido hoy. El descanso también es sagrado.',
    archetype: 'La Tierra Fértil',
    practice: 'Regálate 10 minutos de silencio sin pantalla antes del anochecer.',
  },
  {
    id: '4',
    theme: 'Límites Claros',
    quote: 'Un "no" respetuoso a tiempo protege el vínculo más que diez "sí" llenos de resentimiento.',
    archetype: 'El Guardián del Centro',
    practice: 'Di que no a una petición que drene tu energía disponible hoy.',
  },
  {
    id: '5',
    theme: 'Amor Propio sin Disfraz',
    quote: 'No necesitas la aprobación externa para validar que tu esfuerzo es suficiente. Mírate con honor.',
    archetype: 'El Espejo Puro',
    practice: 'Reconoce en voz baja tres decisiones valientes que tomaste este año.',
  },
  {
    id: '6',
    theme: 'Aceptación Emocional',
    quote: 'La vulnerabilidad no es debilidad; es la máxima prueba de valentía de un corazón despierto.',
    archetype: 'El Alquimista',
    practice: 'Permítete sentir la emoción actual sin buscar explicarla de inmediato.',
  },
  {
    id: '7',
    theme: 'Pertenencia en Ti',
    quote: 'No tienes que encoger tus alas ni pedir permiso para existir en tu propio espacio.',
    archetype: 'El Roble Sagrado',
    practice: 'Habita tu postura con la espalda erguida y los pies firmes en el suelo.',
  },
];

// Aesthetic backdrop presets with real photographic and artistic imagery
export type BackdropStyle =
  | 'vishuda-art'
  | 'amanecer-meditacion'
  | 'espejo-botanico'
  | 'acuarela-somatica'
  | 'calma-liberacion'
  | 'bosque-mistico'
  | 'atardecer-dorado'
  | 'cielo-estrellado'
  | 'lago-zen';

export interface BackdropConfig {
  id: BackdropStyle;
  name: string;
  subtitle: string;
  tag: string;
  category: 'vishuda' | 'paisaje';
  imageUrl: string;
  thumbnail: string;
}

export const BACKDROP_PRESETS: BackdropConfig[] = [
  {
    id: 'vishuda-art',
    name: 'Arte Sagrado Vishuda',
    subtitle: 'Ilustración oficial del oráculo',
    tag: '✦ Obra Original',
    category: 'vishuda',
    imageUrl: vishudaOracleArt,
    thumbnail: vishudaOracleArt,
  },
  {
    id: 'amanecer-meditacion',
    name: 'Amanecer & Presencia',
    subtitle: 'Luz dorada de nuevo despertar',
    tag: '🌅 Amanecer',
    category: 'vishuda',
    imageUrl: vishudaAmanecer,
    thumbnail: vishudaAmanecer,
  },
  {
    id: 'espejo-botanico',
    name: 'Espejo Botánico de Alma',
    subtitle: 'Follaje natural y serenidad',
    tag: '🌿 Botánico',
    category: 'vishuda',
    imageUrl: espejoBotanico,
    thumbnail: espejoBotanico,
  },
  {
    id: 'acuarela-somatica',
    name: 'Acuarela Somática',
    subtitle: 'Pintura zen de meditación',
    tag: '🎨 Acuarela',
    category: 'vishuda',
    imageUrl: somaticWatercolor,
    thumbnail: somaticWatercolor,
  },
  {
    id: 'calma-liberacion',
    name: 'Paz & Liberación',
    subtitle: 'Sanación y calma interior',
    tag: '🕊️ Liberación',
    category: 'vishuda',
    imageUrl: weeklyReleaseCover,
    thumbnail: weeklyReleaseCover,
  },
  {
    id: 'bosque-mistico',
    name: 'Bosque en la Niebla',
    subtitle: 'Pinos, bruma y calma profunda',
    tag: '🌲 Bosque Niebla',
    category: 'paisaje',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1080&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'atardecer-dorado',
    name: 'Atardecer Dorado',
    subtitle: 'Horizontes de calidez y paz',
    tag: '🌇 Atardecer',
    category: 'paisaje',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'cielo-estrellado',
    name: 'Noche Cósmica',
    subtitle: 'Cosmos, misticismo y silencio',
    tag: '🌌 Cosmos',
    category: 'paisaje',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1080&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'lago-zen',
    name: 'Aguas Claras & Montaña',
    subtitle: 'Reflejos de quietud absoluta',
    tag: '🏔️ Lago Zen',
    category: 'paisaje',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=240&q=80',
  },
];

export const DailyOracleCard: React.FC<DailyOracleCardProps> = ({
  onGoHome,
  inlineTeaser = false,
  onOpenFull,
}) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(isOracleDrawnToday());
  const [currentIndex, setCurrentIndex] = useState(() => {
    const day = new Date().getDate();
    return day % EXTENDED_ORACLE_CARDS.length;
  });
  const [copied, setCopied] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Customization state for Instagram Story
  const [userName, setUserName] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [selectedBackdrop, setSelectedBackdrop] = useState<BackdropStyle>('vishuda-art');
  const [fontFamilyMode, setFontFamilyMode] = useState<'handwriter' | 'editorial'>('handwriter');
  const [showPersonalizePanel, setShowPersonalizePanel] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customImageName, setCustomImageName] = useState('');
  const [darknessOverlay, setDarknessOverlay] = useState(0.45);

  useEffect(() => {
    loadPostcardImage().then((stored) => {
      if (stored) {
        setCustomImage(stored);
        setCustomImageName('Foto guardada');
      }
    });
  }, []);

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setCustomImage(dataUrl);
      setCustomImageName(file.name);
      await savePostcardImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomImage = async () => {
    setCustomImage(null);
    setCustomImageName('');
    await removePostcardImage();
  };

  const currentCard = EXTENDED_ORACLE_CARDS[currentIndex];

  const currentDateFormatted = new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const handleReveal = () => {
    if (!isRevealed) {
      setIsRevealed(true);
      setOracleDrawnToday();
    }
  };

  const handleDrawAnother = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShuffling(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % EXTENDED_ORACLE_CARDS.length);
      setIsRevealed(true);
      setIsShuffling(false);
    }, 400);
  };

  const handleCopyQuote = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `"${currentCard.quote}"\n\n✨ Arquetipo: ${currentCard.archetype}\n🌿 Práctica: ${currentCard.practice}\n\n— Oráculo de Vishuda Essentia`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const currentPreset =
    BACKDROP_PRESETS.find((p) => p.id === selectedBackdrop) ||
    BACKDROP_PRESETS[0];

  const activeImageSrc = customImage || currentPreset.imageUrl;

  const handleRandomizeBackdrop = () => {
    const others = BACKDROP_PRESETS.filter((b) => b.id !== selectedBackdrop);
    const next = others[Math.floor(Math.random() * others.length)];
    if (next) {
      setCustomImage(null);
      setSelectedBackdrop(next.id);
    }
  };

  // Generate Instagram Story Image (1080x1920) on Canvas with real image and customized options
  const generateStoryCanvas = async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    if (document.fonts) {
      try {
        await document.fonts.ready;
      } catch {
        // Continue if font check is not supported
      }
    }

    // 1. Draw Active Image (Official Vishuda Art / Landscape / Custom Upload)
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const imageElement = new Image();
        imageElement.crossOrigin = 'anonymous';
        imageElement.onload = () => resolve(imageElement);
        imageElement.onerror = (e) => reject(e);
        imageElement.src = activeImageSrc;
      });

      // Render image with cover aspect ratio
      const scale = Math.max(1080 / img.width, 1920 / img.height);
      const nw = img.width * scale;
      const nh = img.height * scale;
      const ox = (1080 - nw) / 2;
      const oy = (1920 - nh) / 2;
      ctx.drawImage(img, ox, oy, nw, nh);
    } catch {
      // Safe fallback to local Vishuda Oracle artwork asset
      try {
        const fallbackImg = await new Promise<HTMLImageElement>((resolve, reject) => {
          const fallback = new Image();
          fallback.onload = () => resolve(fallback);
          fallback.onerror = (e) => reject(e);
          fallback.src = vishudaOracleArt;
        });
        const scale = Math.max(1080 / fallbackImg.width, 1920 / fallbackImg.height);
        const nw = fallbackImg.width * scale;
        const nh = fallbackImg.height * scale;
        const ox = (1080 - nw) / 2;
        const oy = (1920 - nh) / 2;
        ctx.drawImage(fallbackImg, ox, oy, nw, nh);
      } catch {
        // Last-resort gradient
        const grad = ctx.createLinearGradient(0, 0, 0, 1920);
        grad.addColorStop(0, '#04100c');
        grad.addColorStop(0.5, '#09241b');
        grad.addColorStop(1, '#133e31');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1920);
      }
    }

    // 2. Darkness overlay for contrast and legibility
    ctx.fillStyle = `rgba(0, 0, 0, ${darknessOverlay})`;
    ctx.fillRect(0, 0, 1080, 1920);

    // 3. Add Film Vignette (Dark borders for cinematic focus)
    const vignette = ctx.createRadialGradient(540, 960, 400, 540, 960, 1100);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.45)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, 1080, 1920);

    // 4. Elegant Outer Borders in Champagne Gold
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 3.5;
    ctx.strokeRect(55, 55, 970, 1810);

    ctx.strokeStyle = 'rgba(234, 208, 143, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(75, 75, 930, 1770);

    // Golden Corner Diamonds
    const drawDiamond = (x: number, y: number) => {
      ctx.fillStyle = '#ead08f';
      ctx.beginPath();
      ctx.moveTo(x, y - 8);
      ctx.lineTo(x + 8, y);
      ctx.lineTo(x, y + 8);
      ctx.lineTo(x - 8, y);
      ctx.closePath();
      ctx.fill();
    };
    drawDiamond(75, 75);
    drawDiamond(1005, 75);
    drawDiamond(75, 1845);
    drawDiamond(1005, 1845);

    // 5. Sacred Geometry Watermark (Mandala Rings)
    ctx.save();
    ctx.translate(540, 960);
    ctx.strokeStyle = 'rgba(234, 208, 143, 0.08)';
    ctx.lineWidth = 2.5;
    for (let r = 140; r <= 460; r += 80) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Star lines
    ctx.beginPath();
    ctx.moveTo(-450, 0);
    ctx.lineTo(450, 0);
    ctx.moveTo(0, -450);
    ctx.lineTo(0, 450);
    ctx.stroke();
    ctx.restore();

    // 6. Header Section
    ctx.fillStyle = '#ead08f';
    ctx.font = 'bold 42px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ VISHUDA ESSENTIA ✦', 540, 200);

    ctx.fillStyle = '#f0f5f2';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('ORÁCULO DE INTENCIÓN Y VOZ', 540, 250);

    // Date tag
    ctx.fillStyle = '#cfe1d9';
    ctx.font = 'italic 22px "Playfair Display", serif';
    ctx.fillText(currentDateFormatted.toUpperCase(), 540, 290);

    // Gold Divider line
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(320, 320);
    ctx.lineTo(760, 320);
    ctx.stroke();

    // 7. Personal User Tag (If personalized)
    let currentTop = 410;
    if (userName.trim()) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(260, currentTop, 560, 60);
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(260, currentTop, 560, 60);

      ctx.fillStyle = '#ead08f';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(`✨ INTENCIÓN DE: ${userName.trim().toUpperCase()}`, 540, currentTop + 40);
      currentTop += 90;
    }

    // 8. Archetype Pill (Glassmorphic)
    ctx.fillStyle = 'rgba(234, 208, 143, 0.18)';
    ctx.fillRect(280, currentTop, 520, 66);
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 2;
    ctx.strokeRect(280, currentTop, 520, 66);

    ctx.fillStyle = '#ead08f';
    ctx.font = 'italic bold 32px "Playfair Display", serif';
    ctx.fillText(`Arquetipo: ${currentCard.archetype}`, 540, currentTop + 45);

    // 9. Quotation Marks
    ctx.fillStyle = 'rgba(234, 208, 143, 0.45)';
    ctx.font = 'bold 140px "Playfair Display", serif';
    ctx.fillText('“', 540, currentTop + 175);

    // 10. Quote Text with Large Bold Font, Word Wrap & Drop Shadow for Readability
    ctx.fillStyle = '#ffffff';
    let lineHeight = 88;
    let maxWidth = 880;

    if (fontFamilyMode === 'handwriter') {
      ctx.font = 'bold 84px "Caveat", "Marck Script", cursive';
      lineHeight = 98;
      maxWidth = 900;
    } else {
      ctx.font = 'bold 64px "Playfair Display", serif';
      lineHeight = 84;
      maxWidth = 880;
    }

    // Shadow for strong contrast on any backdrop
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    const words = currentCard.quote.split(' ');
    let line = '';
    let y = currentTop + 270;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 540, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 540, y);
    ctx.restore();

    // 11. Personal Custom Reflection Note (If provided)
    let nextBoxY = y + 100;
    if (personalNote.trim()) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(150, nextBoxY, 780, 115);
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(150, nextBoxY, 780, 115);

      ctx.fillStyle = '#ead08f';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('MI INTENCIÓN HOY:', 540, nextBoxY + 38);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'italic 34px "Caveat", cursive';
      ctx.fillText(`“${personalNote.trim()}”`, 540, nextBoxY + 82);

      nextBoxY += 140;
    }

    // 12. Micro-practice Box (Enlarged and highlighted)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(140, nextBoxY, 800, 180);
    ctx.strokeStyle = 'rgba(234, 208, 143, 0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(140, nextBoxY, 800, 180);

    ctx.fillStyle = '#ead08f';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('MICRO-PRÁCTICA SOMÁTICA:', 540, nextBoxY + 52);

    ctx.fillStyle = '#f0f7f4';
    ctx.font = 'bold 30px sans-serif';
    
    // Word wrap practice if long
    const practiceWords = currentCard.practice.split(' ');
    let pLine = '';
    let pY = nextBoxY + 105;
    for (let pi = 0; pi < practiceWords.length; pi++) {
      const testP = pLine + practiceWords[pi] + ' ';
      if (ctx.measureText(testP).width > 740 && pi > 0) {
        ctx.fillText(pLine, 540, pY);
        pLine = practiceWords[pi] + ' ';
        pY += 40;
      } else {
        pLine = testP;
      }
    }
    ctx.fillText(pLine, 540, pY);

    // 13. CapCut Style Sticker / Film Indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('REC ● 00:26:00 · 4K 60FPS · VISHUDA ESSENTIA', 540, 1620);

    // 14. Footer Branding
    ctx.fillStyle = '#ead08f';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('@vishudaessentia', 540, 1680);

    ctx.fillStyle = '#cfe1d9';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('Sabiduría Somática · Vishuda Essentia', 540, 1724);

    return canvas;
  };

  const handleDownloadStoryImage = async () => {
    setIsDownloading(true);
    try {
      const canvas = await generateStoryCanvas();
      const link = document.createElement('a');
      const suffix = customImage ? 'foto-personal' : selectedBackdrop;
      link.download = `postal-vishuda-${suffix}-${currentCard.theme.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      // fallback
    } finally {
      setTimeout(() => setIsDownloading(false), 600);
    }
  };

  const handleCopyImageToClipboard = async () => {
    try {
      const canvas = await generateStoryCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        if (navigator.clipboard && (window as any).ClipboardItem) {
          try {
            await navigator.clipboard.write([
              new (window as any).ClipboardItem({ 'image/png': blob }),
            ]);
            setCopiedImage(true);
            setTimeout(() => setCopiedImage(false), 2400);
            return;
          } catch (e) {
            // fallback
          }
        }

        // Fallback to regular download
        handleDownloadStoryImage();
      });
    } catch (e) {
      handleDownloadStoryImage();
    }
  };

  const handleNativeShare = async () => {
    try {
      const canvas = await generateStoryCanvas();
      canvas.toBlob(async (blob) => {
        if (blob && navigator.canShare && navigator.share) {
          try {
            const file = new File([blob], 'postal-vishuda-story.png', { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: `Oráculo Vishuda: ${currentCard.theme}`,
                text: `"${currentCard.quote}" — Arquetipo: ${currentCard.archetype} (@vishudaessentia)`,
                files: [file],
              });
              return;
            }
          } catch (e) {
            // ignore or fallback
          }
        }

        // Fallback: download
        handleDownloadStoryImage();
      });
    } catch (e) {
      handleDownloadStoryImage();
    }
  };

  // If rendered as teaser banner on Home
  if (inlineTeaser) {
    return (
      <div
        onClick={onOpenFull}
        className="w-full relative overflow-hidden bg-gradient-to-br from-[#0a1e18] via-[#102e25] to-[#184437] border border-[#c5a059]/50 rounded-3xl p-4 shadow-md cursor-pointer text-left text-white group hover:shadow-lg transition-all"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-[#ead08f]/15 border border-[#ead08f]/40 flex items-center justify-center text-[#ead08f] text-2xl group-hover:scale-105 transition-transform shadow-inner">
            ✦
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase tracking-widest text-[#ead08f] font-bold block">
              Oráculo de Intención · Ronda del Día
            </span>
            <b className="text-xs font-semibold text-white block truncate mt-0.5">
              {isRevealed ? currentCard.quote : 'Toca la pantalla para revelar tu mensaje diario'}
            </b>
            <small className="text-[11px] text-[#cfe1d9] block truncate mt-0.5">
              {isRevealed
                ? `Arquetipo: ${currentCard.archetype} · Toca para abrir y crear tu postal estética`
                : 'Mensaje de Alma para sincronizar tu mente y tu cuerpo'}
            </small>
          </div>
          <div className="text-[#ead08f] text-lg font-light group-hover:translate-x-1 transition-transform pr-1">
            →
          </div>
        </div>
      </div>
    );
  }

  // Full view representation
  return (
    <div className="space-y-6 animate-fadeIn pb-8 text-[#1d2924]">
      {onGoHome && (
        <button
          onClick={onGoHome}
          className="text-xs font-bold text-[#144436] hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </button>
      )}

      <div className="text-center space-y-1">
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#1b5e4b] font-extrabold block">
          Comunidad & Consciencia
        </span>
        <h1 className="text-2xl font-serif font-extrabold text-[#0e2721]">
          Oráculo de Intención · Ronda del Día
        </h1>
        <p className="text-xs text-[#52665e] max-w-sm mx-auto leading-relaxed">
          Toca la carta sagrada para conectar con la sabiduría de Alma. Luego genera tu postal artística con tus imágenes favoritas listas para descargar y compartir.
        </p>
      </div>

      {/* Main Interactive Card Container */}
      <div className="flex justify-center py-2">
        <div
          onClick={handleReveal}
          className={`w-full max-w-xs min-h-[380px] rounded-3xl p-6 flex flex-col justify-between text-center cursor-pointer transition-all duration-500 shadow-xl relative overflow-hidden group ${
            isRevealed
              ? 'text-white border-2 border-[#c5a059]'
              : 'bg-gradient-to-b from-[#0a1e18] to-[#113127] text-white border-2 border-[#c5a059]/40 hover:scale-[1.02]'
          } ${isShuffling ? 'opacity-40 scale-95' : 'opacity-100'}`}
          style={
            isRevealed
              ? {
                  backgroundImage: `linear-gradient(to bottom, rgba(8, 26, 21, 0.78), rgba(14, 39, 33, 0.88), rgba(21, 58, 48, 0.94)), url(${activeImageSrc})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        >
          {/* Subtle Golden Mandala Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-64 h-64 text-[#ead08f]" fill="none">
              <circle cx="50" cy="50" r="45" stroke="#ead08f" strokeWidth="1" />
              <circle cx="50" cy="50" r="30" stroke="#ead08f" strokeWidth="1" strokeDasharray="4 4" />
              <polygon points="50,15 80,65 20,65" stroke="#ead08f" strokeWidth="1" fill="#ead08f" fillOpacity="0.2" />
            </svg>
          </div>

          {/* Card Top Label */}
          <div className="relative z-10">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#ead08f] block">
              ✦ VISHUDA ESSENTIA ✦
            </span>
            <span className="text-xs text-[#cfe1d9] mt-0.5 block font-mono">
              {isRevealed ? currentCard.theme : 'CARTA INTACTA'}
            </span>
          </div>

          {/* Center Message / Mystery */}
          <div className="relative z-10 py-6">
            {!isRevealed ? (
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#ead08f]/10 border border-[#ead08f]/50 flex items-center justify-center text-4xl text-[#ead08f] shadow-inner group-hover:scale-110 transition-transform">
                  ✦
                </div>
                <div className="space-y-1">
                  <b className="text-sm text-white block">Toca para descubrir tu guía de hoy</b>
                  <p className="text-[11px] text-[#cfe1d9]">Tu intuición ya sabe la respuesta</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <span className="text-xs font-serif text-[#ead08f] block italic">
                  — Arquetipo: {currentCard.archetype} —
                </span>
                <p className="text-lg font-serif font-bold text-white leading-relaxed px-2">
                  "{currentCard.quote}"
                </p>
                <div className="bg-white/10 rounded-2xl p-3 border border-[#ead08f]/30 text-left space-y-1 mt-2">
                  <span className="text-[9px] uppercase font-bold text-[#ead08f] tracking-wider block">
                    Micro-práctica de hoy:
                  </span>
                  <p className="text-[11px] text-[#cfe1d9] leading-tight">
                    {currentCard.practice}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Card Footer Actions */}
          <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10">
            {isRevealed ? (
              <>
                <button
                  onClick={handleDrawAnother}
                  disabled={isShuffling}
                  className="text-xs text-[#ead08f] hover:underline flex items-center gap-1.5 font-bold py-1 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
                  <span>Otra carta</span>
                </button>
                <button
                  onClick={handleCopyQuote}
                  className="text-xs text-[#ead08f] hover:underline flex items-center gap-1.5 font-bold py-1 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? 'Copiado' : 'Compartir'}</span>
                </button>
              </>
            ) : (
              <span className="text-xs text-[#ead08f] mx-auto uppercase tracking-widest font-semibold py-1">
                Toca para revelar tu carta
              </span>
            )}
          </div>
        </div>
      </div>

      {/* QUICK BACKGROUND STRIP & POSTAL CALLOUT */}
      {isRevealed && (
        <div className="max-w-sm mx-auto space-y-3 pt-2 animate-fadeIn">
          {/* Miniature Background Selector directly in main view */}
          <div className="bg-[#0b241c] p-3 rounded-2xl border border-[#c5a059]/40 text-center space-y-2 shadow-md">
            <span className="text-[11px] font-bold text-[#ead08f] flex items-center justify-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Obras oficiales de Vishuda disponibles:</span>
            </span>
            <div className="flex justify-center gap-2 overflow-x-auto py-1">
              {BACKDROP_PRESETS.slice(0, 5).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setCustomImage(null);
                    setSelectedBackdrop(preset.id);
                  }}
                  className={`w-11 h-11 rounded-xl border overflow-hidden relative transition-transform cursor-pointer shrink-0 ${
                    !customImage && selectedBackdrop === preset.id
                      ? 'border-[#ead08f] ring-2 ring-[#ead08f] scale-105'
                      : 'border-white/20 opacity-70 hover:opacity-100'
                  }`}
                  title={preset.name}
                >
                  <img
                    src={preset.thumbnail}
                    alt={preset.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowStoryModal(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#091c16] via-[#143e31] to-[#1c5544] border-2 border-[#c5a059] text-[#ead08f] font-bold text-sm shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Camera className="w-4 h-4 text-[#ead08f] group-hover:scale-110 transition-transform" />
            <span>Previsualizar & Personalizar Postal (9:16)</span>
          </button>
          <p className="text-[11px] text-center text-[#556961]">
            Previsualiza exactamente tu tarjeta en formato vertical antes de guardarla.
          </p>
        </div>
      )}

      {/* MODAL: ESTUDIO DE POSTALES VISHUDA CON PREVISUALIZACIÓN REAL EN VIVO */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn overflow-y-auto">
          <div className="bg-[#05140f] border-2 border-[#c5a059] rounded-3xl max-w-4xl w-full p-4 sm:p-6 text-white shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#ead08f]/20 border border-[#ead08f]/40 flex items-center justify-center text-[#ead08f]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#ead08f]">
                    Estudio de Postales & Oráculo (9:16)
                  </h3>
                  <p className="text-[11px] text-[#cfe1d9]">
                    Previsualiza tu tarjeta con las obras de Vishuda antes de descargar
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowStoryModal(false)}
                className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid: Preview on Left + Customization on Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* COLUMNA DE PREVISUALIZACIÓN REAL (9:16) */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#ead08f] flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Previsualización de la Tarjeta:</span>
                  </span>
                  <span className="text-[10px] text-[#cfe1d9] bg-[#ead08f]/15 px-2 py-0.5 rounded-full border border-[#ead08f]/30 font-medium">
                    Formato 9:16
                  </span>
                </div>

                {/* TARJETA 9:16 CON LA IMAGEN REAL */}
                <div
                  className="w-full max-w-[270px] aspect-[9/16] rounded-2xl border-2 border-[#c5a059] p-4 flex flex-col justify-between text-center shadow-2xl relative overflow-hidden transition-all duration-300"
                  style={{
                    backgroundImage: `url(${activeImageSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Dynamic Darkness Layer */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-colors"
                    style={{ backgroundColor: `rgba(0, 0, 0, ${darknessOverlay})` }}
                  />

                  {/* Vignette & Gold Frame */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
                  <div className="absolute inset-2 border border-[#ead08f]/40 pointer-events-none rounded-xl" />

                  {/* Top Header */}
                  <div className="space-y-0.5 relative z-10 pt-1">
                    <span className="text-[8px] tracking-[0.25em] font-bold uppercase block text-[#ead08f]">
                      ✦ VISHUDA ESSENTIA ✦
                    </span>
                    <span className="text-[8px] block text-[#cfe1d9]">
                      ORÁCULO DE INTENCIÓN · {currentDateFormatted}
                    </span>
                  </div>

                  {/* Center Content */}
                  <div className="space-y-2 py-1 relative z-10 my-auto">
                    {userName.trim() && (
                      <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block bg-[#ead08f]/25 text-[#ead08f] border border-[#ead08f]/40">
                        ✨ {userName.trim()}
                      </span>
                    )}

                    <div>
                      <span className="text-[9px] px-2.5 py-0.5 rounded-full border italic inline-block bg-[#ead08f]/15 border-[#ead08f]/40 text-[#ead08f]">
                        {currentCard.archetype}
                      </span>
                    </div>

                    <p
                      className="text-white font-bold leading-snug px-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
                      style={{
                        fontFamily:
                          fontFamilyMode === 'handwriter'
                            ? 'Caveat, cursive'
                            : 'Playfair Display, serif',
                        fontSize: fontFamilyMode === 'handwriter' ? '1.45rem' : '1.15rem',
                        lineHeight: fontFamilyMode === 'handwriter' ? 1.25 : 1.35,
                      }}
                    >
                      "{currentCard.quote}"
                    </p>

                    {personalNote.trim() && (
                      <p
                        className="text-xs italic text-[#ead08f] font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
                        style={{ fontFamily: 'Caveat, cursive', fontSize: '1rem' }}
                      >
                        “{personalNote.trim()}”
                      </p>
                    )}

                    <div className="rounded-xl p-2.5 text-[10px] max-w-[230px] mx-auto border bg-black/60 border-white/20 text-[#f0f7f4] font-medium leading-snug shadow-md">
                      🌿 {currentCard.practice}
                    </div>
                  </div>

                  {/* Bottom Footer */}
                  <div className="relative z-10 space-y-0.5 pb-1">
                    <div className="text-[7px] text-white/50 font-mono tracking-widest uppercase">
                      REC ● 4K 60FPS · CINEMATIC
                    </div>
                    <div className="text-[8px] text-[#cfe1d9] font-mono tracking-wider">
                      @vishudaessentia · Sabiduría Somática
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-center text-[#cfe1d9] mt-2 bg-[#0b241c] px-2.5 py-1 rounded-full border border-white/10">
                  ✨ Previsualización en vivo · Lo que ves arriba es lo que descargas
                </p>
              </div>

              {/* COLUMNA DE CONTROLES, FONDOS Y ACCIONES */}
              <div className="md:col-span-7 space-y-4">
                {/* 1. SELECCIÓN DE OBRAS OFICIALES DE VISHUDA */}
                <div className="bg-[#0a1e18] p-3.5 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#ead08f] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Colección Oficial Vishuda:</span>
                    </span>
                    <span className="text-[10px] text-[#cfe1d9]">5 obras de arte</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BACKDROP_PRESETS.filter((p) => p.category === 'vishuda').map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setCustomImage(null);
                          setSelectedBackdrop(preset.id);
                        }}
                        className={`p-1.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          !customImage && selectedBackdrop === preset.id
                            ? 'border-[#ead08f] bg-[#12362b] ring-1 ring-[#ead08f] shadow-sm'
                            : 'border-white/15 bg-black/20 hover:bg-white/5 text-white/80'
                        }`}
                      >
                        <img
                          src={preset.thumbnail}
                          alt={preset.name}
                          className="w-9 h-12 object-cover rounded-lg shrink-0 border border-white/10"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold block truncate text-[#ead08f]">
                            {preset.tag}
                          </span>
                          <span className="text-[9px] text-[#cfe1d9] block truncate">
                            {preset.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. PAISAJES NATURALES */}
                <div className="bg-[#0a1e18] p-3.5 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#cfe1d9] flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#ead08f]" />
                      <span>Paisajes de la Naturaleza:</span>
                    </span>
                    <button
                      onClick={handleRandomizeBackdrop}
                      className="text-[11px] text-[#ead08f] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Aleatorio</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BACKDROP_PRESETS.filter((p) => p.category === 'paisaje').map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setCustomImage(null);
                          setSelectedBackdrop(preset.id);
                        }}
                        className={`p-1.5 rounded-xl border text-left transition-all flex flex-col items-center text-center gap-1 cursor-pointer ${
                          !customImage && selectedBackdrop === preset.id
                            ? 'border-[#ead08f] bg-[#12362b] ring-1 ring-[#ead08f]'
                            : 'border-white/15 bg-black/20 hover:bg-white/5 text-white/80'
                        }`}
                      >
                        <img
                          src={preset.thumbnail}
                          alt={preset.name}
                          className="w-full h-12 object-cover rounded-lg border border-white/10"
                        />
                        <span className="text-[9px] font-semibold truncate block w-full text-[#cfe1d9]">
                          {preset.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. SUBIR TU PROPIA FOTO */}
                <div className="bg-[#0a1e18] p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#ead08f]/20 flex items-center justify-center text-[#ead08f] shrink-0">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-[11px] font-bold text-white block truncate">
                        {customImage ? `Foto activa: ${customImageName || 'Cargada'}` : '¿Tienes tu propia imagen?'}
                      </span>
                      <span className="text-[9px] text-[#cfe1d9] block truncate">
                        {customImage ? 'Mostrándose en la previsualización' : 'Sube una foto desde tu celular o computadora'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <label className="px-3 py-1.5 rounded-xl bg-[#ead08f] hover:bg-[#f3dc9f] text-[#05140f] font-bold text-[11px] cursor-pointer transition-all shadow-sm flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>{customImage ? 'Cambiar' : 'Subir'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCustomImageUpload}
                        className="hidden"
                      />
                    </label>
                    {customImage && (
                      <button
                        onClick={handleRemoveCustomImage}
                        className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white/70 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Quitar foto y volver a los artes oficiales"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. AJUSTES DE ESTILO & CONTRASTE */}
                <div className="bg-[#0a1e18] p-3.5 rounded-2xl border border-white/10 space-y-3 text-xs">
                  {/* Darkness slider */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-[#cfe1d9] font-medium flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-[#ead08f]" />
                      <span>Filtro de contraste sobre la imagen:</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0.15"
                        max="0.75"
                        step="0.05"
                        value={darknessOverlay}
                        onChange={(e) => setDarknessOverlay(parseFloat(e.target.value))}
                        className="w-24 accent-[#ead08f] cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-[#ead08f] w-7 text-right">
                        {Math.round(darknessOverlay * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Typography selector */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-[11px] text-[#cfe1d9] font-medium">Estilo de letra:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFontFamilyMode('handwriter')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          fontFamilyMode === 'handwriter'
                            ? 'bg-[#ead08f] text-[#05140f]'
                            : 'bg-white/10 text-white/70 hover:text-white'
                        }`}
                        style={{ fontFamily: 'Caveat, cursive' }}
                      >
                        ✍️ Manuscrita
                      </button>
                      <button
                        onClick={() => setFontFamilyMode('editorial')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          fontFamilyMode === 'editorial'
                            ? 'bg-[#ead08f] text-[#05140f]'
                            : 'bg-white/10 text-white/70 hover:text-white'
                        }`}
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        Editorial Serif
                      </button>
                    </div>
                  </div>

                  {/* Personalization Toggle */}
                  <div className="pt-1">
                    <button
                      onClick={() => setShowPersonalizePanel(!showPersonalizePanel)}
                      className="text-[11px] text-[#cfe1d9] hover:text-[#ead08f] underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>
                        {showPersonalizePanel ? 'Ocultar personalización' : 'Añadir mi nombre / intención personalizada'}
                      </span>
                    </button>
                  </div>

                  {showPersonalizePanel && (
                    <div className="space-y-2 pt-2 border-t border-white/10 animate-fadeIn">
                      <div>
                        <label className="text-[10px] text-[#cfe1d9] block mb-1 font-semibold flex items-center gap-1">
                          <User className="w-3 h-3 text-[#ead08f]" />
                          <span>Tu Nombre o Usuario (opcional):</span>
                        </label>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Ej. @mariapaz o Alma Libre"
                          className="w-full bg-[#05140f] border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#ead08f]"
                          maxLength={28}
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[#cfe1d9] block mb-1 font-semibold flex items-center gap-1">
                          <Heart className="w-3 h-3 text-[#ead08f]" />
                          <span>Tu Sentir / Intención personal (opcional):</span>
                        </label>
                        <input
                          type="text"
                          value={personalNote}
                          onChange={(e) => setPersonalNote(e.target.value)}
                          placeholder="Ej. Hoy elijo mi paz sobre la prisa"
                          className="w-full bg-[#05140f] border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#ead08f]"
                          maxLength={40}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. BOTONES DE ACCIÓN Y DESCARGA */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleDownloadStoryImage}
                    disabled={isDownloading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#c5a059] via-[#ead08f] to-[#c5a059] text-[#05140f] font-extrabold text-sm shadow-xl hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloading ? 'Generando imagen HD...' : 'Descargar Tarjeta HD (PNG 1080x1920)'}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleCopyImageToClipboard}
                      className="py-2.5 px-3 rounded-xl border border-white/20 text-xs font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedImage ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#ead08f]" />
                      )}
                      <span>{copiedImage ? '¡Imagen Copiada!' : 'Copiar Imagen'}</span>
                    </button>

                    <button
                      onClick={handleNativeShare}
                      className="py-2.5 px-3 rounded-xl border border-[#c5a059]/60 text-xs font-bold text-[#ead08f] hover:bg-[#ead08f]/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Compartir Tarjeta</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
