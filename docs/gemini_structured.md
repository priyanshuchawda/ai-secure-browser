Structured Outputs

content_copy


You can configure Gemini models to generate responses that adhere to a provided JSON Schema. This capability guarantees predictable and parsable results, ensures format and type-safety, enables the programmatic detection of refusals, and simplifies prompting.

Using structured outputs is ideal for a wide range of applications:

Data extraction: Pull specific information from unstructured text, like extracting names, dates, and amounts from an invoice.
Structured classification: Classify text into predefined categories and assign structured labels, such as categorizing customer feedback by sentiment and topic.
Agentic workflows: Generate structured data that can be used to call other tools or APIs, like creating a character sheet for a game or filling out a form.
In addition to supporting JSON Schema in the REST API, the Google GenAI SDKs for Python and JavaScript also make it easy to define object schemas using Pydantic and Zod, respectively. The example below demonstrates how to extract information from unstructured text that conforms to a schema defined in code.

Recipe Extractor Content Moderation Recursive Structures

This example demonstrates how to extract structured data from text using basic JSON Schema types like object, array, string, and integer.

Python
JavaScript
Go
REST

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ingredientSchema = z.object({
  name: z.string().describe("Name of the ingredient."),
  quantity: z.string().describe("Quantity of the ingredient, including units."),
});

const recipeSchema = z.object({
  recipe_name: z.string().describe("The name of the recipe."),
  prep_time_minutes: z.number().optional().describe("Optional time in minutes to prepare the recipe."),
  ingredients: z.array(ingredientSchema),
  instructions: z.array(z.string()),
});

const ai = new GoogleGenAI({});

const prompt = `
Please extract the recipe from the following text.
The user wants to make delicious chocolate chip cookies.
They need 2 and 1/4 cups of all-purpose flour, 1 teaspoon of baking soda,
1 teaspoon of salt, 1 cup of unsalted butter (softened), 3/4 cup of granulated sugar,
3/4 cup of packed brown sugar, 1 teaspoon of vanilla extract, and 2 large eggs.
For the best part, they'll need 2 cups of semisweet chocolate chips.
First, preheat the oven to 375°F (190°C). Then, in a small bowl, whisk together the flour,
baking soda, and salt. In a large bowl, cream together the butter, granulated sugar, and brown sugar
until light and fluffy. Beat in the vanilla and eggs, one at a time. Gradually beat in the dry
ingredients until just combined. Finally, stir in the chocolate chips. Drop by rounded tablespoons
onto ungreased baking sheets and bake for 9 to 11 minutes.
`;

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
  config: {
    responseMimeType: "application/json",
    responseJsonSchema: zodToJsonSchema(recipeSchema),
  },
});

const recipe = recipeSchema.parse(JSON.parse(response.text));
console.log(recipe);
Example Response:


{
  "recipe_name": "Delicious Chocolate Chip Cookies",
  "ingredients": [
    {
      "name": "all-purpose flour",
      "quantity": "2 and 1/4 cups"
    },
    {
      "name": "baking soda",
      "quantity": "1 teaspoon"
    },
    {
      "name": "salt",
      "quantity": "1 teaspoon"
    },
    {
      "name": "unsalted butter (softened)",
      "quantity": "1 cup"
    },
    {
      "name": "granulated sugar",
      "quantity": "3/4 cup"
    },
    {
      "name": "packed brown sugar",
      "quantity": "3/4 cup"
    },
    {
      "name": "vanilla extract",
      "quantity": "1 teaspoon"
    },
    {
      "name": "large eggs",
      "quantity": "2"
    },
    {
      "name": "semisweet chocolate chips",
      "quantity": "2 cups"
    }
  ],
  "instructions": [
    "Preheat the oven to 375°F (190°C).",
    "In a small bowl, whisk together the flour, baking soda, and salt.",
    "In a large bowl, cream together the butter, granulated sugar, and brown sugar until light and fluffy.",
    "Beat in the vanilla and eggs, one at a time.",
    "Gradually beat in the dry ingredients until just combined.",
    "Stir in the chocolate chips.",
    "Drop by rounded tablespoons onto ungreased baking sheets and bake for 9 to 11 minutes."
  ]
}
Streaming
You can stream structured outputs, which allows you to start processing the response as it's being generated, without having to wait for the entire output to be complete. This can improve the perceived performance of your application.

