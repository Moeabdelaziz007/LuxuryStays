import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  getDoc,
  serverTimestamp,
  orderBy,
  limit as firestoreLimit,
  Timestamp
} from "firebase/firestore";

// BookingStatus enum
export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled"
}

// Define the Booking type that mirrors our Firestore structure
export interface FirestoreBooking {
  id?: string; // Optional as it's assigned by Firestore
  propertyId: string;
  customerId: string;
  status: "pending" | "confirmed" | "cancelled";
  checkInDate: Timestamp | string;
  checkOutDate: Timestamp | string;
  totalPrice?: number;
  paymentStatus?: string;
  notes?: string;
  createdAt?: Timestamp;
}

const BOOKINGS_COLLECTION = "bookings";

// Create a new booking
export async function createBooking(booking: Omit<FirestoreBooking, 'id' | 'createdAt'>): Promise<string> {
  try {
    // Prepare booking object with server timestamp
    const newBooking = {
      ...booking,
      // Convert string dates to Firestore Timestamps if they're strings
      checkInDate: typeof booking.checkInDate === 'string' 
        ? Timestamp.fromDate(new Date(booking.checkInDate)) 
        : booking.checkInDate,
      checkOutDate: typeof booking.checkOutDate === 'string' 
        ? Timestamp.fromDate(new Date(booking.checkOutDate)) 
        : booking.checkOutDate,
      createdAt: serverTimestamp()
    };

    // Add document to Firestore
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), newBooking);
    return docRef.id;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

// Get a booking by ID
export async function getBookingById(id: string): Promise<FirestoreBooking | null> {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<FirestoreBooking, 'id'>;
      return { ...data, id: docSnap.id };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting booking:", error);
    throw error;
  }
}

// Get all bookings for a customer
export async function getCustomerBookings(customerId: string): Promise<FirestoreBooking[]> {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where("customerId", "==", customerId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: FirestoreBooking[] = [];
    
    querySnapshot.forEach((doc) => {
      bookings.push({ ...doc.data() as Omit<FirestoreBooking, 'id'>, id: doc.id });
    });
    
    return bookings;
  } catch (error) {
    console.error("Error getting customer bookings:", error);
    throw error;
  }
}

// Get all bookings for a property
export async function getPropertyBookings(propertyId: string): Promise<FirestoreBooking[]> {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where("propertyId", "==", propertyId),
      orderBy("checkInDate", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: FirestoreBooking[] = [];
    
    querySnapshot.forEach((doc) => {
      bookings.push({ ...doc.data() as Omit<FirestoreBooking, 'id'>, id: doc.id });
    });
    
    return bookings;
  } catch (error) {
    console.error("Error getting property bookings:", error);
    throw error;
  }
}

// Update a booking status
export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, id);
    await updateDoc(bookingRef, { status });
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
}

// Delete a booking
export async function deleteBooking(id: string): Promise<void> {
  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, id);
    await deleteDoc(bookingRef);
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
}

// Get recent bookings (for admin dashboards)
export async function getRecentBookings(limitCount: number = 5): Promise<FirestoreBooking[]> {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      orderBy("createdAt", "desc"),
      firestoreLimit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: FirestoreBooking[] = [];
    
    querySnapshot.forEach((doc) => {
      bookings.push({ ...doc.data() as Omit<FirestoreBooking, 'id'>, id: doc.id });
    });
    
    return bookings;
  } catch (error) {
    console.error("Error getting recent bookings:", error);
    throw error;
  }
}

// Check if a property is available for specific dates
export async function isPropertyAvailable(
  propertyId: string, 
  checkInDate: Date, 
  checkOutDate: Date
): Promise<boolean> {
  try {
    // Convert dates to Firestore Timestamps
    const checkIn = Timestamp.fromDate(checkInDate);
    const checkOut = Timestamp.fromDate(checkOutDate);
    
    // Query for any conflicting bookings
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where("propertyId", "==", propertyId),
      where("status", "!=", "cancelled"),
      where("checkInDate", "<=", checkOut),
      where("checkOutDate", ">=", checkIn)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty; // If empty, no conflicts found
  } catch (error) {
    console.error("Error checking property availability:", error);
    throw error;
  }
}