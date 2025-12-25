/**
 * Auth Feature Index
 * 
 * Re-export all auth-related functionality.
 */

// Actions
export {
  signUp,
  signIn,
  signInWithMagicLink,
  signInWithOrcid,
  signInWithGoogle,
  signOut,
  getCurrentUser,
  getCurrentProfile,
} from './actions';

// Components
export { LoginForm, SignupForm } from './components';