The streamed chunks will be valid partial JSON strings, which can be concatenated to form the final, complete JSON object.

Python
JavaScript

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({});
const prompt = "The new UI is incredibly intuitive and visually appealing. Great job! Add a very long summary to test streaming!";

const feedbackSchema = z.object({
  sentiment: z.enum(["positive", "neutral", "negative"]),
  summary: z.string(),
});

const stream = await ai.models.generateContentStream({
  model: "gemini-2.5-flash",
  contents: prompt,
  config: {
    responseMimeType: "application/json",
    responseJsonSchema: zodToJsonSchema(feedbackSchema),
  },
});

for await (const chunk of stream) {
  console.log(chunk.candidates[0].content.parts[0].text)
}
Structured outputs with tools
Preview: This is a feature available only for the Gemini 3 series models, gemini-3-pro-preview and gemini-3-flash-preview.
Gemini 3 lets you combine Structured Outputs with built-in tools, including Grounding with Google Search, URL Context, Code Execution, and File Search.

Python
JavaScript
REST

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({});

const matchSchema = z.object({
  winner: z.string().describe("The name of the winner."),
  final_match_score: z.string().describe("The final score."),
  scorers: z.array(z.string()).describe("The name of the scorer.")
});

async function run() {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: "Search for all details for the latest Euro.",
    config: {
      tools: [
        { googleSearch: {} },
        { urlContext: {} }
      ],
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(matchSchema),
    },
  });

  const match = matchSchema.parse(JSON.parse(response.text));
  console.log(match);
}

run();
JSON schema support
To generate a JSON object, set the response_mime_type in the generation configuration to application/json and provide a response_json_schema. The schema must be a valid JSON Schema that describes the desired output format.

The model will then generate a response that is a syntactically valid JSON string matching the provided schema. When using structured outputs, the model will produce outputs in the same order as the keys in the schema.

Gemini's structured output mode supports a subset of the JSON Schema specification.

The following values of type are supported:

string: For text.
number: For floating-point numbers.
integer: For whole numbers.
boolean: For true/false values.
object: For structured data with key-value pairs.
array: For lists of items.
null: To allow a property to be null, include "null" in the type array (e.g., {"type": ["string", "null"]}).
These descriptive properties help guide the model:

title: A short description of a property.
description: A longer and more detailed description of a property.
Type-specific properties
For object values:

properties: An object where each key is a property name and each value is a schema for that property.
required: An array of strings, listing which properties are mandatory.
additionalProperties: Controls whether properties not listed in properties are allowed. Can be a boolean or a schema.
For string values:

enum: Lists a specific set of possible strings for classification tasks.
format: Specifies a syntax for the string, such as date-time, date, time.
For number and integer values:

enum: Lists a specific set of possible numeric values.
minimum: The minimum inclusive value.
maximum: The maximum inclusive value.
For array values:

items: Defines the schema for all items in the array.
prefixItems: Defines a list of schemas for the first N items, allowing for tuple-like structures.
minItems: The minimum number of items in the array.
maxItems: The maximum number of items in the array.
Model support
The following models support structured output:

Model	Structured Outputs
Gemini 3 Pro Preview	✔️
Gemini 3 Flash Preview	✔️
Gemini 2.5 Pro	✔️
Gemini 2.5 Flash	✔️
Gemini 2.5 Flash-Lite	✔️
Gemini 2.0 Flash	✔️*
Gemini 2.0 Flash-Lite	✔️*
* Note that Gemini 2.0 requires an explicit propertyOrdering list within the JSON input to define the preferred structure. You can find an example in this cookbook.

Structured outputs vs. function calling
Both structured outputs and function calling use JSON schemas, but they serve different purposes:

