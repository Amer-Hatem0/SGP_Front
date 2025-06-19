import ONNXModelService from './onnxModelService';
import { BertTokenizer } from '@xenova/transformers';
import metadata from './diagnosis_metadata_finale.json';



class SymptomAnalyzer {
    constructor() {
      this.tokenizer = null;
      this.labelMap = metadata.label_map;
      this.symptomDiseaseMap = metadata.symptom_disease_map;
      this.diseaseSymptomMap = metadata.disease_symptom_map;
      this.currentSymptoms = new Set();
      this.possibleConditions = new Set();
      this.diagnosticPath = [];
      this.symptomIndices = this.createSymptomIndices();
      this.loaded = this.loadResources();
      this.retryCount = 0;
      this.maxRetries = 3;
      this.emulatedMode = false;
      this.narrowingRounds = 0;
    }
  
    createSymptomIndices() {
      const indices = {};
      Object.keys(this.symptomDiseaseMap).forEach((symptom, index) => {
        indices[symptom] = index;
      });
      return indices;
    }
  
    async loadResources() {
      try {
        // Try loading from HuggingFace CDN first
        this.tokenizer = await BertTokenizer.from_pretrained(
          'emilyalsentzer/Bio_ClinicalBERT',
          {
            revision: 'main',
            progress_callback: (progress) => {
              console.log(`Download progress: ${progress.loaded}/${progress.total} bytes`);
            }
          }
        );
  
        // Initialize ONNX model
        await ONNXModelService.initialize();
        console.log('AI models loaded successfully');
      } catch (error) {
        console.error('Model loading error:', error);
        
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log(`Retrying in ${this.retryCount * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, this.retryCount * 2000));
          return this.loadResources();
        }
  
        console.warn('Falling back to emulated mode with limited functionality');
        this.emulatedMode = true;
        this.tokenizer = this.createBasicTokenizer();
      }
    }
  
    createBasicTokenizer() {
      // Simple word-based tokenizer for fallback mode
      return {
        async call(text, options) {
          const words = text.toLowerCase().split(/\s+/);
          const tokens = [101, ...words.map(w => w.charCodeAt(0) % 5000), 102];
          return {
            input_ids: new Int32Array(tokens),
            attention_mask: new Int32Array(tokens.map(() => 1))
          };
        }
      };
    }
  
    async predictCondition(text) {
      try {
        await this.loaded;
        
        // Tokenize input
        const inputs = await this.tokenizer.call(text, {
          padding: 'max_length',
          truncation: true,
          max_length: 128
        });
  
        // Create symptoms tensor
        const symptoms = this.extractSymptoms(text);
        const symptomsTensor = new Float32Array(Object.keys(this.symptomDiseaseMap).length).fill(0);
        symptoms.forEach(s => {
          if (this.symptomIndices[s] !== undefined) {
            symptomsTensor[this.symptomIndices[s]] = 1;
          }
        });
  
        if (this.emulatedMode) {
          // Fallback to simple symptom matching when models fail to load
          const possibleConditions = this.findPossibleConditions();
          return possibleConditions.size > 0 
            ? Array.from(possibleConditions)[0] 
            : 'unknown condition';
        }
        await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
  
        // Run ONNX model prediction
        const logits = await ONNXModelService.predict(
          inputs.input_ids,
          inputs.attention_mask,
          symptomsTensor
        );
        
        const predictedIndex = this.argmax(logits);
        return this.labelMap[predictedIndex.toString()];
      } catch (error) {
        console.error('Prediction error:', error);
        throw new Error(this.emulatedMode 
          ? 'Basic symptom analysis failed'
          : 'AI analysis failed. Please try again later.');
      }
    }

  argmax(array) {
    return array.reduce((maxIndex, item, index) => 
      item > array[maxIndex] ? index : maxIndex, 0);
  }

  // extractSymptoms(text) {   // POSITIVE ONLY
  //   const symptoms = new Set();
  //   const textLower = text.toLowerCase();
    
  //   Object.keys(this.symptomDiseaseMap).forEach(symptom => {
  //     if (textLower.includes(symptom.toLowerCase())) {
  //       symptoms.add(symptom);
  //     }
  //   });
    
  //   return Array.from(symptoms);
  // }

  extractSymptomsWithNegation(text) {
  const positive = new Set();
  const negative = new Set();
  const textLower = text.toLowerCase();

  const negationPatterns = [
    /not\s+(\w+(?:\s+\w+)?)/g,            // e.g., "not nausea", "not chest pain"
    /don't\s+have\s+(\w+(?:\s+\w+)?)/g,   // e.g., "don't have fever"
    /no\s+(\w+(?:\s+\w+)?)/g,             // e.g., "no cough"
    /without\s+(\w+(?:\s+\w+)?)/g         // e.g., "without headache"
  ];

  Object.keys(this.symptomDiseaseMap).forEach(symptom => {
    if (textLower.includes(symptom.toLowerCase())) {
      positive.add(symptom);
    }
  });

  for (const pattern of negationPatterns) {
    let match;
    while ((match = pattern.exec(textLower)) !== null) {
      const matchedSymptom = match[1]?.trim();
      if (matchedSymptom) {
        for (const realSymptom of Object.keys(this.symptomDiseaseMap)) {
          if (realSymptom.toLowerCase().includes(matchedSymptom)) {
            negative.add(realSymptom);
            positive.delete(realSymptom); // remove if falsely marked positive
          }
        }
      }
    }
  }

  return {
    positive: Array.from(positive),
    negative: Array.from(negative)
  };
}


  async analyzeInput(text) {
    await this.loaded;
    
    const { positive, negative } = this.extractSymptomsWithNegation(text);

    positive.forEach(s => this.currentSymptoms.add(s));
    negative.forEach(s => this.currentSymptoms.delete(s));

    this.diagnosticPath.push(`Patient reported: ${text}`);


    if (this.currentSymptoms.size < 3) {
      return this.generateFollowUpQuestionForMoreSymptoms();
    }

    const severityWords = ['mild', 'moderate', 'severe'];
    if (severityWords.some(word => text.toLowerCase().includes(word))) {
      this.diagnosticPath.push(`Patient described symptom severity: ${text}`);
      return this.generateDiagnosisGuess();  // new method to continue
    }

    const noMoreSymptomsPhrases = [
  "that's all", "no more", "nothing else", "i'm done", "that's it", "no i don't", "no i do not", "no"
];

if (noMoreSymptomsPhrases.some(phrase => text.toLowerCase().includes(phrase))) {
  this.diagnosticPath.push("Patient indicated no further symptoms.");
  return {
    text: "Thanks for the information. Based on what you've shared, I recommend visiting a general physician for a full evaluation.",
    isDiagnosis: true,
    isQuestion: false,
    reasoning: [...this.diagnosticPath],
    specialty: "general practice"
  };
}


    const possibleConditions = this.findPossibleConditions();
    
    // Only proceed with diagnosis if we have exactly one high-confidence condition
    // if (possibleConditions.size === 1 && this.hasStrongMatch(possibleConditions)) {
    //   return this.generateDiagnosis(Array.from(possibleConditions)[0]);
    // }
    this.narrowingRounds = (this.narrowingRounds || 0) + 1;
    if (
      possibleConditions.size === 1 &&
      this.hasStrongMatch(possibleConditions) &&
      this.narrowingRounds >= 2
    ) {
      return this.generateDiagnosis(Array.from(possibleConditions)[0]);
    }
    /////////////
    
     // Otherwise ask follow-up questions
    return this.generateFollowUpQuestion(possibleConditions);
  }

  generateFollowUpQuestionForMoreSymptoms() {
    // Find symptoms commonly associated with current symptoms but not yet reported
    const relatedSymptoms = [];
    
    this.currentSymptoms.forEach(symptom => {
      this.symptomDiseaseMap[symptom]?.forEach(condition => {
        this.diseaseSymptomMap[condition]?.forEach(relatedSymptom => {
          if (!this.currentSymptoms.has(relatedSymptom)) {
            relatedSymptoms.push(relatedSymptom);
          }
        });
      });
    });

    // Ask about the most commonly related symptom
  //   if (relatedSymptoms.length > 0) {
  //     const mostCommonSymptom = this.findMostCommonSymptom(relatedSymptoms);
  //     this.diagnosticPath.push(`Gathering more symptoms: ${mostCommonSymptom}`);
  //     return {
  //       text: `Do you have ${mostCommonSymptom}?`,
  //       isQuestion: true,
  //       isDiagnosis: false
  //     };
  //   }

  //   // Fallback question
  //   return {
  //     text: "Can you describe any other symptoms you're experiencing?",
  //     isQuestion: true,
  //     isDiagnosis: false
  //   };
  // }
  if (relatedSymptoms.length > 0) {
      const topSymptoms = this.findTopCommonSymptoms(relatedSymptoms, 3);
      const questionText = topSymptoms.map(s => `• Do you have ${s}?`).join('\n');
      this.diagnosticPath.push(`Gathering more symptoms: ${topSymptoms.join(', ')}`);
      return {
        text: `Can you tell me if you have any of the following symptoms?\n${questionText}`,
        isQuestion: true,
        isDiagnosis: false,
        symptomsToConfirm: topSymptoms
      };
    }

    return {
      text: "Can you describe any other symptoms you're experiencing?",
      isQuestion: true,
      isDiagnosis: false
    };
  }

  //  findMostCommonSymptom(symptoms) {
  //   const frequency = {};
  //   symptoms.forEach(symptom => {
  //     frequency[symptom] = (frequency[symptom] || 0) + 1;
  //   });
  //   return Object.entries(frequency).sort((a, b) => b[1] - a[1])[0][0];
  // }
  findTopCommonSymptoms(symptoms, count) {
    const frequency = {};
    symptoms.forEach(symptom => {
      frequency[symptom] = (frequency[symptom] || 0) + 1;
    });
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([symptom]) => symptom);
  }

  hasStrongMatch(possibleConditions) {
    const condition = Array.from(possibleConditions)[0];
    const requiredSymptoms = this.diseaseSymptomMap[condition]?.length || 0;
    const matchedSymptoms = this.countMatchingSymptoms(condition);
    
    // Require at least 60% of symptoms for this condition to be present
    // return matchedSymptoms / requiredSymptoms >= 0.6;
    //////////////////////
    // Dynamic threshold: require more confidence with fewer symptoms
    const baseThreshold = 0.5;
    const dynamicBoost = 0.05 * (3 - Math.min(this.currentSymptoms.size, 3));
    return matchedSymptoms / requiredSymptoms >= baseThreshold + dynamicBoost;

  }

  countMatchingSymptoms(condition) {
    let count = 0;
    this.diseaseSymptomMap[condition]?.forEach(symptom => {
      if (this.currentSymptoms.has(symptom)) count++;
    });
    return count;
  }

  generateDiagnosisGuess() {
  const possibleConditions = this.findPossibleConditions();
  if (possibleConditions.size === 1 && this.hasStrongMatch(possibleConditions)) {
    return this.generateDiagnosis(Array.from(possibleConditions)[0]);
  }

  return {
    text: "Thanks! Based on what I know, I still need a bit more. Could you mention any other symptoms?",
    isQuestion: true,
    isDiagnosis: false
  };
}


  findPossibleConditions() {
    const conditionScores = {};
    
    this.currentSymptoms.forEach(symptom => {
      this.symptomDiseaseMap[symptom]?.forEach(condition => {
        conditionScores[condition] = (conditionScores[condition] || 0) + 1;
      });
    });
    
    const maxScore = Math.max(...Object.values(conditionScores));
    return new Set(
      Object.entries(conditionScores)
        .filter(([_, score]) => score === maxScore)
        .map(([condition]) => condition)
    );
  }

  // generateFollowUpQuestion(possibleConditions) {
  //   const differentiatingSymptoms = this.findDifferentiatingSymptoms(possibleConditions);
    
  //   if (differentiatingSymptoms.length > 0) {
  //     const symptom = differentiatingSymptoms[0];
  //     this.diagnosticPath.push(`Differentiating question: ${symptom}`);
  //     return {
  //       text: `Do you have ${symptom}?`,
  //       isQuestion: true,
  //       isDiagnosis: false
  //     };
  //   }
    
  //   const symptomToAsk = Array.from(this.currentSymptoms)[0];
  //   return {
  //     text: `Describe your ${symptomToAsk} severity (mild/moderate/severe)`,
  //     isQuestion: true,
  //     isDiagnosis: false
  //   };
  // }

  generateFollowUpQuestion(possibleConditions) {
    const differentiatingSymptoms = this.findDifferentiatingSymptoms(possibleConditions);
    if (differentiatingSymptoms.length > 0) {
      const topSymptoms = differentiatingSymptoms.slice(0, 3);
      const questionText = topSymptoms.map(s => `• Do you have ${s}?`).join('\n');
      this.diagnosticPath.push(`Differentiating questions: ${topSymptoms.join(', ')}`);
      return {
        text: `To help narrow it down, please answer:\n${questionText}`,
        isQuestion: true,
        isDiagnosis: false,
        symptomsToConfirm: topSymptoms
      };
    }

    if (this.diagnosticPath.some(step => step.toLowerCase().includes('still analyzing'))) {
    return {
      text: "Understood. Please see a doctor if symptoms persist or worsen.",
      isQuestion: false,
      isDiagnosis: true,
      reasoning: [...this.diagnosticPath],
      specialty: "general practice"
    };
  }

    if (this.diagnosticPath.some(step => step.toLowerCase().includes('severity'))) {
  return {
    text: "Thanks! I'm still analyzing your symptoms. Is there anything else you feel or noticed?",
    isQuestion: true,
    isDiagnosis: false
  };
}

const fallback = Array.from(this.currentSymptoms)[0];
this.diagnosticPath.push(`Asked about severity of: ${fallback}`);
return {
  text: `Describe your ${fallback} severity (mild/moderate/severe)`,
  isQuestion: true,
  isDiagnosis: false
};

  }

  findDifferentiatingSymptoms(possibleConditions) {
    const conditionList = Array.from(possibleConditions);
    const allSymptoms = new Set();
    
    conditionList.forEach(condition => {
      this.diseaseSymptomMap[condition]?.forEach(symptom => {
        allSymptoms.add(symptom);
      });
    });
    
    const differentiatingSymptoms = [];
    allSymptoms.forEach(symptom => {
      if (!this.currentSymptoms.has(symptom)) {
        const conditionsWithSymptom = conditionList.filter(condition => 
          this.diseaseSymptomMap[condition]?.includes(symptom)
        );
        
        if (conditionsWithSymptom.length > 0 && conditionsWithSymptom.length < conditionList.length) {
          differentiatingSymptoms.push(symptom);
        }
      }
    });
    
    return differentiatingSymptoms;
  }

  /*
  findDifferentiatingSymptoms(possibleConditions) {
    const list = Array.from(possibleConditions);
    const allSymptoms = new Set();
    list.forEach(cond => {
      this.diseaseSymptomMap[cond]?.forEach(s => allSymptoms.add(s));
    });

    return Array.from(allSymptoms).filter(symptom => {
      if (this.currentSymptoms.has(symptom)) return false;
      const count = list.filter(cond => this.diseaseSymptomMap[cond]?.includes(symptom)).length;
      return count > 0 && count < list.length;
    });
  }
  */
  generateDiagnosis(condition) {
    const reasoning = [...this.diagnosticPath];
    reasoning.push(`Final diagnosis: ${condition}`);
    
    return {
      text: `Based on symptoms, possible condition: ${condition}. Consult a ${this.mapConditionToSpecialty(condition)} specialist.`,
      isQuestion: false,
      isDiagnosis: true,
      reasoning: reasoning,
      specialty: this.mapConditionToSpecialty(condition)
    };
  }

  mapConditionToSpecialty(condition) {
    const conditionLower = condition.toLowerCase();
    const specialtyMap = {
      'heart': 'cardiology',
      'lung': 'pulmonology',
      'stomach': 'gastroenterology',
      'skin': 'dermatology',
      'brain': 'neurology',
      'joint': 'rheumatology',
      'diabet': 'endocrinology',
      'infection': 'infectious disease',
      'mental': 'psychiatry'
    };

    for (const [key, specialty] of Object.entries(specialtyMap)) {
      if (conditionLower.includes(key)) return specialty;
    }
    return 'general practice';
  }

  resetConversation() {
    this.currentSymptoms.clear();
    this.possibleConditions.clear();
    this.diagnosticPath = [];
    this.narrowingRounds = 0;
  }
}

export default SymptomAnalyzer;