export async function fetchApi(apiUrl: string, text: string, aggressiveness?: number) {
    const url = `http://localhost:8000${apiUrl}?aggressiveness=${aggressiveness ? aggressiveness : .9}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return result;
    } catch (error: any) {
        console.error(error.message);
    }
}