Feature	Primary Use Case
Structured Outputs	Formatting the final response to the user. Use this when you want the model's answer to be in a specific format (e.g., extracting data from a document to save to a database).
Function Calling	Taking action during the conversation. Use this when the model needs to ask you to perform a task (e.g., "get current weather") before it can provide a final answer.
Best practices
Clear descriptions: Use the description field in your schema to provide clear instructions to the model about what each property represents. This is crucial for guiding the model's output.
Strong typing: Use specific types (integer, string, enum) whenever possible. If a parameter has a limited set of valid values, use an enum.
Prompt engineering: Clearly state in your prompt what you want the model to do. For example, "Extract the following information from the text..." or "Classify this feedback according to the provided schema...".
Validation: While structured output guarantees syntactically correct JSON, it does not guarantee the values are semantically correct. Always validate the final output in your application code before using it.
Error handling: Implement robust error handling in your application to gracefully manage cases where the model's output, while schema-compliant, may not meet your business logic requirements.
Limitations
Schema subset: Not all features of the JSON Schema specification are supported. The model ignores unsupported properties.
Schema complexity: The API may reject very large or deeply nested schemas. If you encounter errors, try simplifying your schema by shortening property names, reducing nesting, or limiting the number of constraints.

Understand and count tokens

content_copy


Gemini and other generative AI models process input and output at a granularity called a token.

For Gemini models, a token is equivalent to about 4 characters. 100 tokens is equal to about 60-80 English words.

About tokens
Tokens can be single characters like z or whole words like cat. Long words are broken up into several tokens. The set of all tokens used by the model is called the vocabulary, and the process of splitting text into tokens is called tokenization.

When billing is enabled, the cost of a call to the Gemini API is determined in part by the number of input and output tokens, so knowing how to count tokens can be helpful.



Python JavaScript Go

Count tokens
All input to and output from the Gemini API is tokenized, including text, image files, and other non-text modalities.

You can count tokens in the following ways:

Call countTokens with the input of the request.
This returns the total number of tokens in the input only. You can make this call before sending the input to the model to check the size of your requests.

Use the usageMetadata attribute on the response object after calling generate_content.
This returns the total number of tokens in both the input and the output: totalTokenCount.
It also returns the token counts of the input and output separately: promptTokenCount (input tokens) and candidatesTokenCount (output tokens). And if you are using Context caching, the cached token count will be in cachedContentTokenCount.

If you are using a thinking model like the 2.5 ones, the token used during the thinking process are returned in thoughtsTokenCount.

Count text tokens
If you call countTokens with a text-only input, it returns the token count of the text in the input only (totalTokens). You can make this call before calling generateContent to check the size of your requests.

Another option is calling generateContent and then using the usageMetadata attribute on the response object to get the following:

The separate token counts of the input (promptTokenCount), the cached content (cachedContentTokenCount) and the output (candidatesTokenCount)
The token count for the thinking process (thoughtsTokenCount)
The total number of tokens in both the input and the output (totalTokenCount)

// Make sure to include the following import:
// import {GoogleGenAI} from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const prompt = "The quick brown fox jumps over the lazy dog.";
const countTokensResponse = await ai.models.countTokens({
  model: "gemini-2.0-flash",
  contents: prompt,
});
console.log(countTokensResponse.totalTokens);

const generateResponse = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: prompt,
});
console.log(generateResponse.usageMetadata);

Count multi-turn (chat) tokens
If you call countTokens with the chat history, it returns the total token count of the text from each role in the chat (totalTokens).

Another option is calling sendMessage and then using the usageMetadata attribute on the response object to get the following:

The separate token counts of the input (promptTokenCount), the cached content (cachedContentTokenCount) and the output (candidatesTokenCount)
The token count for the thinking process (thoughtsTokenCount)
The total number of tokens in both the input and the output (totalTokenCount)
To understand how big your next conversational turn will be, you need to append it to the history when you call countTokens.


// Make sure to include the following import:
// import {GoogleGenAI} from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// Initial chat history.
const history = [
  { role: "user", parts: [{ text: "Hi my name is Bob" }] },
  { role: "model", parts: [{ text: "Hi Bob!" }] },
];
const chat = ai.chats.create({
  model: "gemini-2.0-flash",
  history: history,
});

