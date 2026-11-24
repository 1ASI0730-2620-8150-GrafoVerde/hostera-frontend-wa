/**
 * Application service store for the IAM bounded context.
 * It signs users in and out, registers new users, and keeps the session across page reloads.
 *
 * @module useIamStore
 */
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { disposeStores } from '../../pinia.js';
import { IamApi } from '../infrastructure/iam-api.js';
import { SessionAssembler } from '../infrastructure/session.assembler.js';
import { UserAssembler } from '../infrastructure/user.assembler.js';
import { SessionStorage } from '../infrastructure/session.storage.js';
import { IamErrorAssembler } from '../infrastructure/iam-error.assembler.js';
import { SignInCommand } from '../domain/sign-in.command.js';

const iamApi = new IamApi();

/**
 * Identifier of the IAM store, which survives a change of account.
 * @type {string}
 */
const iamStoreId = 'iam';

/**
 * Reactive store that exposes IAM commands and the current session.
 *
 * @returns {Object} Store state and actions.
 */
const useIamStore = defineStore(iamStoreId, () => {
  /**
   * Current session, restored from the browser when the application starts.
   * @type {import('vue').Ref<import('../domain/model/session.entity.js').Session|null>}
   */
  const session = ref(SessionStorage.load());
  /**
   * Whether a sign-in or sign-up request is in progress.
   * @type {import('vue').Ref<boolean>}
   */
  const submitting = ref(false);
  /**
   * Whether the platform ended the last session because its token was no longer valid.
   * @type {import('vue').Ref<boolean>}
   */
  const sessionExpired = ref(false);
  /**
   * Signed-in user.
   * @type {import('vue').ComputedRef<import('../domain/model/user.entity.js').User|null>}
   */
  const currentUser = computed(() => session.value?.user ?? null);
  /**
   * Whether a user is signed in.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isSignedIn = computed(() => Boolean(session.value?.isValid));
  /**
   * Bearer token of the current session.
   * @type {import('vue').ComputedRef<string|null>}
   */
  const token = computed(() => session.value?.token ?? null);

  /**
   * Tracks an authentication request and translates its rejection into an IAM error.
   * @template T
   * @param {Promise<T>} request - Request in progress.
   * @returns {Promise<T>} The same request.
   * @throws {import('../domain/model/iam.error.js').IamError} When the platform rejects the request.
   */
  function trackSubmitting(request) {
    submitting.value = true;
    return request
      .catch((error) => {
        throw IamErrorAssembler.toErrorFromResponse(error);
      })
      .finally(() => {
        submitting.value = false;
      });
  }

  /**
   * Starts a session, dropping the data that the previous account loaded.
   * @param {import('../domain/model/session.entity.js').Session} newSession - Session to start.
   * @returns {void}
   */
  function startSession(newSession) {
    disposeStores([iamStoreId]);
    SessionStorage.save(newSession);
    session.value = newSession;
    sessionExpired.value = false;
  }

  /**
   * Checks the username and password of a user and starts its session.
   * @param {SignInCommand} signInCommand - Sign-in command.
   * @returns {Promise<import('../domain/model/user.entity.js').User>} Signed-in user.
   * @throws {import('../domain/model/iam.error.js').IamError} When the credentials are wrong.
   */
  function signIn(signInCommand) {
    return trackSubmitting(
      iamApi.signIn(signInCommand).then((response) => {
        startSession(SessionAssembler.toEntityFromResponse(response));
        return currentUser.value;
      }),
    );
  }

  /**
   * Registers a new user, who starts a new organization without properties, and signs it in.
   * @param {import('../domain/sign-up.command.js').SignUpCommand} signUpCommand - Sign-up command.
   * @returns {Promise<import('../domain/model/user.entity.js').User>} Signed-in user.
   * @throws {import('../domain/model/iam.error.js').IamError} When the username is taken or the input is invalid.
   */
  function signUp(signUpCommand) {
    return trackSubmitting(
      iamApi
        .signUp(signUpCommand)
        .then((response) => UserAssembler.toEntityFromResponse(response)),
    ).then(() => signIn(new SignInCommand({ ...signUpCommand })));
  }

  /**
   * Ends the current session and drops the data that its account loaded.
   * @returns {void}
   */
  function signOut() {
    SessionStorage.clear();
    session.value = null;
    disposeStores([iamStoreId]);
  }

  /**
   * Ends a session whose token the platform no longer accepts, such as an expired one.
   * @returns {void}
   */
  function expireSession() {
    if (!session.value) return;
    signOut();
    sessionExpired.value = true;
  }

  return {
    session,
    submitting,
    sessionExpired,
    currentUser,
    isSignedIn,
    token,
    signIn,
    signUp,
    signOut,
    expireSession,
  };
});

export default useIamStore;
