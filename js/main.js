// Firebase configuration
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyB4tHbG7Qhz7TEs9RKjqSjgzVlJCPWw7aA",
    authDomain: "earnifyxlab.firebaseapp.com",
    projectId: "earnifyxlab",
    storageBucket: "earnifyxlab.firebasestorage.app",
    messagingSenderId: "944846937649",
    appId: "1:944846937649:web:343ebdc58b9af8a6207f10",
    measurementId: "G-SGW7CDT1LV"
};

window.initializeFirebase = async function () {
    if (window.__earnifyxFirebaseInitialized) {
        return window.firebaseApp;
    }

    try {
        const [
            { initializeApp },
            { getAnalytics },
            {
                getAuth,
                createUserWithEmailAndPassword,
                signInWithEmailAndPassword,
                signOut,
                updateProfile,
                onAuthStateChanged
            },
            {
                getFirestore,
                doc,
                setDoc,
                getDoc,
                collection,
                getDocs
            },
            {
                initializeAppCheck,
                ReCaptchaEnterpriseProvider
            }
        ] = await Promise.all([
            import("https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js"),
            import("https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js"),
            import("https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js"),
            import("https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"),
            import("https://www.gstatic.com/firebasejs/12.18.0/firebase-app-check.js")
        ]);

        // Initialize Firebase
        const app = initializeApp(FIREBASE_CONFIG);

        // Initialize Firebase App Check
        const appCheck = initializeAppCheck(app, {
            provider: new ReCaptchaEnterpriseProvider(
                "6Lc2nqwtAAAAAGF1CYLLWSSSkKDPQv_WwFf4JQ6n"
            ),
            isTokenAutoRefreshEnabled: true
        });

        const analytics = getAnalytics(app);
        const auth = getAuth(app);
        const db = getFirestore(app);

        window.firebaseApp = app;
        window.firebaseAnalytics = analytics;
        window.firebaseAuth = auth;
        window.firebaseDb = db;
        window.firebaseAppCheck = appCheck;

        window.firebaseAuthHelpers = {
            createUserWithEmailAndPassword,
            signInWithEmailAndPassword,
            signOut,
            updateProfile,
            onAuthStateChanged,
            doc,
            setDoc,
            getDoc,
            collection,
            getDocs
        };

        window.__earnifyxFirebaseInitialized = true;

        return app;

<<<<<<< HEAD
    } catch (error) {
        console.warn("Firebase initialization failed:", error);
        return null;
    }
=======
   } catch (error) {
    console.error("🔥 FIREBASE / APP CHECK INITIALIZATION ERROR:", error);
    throw error;
}
>>>>>>> e49e44c (Add Visual Alphanumeric Captcha and Manager Access Control with author attribution)
};


window.FirebaseService = {

    async ensureReady() {
        if (window.renderAuthUI) {
            window.renderAuthUI(
                window.AuthUI && window.AuthUI.getUser()
            );
        }

        if (!window.firebaseAuth || !window.firebaseDb) {
            await window.initializeFirebase();
        }

        return {
            auth: window.firebaseAuth,
            db: window.firebaseDb,
            helpers: window.firebaseAuthHelpers
        };
    },

    async registerUser({
        name,
        email,
        phone,
        password
    }) {
        try {
            const {
                auth,
                db,
                helpers
            } = await this.ensureReady();

            const credential =
                await helpers.createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            await helpers.updateProfile(
                credential.user,
                {
                    displayName: name
                }
            );

            const isAdmin = email.toLowerCase().includes("admin");
            const isManager = email.toLowerCase().includes("manager");
            const role = isAdmin ? "admin" : (isManager ? "manager" : "user");

            const userDoc = {
                uid: credential.user.uid,
                name: name,
                email: email,
                phone: phone,
                role: role,
                isAdmin: isAdmin,
                plan: "free",
                isPro: false,
                subscriptionStatus: "inactive",
                premiumUntil: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await helpers.setDoc(
                helpers.doc(
                    db,
                    "users",
                    credential.user.uid
                ),
                userDoc
            );

            return {
                ...credential.user,
                profile: userDoc
            };
        } catch (error) {
            console.warn("Firebase registration fallback:", error);
            const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
            if (isLocal) {
                const isAdmin = email.toLowerCase().includes("admin");
                const isManager = email.toLowerCase().includes("manager");
                const role = isAdmin ? "admin" : (isManager ? "manager" : "user");
                const localDoc = {
                    uid: "local-" + Date.now(),
                    name: name,
                    email: email,
                    phone: phone,
                    role: role,
                    isAdmin: isAdmin,
                    plan: "free",
                    isPro: false,
                    subscriptionStatus: "inactive",
                    createdAt: new Date().toISOString()
                };
                return {
                    uid: localDoc.uid,
                    email: email,
                    displayName: name,
                    isAdmin: isAdmin,
                    profile: localDoc
                };
            }
            throw error;
        }
    },


    async loginUser(arg1, arg2) {
        const email = (typeof arg1 === "object" && arg1 !== null) ? arg1.email : arg1;
        const password = (typeof arg1 === "object" && arg1 !== null) ? arg1.password : arg2;

        try {
            const {
                auth,
                helpers
            } = await this.ensureReady();

            const credential =
                await helpers.signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const profile = await this.getUserProfile(credential.user.uid);

            return {
                ...credential.user,
                profile: profile || {}
            };
        } catch (error) {
            console.warn("Firebase login fallback for localhost:", error);
            const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
            if (isLocal) {
                const isAdmin = email.toLowerCase().includes("admin");
                const isManager = email.toLowerCase().includes("manager");
                const role = isAdmin ? "admin" : (isManager ? "manager" : "user");
                const name = isAdmin ? "Super Admin" : (isManager ? "Content Manager" : email.split("@")[0]);

                return {
                    uid: "local-" + Date.now(),
                    email: email,
                    displayName: name,
                    isAdmin: isAdmin,
                    profile: {
                        name: name,
                        email: email,
                        role: role,
                        isAdmin: isAdmin,
                        plan: "free",
                        isPro: isAdmin,
                        subscriptionStatus: "active"
                    }
                };
            }
            throw error;
        }
    },


    async logoutUser() {
        try {
            const {
                auth,
                helpers
            } = await this.ensureReady();

            await helpers.signOut(auth);
        } catch (e) {
            // ignore logout error
        }
    },


    async getUserProfile(uid) {
        try {
            const {
                db,
                helpers
            } = await this.ensureReady();

            const snapshot =
                await helpers.getDoc(
                    helpers.doc(
                        db,
                        "users",
                        uid
                    )
                );

            if (!snapshot.exists()) {
                return null;
            }

            return snapshot.data();
        } catch (e) {
            return null;
        }
    }

};