// Count tokens for the current chat history.
const countTokensResponse = await ai.models.countTokens({
  model: "gemini-2.0-flash",
  contents: chat.getHistory(),
});
console.log(countTokensResponse.totalTokens);

const chatResponse = await chat.sendMessage({
  message: "In one sentence, explain how a computer works to a young child.",
});
console.log(chatResponse.usageMetadata);

// Add an extra user message to the history.
const extraMessage = {
  role: "user",
  parts: [{ text: "What is the meaning of life?" }],
};
const combinedHistory = chat.getHistory();
combinedHistory.push(extraMessage);
const combinedCountTokensResponse = await ai.models.countTokens({
  model: "gemini-2.0-flash",
  contents: combinedHistory,
});
console.log(
  "Combined history token count:",
  combinedCountTokensResponse.totalTokens,
);

Count multimodal tokens
All input to the Gemini API is tokenized, including text, image files, and other non-text modalities. Note the following high-level key points about tokenization of multimodal input during processing by the Gemini API:

With Gemini 2.0, image inputs with both dimensions <=384 pixels are counted as 258 tokens. Images larger in one or both dimensions are cropped and scaled as needed into tiles of 768x768 pixels, each counted as 258 tokens. Prior to Gemini 2.0, images used a fixed 258 tokens.

Video and audio files are converted to tokens at the following fixed rates: video at 263 tokens per second and audio at 32 tokens per second.

Media resolutions
Gemini 3 Pro Preview introduces granular control over multimodal vision processing with the media_resolution parameter. The media_resolution parameter determines the maximum number of tokens allocated per input image or video frame. Higher resolutions improve the model's ability to read fine text or identify small details, but increase token usage and latency.

For more details about the parameter and how it can impact token calculations, see the media resolution guide.

Image files
If you call countTokens with a text-and-image input, it returns the combined token count of the text and the image in the input only (totalTokens). You can make this call before calling generateContent to check the size of your requests. You can also optionally call countTokens on the text and the file separately.

Another option is calling generateContent and then using the usageMetadata attribute on the response object to get the following:

The separate token counts of the input (promptTokenCount), the cached content (cachedContentTokenCount) and the output (candidatesTokenCount)
The token count for the thinking process (thoughtsTokenCount)
The total number of tokens in both the input and the output (totalTokenCount)
Note: You'll get the same token count if you use a file uploaded using the File API or you provide the file as inline data.
Example that uses an uploaded image from the File API:


// Make sure to include the following import:
// import {GoogleGenAI} from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const prompt = "Tell me about this image";
const organ = await ai.files.upload({
  file: path.join(media, "organ.jpg"),
  config: { mimeType: "image/jpeg" },
});

const countTokensResponse = await ai.models.countTokens({
  model: "gemini-2.0-flash",
  contents: createUserContent([
    prompt,
    createPartFromUri(organ.uri, organ.mimeType),
  ]),
});
console.log(countTokensResponse.totalTokens);

const generateResponse = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: createUserContent([
    prompt,
    createPartFromUri(organ.uri, organ.mimeType),
  ]),
});
console.log(generateResponse.usageMetadata);

Example that provides the image as inline data:


// Make sure to include the following import:
// import {GoogleGenAI} from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const prompt = "Tell me about this image";
const imageBuffer = fs.readFileSync(path.join(media, "organ.jpg"));

// Convert buffer to base64 string.
const imageBase64 = imageBuffer.toString("base64");

// Build contents using createUserContent and createPartFromBase64.
const contents = createUserContent([
  prompt,
  createPartFromBase64(imageBase64, "image/jpeg"),
]);

const countTokensResponse = await ai.models.countTokens({
  model: "gemini-2.0-flash",
  contents: contents,
});
console.log(countTokensResponse.totalTokens);

const generateResponse = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: contents,
});
console.log(generateResponse.usageMetadata);

Video or audio files
Audio and video are each converted to tokens at the following fixed rates:

Video: 263 tokens per second
Audio: 32 tokens per second
If you call countTokens with a text-and-video/audio input, it returns the combined token count of the text and the video/audio file in the input only (totalTokens). You can make this call before calling generateContent to check the size of your requests. You can also optionally call countTokens on the text and the file separately.

