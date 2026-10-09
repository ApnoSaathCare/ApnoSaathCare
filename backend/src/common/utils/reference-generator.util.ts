import * as crypto from 'crypto';

export class ReferenceGenerator {
  /**
   * Generates a unique, non-sequential public reference code.
   * e.g., ASC-ENQ-849201 or ASC-CON-391084
   */
  static generate(prefix: 'ENQ' | 'CON'): string {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `ASC-${prefix}-${randomNum}`;
  }

  /**
   * Generates a UUID string.
   */
  static generateId(): string {
    return crypto.randomUUID();
  }
}
