export async function runSimulation(interventions, years = 5) {
        const res = await fetch(
                `http://localhost:8000/simulate?years=${years}`,
                {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(interventions)
                }
        );

        if (!res.ok) {
                throw new Error("Simulation failed");
        }

        return res.json();
}
