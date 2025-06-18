let embedder: any = null
let generator: any = null
let pipeline: any = null

async function initializeTransformers() {
    if (typeof window === 'undefined') {
        throw new Error('Transformers.js can only be used in the browser')
    }

    if (!pipeline) {
        try {
            // Initialize the environment first
            const { env } = await import('@xenova/transformers')
            env.localModelPath = '/models'
            env.allowLocalModels = true
            env.useBrowserCache = true

            // Then import the pipeline
            const transformers = await import('@xenova/transformers')
            pipeline = transformers.pipeline
        } catch (error) {
            console.error('Error loading Transformers.js:', error)
            throw new Error('Failed to load Transformers.js library')
        }
    }
    return pipeline
}

export async function getEmbedder() {
    if (!embedder) {
        try {
            const pipeline = await initializeTransformers()
            embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
                progress_callback: undefined,
                quantized: true
            })
        } catch (error) {
            console.error('Error loading embedder:', error)
            throw new Error('Failed to load the embedding model')
        }
    }
    return embedder
}

export async function getEmbedding(text: string): Promise<number[]> {
    try {
        const model = await getEmbedder()
        const output = await model(text, { pooling: "mean", normalize: true })
        return Array.from(output.data)
    } catch (error) {
        console.error('Error generating embedding:', error)
        throw new Error('Failed to generate embedding')
    }
}

export function cosineSimilarity(a: number[], b: number[]): number {
    if (!a || !b || a.length !== b.length) {
        throw new Error('Invalid vectors for similarity calculation')
    }
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0)
    const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0))
    const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0))
    return dot / (magA * magB)
}

export async function generateAnswer(question: string, context: string, temperature: number = 0.6): Promise<string> {
    if (!generator) {
        try {
            const pipeline = await initializeTransformers()
            generator = await pipeline("text2text-generation", "Xenova/mt5-small", {
                progress_callback: undefined,
                quantized: true
            })
        } catch (error) {
            console.error('Error loading generator:', error)
            throw new Error('Failed to load the text generation model')
        }
    }

    const prompt = `Instruções: Responda a pergunta usando APENAS as informações do texto fornecido. Seja direto e preciso.\n\nTexto:\n${context}\n\nPergunta: ${question}\n\nResposta direta:`

    try {
        const output = await generator(prompt, {
            max_new_tokens: 50,
            do_sample: false,
            temperature: 0.3,
            top_p: 0.8,
            repetition_penalty: 1.1
        })

        let answer = output[0]?.generated_text?.replace(prompt, "").trim() || "(não foi possível gerar resposta)"

        // Limpa a resposta
        answer = answer
            .replace(/<extra_id_\d+>/g, "")
            .replace(/^[.,\s]+/, "")
            .trim()

        // Se a resposta estiver vazia ou muito curta, tenta uma segunda vez com parâmetros diferentes
        if (answer.length < 3 || answer === "(não foi possível gerar resposta)") {
            const retryOutput = await generator(prompt, {
                max_new_tokens: 50,
                do_sample: true,
                temperature: 0.5,
                top_p: 0.9,
                repetition_penalty: 1.2
            })
            answer = retryOutput[0]?.generated_text?.replace(prompt, "").trim() || "(não foi possível gerar resposta)"
            answer = answer
                .replace(/<extra_id_\d+>/g, "")
                .replace(/^[.,\s]+/, "")
                .trim()
        }

        return answer
    } catch (error) {
        console.error('Error generating answer:', error)
        return "(erro ao gerar resposta)"
    }
}
