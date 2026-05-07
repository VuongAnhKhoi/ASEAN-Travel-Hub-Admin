import { describe, it, expect } from "vitest";
import { validateDestinationInput, formatPrice, constructPrompt } from "../src/utils";

describe('Utils Function', () => {
    describe('validateDestinationInput', () => {
        it('should return true for valid data', () => {
            const validateData = {
                destinationName: 'Destination 1',
                category: 'Adventure',
                country: 'Russia',
            };

            expect(validateDestinationInput(validateData)).toBe(true);
        });

        it('should return false if title is too short', () => {
            const validateData = {
                destinationName: 'Dest',
                category: 'Adventure',
                country: 'Russia',
            };

            expect(validateDestinationInput(validateData)).toBe(false);
        });

        it('should return false if category is empty', () => {
            const validateData = {
                destinationName: 'Dest',
                category: '',
                country: 'Russia',
            };

            expect(validateDestinationInput(validateData)).toBe(false);
        });
    });

    describe('formatPrice', () => {
        it('should format 150 as $150.00', () => {
            expect(formatPrice(150)).toBe('$150.00');
        });

        it('should handle invalid input', () => {
            expect(formatPrice('abc')).toBe('$0.00');
        });
    });
});

