import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * Contexte d'authentification global.
 * Fournit l'état de connexion (user, role, isAuthenticated)
 * ainsi que les actions login/logout à toute l'application.
 */
const AuthContext = createContext()

// ─── Comptes de démonstration (sans Supabase) ────────────────────────────────
const DEMO_ACCOUNTS = {
    'user@example.com': {
        id: 'demo-etudiant',
        email: 'user@example.com',
        role: 'etudiant',
        isDemo: true,
    },
    'entreprise@example.com': {
        id: 'demo-entreprise',
        email: 'entreprise@example.com',
        role: 'entreprise',
        isDemo: true,
    },
    'admin@example.com': {
        id: 'demo-admin',
        email: 'admin@example.com',
        role: 'administration',
        isDemo: true,
    },
}

/**
 * Provider AuthContext.
 * Écoute la session Supabase, expose user / role / isAuthenticated,
 * et les méthodes login / logout.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)

    // ─── Helper : charge le rôle depuis la table utilisateur ─────────────────
    const loadRole = async (supabaseUser) => {
        try {
            const { data, error } = await supabase
                .from('utilisateur')
                .select('role')
                .eq('id_utilisateur', supabaseUser.id)
                .single()

            if (!error && data) return data.role
        } catch (_) { }
        // Fallback sur les metadata Auth si la table n'est pas disponible
        return supabaseUser.user_metadata?.role || null
    }

    // ─── Initialisation : récupère la session existante ───────────────────────
    useEffect(() => {
        const init = async () => {
            try {
                // Timeout de sécurité : si Supabase ne répond pas en 5s, on continue sans session
                const sessionPromise = supabase.auth.getSession()
                const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({ data: { session: null } }), 5000))
                const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise])

                if (session?.user) {
                    const r = await loadRole(session.user)
                    setUser({ ...session.user, role: r, isDemo: false })
                    setRole(r)
                }
            } catch (err) {
                console.warn('Erreur lors de la récupération de la session:', err)
            } finally {
                // setLoading(false) est TOUJOURS appelé, même en cas d'erreur ou de timeout
                setLoading(false)
            }
        }

        init()

        // Écoute les changements de session (connexion / déconnexion)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const r = await loadRole(session.user)
                setUser({ ...session.user, role: r, isDemo: false })
                setRole(r)
            } else {
                setUser(null)
                setRole(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])


    // ─── Login ────────────────────────────────────────────────────────────────
    const login = async (email, password) => {
        // 1. Vérification compte démo
        const demoAccount = DEMO_ACCOUNTS[email.toLowerCase()]
        if (demoAccount && password === 'password') {
            setUser(demoAccount)
            setRole(demoAccount.role)
            return { success: true }
        }

        // 2. Authentification Supabase réelle
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) return { success: false, error: error.message }

            const r = await loadRole(data.user)
            setUser({ ...data.user, role: r, isDemo: false })
            setRole(r)
            return { success: true }
        } catch (err) {
            return { success: false, error: 'Erreur de connexion inattendue.' }
        }
    }

    // ─── Logout ───────────────────────────────────────────────────────────────
    const logout = async () => {
        if (user?.isDemo) {
            setUser(null)
            setRole(null)
            return
        }
        await supabase.auth.signOut()
        setUser(null)
        setRole(null)
    }

    const value = {
        user,
        role,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
    }

    // Pendant l'initialisation : affiche un spinner plutôt que rien
    // (évite l'écran blanc si Supabase est lent)
    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '16px', background: '#f8f8fa' }}>
            <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Chargement…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
        </div>
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook utilitaire pour accéder au contexte d'authentification.
 * @returns {Object} { user, role, isAuthenticated, loading, login, logout }
 */
export function useAuth() {
    return useContext(AuthContext)
}
