import { Groq } from "groq-sdk";
import { assert } from "gadget-server";

/** @type { import("gadget-server").ActionOptions } */
export const options = {
  permissions: {
    public: true
  }
};

const GROQ_API_KEY = "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";

/** @type { ActionRun } */
export const run = async ({ params, logger }) => {
  try {
    logger.info("Chat action started with params:", JSON.stringify(params, null, 2));
    
    // Validate message
    if (!params?.message?.content) {
      logger.error("Missing message content in params");
      return {
        success: false,
        error: "Message content is required"
      };
    }

    // Initialize Groq client
    logger.info("Initializing Groq client...");
    const client = new Groq({
      apiKey: GROQ_API_KEY
    });
    logger.info("Groq client initialized");

    // Prepare API request
    const messages = [
      {
        role: "system",
        content: "You are a helpful AI assistant. Provide clear, concise, and accurate responses to user questions."
      },
      {
        role: "user",
        content: params.message.content
      }
    ];

    logger.info("Making request to Groq API with messages:", JSON.stringify(messages, null, 2));

    try {
      // Call Groq API
      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      });

      logger.info("Groq API response received:", JSON.stringify(completion, null, 2));

      const responseContent = completion.choices?.[0]?.message?.content;

      if (!responseContent) {
        logger.error("No response content in Groq API response");
        return {
          success: false,
          error: "No response content from Groq API"
        };
      }

      logger.info("Returning successful response:", responseContent);
      return {
        success: true,
        response: responseContent
      };
    } catch (groqError) {
      logger.error("Groq API Error:", {
        error: groqError,
        message: groqError.message,
        response: groqError.response?.data
      });
      throw groqError;
    }

  } catch (error) {
    logger.error("Error in chat action:", {
      error: error,
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    return {
      success: false,
      error: error.message || "An unexpected error occurred"
    };
  }
}
