# AI Features Roadmap for Bahikhata

This document outlines the AI capabilities to be integrated into the Bahikhata platform. These features are designed to reduce manual data entry, provide proactive financial insights, and enable natural language interaction with financial data.

## Phase 1: Data Ingestion & Automation (OCR)
**Goal:** Minimize friction in adding transactions and documents.

### 1. Smart Receipt Scanner (OCR)
- **Problem:** Manually entering transaction details from paper receipts is tedious.
- **Solution:** Allow users to upload images/PDFs of receipts. Use Multimodal LLMs (e.g., Gemini 1.5 Flash) to extract structured data.
- **Capabilities:**
    - Extract `Merchant Name`, `Date`, `Total Amount`, `Tax Amount`, and `Currency`.
    - Extract line items (optional but useful for detailed splitting).
    - Auto-suggest `Category` based on line items.
- **Tech Stack:** Python Server (FastAPI) + Google Gemini ViT / Tesseract / Document AI.

### 2. Auto-Categorization Engine
- **Problem:** New transactions often default to "Uncategorized", requiring manual sorting.
- **Solution:** Predict the category for a transaction based on `Description`, `Merchant`, and `Amount`.
- **Capabilities:**
    - Learn from user's historical corrections (Code-based or few-shot prompting).
    - Map "Uber" -> "Transport", "Starbucks" -> "Food & Drink" automatically.
    - Confidence scores: Auto-approve high confidence, flag low confidence for review.

## Phase 2: Conversational Insights (RAG)
**Goal:** Make financial data accessible through natural language.

### 3. Financial Assistant Chatbot ("Bahi-Bot")
- **Problem:** Finding specific insights ("How much did I spend on travel last year?") requires complex filtering of tables.
- **Solution:** A chat interface where users ask questions in plain English.
- **Capabilities:**
    - **Transaction Querying:** "Show me all expenses above ₹5000 from last month."
    - **Summarization:** "Give me a summary of my spending trends this week."
    - **Complex Reasoning:** "Why is my balance lower than expected?" (Analyzes recent large outflows).
- **Tech Stack:** LangChain/LlamaIndex + Vector DB (pgvector) for retrieving relevant transaction history + LLM for answer generation.

### 4. Semantic Search
- **Problem:** Exact keyword search fails (searching "Lunch" misses "McDonalds").
- **Solution:** Vector embeddings for transaction descriptions and categories.
- **Capabilities:**
    - Searching "Medical" retrieves "Pharmacy", "Doctor", "CVS", even if the word "Medical" isn't strictly present.

## Phase 3: Predictive & Proactive Intelligence
**Goal:** Help users stay on budget and avoid bad surprises.

### 5. Smart Budget Forecasting
- **Problem:** Users only know they overspent *after* the fact.
- **Solution:** Predict end-of-month spending based on the current run rate.
- **Capabilities:**
    - "At this rate, you will exceed your Food budget by the 25th."
    - Forecast recurring bills (Rent, Netflix) and subtract them from "Safe to Spend" balance.

### 6. Anomaly & Subscription Detection
- **Problem:** Hidden subscriptions or double-charges go unnoticed.
- **Solution:** Analyze transaction patterns.
- **Capabilities:**
    - **Vampire Subscriptions:** Identify recurring monthly payments that are NOT in the `Subscriptions` table and suggest adding them.
    - **Price Hikes:** "Your internet bill increased by 10% this month compared to the last 6 month average."
    - **Double Charge Alert:** Two identical transactions on the same day.

### 7. Goal Feasibility Analysis
- **Problem:** Users set unrealistic savings goals.
- **Solution:** Analyze income vs. expense capability.
- **Capabilities:**
    - "Based on your average monthly savings of ₹10k, you will reach your goal of ₹1 Lakh in 10 months (Oct 2026), not Aug 2026."
    - Suggest adjustments: "Reduce 'Dining Out' by 15% to hit your goal on time."

## Implementation Priority
1.  **OCR/Parsing** (High Value, Tangible)
2.  **Auto-Categorization** (High Value, Tangible)
3.  **Chatbot/RAG** (High Wow Factor, High Complexity)
4.  **Forecasting/Anomalies** (High Utility, Medium Complexity)
