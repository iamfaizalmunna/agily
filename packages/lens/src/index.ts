/* c8 ignore next */
export {
  DEFAULT_OLLAMA_BASE,
  DEFAULT_OLLAMA_MODEL,
  isLoopbackUrl,
  resolveOllamaBase,
  resolveOllamaModel,
} from "./loopback";
export {
  parseKbMarkdown,
  retrieveKb,
  scoreKbDoc,
  snippetAround,
  tokenize,
  type KbDoc,
  type KbHit,
} from "./kb";
export {
  boardCounts,
  buildLensPrompt,
  checklistFromBody,
  cleanTitle,
  extractiveAnswer,
  parseOllamaChat,
  type BoardFact,
} from "./extract";
export {
  LENS_ASK_BODY_BYTES,
  LENS_ASK_BODY_LIMIT,
  LENS_QUESTION_MAX_LEN,
  applyLensCors,
  clientIpFromRequest,
  isLensKbHttpEnabled,
  lensAskThrottleStatus,
  lensCorsAllowlist,
  publicLensHealthPayload,
  recordLensAsk,
  resetLensAskThrottle,
  safeKbBasename,
} from "./api-security";