Another option is calling generateContent and then using the usageMetadata attribute on the response object to get the following:

The separate token counts of the input (promptTokenCount), the cached content (cachedContentTokenCount) and the output (candidatesTokenCount)
The token count for the thinking process (thoughtsTokenCount)
The total number of tokens in both the input and the output (totalTokenCount)
Note: You'll get the same token count if you use a file uploaded using the File API or you provide the file as inline data.

// Make sure to include the following import:
// import {GoogleGenAI} from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const prompt = "Tell me about this video";
let videoFile = await ai.files.upload({
  file: path.join(media, "Big_Buck_Bunny.mp4"),
  config: { mimeType: "video/mp4" },
});

// Poll until the video file is completely processed (state becomes ACTIVE).
while (!videoFile.state || videoFile.state.toString() !== "ACTIVE") {
  console.log("Processing video...");
  console.log("File state: ", videoFile.state);
  await sleep(5000);
  videoFile = await ai.files.get({ name: videoFile.name });
}

const countTokensResponse = await ai.models.countTokens({
  model: "gemini-2.0-flash",
  contents: createUserContent([
    prompt,
    createPartFromUri(videoFile.uri, videoFile.mimeType),
  ]),
});
console.log(countTokensResponse.totalTokens);

const generateResponse = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: createUserContent([
    prompt,
    createPartFromUri(videoFile.uri, videoFile.mimeType),
  ]),
});
console.log(generateResponse.usageMetadata);

System instructions and tools
System instructions and tools also count towards the total token count for the input.

If you use system instructions, the totalTokens count increases to reflect the addition of systemInstruction.

If you use function calling, the totalTokens count increases to reflect the addition of tools.

Context caching

content_copy


Python JavaScript Go REST

In a typical AI workflow, you might pass the same input tokens over and over to a model. The Gemini API offers two different caching mechanisms:

Implicit caching (automatically enabled on most Gemini models, no cost saving guarantee)
Explicit caching (can be manually enabled on most models, cost saving guarantee)
Explicit caching is useful in cases where you want to guarantee cost savings, but with some added developer work.

Implicit caching
Implicit caching is enabled by default and available for most Gemini models. We automatically pass on cost savings if your request hits caches. There is nothing you need to do in order to enable this. It is effective as of May 8th, 2025. The minimum input token count for context caching is listed in the following table for each model:

Model	Min token limit
Gemini 3 Flash Preview	1024
Gemini 3 Pro Preview	4096
Gemini 2.5 Flash	1024
Gemini 2.5 Pro	4096
To increase the chance of an implicit cache hit:

Try putting large and common contents at the beginning of your prompt
Try to send requests with similar prefix in a short amount of time
You can see the number of tokens which were cache hits in the response object's usage_metadata field.

Explicit caching
Using the Gemini API explicit caching feature, you can pass some content to the model once, cache the input tokens, and then refer to the cached tokens for subsequent requests. At certain volumes, using cached tokens is lower cost than passing in the same corpus of tokens repeatedly.

When you cache a set of tokens, you can choose how long you want the cache to exist before the tokens are automatically deleted. This caching duration is called the time to live (TTL). If not set, the TTL defaults to 1 hour. The cost for caching depends on the input token size and how long you want the tokens to persist.

This section assumes that you've installed a Gemini SDK (or have curl installed) and that you've configured an API key, as shown in the quickstart.

Generate content using a cache
The following example shows how to generate content using a cached system instruction and a text file.


import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

async function main() {
  const doc = await ai.files.upload({
    file: "path/to/file.txt",
    config: { mimeType: "text/plain" },
  });
  console.log("Uploaded file name:", doc.name);

  const modelName = "gemini-2.0-flash-001";
  const cache = await ai.caches.create({
    model: modelName,
    config: {
      contents: createUserContent(createPartFromUri(doc.uri, doc.mimeType)),
      systemInstruction: "You are an expert analyzing transcripts.",
    },
  });
  console.log("Cache created:", cache);

  const response = await ai.models.generateContent({
    model: modelName,
    contents: "Please summarize this transcript",
    config: { cachedContent: cache.name },
  });
  console.log("Response text:", response.text);
}

