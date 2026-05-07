import {SUPABASE_URL, SUPABASE_KEY} from "../config.js";

export async function callAiGenerator(destinationName, category, country) {
    const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/generate-desc`;

    const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
        },

        body: JSON.stringify({
            destinationName: destinationName,
            category: category,
            country: country,
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    if (!result.success) {
        throw new Error(result.error || 'AI Generator Error');
    }

    return result.description;
}