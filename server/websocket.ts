import { Server as HTTPServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { log } from './vite';

/**
 * أنواع الأحداث المدعومة في WebSocket
 */
export enum WebSocketEventType {
  BOOKING_AVAILABILITY_UPDATE = 'booking_availability_update',
  BOOKING_COUNTDOWN_START = 'booking_countdown_start',
  BOOKING_RESERVED = 'booking_reserved',
  PROPERTY_VISITORS_UPDATE = 'property_visitors_update',
  CONNECTION_ESTABLISHED = 'connection_established',
  ERROR = 'error',
}

/**
 * واجهة لرسائل WebSocket
 */
export interface WebSocketMessage {
  type: WebSocketEventType;
  payload: any;
}

/**
 * واجهة لبيانات توافر الحجز
 */
export interface BookingAvailabilityData {
  propertyId: string;
  propertyName: string;
  expiryTime: string; // ISO string for Date
  isAvailable: boolean;
  activeVisitors: number;
  totalSlots: number;
  availableSlots: number;
}

// تخزين الاتصالات النشطة ومعلومات العقارات
interface ConnectionState {
  clients: Map<WebSocket, { propertyId: string | null }>;
  propertyVisitors: Map<string, number>; // propertyId -> عدد المشاهدين
  bookingAvailability: Map<string, BookingAvailabilityData>; // propertyId -> معلومات التوافر
}

// حالة اتصالات WebSocket
const state: ConnectionState = {
  clients: new Map(),
  propertyVisitors: new Map(),
  bookingAvailability: new Map(),
};

/**
 * إعداد خادم WebSocket وربطه بخادم HTTP
 * @param httpServer خادم HTTP المراد ربط WebSocket به
 */
export function setupWebSocketServer(httpServer: HTTPServer) {
  // إنشاء خادم WebSocket باستخدام نفس خادم HTTP ولكن على مسار مختلف
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  log('WebSocket server initialized on path: /ws', 'websocket');

  // معالجة اتصال جديد
  wss.on('connection', (ws: WebSocket) => {
    // إضافة اتصال جديد إلى الحالة
    state.clients.set(ws, { propertyId: null });
    
    log(`New WebSocket connection established. Total connections: ${state.clients.size}`, 'websocket');
    
    // إرسال رسالة تأكيد الاتصال
    sendMessage(ws, {
      type: WebSocketEventType.CONNECTION_ESTABLISHED,
      payload: { connectionId: Date.now().toString() }
    });

    // معالجة الرسائل الواردة
    ws.on('message', (message: string) => {
      try {
        const parsedMessage = JSON.parse(message.toString()) as WebSocketMessage;
        handleClientMessage(ws, parsedMessage);
      } catch (error) {
        log(`Error parsing WebSocket message: ${error}`, 'websocket');
        sendMessage(ws, {
          type: WebSocketEventType.ERROR,
          payload: { message: 'Invalid message format' }
        });
      }
    });

    // معالجة إغلاق الاتصال
    ws.on('close', () => {
      const clientData = state.clients.get(ws);
      if (clientData?.propertyId) {
        // تحديث عدد المشاهدين للعقار عند مغادرة المستخدم
        updatePropertyVisitors(clientData.propertyId, -1);
      }
      
      // إزالة الاتصال من الحالة
      state.clients.delete(ws);
      log(`WebSocket connection closed. Remaining connections: ${state.clients.size}`, 'websocket');
    });

    // معالجة أخطاء الاتصال
    ws.on('error', (error) => {
      log(`WebSocket error: ${error}`, 'websocket');
    });
  });

  log('WebSocket server setup complete', 'websocket');
  return wss;
}

/**
 * معالجة الرسائل الواردة من العملاء
 * @param ws اتصال WebSocket
 * @param message الرسالة الواردة
 */
function handleClientMessage(ws: WebSocket, message: WebSocketMessage) {
  const { type, payload } = message;
  
  // تسجيل الرسائل الواردة (بدون معلومات حساسة)
  log(`Received WebSocket message of type: ${type}`, 'websocket');
  
  switch (type) {
    // عندما يبدأ المستخدم في عرض عقار
    case WebSocketEventType.PROPERTY_VISITORS_UPDATE:
      const propertyId = payload.propertyId;
      if (!propertyId) return;
      
      // تحديث الخريطة بمعرف العقار للعميل الحالي
      const clientData = state.clients.get(ws) || { propertyId: null };
      
      // إذا كان المستخدم يشاهد عقارًا آخر، قم بتحديث العدد لذلك العقار أولاً
      if (clientData.propertyId && clientData.propertyId !== propertyId) {
        updatePropertyVisitors(clientData.propertyId, -1);
      }
      
      // تعيين العقار الجديد وزيادة عدد المشاهدين
      state.clients.set(ws, { propertyId });
      updatePropertyVisitors(propertyId, 1);
      
      // إرسال معلومات التوافر الحالية للعقار إذا كانت متوفرة
      const availabilityData = state.bookingAvailability.get(propertyId);
      if (availabilityData) {
        sendMessage(ws, {
          type: WebSocketEventType.BOOKING_AVAILABILITY_UPDATE,
          payload: availabilityData
        });
      }
      break;
      
    // عندما يقوم المسؤول ببدء العد التنازلي للحجز
    case WebSocketEventType.BOOKING_COUNTDOWN_START:
      if (validateAvailabilityData(payload)) {
        startBookingCountdown(payload);
      }
      break;
      
    // عندما يتم حجز العقار
    case WebSocketEventType.BOOKING_RESERVED:
      if (payload.propertyId) {
        updateBookingAvailability(payload.propertyId, {
          ...state.bookingAvailability.get(payload.propertyId),
          isAvailable: false,
          availableSlots: 0
        });
      }
      break;
      
    default:
      log(`Unknown WebSocket message type: ${type}`, 'websocket');
      break;
  }
}

/**
 * التحقق من صحة بيانات توافر الحجز
 * @param data بيانات التوافر للتحقق منها
 * @returns حالة الصحة
 */
function validateAvailabilityData(data: any): data is BookingAvailabilityData {
  return (
    data &&
    typeof data.propertyId === 'string' &&
    typeof data.propertyName === 'string' &&
    typeof data.expiryTime === 'string' &&
    typeof data.isAvailable === 'boolean' &&
    typeof data.activeVisitors === 'number' &&
    typeof data.totalSlots === 'number' &&
    typeof data.availableSlots === 'number'
  );
}

/**
 * بدء العد التنازلي لتوافر الحجز للعقار
 * @param data بيانات توافر الحجز
 */
function startBookingCountdown(data: BookingAvailabilityData) {
  const { propertyId } = data;
  
  // تحديث حالة توافر الحجز للعقار
  state.bookingAvailability.set(propertyId, {
    ...data,
    activeVisitors: state.propertyVisitors.get(propertyId) || 0
  });
  
  // إرسال تحديث لجميع العملاء المهتمين بهذا العقار
  broadcastToPropertyClients(propertyId, {
    type: WebSocketEventType.BOOKING_AVAILABILITY_UPDATE,
    payload: state.bookingAvailability.get(propertyId)
  });
  
  log(`Started booking countdown for property ID: ${propertyId}`, 'websocket');
  
  // جدولة إرسال تحديث عندما ينتهي وقت العد التنازلي
  const expiryTime = new Date(data.expiryTime).getTime();
  const now = Date.now();
  const timeUntilExpiry = expiryTime - now;
  
  if (timeUntilExpiry > 0) {
    setTimeout(() => {
      const currentData = state.bookingAvailability.get(propertyId);
      if (currentData) {
        updateBookingAvailability(propertyId, {
          ...currentData,
          isAvailable: false
        });
      }
    }, timeUntilExpiry);
  }
}

/**
 * تحديث عدد المشاهدين للعقار
 * @param propertyId معرف العقار
 * @param change التغيير في العدد (1 للزيادة، -1 للنقصان)
 */
function updatePropertyVisitors(propertyId: string, change: number) {
  const currentCount = state.propertyVisitors.get(propertyId) || 0;
  const newCount = Math.max(0, currentCount + change);
  
  state.propertyVisitors.set(propertyId, newCount);
  log(`Property ${propertyId} visitors count updated to ${newCount}`, 'websocket');
  
  // تحديث عدد المشاهدين في بيانات توافر الحجز إذا كانت موجودة
  const availabilityData = state.bookingAvailability.get(propertyId);
  if (availabilityData) {
    updateBookingAvailability(propertyId, {
      ...availabilityData,
      activeVisitors: newCount
    });
  }
  
  // إرسال تحديث لجميع العملاء المهتمين بهذا العقار
  broadcastToPropertyClients(propertyId, {
    type: WebSocketEventType.PROPERTY_VISITORS_UPDATE,
    payload: { propertyId, visitorCount: newCount }
  });
}

/**
 * تحديث حالة توافر الحجز للعقار وإرسال التحديثات
 * @param propertyId معرف العقار
 * @param data بيانات التوافر الجديدة
 */
function updateBookingAvailability(propertyId: string, data: BookingAvailabilityData) {
  state.bookingAvailability.set(propertyId, data);
  
  // إرسال تحديث لجميع العملاء المهتمين بهذا العقار
  broadcastToPropertyClients(propertyId, {
    type: WebSocketEventType.BOOKING_AVAILABILITY_UPDATE,
    payload: data
  });
  
  log(`Updated booking availability for property ID: ${propertyId}`, 'websocket');
}

/**
 * إرسال رسالة لجميع العملاء المهتمين بعقار معين
 * @param propertyId معرف العقار
 * @param message الرسالة للإرسال
 */
function broadcastToPropertyClients(propertyId: string, message: WebSocketMessage) {
  state.clients.forEach((data, client) => {
    if (data.propertyId === propertyId && client.readyState === WebSocket.OPEN) {
      sendMessage(client, message);
    }
  });
}

/**
 * إرسال رسالة إلى اتصال WebSocket محدد
 * @param ws اتصال WebSocket
 * @param message الرسالة للإرسال
 */
function sendMessage(ws: WebSocket, message: WebSocketMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

/**
 * واجهة API لبدء عد تنازلي للحجز للعقار من خارج خدمة WebSocket
 * @param data بيانات توافر الحجز
 */
export function startPropertyBookingCountdown(data: BookingAvailabilityData) {
  if (validateAvailabilityData(data)) {
    startBookingCountdown(data);
    return true;
  }
  return false;
}

/**
 * واجهة API لتحديث عدد المشاهدين للعقار من خارج خدمة WebSocket
 * @param propertyId معرف العقار
 * @param visitorCount عدد المشاهدين الجديد
 */
export function setPropertyVisitorCount(propertyId: string, visitorCount: number) {
  const currentCount = state.propertyVisitors.get(propertyId) || 0;
  const change = visitorCount - currentCount;
  
  if (change !== 0) {
    updatePropertyVisitors(propertyId, change);
    return true;
  }
  return false;
}

/**
 * الحصول على عدد المشاهدين الحالي للعقار
 * @param propertyId معرف العقار
 * @returns عدد المشاهدين الحالي
 */
export function getPropertyVisitorCount(propertyId: string): number {
  return state.propertyVisitors.get(propertyId) || 0;
}

/**
 * الحصول على معلومات توافر الحجز الحالية للعقار
 * @param propertyId معرف العقار
 * @returns معلومات توافر الحجز
 */
export function getBookingAvailability(propertyId: string): BookingAvailabilityData | undefined {
  return state.bookingAvailability.get(propertyId);
}