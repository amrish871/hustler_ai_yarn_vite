import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import {
  Mic,
  MessageSquare,
  Send,
  Camera,
  Image,
  Store,
  Search,
  MapPin,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Package,
  ChevronDown,
  Grid,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import CheckoutPage from "../components/CheckoutPage";

type Message = {
  text?: string;
  image?: string | null;
  sender: "user" | "ai";
  recommendations?: Array<{ storeId: number; store: Store; product: Product }>;
};
type Store = {
  id: number;
  name: string;
  category: string;
  rating: number;
  distance: string;
  image: string;
  popular: string[];
  catalog: Product[];
};
type Product = {
  id: number;
  name: string;
  brand?: string;
  price: number;
  quantity?: string;
  category: string;
  image: string;
};
type CartItem = Omit<Product, 'quantity'> & { quantity: number; storeId: number };
export default function HomeScreen() {
      const [storeProductSuggestions, setStoreProductSuggestions] = useState<{store: Store, product: Product}[]>([]);
    const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');
  const [showConversation, setShowConversation] = useState<boolean>(false);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [showMediaOptions, setShowMediaOptions] = useState<boolean>(false);
  const [showStoreSearch, setShowStoreSearch] = useState<boolean>(false);
  const [storeSearchQuery, setStoreSearchQuery] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showCatalog, setShowCatalog] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [catalogSearchQuery, setCatalogSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set(["All"]));
  const [showBrandDropdown, setShowBrandDropdown] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("cod");
  const [showCheckoutPaymentModal, setShowCheckoutPaymentModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("123 Main Street, Apt 4B, New York, NY 10001");
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<"chat" | "catalog" | "cart">("chat");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [showShoppingAssistant, setShowShoppingAssistant] = useState<boolean>(false);
  const [assistantStep, setAssistantStep] = useState<number>(0);
  const [assistantAnswers, setAssistantAnswers] = useState<Record<string, string>>({});
  const [assistantSuggestions, setAssistantSuggestions] = useState<Array<{store: Store, product: Product}>>([]);
  const [recommendationQuantities, setRecommendationQuantities] = useState<Record<string, number>>({})
  
  // Cart context
  const { setCartCount, setOnCartClick } = useCart();
  
  const addresses = [
    { id: 1, label: "Home", address: "123 Main Street, Apt 4B, New York, NY 10001" },
    { id: 2, label: "Office", address: "456 Business Ave, Suite 200, New York, NY 10002" },
    { id: 3, label: "Friend's Place", address: "789 Oak Road, Brooklyn, NY 10003" },
  ];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const carouselSlides = [
    {
      id: 1,
      title: "Order Grocery",
      emoji: "🛒",
      description: "Browse nearby stores",
      color: "from-green-500/20 to-emerald-600/20",
    },
    {
      id: 2,
      title: "Order Medicines",
      emoji: "💊",
      description: "Get medicines delivered",
      color: "from-indigo-500/20 to-purple-600/20",
    },
    {
      id: 3,
      title: "Order Food",
      emoji: "🍕",
      description: "Food delivery from restaurants",
      color: "from-orange-500/20 to-red-600/20",
    },
  ];

  const goPrev = () =>
    setCarouselIndex(
      (i) => (i - 1 + carouselSlides.length) % carouselSlides.length
    );
  const goNext = () => setCarouselIndex((i) => (i + 1) % carouselSlides.length);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  // Auto-focus the chat input when chat tab is active
  useEffect(() => {
    if (currentTab === "chat" && showConversation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentTab, showConversation]);

  // Sync cart state with CartContext for navbar
  useEffect(() => {
    const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalCartCount);
    setOnCartClick(() => () => {
      setShowCheckout(true);
    });
  }, [cart, setCartCount, setOnCartClick]);

  // Get all products from all stores for the shopping assistant
  const getAllProducts = (): Product[] => {
    const allProducts: Product[] = [];
    stores.forEach((store) => {
      allProducts.push(...store.catalog);
    });
    return allProducts;
  };

  // Shopping Assistant questions
  const getAssistantQuestions = () => {
    return [
      { key: "type", label: "What product are you looking for? (e.g., fan, milk, pizza)" },
      { key: "budget", label: "What's your budget range? (e.g., $100-500)" },
      { key: "brand", label: "Any preferred brand? (type 'skip' to skip)" },
      { key: "features", label: "Any must-have features? (type 'skip' to skip)" },
      { key: "color", label: "Preferred color? (type 'skip' to skip)" },
    ];
  };

  // Filter products for shopping assistant (includes store info)
  const filterAssistantProducts = (answers: Record<string, string>): Array<{store: Store, product: Product}> => {
    const results: Array<{store: Store, product: Product}> = [];

    stores.forEach((store) => {
      let filtered = store.catalog;

      // Filter by product type
      if (answers.type) {
        const searchTerm = answers.type.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm) ||
            p.brand?.toLowerCase().includes(searchTerm)
        );
      }

      // Filter by budget
      if (answers.budget) {
        const budgetNum = Number(answers.budget.replace(/[^\d]/g, ""));
        if (budgetNum > 0) {
          filtered = filtered.filter((p) => p.price <= budgetNum);
        }
      }

      // Filter by brand
      if (answers.brand && answers.brand.toLowerCase() !== "skip") {
        filtered = filtered.filter(
          (p) =>
            p.brand?.toLowerCase().includes(answers.brand.toLowerCase()) || false
        );
      }

      // Filter by color
      if (answers.color && answers.color.toLowerCase() !== "skip") {
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(answers.color.toLowerCase())
        );
      }

      // Add results with store info
      filtered.forEach((product) => {
        results.push({ store, product });
      });
    });

    return results.slice(0, 3); // Show top 3 matches
  };

  // Handle assistant answer in chat
  const handleAssistantAnswer = (answer: string) => {
    const questions = getAssistantQuestions();
    const currentQuestion = questions[assistantStep];

    if (!currentQuestion) return;

    const newAnswers = { ...assistantAnswers, [currentQuestion.key]: answer };
    setAssistantAnswers(newAnswers);

    // Post user's answer to chat
    setMessages((prev) => [
      ...prev,
      { text: answer, sender: "user" },
    ]);

    // Check if we should show suggestions
    if (
      answer.toLowerCase().includes("just show") ||
      assistantStep >= questions.length - 1
    ) {
      const filtered = filterAssistantProducts(newAnswers);
      setAssistantSuggestions(filtered);
      
      // Post suggestion message with recommendations
      setMessages((prev) => [
        ...prev,
        {
          text: `Great! Here are my recommendations based on your answers:`,
          sender: "ai",
          recommendations: filtered.map((item) => ({
            storeId: item.store.id,
            store: item.store,
            product: item.product,
          })),
        },
      ]);
      setShowShoppingAssistant(false);
      return;
    }

    // Move to next question
    if (assistantStep < questions.length - 1) {
      setAssistantStep(assistantStep + 1);
      const nextQuestion = questions[assistantStep + 1];
      
      setMessages((prev) => [
        ...prev,
        { text: nextQuestion.label, sender: "ai" },
      ]);
    } else {
      const filtered = filterAssistantProducts(newAnswers);
      setAssistantSuggestions(filtered);
      
      setMessages((prev) => [
        ...prev,
        {
          text: `Great! Here are my recommendations:`,
          sender: "ai",
          recommendations: filtered.map((item) => ({
            storeId: item.store.id,
            store: item.store,
            product: item.product,
          })),
        },
      ]);
      setShowShoppingAssistant(false);
    }
  };

  // Handle selecting a recommendation
  const handleSelectRecommendation = (storeId: number, product: Product) => {
    // Find the store
    const selectedStoreFromRecommendation = stores.find((s) => s.id === storeId);
    if (!selectedStoreFromRecommendation) return;

    // Get the quantity for this recommendation
    const key = `${storeId}-${product.id}`;
    const quantity = recommendationQuantities[key] || 1;

    // Select the store
    setSelectedStore(selectedStoreFromRecommendation);

    // Add product to cart
    setTimeout(() => {
      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (c) => c.id === product.id && c.storeId === storeId
        );

        if (existingItem) {
          return prevCart.map((c) =>
            c.id === product.id && c.storeId === storeId
              ? { ...c, quantity: c.quantity + quantity }
              : c
          );
        } else {
          return [
            ...prevCart,
            { ...product, quantity: quantity, storeId: storeId },
          ];
        }
      });

      // Post message to chat
      setMessages((prev) => [
        ...prev,
        {
          text: `Great! I've added ${quantity} ${product.image} ${product.name} from ${selectedStoreFromRecommendation.name} to your cart. Would you like to continue shopping or proceed to checkout?`,
          sender: "ai",
        },
      ]);
    }, 100);
  };

  const handleAssistantProduct = (product: Product) => {
    // Close the assistant
    setShowShoppingAssistant(false);

    // Post the suggestion in chat
    setMessages((prev) => [
      ...prev,
      {
        text: `Our Shopping Assistant recommends: ${product.image} ${product.name} - $${product.price}${
          product.brand ? ` (${product.brand})` : ""
        }`,
        sender: "ai",
      },
    ]);

    // Optionally: auto-select the first available store and add to cart
    if (selectedStore) {
      addToCart(product);
    } else {
      // Auto-select Fresh Mart as default
      const firstStore = stores[0];
      setSelectedStore(firstStore);
      setTimeout(() => {
        addToCart(product);
      }, 100);
    }
  };

  const stores = [
    {
      id: 1,
      name: "Fresh Mart",
      category: "Supermarket",
      rating: 4.5,
      distance: "0.3 km",
      image: "🛒",
      popular: ["Milk", "Bread", "Eggs"],
      catalog: [
        {
          id: 1,
          name: "Whole Milk",
          brand: "Well",
          price: 3.99,
          quantity: "1L",
          category: "Dairy",
          image: "🥛",
        },
        {
          id: 2,
          name: "White Bread",
          brand: "Golden",
          price: 2.49,
          quantity: "500g",
          category: "Bakery",
          image: "🍞",
        },
        {
          id: 3,
          name: "Farm Eggs (12)",
          brand: "Happy Farm",
          price: 4.99,
          quantity: "12 pieces",
          category: "Dairy",
          image: "🥚",
        },
        {
          id: 4,
          name: "Cheddar Cheese",
          brand: "Kraft",
          price: 5.99,
          quantity: "200g",
          category: "Dairy",
          image: "🧀",
        },
        {
          id: 5,
          name: "Bananas",
          brand: "Fresh",
          price: 1.99,
          quantity: "1 bunch",
          category: "Fruits",
          image: "🍌",
        },
        { id: 6, name: "Apples", brand: "Orchard", price: 3.49, quantity: "1kg", category: "Fruits", image: "🍎" },
      ],
    },
    {
      id: 2,
      name: "Green Valley Organics",
      category: "Organic Store",
      rating: 4.8,
      distance: "0.7 km",
      image: "🥬",
      popular: ["Organic Veggies", "Fruits", "Grains"],
      catalog: [
        {
          id: 1,
          name: "Organic Spinach",
          brand: "GreenLeaf",
          price: 3.99,
          quantity: "200g",
          category: "Vegetables",
          image: "🥬",
        },
        {
          id: 2,
          name: "Organic Tomatoes",
          brand: "Nature's Best",
          price: 4.49,
          quantity: "500g",
          category: "Vegetables",
          image: "🍅",
        },
        {
          id: 3,
          name: "Organic Carrots",
          brand: "Farm Fresh",
          price: 2.99,
          quantity: "300g",
          category: "Vegetables",
          image: "🥕",
        },
        {
          id: 4,
          name: "Organic Blueberries",
          brand: "BerryPure",
          price: 5.99,
          quantity: "150g",
          category: "Fruits",
          image: "🫐",
        },
        { id: 5, name: "Quinoa", brand: "NaturalHarvest", price: 6.99, quantity: "400g", category: "Grains", image: "🌾" },
        {
          id: 6,
          name: "Organic Honey",
          brand: "HoneyGold",
          price: 8.99,
          quantity: "500ml",
          category: "Pantry",
          image: "🍯",
        },
      ],
    },
    {
      id: 3,
      name: "QuickStop Grocery",
      category: "Convenience Store",
      rating: 4.3,
      distance: "0.2 km",
      image: "🏪",
      popular: ["Snacks", "Drinks", "Daily Essentials"],
      catalog: [
        {
          id: 1,
          name: "Potato Chips",
          brand: "CrispyBites",
          price: 2.99,
          quantity: "150g",
          category: "Snacks",
          image: "🥔",
        },
        {
          id: 2,
          name: "Cola (2L)",
          brand: "CoolBeverage",
          price: 2.49,
          quantity: "2L",
          category: "Drinks",
          image: "🥤",
        },
        {
          id: 3,
          name: "Orange Juice",
          brand: "FreshPress",
          price: 3.99,
          quantity: "1L",
          category: "Drinks",
          image: "🍊",
        },
        {
          id: 4,
          name: "Chocolate Bar",
          brand: "SweetTreats",
          price: 1.99,
          quantity: "50g",
          category: "Snacks",
          image: "🍫",
        },
        {
          id: 5,
          name: "Ice Cream",
          brand: "FrostyCold",
          price: 5.49,
          quantity: "500ml",
          category: "Frozen",
          image: "🍦",
        },
        { id: 6, name: "Coffee", brand: "BrewMaster", price: 7.99, quantity: "250g", category: "Pantry", image: "☕" },
        {
          id: 7,
          name: "Whole Milk",
          brand: "Well",
          price: 1.99,
          quantity: "1L",
          category: "Dairy",
          image: "🥛",
        },
      ],
    },
    {
      id: 4,
      name: "Pizza Palace",
      category: "Restaurant",
      rating: 4.6,
      distance: "0.5 km",
      image: "🍕",
      popular: ["Pizza", "Burgers", "Pasta"],
      catalog: [
        {
          id: 1,
          name: "Margherita Pizza",
          brand: "Authentic",
          price: 12.99,
          quantity: "Large",
          category: "Pizza",
          image: "🍕",
        },
        {
          id: 2,
          name: "Pepperoni Pizza",
          brand: "Authentic",
          price: 14.99,
          quantity: "Large",
          category: "Pizza",
          image: "🍕",
        },
        {
          id: 3,
          name: "Veggie Burger",
          brand: "HealthyBite",
          price: 8.99,
          quantity: "Single",
          category: "Burgers",
          image: "🍔",
        },
        {
          id: 4,
          name: "Classic Burger",
          brand: "HealthyBite",
          price: 9.99,
          quantity: "Single",
          category: "Burgers",
          image: "🍔",
        },
        {
          id: 5,
          name: "Spaghetti Carbonara",
          brand: "ItalianChef",
          price: 11.99,
          quantity: "1 Plate",
          category: "Pasta",
          image: "🍝",
        },
        {
          id: 6,
          name: "Garlic Bread",
          brand: "FreshBake",
          price: 4.99,
          quantity: "6 pieces",
          category: "Sides",
          image: "🥖",
        },
      ],
    },
  ];

  const [filteredStores, setFilteredStores] = useState(stores);

  const toggleListening = () => {
    if (!isListening) {
      // Start listening
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition not supported in your browser");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        
        // Process the transcript immediately
        if (transcript.trim()) {
          const userMessage = transcript.toLowerCase();
          setMessages((messages) => [
            ...messages,
            { text: transcript, sender: "user" },
          ]);

          let aiResponse = "This is a simulated AI response.";
          let addedItems: string[] = [];
          let updatedCart = [...cart];

          // Check if user is trying to select a store
          if (!selectedStore && (userMessage.includes("store") || userMessage.includes("shop") || userMessage.includes("select") || userMessage.includes("browse"))) {
            // Try to match store name
            const matchedStore = stores.find(
              (store) =>
                userMessage.includes(store.name.toLowerCase()) ||
                userMessage.includes(store.name.split(" ")[0].toLowerCase())
            );

            if (matchedStore) {
              handleSelectStore(matchedStore);
              aiResponse = `Great! You selected ${matchedStore.name}. What would you like to order?`;
              setTimeout(() => {
                setMessages((prev: Message[]) => [
                  ...prev,
                  { text: aiResponse, sender: "ai" },
                ]);
              }, 500);
              return;
            } else {
              aiResponse = `I couldn't find that store. Available stores: Fresh Mart, Green Valley Organics, or QuickStop Grocery.`;
              setTimeout(() => {
                setMessages((prev: Message[]) => [
                  ...prev,
                  { text: aiResponse, sender: "ai" },
                ]);
              }, 1000);
              return;
            }
          }

          if (
            userMessage.includes("add") ||
            userMessage.includes("order") ||
            userMessage.includes("get me") ||
            userMessage.includes("i want") ||
            userMessage.includes("please")
          ) {
            if (selectedStore) {
              const currentStore = stores.find(
                (s) => s.id === selectedStore.id
              );
              if (currentStore) {
                currentStore.catalog.forEach((product) => {
                  const productNameLower = product.name.toLowerCase();
                  const productWords = productNameLower.split(" ");
                  const isMatched = productWords.some((word) =>
                    userMessage.includes(word)
                  );

                  if (isMatched) {
                    const existingItemIndex = updatedCart.findIndex(
                      (item) =>
                        item.id === product.id &&
                        item.storeId === selectedStore.id
                    );

                    if (existingItemIndex > -1) {
                      updatedCart[existingItemIndex].quantity += 1;
                    } else {
                      updatedCart.push({
                        ...product,
                        quantity: 1,
                        storeId: selectedStore.id,
                      });
                    }

                    addedItems.push(`${product.name} (${product.image})`);
                  }
                });

                if (addedItems.length > 0) {
                  setCart(updatedCart);
                  aiResponse = `Great! I've added ${addedItems.join(", ")} to your cart. 🛒`;
                } else {
                  aiResponse = `I couldn't find those items in ${selectedStore.name}. Try saying the product name like "milk", "bread", "eggs", etc.`;
                }
              }
            } else {
              // Auto-select the nearest store (QuickStop Grocery)
              const nearestStore = stores[2];
              setSelectedStore(nearestStore);
              aiResponse = `I've automatically selected ${nearestStore.name} (nearest store at ${nearestStore.distance}). Which items would you like to add?`;
            }
          }

          setTimeout(() => {
            setMessages((prev: Message[]) => [
              ...prev,
              { text: aiResponse, sender: "ai" },
            ]);
          }, 1000);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);

      recognition.start();
    } else {
      setIsListening(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    
    if (value.trim().length < 2) {
      setShowSuggestions(false);
      setStoreProductSuggestions([]);
      return;
    }

    // Check if user is asking for help/assistance - don't show suggestions in this case
    const valueLower = value.toLowerCase();
    if (
      valueLower.includes("help") ||
      valueLower.includes("recommend") ||
      valueLower.includes("suggest") ||
      valueLower.includes("what should") ||
      valueLower.includes("what do you suggest") ||
      valueLower.includes("i need help") ||
      valueLower.includes("can you help") ||
      valueLower.includes("any suggestions") ||
      valueLower.includes("what do you recommend") ||
      valueLower.includes("guide me") ||
      valueLower.includes("assist me")
    ) {
      setShowSuggestions(false);
      setStoreProductSuggestions([]);
      return;
    }

    const searchLower = value.toLowerCase();
    if (!selectedStore) {
      // No store selected: search all stores for product
      const found: {store: Store, product: Product}[] = [];
      stores.forEach(store => {
        store.catalog.forEach(product => {
          if (
            product.name.toLowerCase().includes(searchLower) ||
            product.brand?.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower)
          ) {
            found.push({store, product});
          }
        });
      });
      setStoreProductSuggestions(found);
      setShowSuggestions(found.length > 0);
      setSuggestions([]); // Don't show single-store suggestions
      return;
    }

    // Find matching products from selected store
    const matchedProducts = selectedStore.catalog.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    });
    if (matchedProducts.length > 0) {
      setSuggestions(matchedProducts.slice(0, 5)); // Show top 5 suggestions
      setShowSuggestions(true);
      setStoreProductSuggestions([]);
    } else {
      setShowSuggestions(false);
      setStoreProductSuggestions([]);
    }
  };

  const selectSuggestion = (product: Product) => {
    setInputText(product.name);
    setShowSuggestions(false);
    setStoreProductSuggestions([]);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const userMessage = inputText.toLowerCase();
      console.log("User message:", userMessage);
      console.log("Selected store:", selectedStore);
      
      // If in shopping assistant mode, handle as assistant answer
      if (showShoppingAssistant && assistantStep < getAssistantQuestions().length) {
        const answerText = inputText.trim();
        setInputText("");
        handleAssistantAnswer(answerText);
        return;
      }
      
      setMessages((prev) => [...prev, { text: inputText, sender: "user" }]);
      setInputText("");
      
      // Check if user is asking for help/recommendations - trigger shopping assistant
      if (
        userMessage.includes("help") ||
        userMessage.includes("recommend") ||
        userMessage.includes("suggest") ||
        userMessage.includes("what should") ||
        userMessage.includes("what do you suggest") ||
        userMessage.includes("i need help") ||
        userMessage.includes("can you help") ||
        userMessage.includes("any suggestions") ||
        userMessage.includes("what do you recommend") ||
        userMessage.includes("guide me") ||
        userMessage.includes("assist me")
      ) {
        setShowShoppingAssistant(true);
        setAssistantStep(0);
        setAssistantAnswers({});
        setAssistantSuggestions([]);
        
        const aiResponse = `Sure! Let me help you find the perfect product. I'll ask you a few questions to understand your needs better.`;
        setTimeout(() => {
          const questions = getAssistantQuestions();
          setMessages((prev: Message[]) => [
            ...prev,
            { text: aiResponse, sender: "ai" },
            { text: questions[0].label, sender: "ai" },
          ]);
        }, 500);
        return;
      }
      
      // Check if user wants to browse stores
      if (
        userMessage.includes("browse") ||
        userMessage.includes("show stores") ||
        userMessage.includes("list stores") ||
        userMessage.includes("view stores")
      ) {
        setShowStoreSearch(true);
        const aiResponse = `Sure! Here are the available stores. Just click on one to select it.`;
        console.log("AI Response:", aiResponse);
        setTimeout(() => {
          setMessages((prev: Message[]) => [...prev, { text: aiResponse, sender: "ai" }]);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }, 1000);
        return;
      }

      // Check if user is trying to select a store (always check for store names)
      if (!selectedStore) {
        // Try to match store name
        const matchedStore = stores.find(
          (store) =>
            userMessage.includes(store.name.toLowerCase()) ||
            userMessage.includes(store.name.split(" ")[0].toLowerCase())
        );

        if (matchedStore) {
          handleSelectStore(matchedStore);
          const aiResponse = `Great! You selected ${matchedStore.name}. What would you like to order?`;
          console.log("AI Response:", aiResponse);
          setTimeout(() => {
            setMessages((prev: Message[]) => [...prev, { text: aiResponse, sender: "ai" }]);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }, 1000);
          return;
        }
      }
      
      // Check for checkout/payment intent first
      if (
        userMessage.includes("checkout") ||
        userMessage.includes("pay") ||
        userMessage.includes("purchase") ||
        userMessage.includes("proceed") ||
        userMessage.includes("confirm") ||
        userMessage.includes("order now")
      ) {
        // If no store selected, auto-select the nearest store
        let currentSelectedStore = selectedStore;
        if (!currentSelectedStore) {
          // Find the nearest store (first one in the list - QuickStop at 0.2 km)
          const nearestStore = stores[2]; // QuickStop Grocery is nearest
          handleSelectStore(nearestStore);
          currentSelectedStore = nearestStore;
          
          const aiMessage = `No store was selected. I've automatically selected ${nearestStore.name} (nearest store at ${nearestStore.distance}).`;
          setMessages((prev: Message[]) => [...prev, { text: aiMessage, sender: "ai" }]);
        }

        // Check if there are items in cart
        if (cart.length > 0) {
          // Check if user wants to review
          if (
            userMessage.includes("yes") ||
            userMessage.includes("review") ||
            userMessage.includes("see")
          ) {
            // Take to checkout page (Cart tab) to review
            setCurrentTab("cart");
            const aiResponse = `Perfect! Here's your checkout page. Review your items and select a payment method. 🛒`;
            console.log("AI Response:", aiResponse);
            setTimeout(() => {
              setMessages((prev: Message[]) => [...prev, { text: aiResponse, sender: "ai" }]);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }, 1000);
            return;
          } else {
            // Direct checkout - proceed immediately without review
            if (selectedPaymentMethod === "cod") {
              setOrderPlaced(true);
              const aiResponse = `Great! Your order has been placed with Cash on Delivery from ${currentSelectedStore.name}. 🎉`;
              console.log("AI Response:", aiResponse);
              setTimeout(() => {
                setMessages((prev: Message[]) => [...prev, { text: aiResponse, sender: "ai" }]);
                setTimeout(() => {
                  setOrderPlaced(false);
                  setShowConversation(false);
                  setShowCatalog(false);
                  setSelectedStore(null);
                  setCart([]);
                  inputRef.current?.focus();
                }, 2000);
              }, 1000);
            } else {
              // Show payment modal for card/UPI
              setShowPaymentModal(true);
              const aiResponse = `Please enter your ${selectedPaymentMethod.toUpperCase()} details to complete the payment. 💳`;
              console.log("AI Response:", aiResponse);
              setTimeout(() => {
                setMessages((prev: Message[]) => [...prev, { text: aiResponse, sender: "ai" }]);
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 0);
              }, 1000);
            }
            return;
          }
        } else {
          const aiResponse = "Your cart is empty. Please add some items first!";
          console.log("AI Response:", aiResponse);
          setTimeout(() => {
            setMessages((prev: Message[]) => [...prev, { text: aiResponse, sender: "ai" }]);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }, 1000);
          return;
        }
      }

      // Parse intent from user message
      let aiResponse = "This is a simulated AI response.";
      let addedItems: string[] = [];
      let updatedCart = [...cart];

      // Try to match product names (don't require keywords like "add" or "order")
      if (selectedStore) {
        const currentStore = stores.find((s) => s.id === selectedStore.id);
        console.log("Current store:", currentStore);
        if (currentStore) {
          currentStore.catalog.forEach((product) => {
            const productNameLower = product.name.toLowerCase();
            console.log("Checking product:", productNameLower);
            // Match if product name is mentioned (even without "add" keyword)
            // Check if any part of product name is in the user message
            const productWords = productNameLower.split(" ");
            const isMatched = productWords.some((word) =>
              userMessage.includes(word)
            );

            if (isMatched) {
              console.log("Match found:", product.name);
              
              // Parse quantity from user message
              // Look for numbers like "2 milk", "milk 2", "2x milk", etc.
              let quantity = 1;
              const numberMatch = userMessage.match(/\b(\d+)\s*(x|of)?\s*(milk|pizza|burger|bread|eggs|cheese|juice|coffee|pasta|bread|spinach|tomatoes|carrots|blueberries|quinoa|honey|chips|cola|orange|chocolate|ice cream|garlic|margherita|pepperoni|spaghetti)\b|\b(milk|pizza|burger|bread|eggs|cheese|juice|coffee|pasta|bread|spinach|tomatoes|carrots|blueberries|quinoa|honey|chips|cola|orange|chocolate|ice cream|garlic|margherita|pepperoni|spaghetti)\s+(\d+)\b/i);
              
              if (numberMatch) {
                const num = numberMatch[1] || numberMatch[5];
                if (num) {
                  quantity = parseInt(num);
                }
              }
              
              // Add item to cart
              const existingItemIndex = updatedCart.findIndex(
                (item) =>
                  item.id === product.id && item.storeId === selectedStore.id
              );

              if (existingItemIndex > -1) {
                updatedCart[existingItemIndex].quantity += quantity;
              } else {
                updatedCart.push({
                  ...product,
                  quantity: quantity,
                  storeId: selectedStore.id,
                });
              }

              addedItems.push(`${quantity}x ${product.name} (${product.image})`);
            }
          });

          console.log("Added items:", addedItems);
          if (addedItems.length > 0) {
            setCart(updatedCart);
            aiResponse = `Great! I've added ${addedItems.join(", ")} to your cart. 🛒`;
          } else {
            // Check if user is asking for help or just making conversation
            if (
              userMessage.includes("add") ||
              userMessage.includes("order") ||
              userMessage.includes("get") ||
              userMessage.includes("want")
            ) {
              aiResponse = `I couldn't find those items in ${currentStore.name}. Try saying the product name like "milk", "bread", "eggs", etc.`;
            } else {
              aiResponse = `Sure! What would you like to order from ${currentStore.name}?`;
            }
          }
        }
      } else {
        // No store selected, auto-select the nearest store
        const nearestStore = stores[2]; // QuickStop Grocery at 0.2 km
        setSelectedStore(nearestStore);
        aiResponse = `I've automatically selected ${nearestStore.name} (nearest store at ${nearestStore.distance}). What would you like to order?`;
      }

      console.log("AI Response:", aiResponse);
      setTimeout(() => {
        setMessages((prev: Message[]) => [...prev, { text: aiResponse, sender: "ai" }]);
        // Refocus input after message is added
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }, 1000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setMessages((prev: Message[]) => [
          ...prev,
          { image: result, sender: "user" },
        ]);
        setShowConversation(true);
        setTimeout(() => {
          setMessages((prev: Message[]) => [
            ...prev,
            { text: "I can see your image!", sender: "ai" },
          ]);
        }, 1000);
      };
      reader.readAsDataURL(file);
      setShowMediaOptions(false);
    }
  };

  const handleStoreSearch = (query: string) => {
    setStoreSearchQuery(query);
    if (query.trim() === "") {
      setFilteredStores(stores);
    } else {
      setFilteredStores(
        stores.filter(
          (store) =>
            store.name.toLowerCase().includes(query.toLowerCase()) ||
            store.category.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    setShowStoreSearch(false);
    setSelectedCategory("All");
    setSelectedBrands(new Set(["All"]));
    setCurrentTab("catalog");
    setMessages([
      { text: `Welcome to ${store.name}! 🛒`, sender: "ai" },
      { text: `What would you like to order?`, sender: "ai" },
    ]);
    setShowConversation(true);
    setShowCatalog(true);
  };

  const handleBrowseCatalog = () => setShowCatalog(true);

  const handleChatWithStore = () => {
    if (!selectedStore) return;
    setMessages([
      { text: `Welcome to ${selectedStore.name}! 🛒`, sender: "ai" },
      { text: `What would you like to order?`, sender: "ai" },
    ]);
    setShowConversation(true);
  };

  const addToCart = (item: Product | CartItem) => {
    if (!selectedStore) return;
    const existing = cart.find(
      (c) => c.id === item.id && c.storeId === selectedStore.id
    );
    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === item.id && c.storeId === selectedStore.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      );
    } else {
      setCart([...cart, { ...item as Omit<Product, 'quantity'>, quantity: 1, storeId: selectedStore.id }]);
    }
  };

  const removeFromCart = (itemId: number, storeId?: number) => {
    const targetStoreId = storeId || selectedStore?.id;
    if (!targetStoreId) return;
    
    const existing = cart.find(
      (c) => c.id === itemId && c.storeId === targetStoreId
    );
    if (existing && existing.quantity > 1) {
      setCart(
        cart.map((c) =>
          c.id === itemId && c.storeId === targetStoreId
            ? { ...c, quantity: c.quantity - 1 }
            : c
        )
      );
    } else {
      setCart(
        cart.filter((c) => !(c.id === itemId && c.storeId === targetStoreId))
      );
    }
  };

  const getTotalPrice = (storeId?: number) => {
    const targetStoreId = storeId || selectedStore?.id;
    const subtotal = cart
      .filter((c) => c.storeId === targetStoreId)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Add delivery charges if delivery is selected and order is less than $20
    const deliveryCharge = fulfillmentType === 'delivery' && subtotal < 20 ? 5 : 0;
    
    return (subtotal + deliveryCharge).toFixed(2);
  };
  const getCartCount = () =>
    cart
      .filter((c) => c.storeId === selectedStore?.id)
      .reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = (storeId: number) => {
    if (selectedPaymentMethod === "cod") {
      setOrderPlaced(true);
      setTimeout(() => {
        setOrderPlaced(false);
        // Remove only items from the checked-out store
        setCart((prevCart) => prevCart.filter((item) => item.storeId !== storeId));
        setShowCheckout(false);
        // If no more items in cart, reset the UI
        const remainingItems = cart.filter((item) => item.storeId !== storeId);
        if (remainingItems.length === 0) {
          setShowCatalog(false);
          setSelectedStore(null);
          setCurrentTab("chat");
          setShowConversation(false);
        }
      }, 2000);
    } else {
      // For Card/UPI, directly place order
      setOrderPlaced(true);
      setTimeout(() => {
        setOrderPlaced(false);
        // Remove only items from the checked-out store
        setCart((prevCart) => prevCart.filter((item) => item.storeId !== storeId));
        setShowCheckout(false);
        // If no more items in cart, reset the UI
        const remainingItems = cart.filter((item) => item.storeId !== storeId);
        if (remainingItems.length === 0) {
          setShowCatalog(false);
          setSelectedStore(null);
          setCurrentTab("chat");
          setShowConversation(false);
        }
      }, 2000);
    }
  };



  const saveOrder = () => {
    if (selectedStore) {
      const orderItems = cart.filter((item) => item.storeId === selectedStore.id);
      const newOrder = {
        id: Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        store: selectedStore,
        items: orderItems,
        total: getTotalPrice(),
        paymentMethod: selectedPaymentMethod,
        address: deliveryAddress,
      };
      setOrders((prev) => [newOrder, ...prev]);
    }
  };

  function OrderConfirmation() {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">Order Placed!</h2>
          <p className="text-blue-200 mb-6">Your order has been confirmed. Thank you for your purchase!</p>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-white/70 text-sm mb-2">Payment Method</p>
            <p className="text-white font-semibold capitalize mb-4">{selectedPaymentMethod}</p>
            <p className="text-white/70 text-sm mb-2">Total Amount</p>
            <p className="text-2xl font-bold text-green-300">${getTotalPrice()}</p>
          </div>
          <button
            onClick={() => {
              saveOrder();
              setOrderPlaced(false);
              setShowConversation(false);
              setShowCatalog(false);
              setSelectedStore(null);
              setCart([]);
            }}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  function AddressModal() {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
        <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Select Delivery Address</h2>
            <button
              onClick={() => setShowAddressModal(false)}
              className="text-white/70 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {addresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => {
                  setDeliveryAddress(addr.address);
                  setShowAddressModal(false);
                }}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  deliveryAddress === addr.address
                    ? "bg-blue-500/40 border-2 border-blue-400"
                    : "bg-white/10 border-2 border-transparent hover:bg-white/20"
                }`}
              >
                <p className="text-white font-semibold mb-1">{addr.label}</p>
                <p className="text-white/70 text-sm">{addr.address}</p>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddressModal(false)}
            className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  function CheckoutPaymentModal() {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
        <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Select Payment Method</h2>
            <button
              onClick={() => setShowCheckoutPaymentModal(false)}
              className="text-white/70 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {[
              { label: '💳 Card', value: 'card', description: 'Credit or Debit Card' },
              { label: '📱 UPI', value: 'upi', description: 'Google Pay, PhonePe, Paytm' },
              { label: '🚚 COD', value: 'cod', description: 'Cash on Delivery' },
            ].map((method) => (
              <button
                key={method.value}
                onClick={() => {
                  setSelectedPaymentMethod(method.value);
                  setShowCheckoutPaymentModal(false);
                }}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  selectedPaymentMethod === method.value
                    ? "bg-blue-500/40 border-2 border-blue-400"
                    : "bg-white/10 border-2 border-transparent hover:bg-white/20"
                }`}
              >
                <p className="text-white font-semibold mb-1">{method.label}</p>
                <p className="text-white/70 text-sm">{method.description}</p>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCheckoutPaymentModal(false)}
            className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  function HeroCarousel() {
    return (
      <div className="w-full mb-5 relative">
        <div
          ref={carouselRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="overflow-hidden rounded-3xl"
        >
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
          >
            {carouselSlides.map((slide) => (
              <div
                key={slide.id}
                className={`min-w-full p-8 bg-gradient-to-br ${slide.color} rounded-3xl relative`}
              >
                {/* Cart Icon - Top Left */}
                {getCartCount() > 0 && (
                  <button
                    onClick={() => setShowCatalog(true)}
                    className="absolute top-4 left-4 z-20"
                    style={{ pointerEvents: "auto" }}
                  >
                    <div className="relative">
                      <ShoppingCart className="w-8 h-8 text-white" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {getCartCount()}
                      </span>
                    </div>
                  </button>
                )}

                <div className="flex flex-col items-center text-center w-full">
                  <div className="text-6xl mb-4">{slide.emoji}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {slide.title}
                  </h3>
                  <p className="text-blue-200 text-sm mb-6">
                    {slide.description}
                  </p>
                  {/* Mic Button */}
                  <div className="mb-4">
                    <div className="relative">
                      {isListening && (
                        <>
                          <div className="absolute inset-0 animate-ping">
                            <div className="w-28 h-28 rounded-full bg-blue-400/30"></div>
                          </div>
                          <div className="absolute inset-0 animate-pulse">
                            <div className="w-28 h-28 rounded-full bg-purple-400/20"></div>
                          </div>
                        </>
                      )}
                      <button
                        onClick={toggleListening}
                        className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isListening
                            ? "bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/50"
                            : "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50"
                        } hover:scale-110`}
                      >
                        <Mic className="w-12 h-12 text-white" />
                      </button>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConversation(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat</span>
                    </button>
                    <button
                      onClick={() => setShowStoreSearch(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <Store className="w-4 h-4" />
                      <span>Browse</span>
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowMediaOptions(!showMediaOptions)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 hover:scale-105 text-sm"
                      >
                        <Image className="w-4 h-4" />
                        <span>Image</span>
                      </button>
                      {showMediaOptions && (
                        <div className="absolute top-12 left-0 bg-white/10 backdrop-blur-lg rounded-2xl p-2 shadow-xl z-10">
                          <button
                            onClick={() => {
                              cameraInputRef.current?.click();
                              setShowMediaOptions(false);
                            }}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-colors text-white w-full whitespace-nowrap text-sm"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Take Photo</span>
                          </button>
                          <button
                            onClick={() => {
                              fileInputRef.current?.click();
                              setShowMediaOptions(false);
                            }}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-colors text-white w-full whitespace-nowrap text-sm"
                          >
                            <Image className="w-4 h-4" />
                            <span>Upload Image</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={goPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl"
        >
          ‹
        </button>
        <button
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl"
        >
          ›
        </button>

        <div className="flex items-center justify-center gap-2 mt-3">
          {carouselSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCarouselIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                carouselIndex === i ? "bg-white w-8" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  function StoreSearch() {
    return (
      <div className="w-full mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">
            Nearby Grocery Stores
          </h3>
          <button
            onClick={() => setShowStoreSearch(false)}
            className="text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            value={storeSearchQuery}
            onChange={(e) => handleStoreSearch(e.target.value)}
            placeholder="Search stores..."
            className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-white/50 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="bg-white/5 rounded-2xl p-4 h-96 overflow-y-auto space-y-3">
          {filteredStores.map((store) => (
            <button
              key={store.id}
              onClick={() => handleSelectStore(store)}
              className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{store.image}</div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-lg">
                    {store.name}
                  </h4>
                  <p className="text-blue-200 text-sm mb-2">{store.category}</p>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      {store.rating}
                    </span>
                    <span className="flex items-center gap-1 text-white/70 text-sm">
                      <MapPin className="w-4 h-4" />
                      {store.distance}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {store.popular.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-green-500/20 text-green-200 px-2 py-1 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  function Catalog() {
    const paymentMethods = [
      { label: "💳 Credit Card", value: "card" },
      { label: "📱 UPI", value: "upi" },
      { label: "🚚 Cash on Delivery", value: "cod" },
    ];

    return (
      <div className="w-full mt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCatalog(false)}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <h3 className="text-xl font-semibold text-white">Catalog</h3>
          </div>
          <button
            onClick={() => {
              setShowCatalog(false);
              setSelectedStore(null);
            }}
            className="text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>

        {getCartCount() > 0 && (
          <div className="bg-green-500/20 rounded-xl p-3 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-green-300" />
              <span className="text-white font-semibold">
                {getCartCount()} items
              </span>
            </div>
            <span className="text-white font-bold text-lg">
              ${getTotalPrice()}
            </span>
          </div>
        )}

        <div className="bg-white/5 rounded-2xl p-4 max-h-96 overflow-y-auto space-y-2">
          {selectedStore && selectedStore.catalog.map((item) => {
            const cartItem = cart.find(
              (c) => c.id === item.id && c.storeId === selectedStore.id
            );
            const quantity = cartItem ? cartItem.quantity : 0;

            return (
              <div
                key={item.id}
                className="bg-white/10 rounded-xl p-3 flex items-center gap-3"
              >
                <div className="text-3xl">{item.image}</div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">
                    {item.name}
                  </h4>
                  <p className="text-blue-200 text-xs">{item.category}</p>
                  <p className="text-green-300 font-bold text-sm">
                    ${item.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {quantity > 0 ? (
                    <>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 bg-red-500/30 hover:bg-red-500/50 rounded-full flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      <span className="text-white font-semibold w-6 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 bg-green-500/30 hover:bg-green-500/50 rounded-full flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-full text-white text-sm font-semibold"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {getCartCount() > 0 && (
          <button 
            onClick={() => setShowCheckout(true)}
            className="w-full mt-3 py-3 bg-green-500 hover:bg-green-600 rounded-full text-white font-bold"
          >
            Checkout
          </button>
        )}
      </div>
    );
  }

  function ChatPanel() {
    return (
      <div className="w-full mt-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Floating Checkout Button in Chat */}

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowConversation(false);
                setShowCatalog(false);
              }}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <h3 className="text-xl font-semibold text-white">
              {selectedStore ? `${selectedStore.name}` : "Chat"}
            </h3>
          </div>
          <button
            onClick={() => {
              setShowConversation(false);
              setShowCatalog(false);
              setSelectedStore(null);
            }}
            className="text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation - Only show when store is selected */}
        {selectedStore && (
          <div className="flex gap-2 mb-4 bg-white/5 p-3 rounded-lg">
            <button
              onClick={() => setCurrentTab("catalog")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-3 border ${
                currentTab === "catalog"
                  ? "bg-blue-500 text-white border-blue-400"
                  : "bg-transparent text-white/70 hover:text-white border-white/30"
              }`}
            >
              <Grid className="w-4 h-4" />
              Catalog
            </button>
            <button
              onClick={() => setCurrentTab("cart")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 border relative ${
                currentTab === "cart"
                  ? "bg-blue-500 text-white border-blue-400"
                  : "bg-transparent text-white/70 hover:text-white border-white/30"
              }`}
            >
              <div className="relative flex items-center">
                <ShoppingCart className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-3 left-2.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {getCartCount()}
                  </span>
                )}
              </div>
              <span className="text-sm">Cart</span>
            </button>
            <button
              onClick={() => setCurrentTab("chat")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-3 border ${
                currentTab === "chat"
                  ? "bg-blue-500 text-white border-blue-400"
                  : "bg-transparent text-white/70 hover:text-white border-white/30"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>
          </div>
        )}

        {/* Chat Section - Show by default when no store, or when chat tab is selected */}
        {(!selectedStore || currentTab === "chat") && (
          <>
            {selectedStore ? (
              // Store-specific chat
              <div className="bg-white/5 rounded-2xl p-4 h-64 overflow-y-auto mb-4 space-y-3">
                <p className="text-white/70 text-center mt-20">
                  Browse {selectedStore.name} catalog or add items to cart
                </p>
              </div>
            ) : (
              // General chat (no store selected)
              <div className="bg-white/5 rounded-2xl p-4 h-64 overflow-y-auto mb-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-white/50 text-center mt-20">No messages yet</p>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div key={`msg-${idx}-${msg.sender}`}>
                        <div
                          className={`flex ${
                            msg.sender === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-2xl ${
                              msg.sender === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-white/20 text-white"
                            }`}
                          >
                            {msg.image ? (
                              <img
                                src={msg.image}
                                alt="Uploaded"
                                className="rounded-lg max-w-full"
                              />
                            ) : (
                              msg.text
                            )}
                          </div>
                        </div>
                        
                        {/* Render recommendations if present */}
                        {msg.recommendations && msg.recommendations.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {msg.recommendations.map((rec, recIdx) => {
                              const key = `${rec.storeId}-${rec.product.id}`;
                              const qty = recommendationQuantities[key] || 1;
                              return (
                                <div
                                  key={`rec-${idx}-${recIdx}`}
                                  className="bg-white/10 rounded-lg p-3 border border-green-500/30"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="text-2xl flex-shrink-0">{rec.product.image}</div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-white">{rec.product.name}</h4>
                                      {rec.product.brand && (
                                        <p className="text-xs text-white/70">Brand: {rec.product.brand}</p>
                                      )}
                                      {rec.product.quantity && (
                                        <p className="text-xs text-white/70">{rec.product.quantity}</p>
                                      )}
                                      <p className="text-green-400 font-bold mt-1">${rec.product.price}</p>
                                      <p className="text-xs text-blue-300 mt-1">Store: {rec.store.name}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end flex-shrink-0">
                                      <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                                        <button
                                          onClick={() =>
                                            setRecommendationQuantities((prev) => ({
                                              ...prev,
                                              [key]: Math.max(1, (prev[key] || 1) - 1),
                                            }))
                                          }
                                          className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center text-white"
                                        >
                                          −
                                        </button>
                                        <span className="text-white font-semibold min-w-[1.5rem] text-center">{qty}</span>
                                        <button
                                          onClick={() =>
                                            setRecommendationQuantities((prev) => ({
                                              ...prev,
                                              [key]: (prev[key] || 1) + 1,
                                            }))
                                          }
                                          className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center text-white"
                                        >
                                          +
                                        </button>
                                      </div>
                                      <button
                                        onClick={() => handleSelectRecommendation(rec.storeId, rec.product)}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                                      >
                                        Add
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Store product suggestions dropdown */}
                    {storeProductSuggestions.length > 0 && showSuggestions && !inputText.toLowerCase().match(/help|recommend|suggest|what should|what do you suggest|i need help|can you help|any suggestions|what do you recommend|guide me|assist me/) && (
                      <div className="absolute z-50 bg-white/95 rounded-lg shadow-lg mt-2 w-full max-h-60 overflow-y-auto border border-blue-200">
                        {storeProductSuggestions.map(({store, product}, idx) => (
                          <button
                            key={store.id + '-' + product.id + '-' + idx}
                            className="w-full text-left px-4 py-2 hover:bg-blue-100 text-blue-900 flex flex-col border-b last:border-b-0"
                            onClick={() => {
                              setSelectedStore(store);
                              setInputText(product.name);
                              setShowSuggestions(false);
                              setStoreProductSuggestions([]);
                              setShowCatalog(true);
                            }}
                          >
                            <span className="font-semibold">{product.name}</span>
                            <span className="text-xs text-blue-700">{store.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}


            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setShowMediaOptions(!showMediaOptions)}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
                title="Upload image"
              >
                <Image className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={toggleListening}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-white/10 hover:bg-white/20"
                }`}
                title="Voice input"
              >
                <Mic className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                      setShowSuggestions(false);
                    }
                  }}
                  placeholder="Type message..."
                  autoFocus
                  className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  autoComplete="off"
                />
                {/* Suggestions Dropdown (single store) */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-blue-950/95 backdrop-blur-md rounded-2xl shadow-lg z-[9999] max-h-64 overflow-y-auto p-2">
                    <div className="space-y-2">
                      {suggestions.map((product) => {
                        const cartItem = cart.find(
                          (c) => c.id === product.id && c.storeId === selectedStore?.id
                        );
                        const quantity = cartItem ? cartItem.quantity : 0;
                        return (
                          <button
                            key={product.id}
                            onClick={() => selectSuggestion(product)}
                            className="w-full bg-white/10 rounded-xl p-3 flex items-center gap-3 hover:bg-white/15 transition-colors text-left"
                          >
                            <div className="text-4xl flex-shrink-0">
                              {product.image}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-semibold text-sm mb-1 truncate">
                                {product.name}
                              </h4>
                              {product.brand && (
                                <p className="text-gray-400 text-xs mb-1">
                                  {product.brand}
                                </p>
                              )}
                              {product.quantity && (
                                <p className="text-gray-300 text-xs mb-1">
                                  {product.quantity}
                                </p>
                              )}
                              <p className="text-blue-200 text-xs">
                                {product.category}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-green-300 font-bold text-sm mb-1">
                                ${product.price}
                              </p>
                              {quantity > 0 && (
                                <p className="text-blue-300 text-xs font-semibold">
                                  {quantity}x in cart
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Suggestions Dropdown (multi-store) */}
                {showSuggestions && storeProductSuggestions.length > 0 && !inputText.toLowerCase().match(/help|recommend|suggest|what should|what do you suggest|i need help|can you help|any suggestions|what do you recommend|guide me|assist me/) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-blue-950/95 backdrop-blur-md rounded-2xl shadow-lg z-[9999] max-h-64 overflow-y-auto p-2">
                    <div className="space-y-2">
                      {storeProductSuggestions.map(({store, product}, idx) => (
                        <button
                          key={store.id + '-' + product.id + '-' + idx}
                          onClick={() => {
                            setSelectedStore(store);
                            setInputText(product.name);
                            setShowSuggestions(false);
                            setStoreProductSuggestions([]);
                            setShowCatalog(true);
                          }}
                          className="w-full bg-white/10 rounded-xl p-3 flex items-center gap-3 hover:bg-white/15 transition-colors text-left"
                        >
                          <div className="text-4xl flex-shrink-0">{product.image}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold text-sm mb-1 truncate">{product.name}</h4>
                            {product.brand && (
                              <p className="text-gray-400 text-xs mb-1">{product.brand}</p>
                            )}
                            {product.quantity && (
                              <p className="text-gray-300 text-xs mb-1">{product.quantity}</p>
                            )}
                            <p className="text-blue-200 text-xs">{product.category}</p>
                          </div>
                          <div className="text-right flex-shrink-0 min-w-[80px]">
                            <p className="text-green-300 font-bold text-sm mb-1">${product.price}</p>
                            <p className="text-blue-300 text-xs font-semibold">{store.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleSendMessage}
                className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </>
        )}

        {/* Catalog Tab */}
        {currentTab === "catalog" && selectedStore && (
          <div>
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                value={catalogSearchQuery}
                onChange={(e) => setCatalogSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-white/50 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {[
                "All",
                ...Array.from(
                  new Set(selectedStore.catalog.map((item) => item.category))
                ),
              ].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-purple-500 text-white shadow-lg"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Brand Filters Dropdown */}
            <div className="relative mb-4 flex justify-end">
              <button
                onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                className="px-4 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                Brand: {selectedBrands.has("All") ? "All" : `${selectedBrands.size} selected`}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showBrandDropdown && (
                <div className="absolute top-full mt-2 right-0 bg-white/95 rounded-lg shadow-lg z-50 min-w-max max-h-60 overflow-y-auto">
                  {[
                    "All",
                    ...Array.from(
                      new Set(selectedStore.catalog.map((item) => item.brand).filter(Boolean))
                    ),
                  ].map((brand) => (
                    <label
                      key={brand}
                      className="block px-4 py-2 hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-3 text-gray-800"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.has(brand as string)}
                        onChange={(e) => {
                          const newBrands = new Set(selectedBrands);
                          if (brand === "All") {
                            if (e.target.checked) {
                              newBrands.clear();
                              newBrands.add("All");
                            }
                          } else {
                            newBrands.delete("All");
                            if (e.target.checked) {
                              newBrands.add(brand as string);
                            } else {
                              newBrands.delete(brand as string);
                            }
                            if (newBrands.size === 0) {
                              newBrands.add("All");
                            }
                          }
                          setSelectedBrands(newBrands);
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/5 rounded-2xl p-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {selectedStore.catalog
                  .filter((item) => {
                    const matchesSearch =
                      item.name
                        .toLowerCase()
                        .includes(catalogSearchQuery.toLowerCase()) ||
                      item.category
                        .toLowerCase()
                        .includes(catalogSearchQuery.toLowerCase()) ||
                      (item.brand &&
                        item.brand
                          .toLowerCase()
                          .includes(catalogSearchQuery.toLowerCase()));
                    const matchesCategory =
                      selectedCategory === "All" ||
                      item.category === selectedCategory;
                    const matchesBrand =
                      selectedBrands.has("All") ||
                      (item.brand && selectedBrands.has(item.brand));
                    return matchesSearch && matchesCategory && matchesBrand;
                  })
                  .map((item) => {
                    const cartItem = cart.find(
                      (c) => c.id === item.id && c.storeId === selectedStore.id
                    );
                    const quantity = cartItem ? cartItem.quantity : 0;

                    return (
                      <div
                        key={item.id}
                        className="bg-white/10 rounded-xl p-3 flex items-center gap-3"
                      >
                        <div className="text-4xl flex-shrink-0">
                          {item.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold text-sm mb-1 truncate">
                            {item.name}
                          </h4>
                          {item.brand && (
                            <p className="text-gray-400 text-xs mb-1">
                              {item.brand}
                            </p>
                          )}
                          {item.quantity && (
                            <p className="text-gray-300 text-xs mb-1">
                              {item.quantity}
                            </p>
                          )}
                          <p className="text-blue-200 text-xs mb-1">
                            {item.category}
                          </p>
                          <p className="text-green-300 font-bold text-sm">
                            ${item.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {quantity > 0 ? (
                            <>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-7 h-7 bg-red-500/30 hover:bg-red-500/50 rounded-full flex items-center justify-center"
                              >
                                <Minus className="w-3 h-3 text-white" />
                              </button>
                              <span className="text-white font-semibold w-6 text-center text-sm">
                                {quantity}
                              </span>
                              <button
                                onClick={() => addToCart(item)}
                                className="w-7 h-7 bg-green-500/30 hover:bg-green-500/50 rounded-full flex items-center justify-center"
                              >
                                <Plus className="w-3 h-3 text-white" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => addToCart(item)}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-full text-white text-xs font-semibold whitespace-nowrap"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Cart Tab */}
        {currentTab === "cart" && (
          <div>
            {getCartCount() > 0 ? (
              <>
                <div className="bg-white/5 rounded-2xl p-4 max-h-96 overflow-y-auto mb-4 space-y-2">
                  {cart.map((cartItem) => {
                    const store = stores.find((s) => s.id === cartItem.storeId);
                    if (!store) return null;

                    return (
                      <div
                        key={`${cartItem.storeId}-${cartItem.id}`}
                        className="bg-white/10 rounded-xl p-3 flex items-center gap-3"
                      >
                        <div className="text-3xl">{cartItem.image}</div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-sm">
                            {cartItem.name}
                          </h4>
                          <p className="text-blue-300 text-xs mb-1">{store.name}</p>
                          <p className="text-green-300 font-bold text-sm">
                            ${cartItem.price} x {cartItem.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(cartItem.id, cartItem.storeId)}
                            className="w-8 h-8 bg-red-500/30 hover:bg-red-500/50 rounded-full flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4 text-white" />
                          </button>
                          <span className="text-white font-semibold w-6 text-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(cartItem)}
                            className="w-8 h-8 bg-green-500/30 hover:bg-green-500/50 rounded-full flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-green-500/20 rounded-xl p-3 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-green-300" />
                    <span className="text-white font-semibold">
                      {getCartCount()} items
                    </span>
                  </div>
                  <span className="text-white font-bold text-lg">
                    ${getTotalPrice()}
                  </span>
                </div>

                <div className="bg-white/5 rounded-xl p-3 mb-3 flex items-center justify-between">
                  <span className="text-white/70 text-sm">Delivery Charges</span>
                  <span className="text-white font-semibold">
                    {fulfillmentType === 'delivery' && (cart.filter((c) => c.storeId === selectedStore?.id).reduce((sum, item) => sum + item.price * item.quantity, 0)) < 20 ? '$5.00' : 'FREE'}
                  </span>
                </div>

                <div className="w-full px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white font-semibold transition-all flex flex-col gap-2">
                  <div className="flex items-center justify-between w-full">
                    <div 
                      className="flex flex-col items-start flex-1"
                      title="Payment Method"
                    >
                      <span className="text-sm">Payment Method</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-white/70 capitalize">
                          {selectedPaymentMethod === 'card' && '💳 Credit Card'}
                          {selectedPaymentMethod === 'upi' && '📱 UPI'}
                          {selectedPaymentMethod === 'cod' && '🚚 Cash on Delivery'}
                        </span>
                        <button
                          onClick={() => {
                            setShowCheckoutPaymentModal(true);
                          }}
                          title="Change Payment Method"
                          className="p-1 bg-white/10 hover:bg-white/20 rounded-full transition-all flex items-center justify-center"
                        >
                          <ChevronDown className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                      <span className="text-lg font-bold text-green-300 whitespace-nowrap">${getTotalPrice()}</span>
                      <button
                        onClick={() => {
                          handleCheckout(selectedStore?.id || 0);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg text-white font-bold transition-all flex items-center gap-2 whitespace-nowrap"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Place Order
                      </button>
                    </div>
                  </div>
                  {/* Fulfillment type selection */}
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="fulfillmentType"
                        value="delivery"
                        checked={fulfillmentType === 'delivery'}
                        onChange={e => { e.stopPropagation(); setFulfillmentType('delivery'); }}
                      />
                      <span className="text-xs">Delivery</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="fulfillmentType"
                        value="pickup"
                        checked={fulfillmentType === 'pickup'}
                        onChange={e => { e.stopPropagation(); setFulfillmentType('pickup'); }}
                      />
                      <span className="text-xs">Store Pickup</span>
                    </label>
                  </div>
                  {/* Min order info */}
                  {selectedStore && fulfillmentType === 'delivery' && (
                    <div className="text-xs text-yellow-300 mt-2">
                      Min order $20 to avoid delivery charges
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-white/50 mx-auto mb-4" />
                <p className="text-white/70">Your cart is empty</p>
                <p className="text-white/50 text-sm mt-2">Add items from the catalog to get started</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">

      {orderPlaced && <OrderConfirmation />}
      {showAddressModal && <AddressModal />}
      {showCheckoutPaymentModal && <CheckoutPaymentModal />}
      
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl max-w-4xl w-full shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex-shrink-0 p-4 sm:p-6">
              <CheckoutPage
                cartItems={cart}
                stores={stores}
                onBack={() => setShowCheckout(false)}
                onCheckout={handleCheckout}
                getTotalPrice={getTotalPrice}
                removeFromCart={removeFromCart}
                addToCart={addToCart}
                selectedPaymentMethod={selectedPaymentMethod}
                onPaymentMethodChange={setSelectedPaymentMethod}
                onEditPayment={() => setShowCheckoutPaymentModal(true)}
                deliveryAddress={deliveryAddress}
                onEditAddress={() => {
                  setShowAddressModal(true);
                }}
                fulfillmentType={fulfillmentType}
                onFulfillmentTypeChange={setFulfillmentType}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Voice AI Assistant
            </h1>
            <p className="text-blue-200">Speak or type to interact</p>
            <button
              onClick={() => setShowAddressModal(true)}
              className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
              <MapPin className="w-5 h-5 text-green-400" />
              <p className="text-white/90 text-sm">{deliveryAddress}</p>
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col items-center">
              {/* Carousel for Order Grocery / Medicines */}
              {!showConversation &&
                !showStoreSearch &&
                !selectedStore &&
                !showCatalog && <HeroCarousel />}

              {showStoreSearch && !selectedStore && <StoreSearch />}

              {showConversation && <ChatPanel />}

              {showCatalog && selectedStore && !showConversation && <Catalog />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
