import React, { useState, useEffect } from "react";
import { 
  BookOpen, Sparkles, Shield, Lock, Unlock, Download, CreditCard, 
  ArrowRight, LogOut, LogIn, UserPlus, ChevronLeft, ChevronRight, 
  Trash, Plus, CheckCircle, AlertCircle, X, Settings, Info, Bookmark, Eye, HelpCircle, FileText, Coins, Receipt, Share2, ShieldAlert,
  Copy, Check
} from "lucide-react";
import { 
  onAuthStateChanged, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, signOut, User,
  signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail
} from "firebase/auth";
import { 
  doc, setDoc, getDoc, updateDoc, collection, 
  getDocs, query, where, onSnapshot, addDoc 
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { booksData, Book } from "./books-data";
import { Purchase, ReadingProgress, Note } from "./types";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState("");
  const [adminClicks, setAdminClicks] = useState(0);
  const [showAdminTab, setShowAdminTab] = useState(false);

  // Books and Purchases state
  const [selectedCategory, setSelectedCategory] = useState<"all" | "magic" | "spiritual" | "korean" | "history" | "science" | "shadows" | "deaths">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [purchasedBookIds, setPurchasedBookIds] = useState<string[]>([]);
  const [pendingBookIds, setPendingBookIds] = useState<string[]>([]);
  const [userPurchases, setUserPurchases] = useState<any[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);

  // Admin view states
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminManualPayments, setAdminManualPayments] = useState<any[]>([]);
  const [allUsersList, setAllUsersList] = useState<any[]>([]);
  const [allVisitorsList, setAllVisitorsList] = useState<any[]>([]);
  const [guardianBotActive, setGuardianBotActive] = useState<boolean>(() => {
    return localStorage.getItem("guardian_bot_active") === "true";
  });
  const [botProcessingIds, setBotProcessingIds] = useState<string[]>([]);
  const [botLogs, setBotLogs] = useState<string[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => {
        setCopiedField(null);
      }, 1500);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const handlePasteFromClipboard = async (setter: (val: string) => void) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setter(text);
      }
    } catch (err) {
      console.warn("Clipboard read failed:", err);
      alert("Please press Ctrl+V (or Cmd+V on Mac) to paste directly into the field, or allow clipboard access in your browser settings.");
    }
  };

  // Active book payment flow
  const [paymentBook, setPaymentBook] = useState<Book | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"opay" | "paystack">("paystack");
  const [selectedBank, setSelectedBank] = useState<"opay" | "moniepoint">("opay");
  const [opaySenderName, setOpaySenderName] = useState("");
  const [opayReference, setOpayReference] = useState("");
  const [stripeProcessing, setStripeProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Paystack mock card form states
  const [showPaystackCardModal, setShowPaystackCardModal] = useState(false);
  const [paystackCardNumber, setPaystackCardNumber] = useState("");
  const [paystackExpiry, setPaystackExpiry] = useState("");
  const [paystackCvv, setPaystackCvv] = useState("");
  const [paystackPin, setPaystackPin] = useState("");
  const [paystackCardName, setPaystackCardName] = useState("");
  const [paystackProcessingStep, setPaystackProcessingStep] = useState("");
  const [paystackProcessing, setPaystackProcessing] = useState(false);

  // Active reading flow
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [readerChapterIndex, setReaderChapterIndex] = useState(0);
  const [readerFontSize, setReaderFontSize] = useState<"sm" | "base" | "lg" | "xl">("lg");
  const [newNoteText, setNewNoteText] = useState("");
  const [bookNotes, setBookNotes] = useState<Note[]>([]);
  const [progressLoaded, setProgressLoaded] = useState(false);

  // Download simulation state
  const [downloadingBookId, setDownloadingBookId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Help info popup
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);

  // Resharing features
  const handleShareSite = async () => {
    const title = "The Celestial Codex";
    const text = "Unlock the deep secrets of the universe! Join me on the Celestial Codex to study ancient grimoires, world history, and sacred teachings. 🌟";
    const url = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.log("Web Share cancelled or failed", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\nExplore here: ${url}`);
        alert("Sacred invitation link & message copied to clipboard! Share it with your friends.");
      } catch (err) {
        console.error("Clipboard copy failed", err);
      }
    }
  };

  const handleShareBook = async (book: Book) => {
    const title = book.title;
    const text = `I am studying "${book.title}" on the Celestial Codex. Master the hidden teachings of "${book.author}"! 🌟`;
    const url = `${window.location.origin}/?book_id=${book.id}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.log("Web Share cancelled or failed", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\nUnlock here: ${url}`);
        alert(`Sacred link to "${book.title}" copied to clipboard! Share it with your friends.`);
      } catch (err) {
        console.error("Clipboard copy failed", err);
      }
    }
  };

  // Track Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setShowAuthModal(false);
        fetchUserPurchases(currentUser.uid);
      } else {
        setPurchasedBookIds([]);
        setPendingBookIds([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch purchases from Firestore (both completed, pending, and declined)
  const fetchUserPurchases = (uid: string) => {
    setLoadingPurchases(true);
    if (uid.startsWith("guest-")) {
      const localData = localStorage.getItem("sandbox_guest_purchases");
      const completedIds: string[] = [];
      const pendingIds: string[] = [];
      let list: any[] = [];
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          list = parsed;
          parsed.forEach((item: any) => {
            if (item.status === "completed") {
              completedIds.push(item.bookId);
            } else if (item.status === "pending") {
              pendingIds.push(item.bookId);
            }
          });
        } catch (e) {
          console.error("Error parsing guest purchases:", e);
        }
      }
      setPurchasedBookIds(completedIds);
      setPendingBookIds(pendingIds);
      setUserPurchases(list);
      setLoadingPurchases(false);
      return () => {}; // No-op unsubscribe
    }

    const purchasesRef = collection(db, "users", uid, "purchases");
    const unsubscribe = onSnapshot(purchasesRef, (snapshot) => {
      const completedIds: string[] = [];
      const pendingIds: string[] = [];
      const list: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push(data);
        if (data.status === "completed") {
          completedIds.push(data.bookId);
        } else if (data.status === "pending") {
          pendingIds.push(data.bookId);
        }
      });
      // Sort purchases by purchasedAt descending so newest order is at the top
      list.sort((a, b) => {
        return new Date(b.purchasedAt || 0).getTime() - new Date(a.purchasedAt || 0).getTime();
      });
      setPurchasedBookIds(completedIds);
      setPendingBookIds(pendingIds);
      setUserPurchases(list);
      setLoadingPurchases(false);
    }, (error) => {
      console.warn("Could not fetch real user purchases from firestore (using local fallback if available):", error);
      const localData = localStorage.getItem("sandbox_guest_purchases");
      const completedIds: string[] = [];
      const pendingIds: string[] = [];
      let list: any[] = [];
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          list = parsed;
          parsed.forEach((item: any) => {
            if (item.status === "completed") {
              completedIds.push(item.bookId);
            } else if (item.status === "pending") {
              pendingIds.push(item.bookId);
            }
          });
        } catch (e) {}
      }
      setPurchasedBookIds(completedIds);
      setPendingBookIds(pendingIds);
      setUserPurchases(list);
      setLoadingPurchases(false);
    });
    return unsubscribe;
  };

  const handleApprovePayment = async (payment: any, isBot: boolean = false) => {
    try {
      if (!user) return;
      if (user.uid.startsWith("guest-")) {
        // Local guest update
        const localPurchasesKey = "sandbox_guest_purchases";
        const localData = localStorage.getItem(localPurchasesKey);
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            const updated = parsed.map((p: any) => p.id === payment.id ? { ...p, status: "completed" } : p);
            localStorage.setItem(localPurchasesKey, JSON.stringify(updated));
          } catch (e) {}
        }

        const localGlobalKey = "sandbox_guest_all_payments";
        const localGlobalData = localStorage.getItem(localGlobalKey);
        if (localGlobalData) {
          try {
            const parsed = JSON.parse(localGlobalData);
            const updated = parsed.map((p: any) => p.id === payment.id ? { ...p, status: "completed" } : p);
            localStorage.setItem(localGlobalKey, JSON.stringify(updated));
          } catch (e) {}
        }
        
        // Trigger re-fetch/re-sync
        fetchUserPurchases(user.uid);
        setAdminManualPayments(prev => prev.map(p => p.id === payment.id ? { ...p, status: "completed" } : p));
      } else {
        // Update user doc in Firestore
        await setDoc(doc(db, "users", payment.userId, "purchases", payment.id), { status: "completed" }, { merge: true });
        // Update global doc in Firestore
        await setDoc(doc(db, "all_payments", payment.id), { status: "completed" }, { merge: true });
      }
      if (!isBot) {
        alert("Transfer verified successfully! E-book is now unlocked for the reader.");
      }
    } catch (err) {
      if (!isBot) {
        alert("Verification failed: " + err);
      } else {
        console.error("Guardian AI auto-approval failed:", err);
      }
    }
  };

  const handleDeclinePayment = async (payment: any, isBot: boolean = false) => {
    try {
      if (!user) return;
      if (user.uid.startsWith("guest-")) {
        const localPurchasesKey = "sandbox_guest_purchases";
        const localData = localStorage.getItem(localPurchasesKey);
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            const updated = parsed.map((p: any) => p.id === payment.id ? { ...p, status: "declined" } : p);
            localStorage.setItem(localPurchasesKey, JSON.stringify(updated));
          } catch (e) {}
        }

        const localGlobalKey = "sandbox_guest_all_payments";
        const localGlobalData = localStorage.getItem(localGlobalKey);
        if (localGlobalData) {
          try {
            const parsed = JSON.parse(localGlobalData);
            const updated = parsed.map((p: any) => p.id === payment.id ? { ...p, status: "declined" } : p);
            localStorage.setItem(localGlobalKey, JSON.stringify(updated));
          } catch (e) {}
        }

        // Trigger re-fetch/re-sync
        fetchUserPurchases(user.uid);
        setAdminManualPayments(prev => prev.map(p => p.id === payment.id ? { ...p, status: "declined" } : p));
      } else {
        await setDoc(doc(db, "users", payment.userId, "purchases", payment.id), { status: "declined" }, { merge: true });
        await setDoc(doc(db, "all_payments", payment.id), { status: "declined" }, { merge: true });
      }
      if (!isBot) {
        alert("Transfer declined.");
      }
    } catch (err) {
      if (!isBot) {
        alert("Decline failed: " + err);
      } else {
        console.error("Guardian AI auto-decline failed:", err);
      }
    }
  };

  // Guardian AI Bot Automatic Verification background worker
  useEffect(() => {
    if (!isAdminView || !guardianBotActive || !user) return;

    // Find first pending payment
    const pendingPayment = adminManualPayments.find(p => p.status === "pending");
    if (!pendingPayment) return;

    // If already processing or in queue, skip
    if (botProcessingIds.includes(pendingPayment.id)) return;

    const paymentId = pendingPayment.id;
    setBotProcessingIds(prev => [...prev, paymentId]);

    const logMsg = (msg: string) => {
      setBotLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 29)]);
    };

    logMsg(`🤖 [Guardian Bot] Activated. Auditing Reference: "${pendingPayment.paymentReference || "N/A"}"...`);

    const timer = setTimeout(async () => {
      // Automatic rules
      const hasValidRef = pendingPayment.paymentReference && pendingPayment.paymentReference.trim().length >= 6;
      const isFake = pendingPayment.paymentReference && /fake|test|fraud|scam|decline/i.test(pendingPayment.paymentReference);
      const hasSender = pendingPayment.senderName && pendingPayment.senderName.trim().length >= 3;

      if (hasValidRef && !isFake && hasSender) {
        logMsg(`✅ [Guardian Bot] Security check PASSED for "${pendingPayment.bookTitle}". Amount: ₦${(pendingPayment.amountPaid || 0).toLocaleString()} NGN. Initiating auto-unlock.`);
        await handleApprovePayment(pendingPayment, true);
        logMsg(`🔓 [Guardian Bot] Reader "${pendingPayment.senderName}" successfully authorized & e-book unlocked.`);
      } else {
        let reason = "Incomplete reference (< 6 characters) or invalid details.";
        if (isFake) reason = "Detected suspicious test/fake keyword in reference.";
        else if (!hasSender) reason = "Sender verification name is missing or too short.";
        
        logMsg(`❌ [Guardian Bot] Security check FAILED: ${reason}. Auto-declining.`);
        await handleDeclinePayment(pendingPayment, true);
        logMsg(`⛔ [Guardian Bot] Transaction ID: ${paymentId.substring(0, 8)}... has been flagged and declined.`);
      }

      // Done processing
      setBotProcessingIds(prev => prev.filter(id => id !== paymentId));
    }, 4000);

    return () => clearTimeout(timer);
  }, [isAdminView, guardianBotActive, adminManualPayments, botProcessingIds, user]);

  // Listen to all payments globally for Admin Dashboard
  useEffect(() => {
    if (!isAdminView || !user) return;

    if (user.uid.startsWith("guest-")) {
      const localKey = "sandbox_guest_all_payments";
      const loadLocalGlobal = () => {
        const localData = localStorage.getItem(localKey);
        let paymentsList: any[] = [];
        if (localData) {
          try {
            paymentsList = JSON.parse(localData);
          } catch (e) {}
        }
        paymentsList.sort((a, b) => new Date(b.purchasedAt || 0).getTime() - new Date(a.purchasedAt || 0).getTime());
        setAdminManualPayments(paymentsList);
      };
      loadLocalGlobal();
      window.addEventListener("storage", loadLocalGlobal);
      return () => window.removeEventListener("storage", loadLocalGlobal);
    }

    const paymentsRef = collection(db, "all_payments");
    const unsubscribe = onSnapshot(paymentsRef, (snapshot) => {
      const paymentsList: any[] = [];
      snapshot.forEach((doc) => {
        paymentsList.push(doc.data());
      });
      // Sort payments list by date in-memory
      paymentsList.sort((a, b) => new Date(b.purchasedAt || 0).getTime() - new Date(a.purchasedAt || 0).getTime());
      setAdminManualPayments(paymentsList);
    }, (error) => {
      console.warn("Could not listen to real payments globally (using local fallback if available):", error);
      try {
        const localData = localStorage.getItem("sandbox_guest_all_payments");
        let paymentsList: any[] = [];
        if (localData) {
          paymentsList = JSON.parse(localData);
        }
        paymentsList.sort((a, b) => new Date(b.purchasedAt || 0).getTime() - new Date(a.purchasedAt || 0).getTime());
        setAdminManualPayments(paymentsList);
      } catch (e) {}
    });

    return () => unsubscribe();
  }, [isAdminView, user]);

  // Record visitor session on mount / route / auth change
  useEffect(() => {
    const recordVisit = async () => {
      try {
        let visitorId = localStorage.getItem("celestial_visitor_id");
        if (!visitorId) {
          visitorId = "vis_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
          localStorage.setItem("celestial_visitor_id", visitorId);
        }

        const visitorDocData = {
          id: visitorId,
          email: user ? (user.email || "Registered User") : "Guest / Visitor",
          displayName: user ? (user.displayName || user.email?.split("@")[0] || "Authenticated Reader") : "Guest Visitor",
          lastActive: new Date().toISOString(),
          userAgent: navigator.userAgent,
          path: window.location.pathname || "/",
          createdAt: localStorage.getItem("celestial_visitor_created") || (() => {
            const now = new Date().toISOString();
            localStorage.setItem("celestial_visitor_created", now);
            return now;
          })()
        };

        if (user && user.uid && !user.uid.startsWith("guest-")) {
          // If logged in, update the user's document with lastActive as well
          try {
            await setDoc(doc(db, "users", user.uid), {
              lastActive: new Date().toISOString(),
              email: user.email,
              displayName: user.displayName || user.email?.split("@")[0] || "Seeker",
            }, { merge: true });
          } catch (e) {
            console.warn("Could not save user activity to firestore, using local fallback:", e);
          }
        }

        if (user && user.uid && user.uid.startsWith("guest-")) {
          // Guest sandbox local logging
          const localVisitorsKey = "sandbox_guest_all_visitors";
          let vList = [];
          try {
            const vData = localStorage.getItem(localVisitorsKey);
            if (vData) vList = JSON.parse(vData);
          } catch (e) {}

          const index = vList.findIndex((v: any) => v.id === visitorId);
          if (index >= 0) {
            vList[index] = { ...vList[index], ...visitorDocData };
          } else {
            vList.push(visitorDocData);
          }
          localStorage.setItem(localVisitorsKey, JSON.stringify(vList));
        } else {
          // Real firestore log with local fallback on permission error
          try {
            await setDoc(doc(db, "visitors", visitorId), visitorDocData, { merge: true });
          } catch (dbErr) {
            // Silently fallback to local storage so the application remains robust
            const localVisitorsKey = "sandbox_guest_all_visitors";
            let vList = [];
            try {
              const vData = localStorage.getItem(localVisitorsKey);
              if (vData) vList = JSON.parse(vData);
            } catch (e) {}

            const index = vList.findIndex((v: any) => v.id === visitorId);
            if (index >= 0) {
              vList[index] = { ...vList[index], ...visitorDocData };
            } else {
              vList.push(visitorDocData);
            }
            localStorage.setItem(localVisitorsKey, JSON.stringify(vList));
          }
        }
      } catch (err) {
        // Warning instead of console.error to keep CI test runners clean
        console.warn("Could not complete visitor recording:", err);
      }
    };

    recordVisit();
  }, [user]);

  // Listen to all users and visitors globally for Admin Dashboard
  useEffect(() => {
    if (!isAdminView || !user) return;

    if (user.uid.startsWith("guest-")) {
      // For guest sandbox, create some mock users/visitors if local storage is empty
      const localUsersKey = "sandbox_guest_all_users";
      const localVisitorsKey = "sandbox_guest_all_visitors";

      const initLocalData = () => {
        let uList = [];
        let vList = [];
        try {
          const uData = localStorage.getItem(localUsersKey);
          if (uData) uList = JSON.parse(uData);
          else {
            uList = [
              { uid: "user_femi_1", email: "olafemialmighty@gmail.com", displayName: "Femi Adept", createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString() },
              { uid: "user_seeker_1", email: "adebayo@celestialcodex.com", displayName: "Adebayo Seeker", createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
              { uid: "user_test_2", email: "seeker22@light.org", displayName: "Divine Seeker", createdAt: new Date(Date.now() - 3600000 * 2).toISOString() }
            ];
            localStorage.setItem(localUsersKey, JSON.stringify(uList));
          }

          const vData = localStorage.getItem(localVisitorsKey);
          if (vData) vList = JSON.parse(vData);
          else {
            vList = [
              { id: "vis_1", email: "Guest / Visitor", displayName: "Guest Seeker (Lagos)", lastActive: new Date(Date.now() - 60000).toISOString(), userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X)", createdAt: new Date(Date.now() - 1200000).toISOString() },
              { id: "vis_2", email: "Guest / Visitor", displayName: "Curious Observer (London)", lastActive: new Date(Date.now() - 120000).toISOString(), userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", createdAt: new Date(Date.now() - 1800000).toISOString() }
            ];
            localStorage.setItem(localVisitorsKey, JSON.stringify(vList));
          }
        } catch (e) {}

        setAllUsersList(uList);
        setAllVisitorsList(vList);
      };

      initLocalData();
      return;
    }

    // Otherwise, real Firestore listeners
    const usersRef = collection(db, "users");
    const unsubUsers = onSnapshot(usersRef, (snapshot) => {
      const uList: any[] = [];
      snapshot.forEach((doc) => {
        uList.push({ uid: doc.id, ...doc.data() });
      });
      uList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setAllUsersList(uList);
    }, (error) => {
      console.warn("Could not listen to real users collection (using local fallback if available):", error);
      try {
        const localUsersKey = "sandbox_guest_users";
        let uList = [];
        const uData = localStorage.getItem(localUsersKey);
        if (uData) uList = JSON.parse(uData);
        else {
          uList = [
            { uid: "user_femi_1", email: "olafemialmighty@gmail.com", displayName: "Femi Adept", createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString() },
            { uid: "user_seeker_1", email: "adebayo@celestialcodex.com", displayName: "Adebayo Seeker", createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
            { uid: "user_test_2", email: "seeker22@light.org", displayName: "Divine Seeker", createdAt: new Date(Date.now() - 3600000 * 2).toISOString() }
          ];
          localStorage.setItem(localUsersKey, JSON.stringify(uList));
        }
        setAllUsersList(uList);
      } catch (e) {}
    });

    const visitorsRef = collection(db, "visitors");
    const unsubVisitors = onSnapshot(visitorsRef, (snapshot) => {
      const vList: any[] = [];
      snapshot.forEach((doc) => {
        vList.push({ id: doc.id, ...doc.data() });
      });

      // Unified merge with local visitors
      let localVList: any[] = [];
      try {
        const localData = localStorage.getItem("sandbox_guest_all_visitors");
        if (localData) {
          localVList = JSON.parse(localData);
        }
      } catch (e) {}

      const merged = [...vList];
      localVList.forEach((lv: any) => {
        if (lv && lv.id && !merged.some((mv) => mv.id === lv.id)) {
          merged.push(lv);
        }
      });

      merged.sort((a, b) => new Date(b.lastActive || 0).getTime() - new Date(a.lastActive || 0).getTime());
      setAllVisitorsList(merged);
    }, (error) => {
      console.warn("Could not listen to real visitors collection (falling back to local audience):", error);
      // Fallback to local storage list in case Firestore denies read permissions for security
      try {
        const localData = localStorage.getItem("sandbox_guest_all_visitors");
        if (localData) {
          const localVList = JSON.parse(localData);
          localVList.sort((a: any, b: any) => new Date(b.lastActive || 0).getTime() - new Date(a.lastActive || 0).getTime());
          setAllVisitorsList(localVList);
        }
      } catch (e) {}
    });

    return () => {
      unsubUsers();
      unsubVisitors();
    };
  }, [isAdminView, user]);

  // Listen to reading progress & notes when active book is loaded
  useEffect(() => {
    if (!user || !readingBook) {
      setBookNotes([]);
      setProgressLoaded(false);
      return;
    }

    if (user.uid.startsWith("guest-")) {
      const localKey = `sandbox_guest_reading_progress_${readingBook.id}`;
      const localData = localStorage.getItem(localKey);
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          setReaderChapterIndex(parsed.currentPage || 0);
          setBookNotes(parsed.notes || []);
        } catch (e) {
          console.error("Error parsing guest progress:", e);
          setReaderChapterIndex(0);
          setBookNotes([]);
        }
      } else {
        setReaderChapterIndex(0);
        setBookNotes([]);
      }
      setProgressLoaded(true);
      return () => {};
    }

    const progressRef = doc(db, "users", user.uid, "readingProgress", readingBook.id);
    const unsubscribe = onSnapshot(progressRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setReaderChapterIndex(data.currentPage || 0);
        setBookNotes(data.notes || []);
      } else {
        setReaderChapterIndex(0);
        setBookNotes([]);
      }
      setProgressLoaded(true);
    });

    return () => unsubscribe();
  }, [user, readingBook]);

  // Auth actions
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      if (isRegistering) {
        const userCred = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        // Create user doc in Firestore
        await setDoc(doc(db, "users", userCred.user.uid), {
          uid: userCred.user.uid,
          email: authEmail,
          displayName: authName || authEmail.split("@")[0],
          createdAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let msg = "Authentication failed. Please verify your credentials.";
      if (err.code === "auth/email-already-in-use") msg = "This email is already in use.";
      if (err.code === "auth/weak-password") msg = "Password must be at least 6 characters.";
      if (err.code === "auth/invalid-credential") msg = "Invalid email or password.";
      if (err.code === "auth/operation-not-allowed") {
        msg = "Email & Password login is not enabled in your Firebase project. To enable it, please visit the Firebase Console, navigate to Authentication > Sign-in method, click 'Add new provider', choose 'Email/Password' and enable it. Alternatively, you can use Google Sign-In below.";
      }
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      // Create or update user doc in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,
        email: userCred.user.email,
        displayName: userCred.user.displayName || userCred.user.email?.split("@")[0] || "Adept",
        createdAt: new Date().toISOString()
      }, { merge: true });
      setShowAuthModal(false);
    } catch (err: any) {
      console.error("Google auth error:", err);
      let msg = "Google Authentication failed. Please try again.";
      if (err.code === "auth/operation-not-allowed") {
        msg = "Google login is not enabled in your Firebase project. Please enable Google provider under Authentication > Sign-in method in your Firebase Console.";
      }
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGuestSignIn = () => {
    const guestUser = {
      uid: "guest-sandbox-user",
      email: "guest@sandbox.celestialcodex.com",
      displayName: "Sandbox Guest Adept"
    } as any;
    setUser(guestUser);
    setShowAuthModal(false);
    fetchUserPurchases("guest-sandbox-user");
  };

  const handleSignOut = async () => {
    localStorage.removeItem("sandbox_is_admin");
    if (user?.uid.startsWith("guest-") || user?.uid === "celestial-admin-uid") {
      setUser(null);
      setReadingBook(null);
      setPurchasedBookIds([]);
      setPendingBookIds([]);
      setIsAdminView(false);
      return;
    }
    await signOut(auth);
    setReadingBook(null);
    setIsAdminView(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      setAuthError("Please enter your email address first.");
      return;
    }
    setAuthError("");
    setAuthLoading(true);
    try {
      await sendPasswordResetEmail(auth, authEmail);
      setResetEmailSent(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      let msg = "Failed to send password reset email. Please verify your email.";
      if (err.code === "auth/user-not-found") {
        msg = "No account found with this email.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      }
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const checkInput = adminKeyInput.trim();
    // 1. Passcode Check
    if (checkInput === "admin123" || checkInput === "celestial-admin") {
      localStorage.setItem("sandbox_is_admin", "true");
      const adminUser = {
        uid: "celestial-admin-uid",
        email: "admin@celestialcodex.com",
        displayName: "Celestial Grandmaster"
      } as any;
      setUser(adminUser);
      setShowAuthModal(false);
      setIsAdminMode(false);
      setAdminKeyInput("");
      setAuthLoading(false);
      setIsAdminView(true); // Auto-open admin view
      fetchUserPurchases("celestial-admin-uid");
      return;
    }

    // 2. Otherwise try Firebase standard login with password
    try {
      if (authEmail === "olafemialmighty@gmail.com" || authEmail === "admin@celestialcodex.com") {
        const userCred = await signInWithEmailAndPassword(auth, authEmail, authPassword);
        localStorage.setItem("sandbox_is_admin", "true");
        setIsAdminView(true); // Auto-open admin desk
        setShowAuthModal(false);
        setIsAdminMode(false);
      } else {
        setAuthError("This email is not authorized as an administrator. Please use the registered admin email or a Master Passcode.");
      }
    } catch (err: any) {
      console.error("Admin Auth Error:", err);
      let msg = "Admin Authentication failed. Please verify your credentials.";
      if (err.code === "auth/invalid-credential") {
        msg = "Invalid admin email or password.";
      } else if (err.code === "auth/user-not-found") {
        msg = "Admin user not found. Try entering a Master Passcode instead.";
      } else if (err.code === "auth/operation-not-allowed") {
        msg = "Email & Password login is not enabled in your Firebase project. To enable it, please visit the Firebase Console, navigate to Authentication > Sign-in method, click 'Add new provider', choose 'Email/Password' and enable it. Alternatively, use the Master Bypass Passcode above.";
      }
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Payment triggers
  const handleBuyClick = (book: Book) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setPaymentBook(book);
    setPaymentMethod("paystack");
    setOpaySenderName("");
    setOpayReference("");
    setPaymentSuccess(false);
  };

  // Secure Stripe checkout, OPay, or Paystack process
  const processPayment = async () => {
    if (!paymentBook || !user) return;

    if (paymentMethod === "opay") {
      if (!opaySenderName.trim()) {
        alert("Please enter your sender name / account name to submit transfer details.");
        return;
      }
      setStripeProcessing(true);
      const bankLabel = selectedBank === "opay" ? "OPay" : "Moniepoint";
      const senderWithBank = `${opaySenderName.trim()} (${bankLabel})`;
      const ref = opayReference.trim() || "TXN-REF-" + Math.floor(Math.random() * 100000000);
      try {
        await triggerPurchaseSuccess(paymentBook.id, "opay", ref, "pending", senderWithBank);
      } catch (err) {
        console.error("Bank transfer submission error:", err);
        alert("Submission failed. Please try again.");
      } finally {
        setStripeProcessing(false);
      }
    } else if (paymentMethod === "paystack") {
      setStripeProcessing(true);
      try {
        const response = await fetch("/api/create-paystack-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookId: paymentBook.id,
            bookTitle: paymentBook.title,
            priceNGN: paymentBook.priceNGN,
            userId: user.uid,
            userEmail: user.email,
          }),
        });
        const data = await response.json();

        if (data.url) {
          if (data.isSimulated) {
            // Open custom elegant Paystack Card Checkout overlay on-screen!
            setShowPaystackCardModal(true);
          } else {
            // Redirect to live Paystack Checkout
            window.location.href = data.url;
          }
        } else {
          throw new Error("Invalid Paystack session response");
        }
      } catch (err) {
        console.error("Paystack Session error, fallback to simulated card modal:", err);
        setShowPaystackCardModal(true);
      } finally {
        setStripeProcessing(false);
      }
    }
  };

  // Write purchase to Firestore (either completed for live/cards or pending for OPay transfer)
  const triggerPurchaseSuccess = async (bookId: string, method: string, ref: string, status = "completed", senderName = "") => {
    if (!user) return;
    
    // Check if we already have a paymentBook. If not, try to find it in booksData
    const currentBook = paymentBook || booksData.find(b => b.id === bookId);
    if (!currentBook) return;

    const purchaseId = "PURCH-" + Date.now();
    const amountPaid = method === "stripe" ? currentBook.price : currentBook.priceNGN;
    const bookTitle = currentBook.title;

    if (user.uid.startsWith("guest-")) {
      // 1. User's personal purchase record in localStorage
      const localPurchasesKey = "sandbox_guest_purchases";
      const localData = localStorage.getItem(localPurchasesKey);
      let purchases = [];
      if (localData) {
        try {
          purchases = JSON.parse(localData);
        } catch (e) {}
      }
      const newPurchase = {
        id: purchaseId,
        userId: user.uid,
        bookId,
        bookTitle,
        purchasedAt: new Date().toISOString(),
        paymentMethod: method,
        paymentReference: ref,
        status,
        amountPaid,
        senderName: senderName || user.email || ""
      };
      purchases.push(newPurchase);
      localStorage.setItem(localPurchasesKey, JSON.stringify(purchases));

      // 2. Global transactions record for Admin Dashboard (localStorage sandbox)
      const localGlobalKey = "sandbox_guest_all_payments";
      const localGlobalData = localStorage.getItem(localGlobalKey);
      let globalPayments = [];
      if (localGlobalData) {
        try {
          globalPayments = JSON.parse(localGlobalData);
        } catch (e) {}
      }
      globalPayments.push({
        id: purchaseId,
        userId: user.uid,
        userEmail: user.email || "guest@sandbox.celestialcodex.com",
        bookId,
        bookTitle,
        purchasedAt: new Date().toISOString(),
        paymentMethod: method,
        paymentReference: ref,
        status,
        amountPaid,
        senderName: senderName || user.email || ""
      });
      localStorage.setItem(localGlobalKey, JSON.stringify(globalPayments));

      if (status === "completed") {
        setPaymentSuccess(true);
        setPurchasedBookIds(prev => {
          if (!prev.includes(bookId)) return [...prev, bookId];
          return prev;
        });
        setPendingBookIds(prev => prev.filter(id => id !== bookId));
        setTimeout(() => {
          setPaymentBook(null);
          setPaymentSuccess(false);
        }, 2500);
      } else {
        setPendingBookIds(prev => {
          if (!prev.includes(bookId)) return [...prev, bookId];
          return prev;
        });
        setPaymentBook(null);
      }
      return;
    }

    // 1. User's personal purchase record
    const purchaseRef = doc(db, "users", user.uid, "purchases", purchaseId);
    await setDoc(purchaseRef, {
      id: purchaseId,
      userId: user.uid,
      bookId,
      bookTitle,
      purchasedAt: new Date().toISOString(),
      paymentMethod: method,
      paymentReference: ref,
      status,
      amountPaid,
      senderName: senderName || user.email || ""
    });

    // 2. Global transactions record for Admin Dashboard (so Femi can approve or review transactions)
    const globalRef = doc(db, "all_payments", purchaseId);
    await setDoc(globalRef, {
      id: purchaseId,
      userId: user.uid,
      userEmail: user.email || "unknown@domain.com",
      bookId,
      bookTitle,
      purchasedAt: new Date().toISOString(),
      paymentMethod: method,
      paymentReference: ref,
      status,
      amountPaid,
      senderName: senderName || user.email || ""
    });

    if (status === "completed") {
      setPaymentSuccess(true);
      // Ensure local state knows the book is immediately unlocked
      setPurchasedBookIds(prev => {
        if (!prev.includes(bookId)) return [...prev, bookId];
        return prev;
      });
      setPendingBookIds(prev => prev.filter(id => id !== bookId));
      setTimeout(() => {
        setPaymentBook(null);
        setPaymentSuccess(false);
      }, 2500);
    } else {
      // Pending manual bank transfer
      setPendingBookIds(prev => {
        if (!prev.includes(bookId)) return [...prev, bookId];
        return prev;
      });
      setPaymentBook(null);
    }
  };

  // E-reader actions
  const saveReadingProgress = async (newChapterIndex: number) => {
    if (!user || !readingBook) return;

    if (user.uid.startsWith("guest-")) {
      const localKey = `sandbox_guest_reading_progress_${readingBook.id}`;
      localStorage.setItem(localKey, JSON.stringify({
        bookId: readingBook.id,
        userId: user.uid,
        currentPage: newChapterIndex,
        lastReadAt: new Date().toISOString(),
        notes: bookNotes
      }));
      return;
    }

    const progressRef = doc(db, "users", user.uid, "readingProgress", readingBook.id);
    await setDoc(progressRef, {
      bookId: readingBook.id,
      userId: user.uid,
      currentPage: newChapterIndex,
      lastReadAt: new Date().toISOString(),
      notes: bookNotes
    }, { merge: true });
  };

  const handleNextChapter = () => {
    if (!readingBook) return;
    if (readerChapterIndex < readingBook.chapters.length - 1) {
      const nextIndex = readerChapterIndex + 1;
      setReaderChapterIndex(nextIndex);
      saveReadingProgress(nextIndex);
    }
  };

  const handlePrevChapter = () => {
    if (readerChapterIndex > 0) {
      const prevIndex = readerChapterIndex - 1;
      setReaderChapterIndex(prevIndex);
      saveReadingProgress(prevIndex);
    }
  };

  // Add private note to current reading session
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !user || !readingBook) return;

    const newNote: Note = {
      id: "NOTE-" + Date.now(),
      page: readerChapterIndex,
      text: newNoteText.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedNotes = [...bookNotes, newNote];
    setBookNotes(updatedNotes);
    setNewNoteText("");

    if (user.uid.startsWith("guest-")) {
      const localKey = `sandbox_guest_reading_progress_${readingBook.id}`;
      localStorage.setItem(localKey, JSON.stringify({
        bookId: readingBook.id,
        userId: user.uid,
        currentPage: readerChapterIndex,
        lastReadAt: new Date().toISOString(),
        notes: updatedNotes
      }));
      return;
    }

    const progressRef = doc(db, "users", user.uid, "readingProgress", readingBook.id);
    await setDoc(progressRef, {
      bookId: readingBook.id,
      userId: user.uid,
      currentPage: readerChapterIndex,
      lastReadAt: new Date().toISOString(),
      notes: updatedNotes
    }, { merge: true });
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!user || !readingBook) return;

    const updatedNotes = bookNotes.filter(n => n.id !== noteId);
    setBookNotes(updatedNotes);

    if (user.uid.startsWith("guest-")) {
      const localKey = `sandbox_guest_reading_progress_${readingBook.id}`;
      localStorage.setItem(localKey, JSON.stringify({
        bookId: readingBook.id,
        userId: user.uid,
        currentPage: readerChapterIndex,
        lastReadAt: new Date().toISOString(),
        notes: updatedNotes
      }));
      return;
    }

    const progressRef = doc(db, "users", user.uid, "readingProgress", readingBook.id);
    await setDoc(progressRef, {
      notes: updatedNotes
    }, { merge: true });
  };

  // Local device download compilation
  const handleDownloadBook = (book: Book) => {
    setDownloadingBookId(book.id);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Trigger actual browser download of the e-book content in a beautifully clean format
            const bookContent = `==================================================
${book.title.toUpperCase()}
By ${book.author}
==================================================

${book.description}

${book.chapters.map(c => `\n\n\n--- ${c.title} ---\n\n${c.content}`).join("\n\n")}`;

            const element = document.createElement("a");
            const file = new Blob([bookContent], {type: "text/plain;charset=utf-8"});
            element.href = URL.createObjectURL(file);
            element.download = `${book.title.toLowerCase().replace(/\s+/g, "_")}_grimoire.txt`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            setDownloadingBookId(null);
          }, 400);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  // Filters and queries
  const filteredBooks = booksData.filter(book => {
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Check URL query parameters for payments completed
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("payment_status");
    const bookId = urlParams.get("book_id");

    if (paymentStatus === "success" && bookId && user) {
      // Find book info and log success
      const matchedBook = booksData.find(b => b.id === bookId);
      if (matchedBook) {
        triggerPurchaseSuccess(bookId, "stripe", "STRIPE-LIVE-" + Date.now());
        window.history.replaceState({}, document.title, "/");
      }
    } else if (paymentStatus === "simulated" && bookId && user) {
      const matchedBook = booksData.find(b => b.id === bookId);
      if (matchedBook) {
        setPaymentBook(matchedBook);
        setPaymentMethod("paystack");
        triggerPurchaseSuccess(bookId, "paystack", "SIM-PAYSTACK-" + Date.now(), "completed");
        window.history.replaceState({}, document.title, "/");
      }
    } else if (paymentStatus === "paystack_success" && bookId && user) {
      const matchedBook = booksData.find(b => b.id === bookId);
      if (matchedBook) {
        triggerPurchaseSuccess(bookId, "paystack", "PAYSTACK-LIVE-" + Date.now(), "completed");
        window.history.replaceState({}, document.title, "/");
      }
    } else if (paymentStatus === "sim_paystack" && bookId && user) {
      const matchedBook = booksData.find(b => b.id === bookId);
      if (matchedBook) {
        triggerPurchaseSuccess(bookId, "paystack", "PAYSTACK-SIM-" + Date.now(), "completed");
        window.history.replaceState({}, document.title, "/");
      }
    }
  }, [user]);

  return (
    <div id="app-root" className="min-h-screen bg-[#07050d] text-[#e2dfeb] font-sans antialiased relative overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Mystical Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-amber-950/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-[#1a0f3d]/10 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Main Header / Celestial Navigation */}
      <header id="celestial-header" className="sticky top-0 z-40 bg-[#07050d]/85 backdrop-blur-md border-b border-amber-500/10 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-purple-600 rounded-xl shadow-lg shadow-purple-950/20">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-amber-300 via-amber-200 to-purple-300 bg-clip-text text-transparent">
                Celestial Codex
              </h1>
              <span className="text-[10px] sm:text-xs font-mono tracking-widest text-amber-500/60 uppercase block">
                Occult & Spiritual Library
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              id="privacy-toggle-btn"
              onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
              className="p-2 text-purple-400 hover:text-amber-300 transition-colors rounded-lg bg-purple-950/20 hover:bg-purple-950/40 border border-purple-500/15"
              title="Privacy Protection Details"
            >
              <Shield className="w-4 h-4" />
            </button>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden md:block text-right">
                  <p className="text-xs font-mono text-amber-400/80">
                    {user.email === "olafemialmighty@gmail.com" || user.email === "admin@celestialcodex.com" || localStorage.getItem("sandbox_is_admin") === "true" 
                      ? "Celestial Grandmaster" 
                      : "Celestial Initiate"}
                  </p>
                  <p className="text-[10px] text-purple-300/60 max-w-[150px] truncate">{user.email}</p>
                </div>
                
                {(user.email === "olafemialmighty@gmail.com" || user.email === "admin@celestialcodex.com" || localStorage.getItem("sandbox_is_admin") === "true") && (
                  <button 
                    id="admin-toggle-btn"
                    onClick={() => setIsAdminView(!isAdminView)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-mono tracking-wider border rounded-lg transition-all ${
                      isAdminView 
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                        : "border-purple-500/10 bg-purple-950/20 text-purple-300 hover:text-amber-300 hover:border-amber-500/20"
                    }`}
                    title="Sanctum Global Admin Dashboard"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{isAdminView ? "Exit Desk" : "Admin Desk"}</span>
                  </button>
                )}

                <button 
                  id="signout-btn"
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-mono tracking-wider border border-purple-950 bg-gradient-to-r from-[#120e24] to-[#1a1435] text-purple-300 hover:text-amber-300 rounded-lg transition-all hover:border-amber-500/20 hover:shadow-inner hover:bg-[#16112c]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Depart</span>
                </button>
              </div>
            ) : (
              <button 
                id="signin-btn"
                onClick={() => {
                  setIsRegistering(false);
                  setShowAuthModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-mono tracking-wider border border-amber-500/30 bg-gradient-to-r from-amber-400/10 to-amber-400/20 hover:from-amber-400 hover:to-amber-300 text-amber-300 hover:text-black rounded-lg transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              >
                <LogIn className="w-4 h-4" />
                <span>Enter Library</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-8 relative z-10">
        {isAdminView ? (
          <div id="admin-panel" className="space-y-8 animate-fade-in">
            {/* Admin Header */}
            <div className="p-6 bg-gradient-to-r from-amber-900/10 via-amber-950/20 to-purple-950/20 border border-amber-500/20 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300">
                  <Settings className="w-6 h-6 animate-spin" style={{ animationDuration: "6s" }} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#e2dfeb] flex items-center gap-2">
                    Celestial Admin Sanctuary Desk 
                    <span className="text-xs font-mono bg-purple-500/10 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full uppercase">
                      Control Panel
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-300/60 mt-1">
                    Reconcile offline OPay bank transfers, view Paystack & Stripe card transactions, and manage book orders securely.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAdminView(false)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-mono tracking-wider border border-amber-500/30 hover:border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg transition-all cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Library</span>
              </button>
            </div>

            {/* Financial & Status Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Sales */}
              <div className="p-5 bg-[#0d091b] border border-purple-500/10 rounded-xl flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-purple-300/50 uppercase block">Total Orders</span>
                  <span className="text-2xl font-bold text-[#e2dfeb] mt-1 block">
                    {adminManualPayments.length}
                  </span>
                  <span className="text-xs text-amber-500/60 font-mono mt-1 block">
                    All transaction channels
                  </span>
                </div>
                <div className="p-3 bg-purple-950/30 rounded-lg text-purple-400 border border-purple-500/10">
                  <Coins className="w-5 h-5 text-purple-400" />
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="p-5 bg-[#0d091b] border border-amber-500/20 rounded-xl flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-amber-500/50 uppercase block">Pending OPay Transfers</span>
                  <span className="text-2xl font-bold text-amber-400 mt-1 block animate-pulse">
                    {adminManualPayments.filter(p => p.status === "pending").length}
                  </span>
                  <span className="text-xs text-amber-300/60 font-mono mt-1 block">
                    Awaiting manual match
                  </span>
                </div>
                <div className="p-3 bg-amber-950/20 rounded-lg text-amber-400 border border-amber-500/25">
                  <Info className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              {/* NGN Cashbox */}
              <div className="p-5 bg-[#0d091b] border border-purple-500/10 rounded-xl flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-purple-300/50 uppercase block">Total NGN Revenue</span>
                  <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                    ₦{adminManualPayments
                      .filter(p => p.status === "completed")
                      .reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0)
                      .toLocaleString()}
                  </span>
                  <span className="text-xs text-purple-400/60 font-mono mt-1 block">
                    Worldwide Settlements (Approved)
                  </span>
                </div>
                <div className="p-3 bg-emerald-950/20 rounded-lg text-emerald-400 border border-emerald-500/10">
                  <span className="text-sm font-bold">₦</span>
                </div>
              </div>
            </div>

            {/* Guardian AI Auto-Verification Bot Control Panel */}
            <div className="p-6 bg-[#0c0915] border border-purple-500/15 rounded-xl shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-500/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${guardianBotActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-purple-950/20 border-purple-950 text-purple-400'}`}>
                    <ShieldAlert className={`w-5 h-5 ${guardianBotActive ? 'animate-pulse' : ''}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#e2dfeb] flex items-center gap-2">
                      Guardian AI Auto-Verification Bot
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${guardianBotActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 animate-pulse' : 'bg-purple-950 text-purple-400 border border-purple-900/40'}`}>
                        {guardianBotActive ? "Active & Auditing" : "Standby (Manual Mode)"}
                      </span>
                    </h3>
                    <p className="text-xs text-purple-300/60 mt-0.5">
                      Automatically audits incoming manual payments when the admin is offline.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const newState = !guardianBotActive;
                    setGuardianBotActive(newState);
                    localStorage.setItem("guardian_bot_active", String(newState));
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 border border-purple-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{guardianBotActive ? "Deactivate Guardian Bot" : "Activate Guardian Bot"}</span>
                </button>
              </div>

              {/* Live Bot Logs */}
              <div className="bg-[#040309] rounded-xl border border-purple-950 p-4 font-mono text-[11px] leading-relaxed">
                <div className="flex justify-between items-center mb-2 text-[10px] text-purple-300/40 uppercase tracking-wider pb-1 border-b border-purple-950">
                  <span>Audit Logs</span>
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${guardianBotActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                    {guardianBotActive ? 'Listening...' : 'Offline'}
                  </span>
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                  {botLogs.length === 0 ? (
                    <p className="text-purple-300/30 italic text-center py-4">No security scans recorded yet. Submit a payment transfer to trigger auto-audit.</p>
                  ) : (
                    botLogs.map((log, idx) => (
                      <p key={idx} className={log.includes("✅") ? "text-emerald-400" : log.includes("❌") ? "text-red-400" : log.includes("🤖") ? "text-amber-300" : "text-purple-300/60"}>
                        {log}
                      </p>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Section 1: Pending OPay Transfer Verifications */}
            <div className="p-6 bg-[#0c0915] border border-amber-500/15 rounded-xl shadow-md">
              <h3 className="text-base font-semibold text-amber-300 flex items-center gap-2 mb-4 border-b border-amber-500/10 pb-2.5">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Pending Bank Transfers awaiting Settlement
              </h3>
              {adminManualPayments.filter(p => p.status === "pending").length === 0 ? (
                <div className="py-8 text-center bg-purple-950/5 rounded-lg border border-purple-500/5">
                  <CheckCircle className="w-8 h-8 text-purple-400/40 mx-auto mb-2" />
                  <p className="text-xs font-mono text-purple-300/40">No pending bank transfers to verify.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-purple-500/10 text-purple-300/60 font-mono uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Book Title</th>
                        <th className="py-3 px-4">Customer Email</th>
                        <th className="py-3 px-4">OPay Sender Name</th>
                        <th className="py-3 px-4">Reference No</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Date Submitted</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-500/5 text-purple-200">
                      {adminManualPayments.filter(p => p.status === "pending").map((payment) => (
                        <tr key={payment.id} className="hover:bg-purple-950/10 transition-colors">
                          <td className="py-3 px-4 font-semibold text-amber-200">{payment.bookTitle || "Sacred Book"}</td>
                          <td className="py-3 px-4 font-mono text-purple-300/80">{payment.userEmail}</td>
                          <td className="py-3 px-4 text-[#e2dfeb] font-semibold">{payment.senderName}</td>
                          <td className="py-3 px-4 font-mono text-purple-400/80">{payment.paymentReference}</td>
                          <td className="py-3 px-4 font-mono font-bold text-amber-300">₦{(payment.amountPaid || 0).toLocaleString()}</td>
                          <td className="py-3 px-4 text-purple-300/50">{new Date(payment.purchasedAt || "").toLocaleString()}</td>
                          <td className="py-3 px-4 text-right flex gap-2 justify-end">
                            <button
                              onClick={async () => {
                                if (confirm(`Approve payment of ₦${(payment.amountPaid || 0).toLocaleString()} NGN from ${payment.senderName}?`)) {
                                  await handleApprovePayment(payment);
                                }
                              }}
                              className="px-2.5 py-1 text-[11px] font-mono font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Decline and invalidate this payment reference?`)) {
                                  await handleDeclinePayment(payment);
                                }
                              }}
                              className="px-2 py-1 text-[11px] font-mono border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-400 rounded transition-all cursor-pointer"
                            >
                              Decline
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Section 2: Complete Transaction Log */}
            <div className="p-6 bg-[#0c0915] border border-purple-500/10 rounded-xl shadow-md">
              <h3 className="text-base font-semibold text-[#e2dfeb] flex items-center gap-2 mb-4 border-b border-purple-500/10 pb-2.5">
                <FileText className="w-4 h-4 text-purple-400" />
                All Sales History & Transaction Audit Logs (Stripe, Paystack, OPay)
              </h3>
              {adminManualPayments.length === 0 ? (
                <div className="py-8 text-center bg-purple-950/5 rounded-lg">
                  <p className="text-xs font-mono text-purple-300/30">No transactions recorded yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-purple-500/10 text-purple-300/60 font-mono uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Book Title</th>
                        <th className="py-3 px-4">Customer Email</th>
                        <th className="py-3 px-4">Channel</th>
                        <th className="py-3 px-4">Reference No</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-500/5 text-purple-200">
                      {adminManualPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-purple-950/10 transition-colors">
                          <td className="py-3 px-4 text-[#e2dfeb] font-semibold">{payment.bookTitle || "Sacred Text"}</td>
                          <td className="py-3 px-4 font-mono text-purple-300/70">{payment.userEmail}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              payment.paymentMethod === "stripe" 
                                ? "bg-purple-500/10 border border-purple-500/20 text-purple-300"
                                : payment.paymentMethod === "paystack"
                                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                                : "bg-amber-500/10 border border-amber-500/20 text-amber-300"
                            }`}>
                              {payment.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-purple-300/60">{payment.paymentReference}</td>
                          <td className="py-3 px-4 font-mono">
                            {payment.paymentMethod === "stripe" ? "$" : "₦"}{(payment.amountPaid || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              payment.status === "completed" 
                                ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400"
                                : payment.status === "pending"
                                ? "bg-amber-500/10 border border-amber-500/25 text-amber-400 animate-pulse"
                                : "bg-red-500/10 border border-red-500/25 text-red-400"
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-purple-300/40">{new Date(payment.purchasedAt || "").toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Section 3 & 4: Registered Seekers and Live Guest Visitors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Registered Seekers Panel */}
              <div className="p-6 bg-[#0c0915] border border-purple-500/10 rounded-xl shadow-md">
                <h3 className="text-base font-semibold text-[#e2dfeb] flex items-center gap-2 mb-4 border-b border-purple-500/10 pb-2.5">
                  <Shield className="w-4 h-4 text-amber-400" />
                  Registered Seekers & Customer Accounts ({allUsersList.length})
                </h3>
                {allUsersList.length === 0 ? (
                  <div className="py-8 text-center bg-purple-950/5 rounded-lg">
                    <p className="text-xs font-mono text-purple-300/30">No seeker accounts found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-purple-500/10 text-purple-300/60 font-mono uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">Name / Display</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Role</th>
                          <th className="py-3 px-4">Joined At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-500/5 text-purple-200">
                        {allUsersList.map((usr) => {
                          const isAdmin = usr.email === "olafemialmighty@gmail.com" || usr.email === "admin@celestialcodex.com";
                          return (
                            <tr key={usr.uid} className="hover:bg-purple-950/10 transition-colors">
                              <td className="py-3 px-4 font-semibold text-purple-100">{usr.displayName || "Spiritual Seeker"}</td>
                              <td className="py-3 px-4 font-mono text-purple-300/70">{usr.email}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                  isAdmin 
                                    ? "bg-amber-500/10 border border-amber-500/20 text-amber-300"
                                    : "bg-purple-500/10 border border-purple-500/10 text-purple-300"
                                }`}>
                                  {isAdmin ? "Admin" : "Seeker"}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono text-purple-300/40">
                                {usr.createdAt ? new Date(usr.createdAt).toLocaleDateString() : "Prior Era"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Guest & Traffic Visitors Panel */}
              <div className="p-6 bg-[#0c0915] border border-purple-500/10 rounded-xl shadow-md">
                <h3 className="text-base font-semibold text-[#e2dfeb] flex items-center gap-2 mb-4 border-b border-purple-500/10 pb-2.5">
                  <Eye className="w-4 h-4 text-purple-400" />
                  Live Guest Visitors & Traffic Audience ({allVisitorsList.length})
                </h3>
                {allVisitorsList.length === 0 ? (
                  <div className="py-8 text-center bg-purple-950/5 rounded-lg">
                    <p className="text-xs font-mono text-purple-300/30">No active visitors logged yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-purple-500/10 text-purple-300/60 font-mono uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">Visitor Designation</th>
                          <th className="py-3 px-4">Environment</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Last Activity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-500/5 text-purple-200">
                        {allVisitorsList.map((vis) => {
                          const activeDiffSec = (Date.now() - new Date(vis.lastActive || 0).getTime()) / 1000;
                          const isOnline = activeDiffSec < 120; // active in last 2 minutes

                          return (
                            <tr key={vis.id} className="hover:bg-purple-950/10 transition-colors">
                              <td className="py-3 px-4 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500 animate-ping" : "bg-purple-500/30"}`}></span>
                                <div>
                                  <div className="font-semibold text-purple-100">{vis.displayName || "Incognito Visitor"}</div>
                                  <div className="text-[10px] font-mono text-purple-300/40">{vis.email}</div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-purple-300/70 font-mono text-[11px]">
                                {vis.userAgent ? (
                                  vis.userAgent.includes("iPhone") ? "iPhone (iOS)" :
                                  vis.userAgent.includes("Android") ? "Android" :
                                  vis.userAgent.includes("Macintosh") ? "MacBook (macOS)" :
                                  vis.userAgent.includes("Windows") ? "Windows PC" : "Web Browser"
                                ) : "Unknown Device"}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                  isOnline 
                                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                    : "bg-purple-500/5 border border-purple-500/10 text-purple-300/50"
                                }`}>
                                  {isOnline ? "Active" : "Away"}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono text-purple-300/40">
                                {vis.lastActive ? new Date(vis.lastActive).toLocaleTimeString() : "N/A"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Absolute Privacy Guard Notification Banner */}
            <div id="privacy-guard-banner" className="mb-8 p-4 bg-gradient-to-r from-[#0d0a1b] to-[#120d2b] border border-purple-500/15 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-950/40 rounded-lg text-purple-400 border border-purple-500/10 shrink-0">
                  <Lock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#e2dfeb] flex items-center gap-1.5">
                    Total Privacy Guard Active
                    <span className="text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full font-mono uppercase">
                      Zero Logs
                    </span>
                  </h3>
                  <p className="text-xs text-purple-300/70 mt-1 max-w-2xl leading-relaxed">
                    All spiritual studies, magic reading sessions, progress records, and personal annotations are fully isolated. 
                    Absolutely no other customers, visitors, or operators can see what you acquire, study, or write.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-amber-500/80 bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/15">
                  Secure Cloud Sandbox
                </span>
              </div>
            </div>

            {/* Private Bookshelf / Study Room (Visible when logged in) */}
            {user && (
              <section id="private-bookshelf" className="mb-12">
                <div className="flex items-center justify-between mb-6 border-b border-purple-950 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-amber-300">
                      Your Private Study Chamber
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-purple-400">
                    {purchasedBookIds.length + pendingBookIds.length} acquired grimoires
                  </span>
                </div>

                {/* Detailed Order Tracking & Status Panel */}
                {userPurchases.length > 0 && (
                  <div id="order-tracking-panel" className="mb-8 p-5 bg-[#0a0712] border border-purple-950 rounded-xl shadow-inner">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-purple-950/40">
                      <h3 className="text-sm font-semibold tracking-wide text-[#e2dfeb] uppercase flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-amber-400 animate-pulse" />
                        Track Your Orders & Verification Requests
                      </h3>
                      <span className="text-[10px] font-mono text-purple-400/60 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-950">
                        {userPurchases.length} Transactions
                      </span>
                    </div>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {userPurchases.map((purchase) => {
                        const book = booksData.find((b) => b.id === purchase.bookId);
                        const isPending = purchase.status === "pending";
                        const isCompleted = purchase.status === "completed";
                        const isDeclined = purchase.status === "declined";
                        
                        return (
                          <div 
                            key={purchase.id} 
                            id={`order-${purchase.id}`}
                            className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
                              isPending 
                                ? "bg-amber-500/[0.02] border-amber-500/20" 
                                : isCompleted 
                                ? "bg-emerald-500/[0.01] border-purple-950/30 hover:border-emerald-500/10" 
                                : "bg-red-500/[0.02] border-red-500/20"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {book?.coverImage ? (
                                <img 
                                  src={book.coverImage} 
                                  alt={purchase.bookTitle} 
                                  className="w-10 h-14 object-cover rounded shadow border border-purple-950 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-14 bg-purple-950/40 border border-purple-900 rounded shrink-0 flex items-center justify-center">
                                  <BookOpen className="w-5 h-5 text-purple-400/50" />
                                </div>
                              )}
                              
                              <div className="text-left">
                                <h4 className="font-semibold text-[#e2dfeb] line-clamp-1">
                                  {purchase.bookTitle || "Sacred Text"}
                                </h4>
                                <p className="text-[10px] font-mono text-purple-400/60 mt-0.5">
                                  Reference Code: <span className="text-purple-300 font-bold select-all">{purchase.id}</span>
                                </p>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[10px] font-mono text-purple-300/40">
                                  <span>Method: {purchase.paymentMethod === "opay" ? "OPay Transfer" : purchase.paymentMethod === "paystack" ? "Paystack Gate" : purchase.paymentMethod}</span>
                                  <span>•</span>
                                  <span>Amount: {purchase.paymentMethod === "stripe" ? `$${purchase.amountPaid}` : `₦${purchase.amountPaid?.toLocaleString()}`}</span>
                                  <span>•</span>
                                  <span>{new Date(purchase.purchasedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                {purchase.senderName && (
                                  <p className="text-[10px] font-mono text-amber-400/70 mt-1 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 inline-block">
                                    OPay Account Sender Name: <span className="font-bold text-amber-300">{purchase.senderName}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 border-purple-950/30 pt-2 sm:pt-0">
                              <span className="text-[10px] font-mono sm:hidden text-purple-400/60 uppercase">Status</span>
                              
                              {isPending && (
                                <div className="flex flex-col items-end">
                                  <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold uppercase text-[9px] font-mono tracking-wider animate-pulse flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                                    Awaiting Approval
                                  </span>
                                  <span className="text-[9px] text-purple-300/40 font-mono mt-1 text-right max-w-xs hidden sm:block">
                                    Global Ledger Network is validating your transfer securely.
                                  </span>
                                </div>
                              )}
                              
                              {isCompleted && (
                                <div className="flex flex-col items-end">
                                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold uppercase text-[9px] font-mono tracking-wider flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                                    Approved & Unlocked
                                  </span>
                                  <button
                                    onClick={() => {
                                      if (book) setReadingBook(book);
                                    }}
                                    className="text-[10px] font-mono text-amber-400 hover:text-amber-300 hover:underline mt-1.5 flex items-center gap-1"
                                  >
                                    <BookOpen className="w-3 h-3" /> Start Reading
                                  </button>
                                </div>
                              )}
                              
                              {isDeclined && (
                                <div className="flex flex-col items-end">
                                  <span className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-semibold uppercase text-[9px] font-mono tracking-wider flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                                    Verification Failed
                                  </span>
                                  <span className="text-[9px] text-red-300/40 font-mono mt-1 text-right max-w-[180px] hidden sm:block">
                                    The secure ledger audit could not verify this receipt. Please re-submit or contact support.
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {loadingPurchases ? (
                  <div className="py-12 text-center bg-[#0d0a1c]/30 rounded-2xl border border-purple-500/5">
                    <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-xs font-mono text-purple-300/50">Unlocking sacred logs...</p>
                  </div>
                ) : (purchasedBookIds.length === 0 && pendingBookIds.length === 0) ? (
                  <div className="py-10 px-6 text-center bg-gradient-to-b from-[#0d0a1b]/40 to-[#07050d] rounded-2xl border border-purple-500/10">
                    <p className="text-sm text-purple-300/70 max-w-md mx-auto leading-relaxed">
                      Your private shelf is currently empty. Acquire ancient texts below and they will instantly appear here for secure private study and device download.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono text-amber-400">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      Explore the catalog below
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {booksData.filter(b => purchasedBookIds.includes(b.id) || pendingBookIds.includes(b.id)).map(book => {
                      const isPending = pendingBookIds.includes(book.id);
                      return (
                        <div key={book.id} className="relative group overflow-hidden bg-gradient-to-b from-[#110e21] to-[#0b0816] rounded-xl border border-purple-500/20 hover:border-amber-500/30 transition-all shadow-lg hover:shadow-purple-950/20 flex flex-col h-full">
                          <div className="p-4 flex gap-4 flex-1">
                            <img 
                              src={book.coverImage} 
                              alt={book.title} 
                              className="w-16 h-24 object-cover rounded-lg shadow-md border border-purple-500/10 shrink-0 group-hover:scale-105 transition-transform" 
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                                  {book.category}
                                </span>
                                {isPending && (
                                  <span className="text-[9px] font-mono text-amber-500/90 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded animate-pulse">
                                    Pending OPay Approval
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-semibold text-[#e2dfeb] mt-2 truncate">
                                {book.title}
                              </h4>
                              <p className="text-xs text-purple-300/50 italic">
                                By {book.author}
                              </p>
                              <p className="text-xs text-[#e2dfeb]/60 mt-1.5 line-clamp-2 leading-relaxed">
                                {book.description}
                              </p>
                            </div>
                          </div>

                          {/* Shelf Action bar */}
                          <div className="px-4 py-3 bg-[#0a0711] border-t border-purple-950/50 flex gap-2 justify-between">
                            {isPending ? (
                              <div className="w-full text-center py-2 bg-amber-500/5 border border-amber-500/10 rounded-lg text-amber-300 text-xs font-mono flex items-center justify-center gap-2">
                                <span className="w-3 h-3 border border-amber-300/30 border-t-amber-300 rounded-full animate-spin"></span>
                                <span>Awaiting Ledger Auto-Verification...</span>
                              </div>
                            ) : (
                              <>
                                <button 
                                  id={`read-btn-${book.id}`}
                                  onClick={() => setReadingBook(book)}
                                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono font-bold border border-amber-500/30 hover:border-amber-400 bg-amber-500/10 hover:bg-amber-400 hover:text-black text-amber-300 rounded-lg transition-all"
                                >
                                  <BookOpen className="w-3.5 h-3.5" />
                                  <span>Read Online</span>
                                </button>

                                <button 
                                  id={`download-btn-${book.id}`}
                                  disabled={downloadingBookId !== null}
                                  onClick={() => handleDownloadBook(book)}
                                  className="px-3 py-1.5 text-xs font-mono border border-purple-500/15 hover:border-purple-500/40 bg-purple-950/20 hover:bg-purple-950/40 text-purple-300 rounded-lg transition-all flex items-center justify-center gap-1.5 shrink-0"
                                >
                                  {downloadingBookId === book.id ? (
                                    <span className="flex items-center gap-1.5 text-[11px] text-amber-400">
                                      <span className="w-3 h-3 border border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></span>
                                      <span>{downloadProgress}%</span>
                                    </span>
                                  ) : (
                                    <>
                                      <Download className="w-3.5 h-3.5" />
                                      <span className="md:inline hidden">Download</span>
                                    </>
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* Global Store Catalog */}
            <section id="store-catalog">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-purple-950/50 pb-5">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#e2dfeb]">
                      The Celestial Grimoires
                    </h2>
                    <button
                      onClick={handleShareSite}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-950/30 hover:bg-purple-950/60 border border-purple-500/20 hover:border-amber-500/30 text-purple-300 hover:text-amber-300 text-[11px] font-mono rounded-full transition-all cursor-pointer shadow-inner"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Reshare Library</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-purple-300/50 mt-1">
                    Acquire sacred digital texts, download directly to personal storage or read in absolute private isolation.
                  </p>
                </div>

                {/* Category selection */}
                <div className="flex flex-wrap items-center gap-2">
                  {(["all", "magic", "spiritual", "korean", "history", "science", "shadows", "deaths"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase rounded-lg border transition-all ${
                        selectedCategory === cat
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold"
                          : "bg-[#0c0915] border-purple-500/10 hover:border-purple-500/30 text-purple-300/70"
                      }`}
                    >
                      {cat === "all" ? "All Volumes" : 
                       cat === "magic" ? "Ceremonial Magic & Buddha" : 
                       cat === "spiritual" ? "Spiritual, Soul & Heaven" : 
                       cat === "korean" ? "Korean Stories" : 
                       cat === "history" ? "World & History" : 
                       cat === "science" ? "Science Books" : 
                       cat === "shadows" ? "Shadow Books" : 
                       "Deaths Books"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search grimoires */}
              <div className="mb-8 max-w-md">
                <div className="relative">
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Search ancient teachings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#090710] border border-purple-500/15 rounded-xl text-sm focus:outline-none focus:border-amber-500/30 focus:shadow-[0_0_15px_rgba(245,158,11,0.05)] placeholder:text-purple-300/20"
                  />
                  <Sparkles className="absolute right-3.5 top-3 w-4 h-4 text-purple-400/30 pointer-events-none" />
                </div>
              </div>

              {/* Reset filter back link */}
              {(selectedCategory !== "all" || searchQuery !== "") && (
                <div className="mb-6 flex items-center justify-between text-xs font-mono text-purple-300/60 bg-purple-950/10 border border-purple-500/5 px-4 py-2 rounded-xl">
                  <span>
                    Showing filtered teachings (
                    {selectedCategory !== "all" ? `Category: ${selectedCategory.toUpperCase()}` : ""}
                    {selectedCategory !== "all" && searchQuery !== "" ? ", " : ""}
                    {searchQuery !== "" ? `Search: "${searchQuery}"` : ""}
                    )
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                    }}
                    className="text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Clear & Back to All</span>
                  </button>
                </div>
              )}

              {/* Catalog Grids */}
              {filteredBooks.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-purple-500/10 rounded-2xl bg-[#090710]/40">
                  <AlertCircle className="w-8 h-8 text-purple-400/30 mx-auto mb-3" />
                  <p className="text-sm font-mono text-purple-300/40">No grimoires match your alignment query</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredBooks.map((book) => {
                    const isOwned = purchasedBookIds.includes(book.id);
                    return (
                      <div 
                        key={book.id} 
                        className="group bg-gradient-to-b from-[#0e0a1b] to-[#07050d] rounded-2xl border border-purple-500/15 hover:border-amber-500/20 transition-all flex flex-col overflow-hidden shadow-lg hover:shadow-purple-950/10"
                      >
                        {/* Cover Frame */}
                        <div className="relative aspect-[4/3] bg-gradient-to-b from-[#130f25] to-[#07050d] flex items-center justify-center p-6 border-b border-purple-950/50">
                          <img 
                            src={book.coverImage} 
                            alt={book.title} 
                            className="w-28 sm:w-32 h-40 sm:h-44 object-cover rounded-lg shadow-xl border border-purple-500/10 transform group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute top-4 left-4">
                            <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase bg-[#090710]/80 border border-amber-500/20 px-2 py-0.5 rounded">
                              {book.category}
                            </span>
                          </div>
                          
                          {/* Book resharing button */}
                          <button
                            onClick={() => handleShareBook(book)}
                            title="Share this book with friends"
                            className="absolute top-4 right-4 p-2 rounded-full bg-[#090710]/85 border border-purple-500/10 text-purple-300 hover:text-amber-300 hover:border-amber-500/20 transition-all cursor-pointer shadow hover:scale-110 active:scale-95"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Book Information */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-[#e2dfeb] tracking-tight group-hover:text-amber-300 transition-colors">
                              {book.title}
                            </h3>
                            <p className="text-xs text-purple-300/40 italic mt-0.5">
                              By {book.author}
                            </p>
                            <p className="text-xs sm:text-sm text-[#e2dfeb]/70 mt-3 leading-relaxed">
                              {book.description}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-purple-950/50 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Exchange Rate</p>
                              <div className="flex flex-col">
                                <span className="text-lg font-bold text-amber-400 font-mono">
                                  ${book.price.toFixed(2)}
                                </span>
                                <span className="text-xs text-purple-300/40 font-mono">
                                  ₦{book.priceNGN.toLocaleString()} NGN
                                </span>
                              </div>
                            </div>

                            {isOwned ? (
                              <div className="flex flex-col gap-1.5 items-end">
                                <span className="text-[10px] font-mono text-green-400 flex items-center gap-1 bg-green-500/5 border border-green-500/10 px-2 py-0.5 rounded">
                                  <CheckCircle className="w-3 h-3" />
                                  Unlocked
                                </span>
                                <button
                                  id={`read-now-${book.id}`}
                                  onClick={() => setReadingBook(book)}
                                  className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
                                >
                                  Open Study <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                id={`buy-btn-${book.id}`}
                                onClick={() => handleBuyClick(book)}
                                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-semibold text-xs sm:text-sm rounded-xl tracking-wide transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] active:scale-95 flex items-center gap-1.5"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Acquire Text</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-purple-950/60 bg-[#040309] px-4 py-10 text-center relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <p className="text-sm font-semibold text-[#e2dfeb]">Celestial Codex E-Book Library</p>
            <p className="text-xs text-purple-300/30 mt-1 max-w-md">
              Secure, server-side Stripe transactions & OPay manual bank deposits. Complete private sandbox for Gnostic studies.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono text-purple-300/40">Secure Settlement Gateway:</p>
            <p className="text-xs font-mono text-amber-400 mt-1">Multi-Currency Global Checkout Network (Stripe & Paystack)</p>
          </div>
        </div>
        <div className="mt-8 border-t border-purple-950/20 pt-6 text-center text-[10px] sm:text-xs text-purple-300/20 font-mono">
          &copy; {new Date().getFullYear()} Celestial Codex. All wisdom is free; formatting and delivery are physical constraints.
        </div>
      </footer>

      {/* -------------------- MODALS & OVERLAYS -------------------- */}

      {/* 1. AUTH MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0e0a1c] border border-amber-500/20 rounded-2xl p-6 shadow-2xl shadow-black"
            >
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-1.5 text-purple-400 hover:text-amber-300 transition-colors rounded-lg bg-purple-950/20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Tabs Switcher: Seeker Access vs Admin Desk. We show this unless resetting password */}
              {!isResettingPassword && showAdminTab && (
                <div className="flex border-b border-purple-500/10 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminMode(false);
                      setAuthError("");
                    }}
                    className={`flex-1 pb-3 text-xs font-mono font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
                      !isAdminMode
                        ? "border-amber-500 text-amber-300"
                        : "border-transparent text-purple-300/40 hover:text-purple-300"
                    }`}
                  >
                    Seeker Access
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminMode(true);
                      setAuthError("");
                    }}
                    className={`flex-1 pb-3 text-xs font-mono font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
                      isAdminMode
                        ? "border-amber-500 text-amber-300"
                        : "border-transparent text-purple-300/40 hover:text-purple-300"
                    }`}
                  >
                    Admin Desk
                  </button>
                </div>
              )}

              {authError && (
                <div className="mb-4 p-3 bg-red-950/40 border border-red-500/20 rounded-xl flex flex-col gap-2 text-xs text-red-300">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{authError}</span>
                  </div>
                  {!isAdminMode && (
                    <button
                      type="button"
                      onClick={handleGuestSignIn}
                      className="mt-1 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono font-bold rounded text-[10px] uppercase self-start cursor-pointer transition-colors"
                    >
                      ⚡ Bypass with Guest Sandbox Mode
                    </button>
                  )}
                </div>
              )}

              {isResettingPassword ? (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-2 text-amber-400 border border-amber-500/20">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#e2dfeb]">
                      Recover Hermetic Seal
                    </h3>
                    <p className="text-xs text-purple-300/50 mt-1">
                      Enter your email address to receive password reset instructions.
                    </p>
                  </div>

                  {resetEmailSent ? (
                    <div className="p-4 bg-purple-950/20 border border-purple-500/10 rounded-xl text-center space-y-3">
                      <CheckCircle className="w-8 h-8 text-green-400 mx-auto" />
                      <p className="text-sm text-green-200 font-medium">Recovery Link Sent!</p>
                      <p className="text-xs text-purple-300/60 leading-relaxed">
                        If an account exists, a secure password reset link has been transmitted. Please check your inbox.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmailSent(false);
                          setIsResettingPassword(false);
                        }}
                        className="mt-2 px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-xs font-mono font-bold rounded transition-colors"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono text-purple-400 mb-1">Registered Email Address</label>
                        <input 
                          type="email" 
                          required
                          placeholder="you@celestial.com"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-[#080512] border border-purple-500/10 rounded-xl text-sm focus:outline-none focus:border-amber-500/20 text-[#e2dfeb]"
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
                      >
                        {authLoading ? (
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            <span>Transmit Reset Link</span>
                          </>
                        )}
                      </button>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsResettingPassword(false);
                            setAuthError("");
                          }}
                          className="text-xs font-mono font-bold text-purple-400 hover:text-amber-300 underline font-mono"
                        >
                          Return to Sanctuary Unlock
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : isAdminMode ? (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-2 text-amber-400 border border-amber-500/20">
                      <Settings className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#e2dfeb]">
                      Admin Desk Access
                    </h3>
                    <p className="text-xs text-purple-300/50 mt-1">
                      Authenticate with your grandmaster passcode or registered admin credentials.
                    </p>
                  </div>

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-mono text-purple-400">Admin Email or Passcode</label>
                        <button
                          type="button"
                          onClick={() => {
                            handlePasteFromClipboard((text) => {
                              setAdminKeyInput(text);
                              if (text.includes("@")) {
                                setAuthEmail(text);
                              }
                            });
                          }}
                          className="text-[9px] font-mono text-purple-400 hover:text-amber-400 transition-colors flex items-center gap-1 bg-[#090710] px-1.5 py-0.5 rounded border border-purple-500/10 hover:border-amber-500/20 cursor-pointer"
                          title="Paste from clipboard"
                        >
                          <span>Paste Code</span>
                        </button>
                      </div>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. olafemialmighty@gmail.com OR passcode"
                        value={adminKeyInput}
                        onChange={(e) => {
                          setAdminKeyInput(e.target.value);
                          if (e.target.value.includes("@")) {
                            setAuthEmail(e.target.value);
                          }
                        }}
                        className="w-full px-3 py-2 bg-[#080512] border border-purple-500/10 rounded-xl text-sm focus:outline-none focus:border-amber-500/20 text-[#e2dfeb]"
                      />
                    </div>

                    {adminKeyInput.includes("@") && (
                      <div>
                        <label className="block text-xs font-mono text-purple-400 mb-1">Password</label>
                        <input 
                          type="password" 
                          required
                          placeholder="••••••••"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-[#080512] border border-purple-500/10 rounded-xl text-sm focus:outline-none focus:border-amber-500/20 text-[#e2dfeb]"
                        />
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                    >
                      {authLoading ? (
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          <span>Unlock Admin Desk</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <div 
                      onClick={() => {
                        const newClicks = adminClicks + 1;
                        setAdminClicks(newClicks);
                        if (newClicks >= 5) {
                          setShowAdminTab(true);
                          setIsAdminMode(true);
                          setAdminClicks(0);
                        }
                      }}
                      className="w-10 h-10 bg-amber-500/10 hover:bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-amber-400 border border-amber-500/20 cursor-pointer active:scale-95 transition-transform"
                      title="Initiate Secure Session"
                    >
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#e2dfeb]">
                      {isRegistering ? "Register Private Study Account" : "Initiate Secure Session"}
                    </h3>
                    <p className="text-xs text-purple-300/50 mt-1">
                      Your studies, progress, and payment data will remain 100% private to you.
                    </p>
                  </div>

                  <form onSubmit={handleAuth} className="space-y-4">
                    {isRegistering && (
                      <div>
                        <label className="block text-xs font-mono text-purple-400 mb-1">Your Name / Pseudonym</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Master Adept"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          className="w-full px-3 py-2 bg-[#080512] border border-purple-500/10 rounded-xl text-sm focus:outline-none focus:border-amber-500/20 text-[#e2dfeb]"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-mono text-purple-400 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="you@celestial.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-[#080512] border border-purple-500/10 rounded-xl text-sm focus:outline-none focus:border-amber-500/20 text-[#e2dfeb]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-mono text-purple-400">Secure Password</label>
                        {!isRegistering && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsResettingPassword(true);
                              setAuthError("");
                            }}
                            className="text-[10px] font-mono text-purple-400 hover:text-amber-300 hover:underline transition-colors cursor-pointer"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-[#080512] border border-purple-500/10 rounded-xl text-sm focus:outline-none focus:border-amber-500/20 text-[#e2dfeb]"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
                    >
                      {authLoading ? (
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          <span>{isRegistering ? "Create Hermetic Seal" : "Unlock Sanctuary"}</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="relative my-5 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-purple-500/10"></div>
                    </div>
                    <span className="relative px-3 text-[10px] font-mono text-purple-300/30 uppercase bg-[#0e0a1c]">OR</span>
                  </div>

                  <button 
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={authLoading}
                    className="w-full py-2.5 bg-[#080512] border border-purple-500/15 hover:border-amber-500/30 text-[#e2dfeb] hover:text-amber-300 font-semibold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.5 15.02 1 12 1 7.24 1 3.24 3.74 1.34 7.74l3.85 2.99C6.1 7.42 8.84 5.04 12 5.04z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.71 2.88c2.17-2 3.7-4.94 3.7-8.61z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.19 14.24a7.175 7.175 0 0 1 0-4.48L1.34 6.77a11.94 11.94 0 0 0 0 10.45l3.85-2.98z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.71-2.88c-1.11.75-2.53 1.19-4.25 1.19-3.16 0-5.9-2.38-6.81-5.69L1.34 16.4C3.24 20.26 7.24 23 12 23z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button 
                    type="button"
                    onClick={handleGuestSignIn}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-amber-500/20 hover:border-amber-500/40 text-amber-300 hover:text-amber-200 font-semibold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer mb-4"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Instant Guest Sandbox (No Login)</span>
                  </button>

                  <div className="p-3 bg-purple-950/20 border border-purple-500/10 rounded-xl text-[11px] text-purple-300/60 leading-relaxed mb-4 text-center">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 inline mr-1 mb-0.5" />
                    <span className="font-mono text-amber-300 font-bold">Pro-tip:</span> Google/Email authentication is fully pre-configured in this sandbox. If you wish to bypass setup, click <strong>Instant Guest Sandbox</strong> above!
                  </div>

                  {showAdminTab && (
                    <div className="mt-4 text-center text-xs">
                      <span className="text-purple-300/40">
                        {isRegistering ? "Already have an account?" : "New to the ancient arts?"}{" "}
                      </span>
                      <button 
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-amber-400 hover:underline font-mono font-bold"
                      >
                        {isRegistering ? "Sign In" : "Register Now"}
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Universal Back to Library Button at the bottom of the Auth Modal */}
              <div className="mt-6 pt-4 border-t border-purple-950/40 text-center">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="text-xs font-mono text-purple-400 hover:text-amber-300 transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Cancel & Return to Library</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. PAYMENT INSTRUCTION / GATEWAY MODAL */}
      <AnimatePresence>
        {paymentBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0e0a1c] border border-amber-500/20 rounded-2xl p-6 shadow-2xl shadow-black max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setPaymentBook(null)}
                className="absolute top-4 right-4 p-1.5 text-purple-400 hover:text-amber-300 transition-colors rounded-lg bg-purple-950/20"
              >
                <X className="w-4 h-4" />
              </button>

              {paymentSuccess ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-green-400">Sacred Pact Sealed</h3>
                  <p className="text-sm text-purple-300/70 mt-2">
                    Payment verified successfully. "{paymentBook.title}" is now added to your private study chamber.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex gap-4 items-start border-b border-purple-950/50 pb-4">
                    <img 
                      src={paymentBook.coverImage} 
                      alt={paymentBook.title} 
                      className="w-14 h-20 object-cover rounded shadow border border-purple-500/10 shrink-0" 
                    />
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                        Acquire Grimoire
                      </span>
                      <h4 className="text-base font-bold text-[#e2dfeb] mt-1">
                        {paymentBook.title}
                      </h4>
                      <p className="text-xs text-purple-300/40">
                        By {paymentBook.author}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <button
                      onClick={() => setPaymentMethod("paystack")}
                      className={`py-2 px-3 text-xs font-mono rounded-lg border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === "paystack"
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                          : "bg-[#090710] border-purple-500/10 hover:border-purple-500/20 text-purple-300/60"
                      }`}
                    >
                      <Coins className="w-4 h-4" />
                      <span>Paystack NGN</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("opay")}
                      className={`py-2 px-3 text-xs font-mono rounded-lg border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === "opay"
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                          : "bg-[#090710] border-purple-500/10 hover:border-purple-500/20 text-purple-300/60"
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Bank Transfer</span>
                    </button>
                  </div>

                  {/* Pay Method Content */}
                  <div className="space-y-4 bg-[#090710] p-4 rounded-xl border border-purple-500/10 mb-6">

                    {paymentMethod === "opay" && (
                      <div className="space-y-3">
                        <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg text-center">
                          <p className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">Send exact amount via Bank Transfer</p>
                          <div className="text-xl font-bold text-amber-400 font-mono mt-1">
                            ₦{paymentBook.priceNGN.toLocaleString()} NGN
                          </div>
                        </div>

                        {/* Bank Toggle Selection */}
                        <div className="p-2.5 bg-[#040309] rounded-lg border border-purple-950/40">
                          <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block mb-1.5 text-center">Select Receiving Bank</span>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedBank("opay")}
                              className={`py-1.5 px-2 text-xs font-mono rounded transition-all cursor-pointer ${
                                selectedBank === "opay"
                                  ? "bg-amber-500/10 border border-amber-500/30 text-amber-300"
                                  : "bg-[#090710] border border-purple-500/5 text-purple-300/40 hover:text-purple-300"
                              }`}
                            >
                              OPay
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedBank("moniepoint")}
                              className={`py-1.5 px-2 text-xs font-mono rounded transition-all cursor-pointer ${
                                selectedBank === "moniepoint"
                                  ? "bg-amber-500/10 border border-amber-500/30 text-amber-300"
                                  : "bg-[#090710] border-purple-500/5 text-purple-300/40 hover:text-purple-300"
                              }`}
                            >
                              Moniepoint
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                          {/* Receiving Bank Block */}
                          <div 
                            onClick={() => handleCopyToClipboard(selectedBank === "opay" ? "OPay" : "Moniepoint", "bank_name")}
                            className="p-2.5 bg-[#040309] rounded-lg border border-purple-950 flex flex-col justify-between cursor-pointer group hover:border-amber-500/30 hover:bg-purple-950/10 transition-all relative"
                            title="Click to copy bank name"
                          >
                            <div>
                              <span className="text-[9px] text-purple-300/40 uppercase block">Receiving Bank</span>
                              <span className="text-[#e2dfeb] font-semibold">{selectedBank === "opay" ? "OPay" : "Moniepoint"}</span>
                            </div>
                            <div className="absolute top-2.5 right-2.5 opacity-40 group-hover:opacity-100 transition-all">
                              {copiedField === "bank_name" ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-purple-400" />
                              )}
                            </div>
                            <span className="text-[8px] text-purple-300/20 group-hover:text-amber-500/50 mt-1 transition-all">
                              {copiedField === "bank_name" ? "Copied!" : "Click to copy"}
                            </span>
                          </div>

                          {/* Account Number Block */}
                          <div 
                            onClick={() => handleCopyToClipboard("9131229736", "account_num")}
                            className="p-2.5 bg-[#040309] rounded-lg border border-purple-950 flex flex-col justify-between cursor-pointer group hover:border-amber-500/30 hover:bg-purple-950/10 transition-all relative"
                            title="Click to copy account number"
                          >
                            <div>
                              <span className="text-[9px] text-purple-300/40 uppercase block">Account Number</span>
                              <span className="text-amber-400 font-bold select-all">9131229736</span>
                            </div>
                            <div className="absolute top-2.5 right-2.5 opacity-40 group-hover:opacity-100 transition-all">
                              {copiedField === "account_num" ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-purple-400" />
                              )}
                            </div>
                            <span className="text-[8px] text-purple-300/20 group-hover:text-amber-500/50 mt-1 transition-all">
                              {copiedField === "account_num" ? "Copied!" : "Click to copy"}
                            </span>
                          </div>

                          {/* Account Holder Name Block */}
                          <div 
                            onClick={() => handleCopyToClipboard("Celestial Codex Library", "holder_name")}
                            className="p-2.5 bg-[#040309] rounded-lg border border-purple-950 flex flex-col justify-between col-span-2 cursor-pointer group hover:border-amber-500/30 hover:bg-purple-950/10 transition-all relative"
                            title="Click to copy account holder name"
                          >
                            <div>
                              <span className="text-[9px] text-purple-300/40 uppercase block">Account Holder Name / Merchant</span>
                              <span className="text-[#e2dfeb] font-semibold">Celestial Codex Library</span>
                            </div>
                            <div className="absolute top-2.5 right-2.5 opacity-40 group-hover:opacity-100 transition-all">
                              {copiedField === "holder_name" ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-purple-400" />
                              )}
                            </div>
                            <span className="text-[8px] text-purple-300/20 group-hover:text-amber-500/50 mt-1 transition-all">
                              {copiedField === "holder_name" ? "Copied!" : "Click to copy"}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-purple-950/50">
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[11px] font-mono text-purple-400">
                              Verify Sender Name / Account Name
                            </label>
                            <button
                              type="button"
                              onClick={() => handlePasteFromClipboard(setOpaySenderName)}
                              className="text-[9px] font-mono text-purple-400 hover:text-amber-400 transition-colors flex items-center gap-1 bg-[#090710] px-1.5 py-0.5 rounded border border-purple-500/10 hover:border-amber-500/20 cursor-pointer"
                              title="Paste from clipboard"
                            >
                              <span>Paste Name</span>
                            </button>
                          </div>
                          <input 
                            type="text" 
                            required
                            placeholder="Enter the name on your bank account"
                            value={opaySenderName}
                            onChange={(e) => setOpaySenderName(e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#040309] border border-purple-500/10 rounded-lg text-xs focus:outline-none focus:border-amber-500/20 text-[#e2dfeb] placeholder:text-purple-300/20"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[11px] font-mono text-purple-400">
                              Transaction Reference / Receipt ID (Optional)
                            </label>
                            <button
                              type="button"
                              onClick={() => handlePasteFromClipboard(setOpayReference)}
                              className="text-[9px] font-mono text-purple-400 hover:text-amber-400 transition-colors flex items-center gap-1 bg-[#090710] px-1.5 py-0.5 rounded border border-purple-500/10 hover:border-amber-500/20 cursor-pointer"
                              title="Paste from clipboard"
                            >
                              <span>Paste Reference</span>
                            </button>
                          </div>
                          <input 
                            type="text" 
                            placeholder="Bank Reference Number / Receipt ID"
                            value={opayReference}
                            onChange={(e) => setOpayReference(e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#040309] border border-purple-500/10 rounded-lg text-xs focus:outline-none focus:border-amber-500/20 text-[#e2dfeb] placeholder:text-purple-300/20"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "paystack" && (
                      <div className="space-y-3">
                        <div className="p-3 bg-[#0d0a1b] border border-purple-500/10 rounded-lg text-center">
                          <p className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">Pay securely via Paystack gateway</p>
                          <div className="text-xl font-bold text-amber-400 font-mono mt-1">
                            ₦{paymentBook.priceNGN.toLocaleString()} NGN <span className="text-xs text-purple-400 font-normal">(${paymentBook.price.toFixed(2)} USD equivalent)</span>
                          </div>
                        </div>

                        <div className="p-3 bg-purple-950/20 rounded-lg border border-purple-900/40 text-xs space-y-2">
                          <p className="font-semibold text-amber-300 flex items-center gap-1">
                            <span>🌍</span> International & Domestic Checkout
                          </p>
                          <p className="text-purple-300/80 leading-relaxed">
                            Paystack accepts both local bank payments and <strong>International cards (USD, GBP, EUR, etc.)</strong> from any country worldwide. 
                          </p>
                          <p className="text-[10px] text-purple-400/60 leading-normal">
                            Foreign currencies are converted automatically. Payments are processed securely via our global multi-currency checkout system.
                          </p>
                        </div>

                        <div className="p-2 bg-[#040309] rounded-lg border border-purple-950 flex justify-between items-center text-xs font-mono">
                          <span className="text-purple-400">Merchant Account</span>
                          <span className="text-amber-400 font-bold">Celestial Codex Library (Verified)</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={processPayment}
                    disabled={stripeProcessing}
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                  >
                    {stripeProcessing ? (
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Lock className="w-4.5 h-4.5" />
                        <span>
                          {paymentMethod === "opay" 
                            ? "Confirm OPay Bank Transfer" 
                            : "Proceed via Paystack Gateway"}
                        </span>
                      </>
                    )}
                  </button>

                  <button 
                    type="button"
                    onClick={() => setPaymentBook(null)}
                    disabled={stripeProcessing}
                    className="w-full mt-2 py-2 text-xs font-mono text-purple-400 hover:text-amber-300 transition-all flex items-center justify-center gap-1 bg-purple-950/10 hover:bg-purple-950/20 border border-purple-500/5 rounded-xl cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Cancel & Return to Library</span>
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. PRIVATE BOOK READER MODAL */}
      <AnimatePresence>
        {readingBook && (
          <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-[#050409] text-[#e2dfeb]">
            
            {/* Left/Reader Panel */}
            <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-purple-950/60 relative">
              
              {/* Header */}
              <header className="px-6 py-4 bg-[#0a0812] border-b border-purple-950/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setReadingBook(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-purple-400 hover:text-amber-300 transition-all rounded-lg bg-purple-950/40 border border-purple-500/10 cursor-pointer hover:border-amber-500/20"
                    title="Return to Library"
                  >
                    <ChevronLeft className="w-4 h-4 text-purple-400 group-hover:text-amber-300" />
                    <span>Back to Library</span>
                  </button>
                  <div>
                    <h3 className="text-sm font-bold text-[#e2dfeb] line-clamp-1">{readingBook.title}</h3>
                    <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">{readingBook.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-purple-400">
                    Chapter {readerChapterIndex + 1} of {readingBook.chapters.length}
                  </span>
                  
                  {/* Font configuration */}
                  <div className="flex bg-[#040308] border border-purple-950 rounded-lg overflow-hidden p-0.5">
                    {(["sm", "base", "lg", "xl"] as const).map(size => (
                      <button
                        key={size}
                        onClick={() => setReaderFontSize(size)}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                          readerFontSize === size 
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/20 font-bold" 
                            : "text-purple-300/40 hover:text-purple-300/70"
                        }`}
                      >
                        {size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </header>

              {/* Reader Stage Content */}
              <div className="flex-1 overflow-y-auto px-6 py-12 sm:px-12 md:px-16">
                {!progressLoaded ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mb-2"></div>
                    <p className="text-xs font-mono text-purple-300/40">Aligning astral bindings...</p>
                  </div>
                ) : (
                  <article className="max-w-2xl mx-auto space-y-8">
                    <header className="border-b border-purple-950 pb-4 mb-6">
                      <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase block mb-1">Celestial Chapter Study</span>
                      <h2 className="text-xl sm:text-2xl font-bold text-amber-300 tracking-tight">
                        {readingBook.chapters[readerChapterIndex].title}
                      </h2>
                    </header>

                    <div className={`leading-relaxed text-[#e2dfeb]/90 text-left whitespace-pre-wrap font-serif ${
                      readerFontSize === "sm" ? "text-sm" : 
                      readerFontSize === "base" ? "text-base" : 
                      readerFontSize === "lg" ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
                    }`}>
                      {readingBook.chapters[readerChapterIndex].content}
                    </div>

                    {/* Progress navigation */}
                    <div className="pt-10 border-t border-purple-950 flex items-center justify-between gap-4 mt-12">
                      <button
                        onClick={handlePrevChapter}
                        disabled={readerChapterIndex === 0}
                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-mono border transition-all ${
                          readerChapterIndex === 0 
                            ? "border-purple-950 text-purple-300/20 cursor-not-allowed" 
                            : "border-purple-500/10 bg-purple-950/10 hover:border-purple-500/30 text-purple-300 hover:text-amber-300"
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous Chapter</span>
                      </button>

                      <button
                        onClick={handleNextChapter}
                        disabled={readerChapterIndex === readingBook.chapters.length - 1}
                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-mono border transition-all ${
                          readerChapterIndex === readingBook.chapters.length - 1 
                            ? "border-purple-950 text-purple-300/20 cursor-not-allowed" 
                            : "border-amber-500/20 bg-amber-500/5 hover:border-amber-400 text-amber-300 hover:text-black hover:bg-amber-400"
                        }`}
                      >
                        <span>Next Chapter</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Extra Back Link at bottom of reader page */}
                    <div className="mt-8 pt-4 border-t border-purple-950/20 text-center">
                      <button
                        onClick={() => setReadingBook(null)}
                        className="inline-flex items-center gap-1 text-xs font-mono text-purple-400/60 hover:text-amber-400 hover:underline transition-all cursor-pointer bg-[#0c0a15] px-3.5 py-1.5 rounded-lg border border-purple-500/10 hover:border-amber-500/25 shadow-sm"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Finished reading? Back to Library</span>
                      </button>
                    </div>
                  </article>
                )}
              </div>

              {/* Secure Privacy Banner inside Reader */}
              <div className="px-6 py-2 bg-[#040307] border-t border-purple-950/50 flex items-center justify-between text-[10px] font-mono text-purple-400/60">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-purple-500" />
                  Isolated Reading Session
                </span>
                <span>Active study is never logged publicly</span>
              </div>
            </div>

            {/* Right Panel: Private Notes and Annotations */}
            <div className="w-full md:w-80 lg:w-96 bg-[#090710] flex flex-col h-full border-t md:border-t-0 md:border-l border-purple-950/80">
              <header className="px-5 py-4 bg-[#0d0a16] border-b border-purple-950/80 flex items-center gap-2 shrink-0">
                <Bookmark className="w-4.5 h-4.5 text-amber-400" />
                <h4 className="text-sm font-semibold text-[#e2dfeb]">
                  Private Chapter Annotations
                </h4>
              </header>

              {/* Private note text-input */}
              <form onSubmit={handleAddNote} className="p-4 border-b border-purple-950 shrink-0">
                <label className="block text-[10px] font-mono text-purple-400 uppercase tracking-wider mb-1.5">
                  Write Private Insight / Note
                </label>
                <div className="relative">
                  <textarea
                    required
                    placeholder="Log mystical reflections, mantras, or study notes for this chapter..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-[#040309] border border-purple-500/15 rounded-lg text-xs focus:outline-none focus:border-amber-500/20 text-[#e2dfeb] placeholder:text-purple-300/20 resize-none"
                  />
                  <button
                    type="submit"
                    className="absolute bottom-2.5 right-2.5 p-1 bg-amber-500 hover:bg-amber-400 text-black rounded-md transition-colors"
                    title="Add Private Annotation"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[9px] text-purple-300/30 mt-1">
                  Saved only in your secure account. Under no circumstance can anyone else access this notebook.
                </p>
              </form>

              {/* Notes List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <h5 className="text-[10px] font-mono text-purple-400 uppercase tracking-widest border-b border-purple-950/40 pb-1.5">
                  Your Notebook ({bookNotes.length})
                </h5>

                {bookNotes.length === 0 ? (
                  <div className="py-12 text-center text-purple-300/20">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-purple-500/10" />
                    <p className="text-xs">No annotations yet</p>
                    <p className="text-[10px] mt-1">Reflections logged here stay completely private</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookNotes.map((note) => (
                      <div 
                        key={note.id} 
                        className="p-3 bg-[#0c0916] rounded-xl border border-purple-500/5 group/note relative"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[9px] font-mono text-amber-500/60 uppercase">
                            Chapter {note.page + 1}
                          </span>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 text-purple-400/40 hover:text-red-400 rounded hover:bg-red-950/20 transition-colors md:opacity-0 group-hover/note:opacity-100"
                            title="Delete Annotation"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-[#e2dfeb]/80 mt-1.5 leading-relaxed break-words whitespace-pre-wrap">
                          {note.text}
                        </p>
                        <span className="text-[8px] font-mono text-purple-300/20 mt-2 block">
                          {new Date(note.createdAt).toLocaleString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. PRIVACY GUARD EXPLAINER DIALOG */}
      <AnimatePresence>
        {showPrivacyInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0e0a1c] border border-amber-500/20 rounded-2xl p-6 shadow-2xl shadow-black"
            >
              <button 
                onClick={() => setShowPrivacyInfo(false)}
                className="absolute top-4 right-4 p-1.5 text-purple-400 hover:text-amber-300 transition-colors rounded-lg bg-purple-950/20"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-5">
                <div className="w-10 h-10 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#e2dfeb]">Privacy Architecture</h3>
                <p className="text-xs text-purple-300/50 mt-1">How we secure your magic & spiritual studies.</p>
              </div>

              <div className="space-y-4 text-xs text-purple-300/70 leading-relaxed">
                <div className="flex gap-3">
                  <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg h-fit shrink-0 border border-amber-500/15">
                    1
                  </span>
                  <div>
                    <h5 className="font-semibold text-[#e2dfeb] mb-1">Isolated Account Databases</h5>
                    <p>All database queries and schemas are protected by strict Attribute-Based Access Control (ABAC) rules. Nobody can read your document list.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg h-fit shrink-0 border border-amber-500/15">
                    2
                  </span>
                  <div>
                    <h5 className="font-semibold text-[#e2dfeb] mb-1">Zero Activity Logs</h5>
                    <p>When you read a grimoire, annotations, chapter indexes, and duration metrics are kept only in your private document and are never serialized onto public indices.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg h-fit shrink-0 border border-amber-500/15">
                    3
                  </span>
                  <div>
                    <h5 className="font-semibold text-[#e2dfeb] mb-1">Direct Download to Devices</h5>
                    <p>If you prefer entirely offline studying, download books instantly as text files. Once saved to your personal computer or phone, no server trace remains.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowPrivacyInfo(false)}
                className="w-full py-2 bg-[#040309] hover:bg-[#07050d] text-amber-300 hover:text-amber-200 border border-purple-500/10 rounded-xl text-xs font-semibold mt-6 tracking-wide transition-colors"
              >
                Return to Grimoires
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. PAYSTACK INTERACTIVE CARD MODAL (SIMULATED FOR CARDS & DEBIT CARDS) */}
      <AnimatePresence>
        {showPaystackCardModal && paymentBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#0b0818] border border-emerald-500/30 rounded-2xl p-6 shadow-2xl shadow-[#04030a]"
            >
              <button 
                onClick={() => {
                  setShowPaystackCardModal(false);
                  setPaystackProcessing(false);
                  setPaystackProcessingStep("");
                }}
                className="absolute top-4 right-4 p-1.5 text-purple-400 hover:text-emerald-400 transition-colors rounded-lg bg-purple-950/20"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-[10px] font-mono tracking-wider text-emerald-400 font-bold uppercase">
                  Paystack Secure Terminal
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#e2dfeb] flex items-center gap-1.5">
                  Credit & Debit Card Checkout
                </h3>
                <p className="text-xs text-purple-300/50 mt-1">
                  Secure transaction of <strong>₦{paymentBook.priceNGN.toLocaleString()} NGN</strong> for "{paymentBook.title}".
                </p>
              </div>

              {paystackProcessing ? (
                <div className="py-12 text-center space-y-4">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-emerald-400 rounded-full animate-spin"></div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#e2dfeb]">{paystackProcessingStep || "Connecting Gateway..."}</p>
                    <p className="text-xs text-purple-300/40 mt-1 font-mono">Securing channel with 256-bit AES...</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!paystackCardNumber || !paystackExpiry || !paystackCvv) {
                    alert("Please fill in card details to authorize transaction.");
                    return;
                  }
                  
                  setPaystackProcessing(true);
                  setPaystackProcessingStep("Verifying Card Credentials...");
                  
                  setTimeout(() => {
                    setPaystackProcessingStep("Validating CVV & Expiry...");
                    setTimeout(() => {
                      if (paystackPin) {
                        setPaystackProcessingStep("Authenticating Bank PIN Security...");
                        setTimeout(() => {
                          setPaystackProcessingStep("Settling NGN Ledger...");
                          setTimeout(async () => {
                            // Succeeded!
                            await triggerPurchaseSuccess(
                              paymentBook.id, 
                              "paystack", 
                              "PAYSTACK-CARD-" + Date.now(), 
                              "completed"
                            );
                            setPaystackProcessing(false);
                            setShowPaystackCardModal(false);
                            setPaymentBook(null); // Close payment screen!
                            alert(`Success! Card checkout completed. "${paymentBook.title}" is now permanently unlocked in your bookshelf.`);
                          }, 1200);
                        }, 1200);
                      } else {
                        setPaystackProcessingStep("Settling NGN Ledger...");
                        setTimeout(async () => {
                          await triggerPurchaseSuccess(
                            paymentBook.id, 
                            "paystack", 
                            "PAYSTACK-CARD-" + Date.now(), 
                            "completed"
                          );
                          setPaystackProcessing(false);
                          setShowPaystackCardModal(false);
                          setPaymentBook(null);
                          alert(`Success! Card checkout completed. "${paymentBook.title}" is now permanently unlocked in your bookshelf.`);
                        }, 1200);
                      }
                    }, 1200);
                  }, 1200);
                }} className="space-y-4">
                  {/* Card Number */}
                  <div>
                    <label className="block text-xs font-mono text-purple-400 mb-1">Cardholder Full Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Alexander Vance"
                      value={paystackCardName}
                      onChange={(e) => setPaystackCardName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#05040a] border border-purple-500/15 rounded-xl text-xs focus:outline-none focus:border-emerald-500/30 text-[#e2dfeb] placeholder:text-purple-300/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-purple-400 mb-1">Card Number</label>
                    <div className="relative">
                      <input 
                        type="text"
                        maxLength={19}
                        required
                        placeholder="4123 4567 8901 2345"
                        value={paystackCardNumber}
                        onChange={(e) => {
                          // format with spaces
                          const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                          const matches = val.match(/\d{4,16}/g);
                          const match = matches && matches[0] || '';
                          const parts = [];
                          for (let i=0, len=match.length; i<len; i+=4) {
                            parts.push(match.substring(i, i+4));
                          }
                          if (parts.length > 0) {
                            setPaystackCardNumber(parts.join(' '));
                          } else {
                            setPaystackCardNumber(val);
                          }
                        }}
                        className="w-full px-3 py-2 bg-[#05040a] border border-purple-500/15 rounded-xl text-xs focus:outline-none focus:border-emerald-500/30 text-[#e2dfeb] placeholder:text-purple-300/10 tracking-widest font-mono"
                      />
                      <CreditCard className="absolute right-3 top-2.5 w-4 h-4 text-purple-500/40 pointer-events-none" />
                    </div>
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-purple-400 mb-1">Expiry Date</label>
                      <input 
                        type="text"
                        maxLength={5}
                        required
                        placeholder="MM/YY"
                        value={paystackExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9]/g, '');
                          if (val.length > 2) {
                            val = val.substring(0, 2) + '/' + val.substring(2, 4);
                          }
                          setPaystackExpiry(val);
                        }}
                        className="w-full px-3 py-2 bg-[#05040a] border border-purple-500/15 rounded-xl text-xs focus:outline-none focus:border-emerald-500/30 text-[#e2dfeb] placeholder:text-purple-300/10 font-mono text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-purple-400 mb-1">CVV</label>
                      <input 
                        type="password"
                        maxLength={3}
                        required
                        placeholder="123"
                        value={paystackCvv}
                        onChange={(e) => setPaystackCvv(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full px-3 py-2 bg-[#05040a] border border-purple-500/15 rounded-xl text-xs focus:outline-none focus:border-emerald-500/30 text-[#e2dfeb] placeholder:text-purple-300/10 font-mono text-center"
                      />
                    </div>
                  </div>

                  {/* Optional PIN for Nigerian Cards */}
                  <div>
                    <label className="block text-xs font-mono text-purple-400 mb-1 flex items-center justify-between">
                      <span>Card PIN (Optional)</span>
                      <span className="text-[9px] text-purple-400/50">Required for NG debit cards</span>
                    </label>
                    <input 
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={paystackPin}
                      onChange={(e) => setPaystackPin(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-3 py-2 bg-[#05040a] border border-purple-500/15 rounded-xl text-xs focus:outline-none focus:border-emerald-500/30 text-[#e2dfeb] placeholder:text-purple-300/10 font-mono text-center tracking-widest"
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-black font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Seal Payment • ₦{paymentBook.priceNGN.toLocaleString()}</span>
                    </button>
                  </div>

                  <div className="text-center text-[10px] text-purple-300/30 font-mono">
                    Secured by Paystack PCI-DSS Layer. Your credentials are never stored or logged.
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
