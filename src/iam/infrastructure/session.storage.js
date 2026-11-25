import { SessionAssembler } from './session.assembler.js';

/**
 * Browser storage key of the current session.
 * @type {string}
 */
const sessionStorageKey = 'hostera.session';

/**
 * Keeps the current session in the browser so it survives a page reload.
 *
 * @class SessionStorage
 */
export class SessionStorage {
  /**
   * Reads the stored session.
   * @returns {import('../domain/model/session.entity.js').Session|null} Stored session, or null when there is none or it cannot be read.
   */
  static load() {
    try {
      const stored = localStorage.getItem(sessionStorageKey);
      if (!stored) return null;
      const session = SessionAssembler.toEntityFromResource(JSON.parse(stored));
      return session.isValid ? session : null;
    } catch {
      return null;
    }
  }

  /**
   * Stores a session, replacing the previous one.
   * @param {import('../domain/model/session.entity.js').Session} session - Session to keep.
   * @returns {void}
   */
  static save(session) {
    localStorage.setItem(
      sessionStorageKey,
      JSON.stringify(SessionAssembler.toResourceFromEntity(session)),
    );
  }

  /**
   * Removes the stored session.
   * @returns {void}
   */
  static clear() {
    localStorage.removeItem(sessionStorageKey);
  }
}
