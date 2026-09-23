import React, { useState } from 'react';
import { ExplorationData } from '../types';
import { deleteExploration, clearAllExplorations } from '../utils/storage';
import { Trash2, ChevronDown, ChevronUp, Compass, Calendar, Sparkles } from 'lucide-react';

interface JourneyHistoryProps {
  onBack: () => void;
  onStartExploration: () => void;
  explorations?: ExplorationData[];
  onRefresh: () => void;
}

export const JourneyHistory: React.FC<JourneyHistoryProps> = ({
  onBack,
  onStartExploration,
  explorations = [],
  onRefresh,
}) => {
  const safeExplorations = Array.isArray(explorations) ? explorations : [];
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleRequestDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setItemToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    deleteExploration(itemToDelete);
    setItemToDelete(null);
    onRefresh();
  };

  const handleConfirmClearAll = () => {
    clearAllExplorations();
    setShowClearAllModal(false);
    onRefresh();
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Reciente';
    }
  };

  return (
    <div className="space-y-5 pb-8">
      <button
        onClick={onBack}
        className="text-xs font-bold text-[#5b2a63] hover:underline flex items-center gap-1"
      >
        ← Volver
      </button>

      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs tracking-widest uppercase text-[#8b708f] font-bold block">
            Evolución y Registros
          </span>
          <h1 className="text-2xl font-extrabold text-[#332a3d] mt-1">
            Mi Viaje
          </h1>
          <p className="text-sm text-[#655a68] mt-1">
            Tu archivo de indagaciones conscientes en el tiempo.
          </p>
        </div>

        {safeExplorations.length > 0 && (
          <button
            onClick={() => setShowClearAllModal(true)}
            className="text-[11px] text-red-700/80 hover:text-red-700 hover:underline pt-2 cursor-pointer"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {safeExplorations.length === 0 ? (
        <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-8 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#efe4f5] text-[#5b2a63] mx-auto flex items-center justify-center text-xl">
            🌱
          </div>
          <b className="text-sm text-[#332a3d] block">
            Aún no has guardado exploraciones
          </b>
          <p className="text-xs text-[#7d7188] max-w-xs mx-auto leading-relaxed">
            Cada vez que completes una indagación de 9 pasos, quedará registrada aquí para que puedas observar tu progreso.
          </p>
          <button
            onClick={onStartExploration}
            className="px-5 py-2.5 rounded-xl bg-[#5b2a63] text-white font-bold text-xs shadow-md cursor-pointer"
          >
            Comenzar mi primera exploración
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {safeExplorations.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-4 cursor-pointer hover:border-[#5b2a63]/50 transition-all shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#5b2a63] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(item.date)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#efe4f5] text-[#5b2a63] text-[10px] font-bold">
                      {item.intensity}/10 intensidad
                    </span>
                    <button
                      onClick={(e) => handleRequestDelete(e, item.id)}
                      className="text-[#7d7188] hover:text-red-600 p-1 cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#7d7188]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#7d7188]" />
                    )}
                  </div>
                </div>

                <div>
                  <b className="text-sm text-[#332a3d] block">{item.scene}</b>
                  <p className="text-xs text-[#7d7188] mt-0.5">
                    Emoción: <b>{item.emotion}</b> · Protección: {item.protection}
                  </p>
                </div>

                {isExpanded && (
                  <div className="pt-3 border-t border-[#f0e5d7] text-xs space-y-2 text-[#655a68] animate-fadeIn">
                    <div>
                      <b className="text-[#5b2a63] block">Cuerpo:</b>
                      <p>Zona de sensación: {item.body}</p>
                    </div>

                    <div>
                      <b className="text-[#5b2a63] block">Historia mental / Creencia:</b>
                      <p className="italic text-[#332a3d]">"{item.interpretation}"</p>
                    </div>

                    <div>
                      <b className="text-[#5b2a63] block">Necesidad real:</b>
                      <p>{item.need}</p>
                    </div>

                    {item.completion && (
                      <div>
                        <b className="text-[#5b2a63] block">Mi primer paso consciente:</b>
                        <p className="bg-[#f8f4ee] p-2 rounded-xl text-[#332a3d]">"{item.completion}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Clear All Explorations */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-[#332a3d]">¿Borrar historial de exploraciones?</h3>
            <p className="text-xs text-[#7d7188]">
              Esta acción eliminará todas las indagaciones de 9 pasos guardadas. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearAllModal(false)}
                className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmClearAll}
                className="flex-1 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold"
              >
                Sí, borrar todo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete Single Exploration */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-[#332a3d]">¿Eliminar esta exploración?</h3>
            <p className="text-xs text-[#7d7188]">
              Este registro se removerá de tu bitácora de viaje.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
