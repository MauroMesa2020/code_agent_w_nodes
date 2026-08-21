import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import type {IProvider} from "./IProvider.js";
import type { Message } from "../shared/utils/utils_tool";
import type { AgentError } from "../shared/types/AgentError.js";
import { AgentException } from "../exceptions/AgentExceptions.js";

dotenv.config();

export class GeminiProvider implements IProvider{
    private model: string;
    private apiKey: string;
    private genAI: GoogleGenerativeAI;
    public static calls: number = 0;

    constructor (model: string = "gemini-2.5-flash", apiKey?: string) {
        this.apiKey = apiKey || process.env.GOOGLE_API_KEY || "";

        if (!this.apiKey) {
            throw new Error("GOOGLE_API_KEY not found");
        }

        this.model = model;
        this.genAI = new GoogleGenerativeAI(this.apiKey);
    }


    setModel(model: string) {
        if (model && model !== this.model) {
            this.model = model;
        }
    }

    private isRetryable(err: any): boolean {

        return (
            err.status === 429 ||
            err.status === 503
        );
    }

    private getRetryDelay(err: any, attempt: number): number {
        const retryAfter =
            err?.response?.headers?.["retry-after"] ??
            err?.headers?.["retry-after"];

        if (retryAfter) {
            const seconds = Number(retryAfter);

            if (!Number.isNaN(seconds)) {
                return seconds * 1000;
            }

            const date = Date.parse(retryAfter);

            if (!Number.isNaN(date)) {
                return Math.max(0, date - Date.now());
            }
        }

        // Exponential backoff
        const baseDelay = 1000;
        const exponentialDelay = baseDelay * Math.pow(2, attempt);

        // Jitter: evita que varios clientes reintenten exactamente al mismo tiempo
        const jitter = Math.random() * 500;

        return exponentialDelay + jitter;
    }

    private async generateWithRetry(
        messages: Message[],
    ): Promise<string> {

        const MAX_RETRIES = 3;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {

            try {

                return await this.generate(messages);

            } catch (err: any) {

                if (!this.isRetryable(err) || attempt === MAX_RETRIES) {
                    throw new AgentException(this.mapError(err));
                }

                const delay = this.getRetryDelay(err, attempt);

                console.log(
                    `Retry ${attempt + 1}/${MAX_RETRIES} in ${delay}ms`
                );

                await new Promise(resolve =>
                    setTimeout(resolve, delay)
                );
            }
        }

        throw new Error("Unexpected retry state");
    }

    private async generate(
        messages: Message[]
    ): Promise<string> {

        const model = this.genAI.getGenerativeModel({
            model: this.model
        });

        const formatted = messages
            .map((m) => `${m.role}: ${m.content}`)
            .join("\n");

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: formatted }],
                },
            ],
        });

        return result.response.text();
    }

    private mapError(err: any): AgentError {

        console.log(`El status es: ${err.status}`);

        if (err.status === 429) {
            return {
                type: "quota_exceeded",
                message: "Gemini quota exceeded",
                recoverable: false,
            };
        }

        if (err.status === 401 || err.status === 403) {
            return {
                type: "authentication",
                message: "Invalid Gemini credentials",
                recoverable: false,
            };
        }

        return {
            type: "unknown",
            message: err.message ?? "Unknown Gemini error",
            recoverable: false,
        };
    }

    // 
    

    async invoke(messages: Message[]): Promise<string> {
        return this.generateWithRetry(messages);
    }

}

