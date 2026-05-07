export function validateDestinationInput(data){
    if(!data || typeof data !== 'object') return false;
    if(!data.destinationName || data.destinationName.trim().length <5) return false;
    if(!data.country || data.country.trim().length ===0) return false;
    if(!data.category || data.category.trim().length ===0) return false;
    return true;
}

export function constructPrompt(destinationName, category, country){
    return `You are a travel expert. Write a short description for a ${destinationName} a ${category} destination in ${country} country.`
}

export function formatPrice(value){
    const num = Number(value);

    if(!Number.isFinite(num)){
        return '$0.00';
    }

    return `$${num.toFixed(2)}`;
}