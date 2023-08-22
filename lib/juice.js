// server side prompts derived from juice.php
function sub(q) { return  q.doc?.includes("<mark>") ? "marked text" : "document" }

module.exports =  {
  custom: q => {
    let pre = q.persona ? `[Assume this role: ${q.persona}]\n` : ""
    if (q.link) pre += `With help of the 'reference' page${q.doc ? `, as applied to the ${sub(q)}` : ""}: `
    else if (q.doc) pre += `In reference to the ${sub(q)}: `
    return pre + q.value
  },

  // language processing
  langDetect: q => `Name the language the ${sub(q)} is in. On a separate line, provide any dialect used in the language. Then on a separate line, provide the ISO language code. Then On a separate line, provide the best character encoding for the language used. Then on a separate line, provide the best and most popular font used for this language. Finally list the potential target regions where this language is spoken.`,
  nonTranslatable: q => `You are looking for non-translatables, which are names, abbreviations, words, and expressions that you must not translate. On the first line, indicate with a Yes or No, whether the ${sub(q)} contains non-traslables. In a separate paragraph, the list of Non-Translatables.`,
  allTransAnalysis: q => `Provide answers in a 2-column table with borders and 25px padding in each cell. The left-hand column contains 'Does the text contain Ambiguity', 'Is the text ready for Translation', and 'Does the text contain Non-Translatables'. In the right-hand column, provide short answers. Indicate with a Yes or No if possible, 1. Does the ${sub(q)} contains ambiguity?, 2. Does the ${sub(q)} contain any non-translatables?, 3. Is the Source ${sub(q)} Content Quality ready for Translation?`, // request by example or starter
  fleschScore: q => `Provide only the Flesch-Kinaid Score on the first line. Then in a separate paragraph provide the overall readability explanation of the ${sub(q)} based on the Flesch Kinaid Scoring System.`,
  techLangDetect: q => `Provide a Yes or No to indicated if there is technical language in the ${sub(q)}. Then list what is considered technical language and provide the associated definition of each technical term.`,
  inclusiveLangDetect: q => `Tell me if the ${sub(q)} includes inclusive text, by simple a Yes, or No on the first line. Then on separate lines, explain whether the ${sub(q)} is using inclusive language.`,
  subMatter: q => `Classify the domain of the ${sub(q)} so we can identify the best type of translator. Place the domain on one line and the subdomain on the second line. Then provide a translator profile for the best type of translator or the ${sub(q)}.`,
  readerLevelDetect: q => `Determine and provide the reader level used in the ${sub(q)}. Then in parentheses indicate what grade level this would equate to. Then on a separate line, explain the reasoning behind the determination.`,
  listEntities: q => `Create a list of named entities from the ${sub(q)} which include person, location, organization, product, that can be denoted with a proper name.`,
  idSensitive: q => `Tell me if the ${sub(q)} includes any sensitive text, by simple a Yes, or No on the first line. Then in another paragraph, explain what the sensitive content is and why it's considered sensitive.`,
  personalInfo: q => `Tell me if the ${sub(q)} includes any content that may be considered personal information, by simple a Yes, or No on the first line. Then in another paragraph, indicate that there is an the content should be anonymized to comply with HIPAA, GDPR and CCPA standards and best practices.`,
  targetAudience: q => `Determine what audience the ${sub(q)} is intended for in a few words. Then explain why this is believed to be the intended audience.`,
  dateFormatDetect: q => `Tell me on the first line what date format is used throughout the ${sub(q)}. Then in a separate paragraph, provide some examples from the ${sub(q)}.`,
  toneDetect: q => `Tell me on the first line what tone of writing is used in the ${sub(q)}. Then in a separate paragraph, provide examples from the ${sub(q)} to support the determination.`,
  sentimentDetect: q => `Tell me on the first line what literary sentiment used in the ${sub(q)}. Then in a separate paragraph, provide examples from the ${sub(q)} to support the determination.`,
  ambiguityDetect: q => `Tell me on the first line if any portion of the ${sub(q)} may be considered ambiguous. Then in a separate paragraph, provide examples from the ${sub(q)} that may be ambiguous and that would need to be clarified before translation.`,
  qaCheck: q => `Assess the overall quality of the ${sub(q)} based on writing style, use of speed, and overall readability. Then in a separate list, state what you consider the problem areas may be.`,
  stripTags: q => `Remove all the tags in the ${sub(q)} to enhance the readability for the average person. We just want to focus on the readable content.`,
  spellCheck: q => `Correct all the misspelled words in the ${sub(q)}. Then correct it and show the ${sub(q)}. Following the corrected ${sub(q)}, list all the misspelled words and the corrected spelling of each word.`,
  anonymize: q => `Replace all content in the ${sub(q)} that could be considered personal data with '[...]' to comply with HIPAA, GDPR, and CCPA regulations. This should include Name, Address, Social Security number, Medical information, Health insurance information, Payment information, Email address, Phone number, Postal address, IP address, Biometric data, Geolocation data, Employment information, Cookie data, Location data, Online identifiers (e.g. usernames, social media handlesm), Genetic data, Racial or ethnic data, Political opinions, and Sexual orientation.`,
  setUsage: q => `Rewrite the ${sub(q)} to ensure it is using ${q.value}.`,
  extractTerm: q => `Create a list of terminology from the ${sub(q)} that would be deemed important to understand.`,
  removeAmbiguity: q => `Detect and remove any ambiguity from the ${sub(q)} so that it may then be translated.`,
  summarize: q => `Summarize the ${sub(q)} into bullet points.`,
  setDates: q => `Adjust the date format throughout the ${sub(q)} to use the following format: ${q.value}.`,
  setLength: q => `Adjust the length of the ${sub(q)} as follows: ${q.value}`,
  setTone: q => `Adjust the tone of the ${sub(q)} to use the literary ${q.value}.`,
  setLevel: q => `Modify the ${sub(q)} for a reading level best suited for a ${q.value} audience.`,
  translateInto: q => `Translate the ${sub(q)} into ${q.value} using translation best practices.`,
  transBiTable: q => `Provide each sentence of the ${sub(q)} and it's translation in ${q.value} on a new row in a 2-column table`,
  biTermTable: q => `Extract Terminology from the ${sub(q)} that would be deemed important to understand. Provide each term and it's translation in ${q.value} on a new row in a 2-column table.`,
  transcreateInto: q => `Provide 3 distinctly different ${q.value} translations of the ${sub(q)} using different styles, allowing me to select Option 1, 2 or 3.`,

  // content creation
  ideas: q => `Create a numbered list of writing ideas in this topic: ${q.value}.`,
  resumeTemp: q => `Create a resume template appropriate for the ${q.value} industry and inducate with brackets what needs to be filled in. Provide suggestions and considerations.`,
  letterTemp: q => `Provide a formatted sample letter regarding this: ${q.value}.\n Anonamise specific details with brackets.`,
  paperTemp: q => `Provide a template structure with headings for an academic paper for this discipline: ${q.value}`,
  storyline: q => `Suggest the storyline in bulletpoints for a fictional story in the genre of ${q.value}`,
  outlines: q => `Suggest the outlines including headings, subheadings, bulletpoints and structure for a non-fictional book on the theme of ${q.value}`,
  story: q => `Write a detailed short fictional story following this narrative: ${q.value}`,
  poetry: q => `Write me a poem on this subject: ${q.value}`,
  article: q => `Write a short atricle on this subject matter ${q.value}`,
  blurp: q => `Write a blurp for this literature.`,
  tldr: q => `Write a short TLDR for the document.`,
  title: q => `Propose a couple of titles for the literature.`,

  heated: [
    "ideas",
    "resumeTemp",
    "letterTemp",
    "paperTemp",
    "storyline",
    "outlines",
    "story",
    "poem",
    "article",
    "blurp",
    "tldr",
    "title"
  ]
}