await main();
List caches
It's not possible to retrieve or view cached content, but you can retrieve cache metadata (name, model, displayName, usageMetadata, createTime, updateTime, and expireTime).

To list metadata for all uploaded caches, use GoogleGenAI.caches.list():


console.log("My caches:");
const pager = await ai.caches.list({ config: { pageSize: 10 } });
let page = pager.page;
while (true) {
  for (const c of page) {
    console.log("    ", c.name);
  }
  if (!pager.hasNextPage()) break;
  page = await pager.nextPage();
}
Update a cache
You can set a new ttl or expireTime for a cache. Changing anything else about the cache isn't supported.

The following example shows how to update the ttl of a cache using GoogleGenAI.caches.update().


const ttl = `${2 * 3600}s`; // 2 hours in seconds
const updatedCache = await ai.caches.update({
  name: cache.name,
  config: { ttl },
});
console.log("After update (TTL):", updatedCache);
Delete a cache
The caching service provides a delete operation for manually removing content from the cache. The following example shows how to delete a cache using GoogleGenAI.caches.delete().


await ai.caches.delete({ name: cache.name });
Explicit caching using the OpenAI library
If you're using an OpenAI library, you can enable explicit caching using the cached_content property on extra_body.

When to use explicit caching
Context caching is particularly well suited to scenarios where a substantial initial context is referenced repeatedly by shorter requests. Consider using context caching for use cases such as:

Chatbots with extensive system instructions
Repetitive analysis of lengthy video files
Recurring queries against large document sets
Frequent code repository analysis or bug fixing
How explicit caching reduces costs
Context caching is a paid feature designed to reduce overall operational costs. Billing is based on the following factors:

Cache token count: The number of input tokens cached, billed at a reduced rate when included in subsequent prompts.
Storage duration: The amount of time cached tokens are stored (TTL), billed based on the TTL duration of cached token count. There are no minimum or maximum bounds on the TTL.
Other factors: Other charges apply, such as for non-cached input tokens and output tokens.
For up-to-date pricing details, refer to the Gemini API pricing page. To learn how to count tokens, see the Token guide.

Additional considerations
Keep the following considerations in mind when using context caching:

The minimum input token count for context caching varies by model. The maximum is the same as the maximum for the given model. (For more on counting tokens, see the Token guide).
The model doesn't make any distinction between cached tokens and regular input tokens. Cached content is a prefix to the prompt.
There are no special rate or usage limits on context caching; the standard rate limits for GenerateContent apply, and token limits include cached tokens.
The number of cached tokens is returned in the usage_metadata from the create, get, and list operations of the cache service, and also in GenerateContent when using the cache.

URL context

content_copy


The URL context tool lets you provide additional context to the models in the form of URLs. By including URLs in your request, the model will access the content from those pages (as long as it's not a URL type listed in the limitations section) to inform and enhance its response.

The URL context tool is useful for tasks like the following:

Extract Data: Pull specific info like prices, names, or key findings from multiple URLs.
Compare Documents: Analyze multiple reports, articles, or PDFs to identify differences and track trends.
Synthesize & Create Content: Combine information from several source URLs to generate accurate summaries, blog posts, or reports.
Analyze Code & Docs: Point to a GitHub repository or technical documentation to explain code, generate setup instructions, or answer questions.
The following example shows how to compare two recipes from different websites.

Python
Javascript
REST

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
        "Compare the ingredients and cooking times from the recipes at https://www.foodnetwork.com/recipes/ina-garten/perfect-roast-chicken-recipe-1940592 and https://www.allrecipes.com/recipe/21151/simple-whole-roast-chicken/",
    ],
    config: {
      tools: [{urlContext: {}}],
    },
  });
  console.log(response.text);

  // For verification, you can inspect the metadata to see which URLs the model retrieved
  console.log(response.candidates[0].urlContextMetadata)
}

