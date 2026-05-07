import { describe, it, expect, vi, beforeEach } from "vitest";
import { callAiGenerator } from "../src/api.js";

describe('AI API Integration', () => {
    beforeEach(() => {
        const mockFetch = vi.fn();
        global.fetch = mockFetch;
        mockFetch.mockClear();
    });

    it('should return description on successful API response', async () => {
        //Arrange: Define what the fake fetch should return
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                success: true,
                description: "Mocked AI Description for testing"
            })
        });

        //Act: Call the function
        const result = await callAiGenerator('Dest', 'Cat', 'Count');

        //Assert: Check results
        expect(fetch).toHaveBeenCalledTimes(1); //Ensure API was  called once
        expect(result).toBe('Mocked AI Description for testing'); //Check output
    });

    it('should throw error if API returns nok OK status', async () => {
        //Arrange: Simulate a 500 Internal Server Error
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: async () => 'Internal Server Error'
        });

        //Act + Assert: Expect the function to throw an error
        await expect(callAiGenerator('Dest', 'Cat', 'Count')).rejects.toThrow("HTTP Error 500: Internal Server Error");
    });

    it('should throw error if AI logic fails (success:false)', async () => {
        //Arrange: Simulate a 500 Internal Server Error
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
               success: false,
               error: "Quota exceeded"
            })
        });

        //Act + Assert: Expect the function to throw the AI error
        await expect(callAiGenerator('Dest', 'Cat', 'Count')).rejects.toThrow('Quota exceeded');
    });

});


