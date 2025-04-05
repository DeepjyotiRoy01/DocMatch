
// Helper function to calculate word frequency in a document
export const calculateWordFrequency = (text: string): Record<string, number> => {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFrequency: Record<string, number> = {};
  
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  return wordFrequency;
};

// Function to calculate cosine similarity between two documents
export const calculateCosineSimilarity = (doc1: string, doc2: string): number => {
  const freq1 = calculateWordFrequency(doc1);
  const freq2 = calculateWordFrequency(doc2);
  
  // Get all unique words
  const allWords = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
  
  // Calculate dot product
  let dotProduct = 0;
  allWords.forEach(word => {
    dotProduct += (freq1[word] || 0) * (freq2[word] || 0);
  });
  
  // Calculate magnitudes
  const mag1 = Math.sqrt(Object.values(freq1).reduce((sum, freq) => sum + freq * freq, 0));
  const mag2 = Math.sqrt(Object.values(freq2).reduce((sum, freq) => sum + freq * freq, 0));
  
  // Return cosine similarity
  return dotProduct / (mag1 * mag2) || 0;
};

// Function to calculate Levenshtein distance between two strings
export const calculateLevenshteinDistance = (s1: string, s2: string): number => {
  const m = s1.length;
  const n = s2.length;
  
  // Create matrix
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  // Fill first row and column
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  // Fill the rest of the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return dp[m][n];
};

// Normalize Levenshtein distance to a similarity score (0-1)
export const calculateLevenshteinSimilarity = (s1: string, s2: string): number => {
  const distance = calculateLevenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  return maxLength === 0 ? 1 : 1 - distance / maxLength;
};

// Function to match documents based on the selected algorithm
export const matchDocuments = (
  sourceDoc: string,
  targetDocs: { id: string; content: string }[],
  algorithm: 'frequency' | 'cosine' | 'levenshtein' = 'frequency'
): { id: string; similarity: number }[] => {
  if (!sourceDoc || targetDocs.length === 0) return [];
  
  return targetDocs.map(doc => {
    let similarity: number;
    
    switch (algorithm) {
      case 'cosine':
        similarity = calculateCosineSimilarity(sourceDoc, doc.content);
        break;
      case 'levenshtein':
        similarity = calculateLevenshteinSimilarity(sourceDoc, doc.content);
        break;
      case 'frequency':
      default:
        // Simple similarity based on word frequency
        const sourceFreq = calculateWordFrequency(sourceDoc);
        const targetFreq = calculateWordFrequency(doc.content);
        
        const allWords = new Set([...Object.keys(sourceFreq), ...Object.keys(targetFreq)]);
        let matches = 0;
        let total = 0;
        
        allWords.forEach(word => {
          if (sourceFreq[word] > 0 && targetFreq[word] > 0) {
            matches += Math.min(sourceFreq[word], targetFreq[word]);
          }
          total += Math.max(sourceFreq[word] || 0, targetFreq[word] || 0);
        });
        
        similarity = total > 0 ? matches / total : 0;
    }
    
    return { id: doc.id, similarity };
  }).sort((a, b) => b.similarity - a.similarity);
};
