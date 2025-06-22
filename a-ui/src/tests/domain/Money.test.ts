/**
 * Domain Unit Tests - Money Value Object
 * Tests for core domain logic following DDD principles
 */

import { Money } from '../../domain/valueobjects/shared/Money';
import { ValidationError } from '../../domain/errors/DomainErrors';

describe('Money Value Object', () => {
  describe('Creation', () => {
    it('should create valid money with positive amount', () => {
      const money = Money.of(100, 'USD');

      expect(money.amount).toBe(100);
      expect(money.currency).toBe('USD');
    });

    it('should create zero money', () => {
      const money = Money.zero();

      expect(money.amount).toBe(0);
      expect(money.currency).toBe('USD');
    });

    it('should throw error for negative amount', () => {
      expect(() => Money.of(-10, 'USD')).toThrow(ValidationError);
    });

    it('should throw error for invalid currency', () => {
      expect(() => Money.of(100, 'INVALID')).toThrow(ValidationError);
    });
  });

  describe('Arithmetic Operations', () => {
    it('should add money with same currency', () => {
      const money1 = Money.of(100, 'USD');
      const money2 = Money.of(50, 'USD');

      const result = money1.add(money2);

      expect(result.amount).toBe(150);
      expect(result.currency).toBe('USD');
    });

    it('should subtract money with same currency', () => {
      const money1 = Money.of(100, 'USD');
      const money2 = Money.of(30, 'USD');

      const result = money1.subtract(money2);

      expect(result.amount).toBe(70);
      expect(result.currency).toBe('USD');
    });

    it('should multiply money by factor', () => {
      const money = Money.of(50, 'USD');

      const result = money.multiply(3);

      expect(result.amount).toBe(150);
      expect(result.currency).toBe('USD');
    });

    it('should throw error when adding different currencies', () => {
      const usd = Money.of(100, 'USD');
      const eur = Money.of(50, 'EUR');

      expect(() => usd.add(eur)).toThrow(ValidationError);
    });
  });

  describe('Comparison Operations', () => {
    it('should compare money amounts correctly', () => {
      const money1 = Money.of(100, 'USD');
      const money2 = Money.of(150, 'USD');
      const money3 = Money.of(100, 'USD');

      expect(money1.isGreaterThan(money2)).toBe(false);
      expect(money2.isGreaterThan(money1)).toBe(true);
      expect(money1.equals(money3)).toBe(true);
    });

    it('should throw error when comparing different currencies', () => {
      const usd = Money.of(100, 'USD');
      const eur = Money.of(100, 'EUR');

      expect(() => usd.isGreaterThan(eur)).toThrow(ValidationError);
    });
  });

  describe('Formatting', () => {
    it('should format money correctly', () => {
      const money = Money.of(1234.56, 'USD');

      const formatted = money.toString();

      expect(formatted).toBe('$1,234.56');
    });

    it('should format different currencies', () => {
      const eur = Money.of(1000, 'EUR');

      const formatted = eur.toString();

      expect(formatted).toBe('€1,000.00');
    });
  });

  describe('Immutability', () => {
    it('should not mutate original money object during operations', () => {
      const originalMoney = Money.of(100, 'USD');
      const otherMoney = Money.of(50, 'USD');

      const result = originalMoney.add(otherMoney);

      expect(originalMoney.amount).toBe(100);
      expect(result.amount).toBe(150);
      expect(result).not.toBe(originalMoney);
    });
  });
});
