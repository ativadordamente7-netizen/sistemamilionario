/**
 * =================================================================
 * CONFIGURAÇÕES GERAIS DO INFINITY MILLION
 * Modifique estas variáveis conforme a sua oferta e estratégia.
 * =================================================================
 */

// URL Completa do vídeo de VSL (YouTube)
export const VIDEO_URL = "https://youtu.be/mlNRsqImVLs?si=7danoJvgMnjABTiM";

// ID do vídeo no YouTube extraído da URL
export const VIDEO_ID = "mlNRsqImVLs";

// Link de Checkout / Ativação Oficial Kiwify
export const CTA_URL = "https://pay.kiwify.com.br/uE9kuTs";

// Texto do Botão de Compra
export const CTA_BUTTON_TEXT = "ATIVE O SISTEMA AGORA";

// Duração padrão estimada do vídeo oficial no YouTube caso metadados ainda não tenham carregado
export const VIDEO_DURATION_SECONDS = 1419;

// Janela de liberação do botão: nos últimos 3 minutos de vídeo (180 segundos antes do final)
export const LAST_MINUTES_WINDOW_SECONDS = 180;

// Momento de liberação estático de fallback caso o player não retorne a duração exata
export const UNLOCK_DELAY_SECONDS = Math.max(VIDEO_DURATION_SECONDS - LAST_MINUTES_WINDOW_SECONDS, 0);
export const BUTTON_DELAY_SECONDS = UNLOCK_DELAY_SECONDS;
export const UNLOCK_TIME = BUTTON_DELAY_SECONDS;

// Intervalo aproximado entre notificações de ativação (em segundos) - ritmo calmo e realista
export const NOTIFICATION_INTERVAL = 40;

// Lista de dados para o sistema de notificações sociais
// Revisado para não atribuir a atividade a pessoas ou cidades específicas fictícias (risco de
// propaganda enganosa / depoimento fictício sob o CDC). Mensagens genéricas de atividade recente.
// (Estruturado para futura integração com API / Webhooks de vendas reais como Kiwify, Hotmart, Eduzz, etc.)
export const DEMO_NOTIFICATIONS = [
  { id: '1', name: '', message: 'Novo acesso ativado agora.', timestamp: 'agora' },
  { id: '2', name: '', message: 'Uma nova ativação foi registrada.', timestamp: 'há 1 min' },
  { id: '3', name: '', message: 'Novo acesso ativado.', timestamp: 'há 2 min' },
  { id: '4', name: '', message: 'Uma nova ativação foi registrada.', timestamp: 'há 3 min' },
  { id: '5', name: '', message: 'Novo acesso ativado.', timestamp: 'há 4 min' },
  { id: '6', name: '', message: 'Uma nova ativação foi registrada.', timestamp: 'há 5 min' },
  { id: '7', name: '', message: 'Novo acesso ativado.', timestamp: 'há 6 min' },
  { id: '8', name: '', message: 'Uma nova ativação foi registrada.', timestamp: 'há 7 min' }
];