await main();
How it works
The URL Context tool uses a two-step retrieval process to balance speed, cost, and access to fresh data. When you provide a URL, the tool first attempts to fetch the content from an internal index cache. This acts as a highly optimized cache. If a URL is not available in the index (for example, if it's a very new page), the tool automatically falls back to do a live fetch. This directly accesses the URL to retrieve its content in real-time.

Combining with other tools
You can combine the URL context tool with other tools to create more powerful workflows.

Grounding with search
When both URL context and Grounding with Google Search are enabled, the model can use its search capabilities to find relevant information online and then use the URL context tool to get a more in-depth understanding of the pages it finds. This approach is powerful for prompts that require both broad searching and deep analysis of specific pages.

Python
Javascript
REST

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
        "Give me three day events schedule based on YOUR_URL. Also let me know what needs to taken care of considering weather and commute.",
    ],
    config: {
      tools: [
        {urlContext: {}},
        {googleSearch: {}}
        ],
    },
  });
  console.log(response.text);
  // To get URLs retrieved for context
  console.log(response.candidates[0].urlContextMetadata)
}

await main();
Understanding the response
When the model uses the URL context tool, the response includes a url_context_metadata object. This object lists the URLs the model retrieved content from and the status of each retrieval attempt, which is useful for verification and debugging.

The following is an example of that part of the response (parts of the response have been omitted for brevity):


{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "... \n"
          }
        ],
        "role": "model"
      },
      ...
      "url_context_metadata": {
        "url_metadata": [
          {
            "retrieved_url": "https://www.foodnetwork.com/recipes/ina-garten/perfect-roast-chicken-recipe-1940592",
            "url_retrieval_status": "URL_RETRIEVAL_STATUS_SUCCESS"
          },
          {
            "retrieved_url": "https://www.allrecipes.com/recipe/21151/simple-whole-roast-chicken/",
            "url_retrieval_status": "URL_RETRIEVAL_STATUS_SUCCESS"
          }
        ]
      }
    }
}
For complete detail about this object , see the UrlContextMetadata API reference.

Safety checks
The system performs a content moderation check on the URL to confirm they meet safety standards. If the URL you provided fails this check, you will get an url_retrieval_status of URL_RETRIEVAL_STATUS_UNSAFE.

Token count
The content retrieved from the URLs you specify in your prompt is counted as part of the input tokens. You can see the token count for your prompt and tools usage in the usage_metadata object of the model output. The following is an example output:


'usage_metadata': {
  'candidates_token_count': 45,
  'prompt_token_count': 27,
  'prompt_tokens_details': [{'modality': <MediaModality.TEXT: 'TEXT'>,
    'token_count': 27}],
  'thoughts_token_count': 31,
  'tool_use_prompt_token_count': 10309,
  'tool_use_prompt_tokens_details': [{'modality': <MediaModality.TEXT: 'TEXT'>,
    'token_count': 10309}],
  'total_token_count': 10412
  }
Price per token depends on the model used, see the pricing page for details.

Supported models
gemini-3-flash
gemini-3-pro
gemini-2.5-pro
gemini-2.5-flash
gemini-2.5-flash-lite
Best Practices
Provide specific URLs: For the best results, provide direct URLs to the content you want the model to analyze. The model will only retrieve content from the URLs you provide, not any content from nested links.
Check for accessibility: Verify that the URLs you provide don't lead to pages that require a login or are behind a paywall.
Use the complete URL: Provide the full URL, including the protocol (e.g., https://www.google.com instead of just google.com).
Limitations
Function calling: Tool use (URL Context, Grounding with Google Search, etc) with function calling is currently unsupported.
Request limit: The tool can process up to 20 URLs per request.
URL content size: The maximum size for content retrieved from a single URL is 34MB.
Supported and unsupported content types
The tool can extract content from URLs with the following content types:

Text (text/html, application/json, text/plain, text/xml, text/css, text/javascript , text/csv, text/rtf)
Image (image/png, image/jpeg, image/bmp, image/webp)
PDF (application/pdf)
The following content types are not supported:

Paywalled content
YouTube videos (See video understanding to learn how to process YouTube URLs)
Google workspace files like Google docs or spreadsheets
Video and audio files
What's next
Explore the URL context cookbook for more examples.