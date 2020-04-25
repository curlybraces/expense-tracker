import firebase from 'firebase/app';
import 'firebase/auth';
import { Loading, LocalStorage } from 'quasar';
import { showErrorMessageWithTitle } from 'src/functions/show-error-message';

export function handleAuthStateChanged({ commit, dispatch }) {
  firebase.auth().onAuthStateChanged((user) => {
    Loading.hide();
    if (user) {
      commit('setIsSignedIn', true);
      LocalStorage.set('signedIn', true);
      dispatch('users/loadCurrentUser', user.uid, { root: true });
      if (this.$router.currentRoute.fullPath === '/login') {
        this.$router.push('/').catch(() => { });
      }
    } else {
      commit('setIsSignedIn', false);
      LocalStorage.set('signedIn', false);
      dispatch('resetState');
      this.$router.push('/login').catch(() => { });
    }
  });
}

export function login(context, { email, password }) {
  Loading.show();
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      Loading.hide();
    })
    .catch((error) => {
      Loading.hide();
      showErrorMessageWithTitle('Could not sign in', error.message);
    });
}

export function logout() {
  Loading.show();
  firebase
    .auth()
    .signOut()
    .catch((error) => {
      Loading.hide();
      showErrorMessageWithTitle('Could not sign out', error.message);
    });
}

export function loadData({ dispatch, rootGetters }) {
  Loading.show();
  try {
    const currentUser = rootGetters['users/getCurrentUser'];

    dispatch('categories/firebaseReadData', null, { root: true });
    dispatch('collections/loadCollections', currentUser.collections, { root: true });
    // dispatch('collections/firebaseReadData', null, { root: true });
    // dispatch('users/firebaseReadData', null, { root: true });
  } catch (error) {
    console.log(error);
    Loading.hide();
    showErrorMessageWithTitle('Could not load Firebase data', 'Please make sure you configured properly Firebase credentials.');
  }
}

export function loadExpenseData({ dispatch }, collectionId) {
  dispatch('setExpensesLoaded', false);
  dispatch('expenses/firebaseReadData', collectionId, { root: true });
}

export function setCategoriesLoaded({ commit, getters }, value) {
  commit('setCategoriesLoaded', value);

  if (getters.appReady) {
    Loading.hide();
  }
}

export function setCollectionsLoaded({ commit, getters }, value) {
  commit('setCollectionsLoaded', value);

  if (getters.appReady) {
    Loading.hide();
  }
}

export function setUsersLoaded({ commit, getters }, value) {
  commit('setUsersLoaded', value);

  if (getters.appReady) {
    Loading.hide();
  }
}

export function setExpensesLoaded({ commit }, value) {
  commit('setExpensesLoaded', value);
}

export function setCurrentPage({ commit }, value) {
  commit('setCurrentPage', value);
}

export function setToolbarAction({ commit }, value) {
  commit('setToolbarAction', value);
}

export function resetState({ commit }) {
  commit('setIsSignedIn', false);

  commit('setCurrentPage', null);
  commit('setToolbarAction', null);

  commit('setCategoriesLoaded', false);
  commit('setCollectionsLoaded', false);
  commit('setUsersLoaded', false);
  commit('setExpensesLoaded', false);
}
