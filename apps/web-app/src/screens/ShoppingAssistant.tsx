import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Product {
  id: number;
  name: string;
  brand?: string;
  price: number;
  quantity?: string;
  category: string;
  image: string;
}

interface ShoppingAssistantProps {
  catalog: Product[];
  onProductSelected: (product: Product) => void;
  onClose: () => void;
}

type QuestionKey = "budget" | "brand" | "features" | "color" | "confirm";

const ShoppingAssistant: React.FC<ShoppingAssistantProps> = ({
  catalog,
  onProductSelected,
  onClose,
}) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [userInput, setUserInput] = useState("");

  // Dynamic questions - starts with what product they're looking for
  const generateQuestions = () => {
    const baseQuestions: Array<{ key: QuestionKey | "type"; label: string }> = [
      { key: "type", label: "What product are you looking for? (e.g., fan, milk, pizza)" },
      { key: "budget", label: "What's your budget range? (e.g., $100-500)" },
      { key: "brand", label: "Any preferred brand? (optional - press Skip)" },
      { key: "features", label: "Any must-have features? (optional - press Skip)" },
      { key: "color", label: "Preferred color? (optional - press Skip)" },
    ];
    return baseQuestions;
  };

  const questions = generateQuestions();

  const filterProducts = (filterAnswers: Record<string, string>): Product[] => {
    let filtered = catalog;

    // Filter by product type (search in name, category, brand)
    if (filterAnswers.type) {
      const searchTerm = filterAnswers.type.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm) ||
          p.brand?.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by budget
    if (filterAnswers.budget) {
      const budgetNum = Number(filterAnswers.budget.replace(/[^\d]/g, ""));
      if (budgetNum > 0) {
        filtered = filtered.filter((p) => p.price <= budgetNum);
      }
    }

    // Filter by brand
    if (filterAnswers.brand && filterAnswers.brand.toLowerCase() !== "skip") {
      filtered = filtered.filter(
        (p) =>
          p.brand?.toLowerCase().includes(filterAnswers.brand.toLowerCase()) || false
      );
    }

    // Filter by color (if available in name)
    if (filterAnswers.color && filterAnswers.color.toLowerCase() !== "skip") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(filterAnswers.color.toLowerCase())
      );
    }

    return filtered.slice(0, 3); // Show top 3 matches
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[step];
    if (!currentQuestion) return;

    const newAnswers = { ...answers, [currentQuestion.key]: answer };
    setAnswers(newAnswers);

    // Check confidence and suggest if we have enough info or user says "just show me"
    if (
      answer.toLowerCase().includes("just show") ||
      step >= questions.length - 1
    ) {
      const filtered = filterProducts(newAnswers);
      setSuggestions(filtered.length > 0 ? filtered : catalog.slice(0, 3));
      return;
    }

    // Move to next question
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const filtered = filterProducts(newAnswers);
      setSuggestions(filtered.length > 0 ? filtered : catalog.slice(0, 3));
    }

    setUserInput("");
  };

  const handleSkip = () => {
    handleAnswer("skip");
  };

  // Initial state: ask questions directly (no popup list)
  if (suggestions.length === 0 && step === 0 && !answers.type) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Shopping Assistant</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-gray-700 font-medium mb-4">{questions[0]?.label}</p>

        <div className="space-y-2">
          <input
            type="text"
            autoFocus
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && userInput.trim()) {
                handleAnswer(userInput);
              }
            }}
            placeholder="e.g., fan, milk, pizza..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => {
              if (userInput.trim()) {
                handleAnswer(userInput);
              }
            }}
            disabled={!userInput.trim()}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Suggestions state: show filtered products
  if (suggestions.length > 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Perfect Matches!</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {suggestions.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl flex-shrink-0">{product.image}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  {product.brand && (
                    <p className="text-xs text-gray-500">Brand: {product.brand}</p>
                  )}
                  {product.quantity && (
                    <p className="text-xs text-gray-500">{product.quantity}</p>
                  )}
                  <p className="text-green-600 font-bold mt-1">${product.price}</p>
                </div>
              </div>
              <button
                onClick={() => onProductSelected(product)}
                className="w-full mt-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setSuggestions([]);
            setStep(0);
            setAnswers({});
            setUserInput("");
          }}
          className="w-full mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
        >
          Search Again
        </button>
      </div>
    );
  }

  // Q&A state: ask follow-up questions
  const currentQuestion = questions[step];
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          {answers.category} - Question {step + 1}/{questions.length}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <p className="text-gray-700 font-medium mb-4">{currentQuestion?.label}</p>

      <div className="space-y-2">
        <input
          type="text"
          autoFocus
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && userInput.trim()) {
              handleAnswer(userInput);
            }
          }}
          placeholder="Type your answer..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2">
          <button
            onClick={() => {
              if (userInput.trim()) {
                handleAnswer(userInput);
              }
            }}
            disabled={!userInput.trim()}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
          >
            Answer
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
          >
            Skip
          </button>
        </div>

        {step === questions.length - 1 && (
          <button
            onClick={() => handleAnswer("just show me")}
            className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            Just Show Me Great Options! 🎯
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Step {step + 1} of {questions.length}
      </p>
    </div>
  );
};

export default ShoppingAssistant;
