// src/questionsDatabase.js
import initSqlJs from 'sql.js';

// Fallback questions from questions.js
import { questions as fallbackQuestions } from './questions.js';

// Modified to accept an optional array of domains to filter by
export async function getAllQuestions(domains = []) {
  try {
    // Initialize sql.js and tell it where to load the wasm file from:
    const SQL = await initSqlJs({
      locateFile: () => '/sql-wasm.wasm', // now served from the public folder
    });

    // Fetch the bundled SQLite file (ensure it is also in your public folder)
    const response = await fetch('/questions.sqlite');
    if (!response.ok) {
      throw new Error('Failed to load the SQLite database file.');
    }
    const buffer = await response.arrayBuffer();

    // Open the database in memory from the buffer
    const db = new SQL.Database(new Uint8Array(buffer));

    // Base query
    let query = "SELECT * FROM questions";
    const params = {}; // Use named parameters for safety

    // Add WHERE clause if domains are provided
    if (domains && domains.length > 0) {
      const placeholders = domains.map((domain, index) => {
        const key = `:domain${index}`;
        params[key] = domain;
        return key;
      }).join(', ');
      query += ` WHERE domain IN (${placeholders})`;
    }

    // Execute the potentially filtered query
    const result = db.exec(query, params); // Pass params object
    if (!result.length || !result[0].values.length) { // Check if values exist
      db.close(); // Close DB even if no results
      return [];
    }
    const { columns, values } = result[0];
    const questions = values.map(row => {
      const question = {};
      row.forEach((val, index) => {
        const col = columns[index];
        // Parse JSON fields (options, correct_answers, sources)
        if (['options', 'correct_answers', 'sources'].includes(col)) {
          try {
            // Handle potential null or empty strings before parsing
            question[col] = val ? JSON.parse(val) : null;
          } catch (e) {
            console.warn(`Failed to parse JSON for column ${col}, value: ${val}`, e);
            question[col] = null; // Default to null on parse error
          }
        } else {
          question[col] = val;
        }
      });
      return question;
    });

    db.close();
    return questions;
  } catch (error) {
    console.warn('SQL.js failed, using fallback questions:', error);
    // Use fallback questions if SQL.js fails
    if (domains && domains.length > 0) {
      return fallbackQuestions.filter(q => domains.includes(q.domain));
    }
    return fallbackQuestions;
  }
}

export async function getAvailableDomains() {
  try {
    // Initialize sql.js
    const SQL = await initSqlJs({
      locateFile: () => '/sql-wasm.wasm',
    });

    // Fetch the database file
    const response = await fetch('/questions.sqlite');
    if (!response.ok) {
      throw new Error('Failed to load the SQLite database file.');
    }
    const buffer = await response.arrayBuffer();

    // Open the database
    const db = new SQL.Database(new Uint8Array(buffer));

    // Execute query to select distinct domains
    const result = db.exec("SELECT DISTINCT domain FROM questions ORDER BY domain");
    let domains = [];
    if (result.length && result[0].values.length) {
      domains = result[0].values.map(row => row[0]); // Get the first column (domain) from each row
    }

    db.close();
    return domains;
  } catch (error) {
    console.warn('SQL.js failed, using fallback domains:', error);
    // Return default domains as fallback
    return ['Kubernetes_Security_Fundamentals', 'Kubernetes_Cluster_Component_Security', 'Kubernetes_Threat_Model', 'Cloud_Native_Security', 'Platform_Security', 'Compliance_and_Security_Frameworks'];
  }
}
