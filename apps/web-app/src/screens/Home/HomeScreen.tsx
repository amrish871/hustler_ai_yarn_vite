// import { useState } from 'react';
// import PaymentScreen from './PaymentScreen';
// import { HeroCarousel } from '../../components/HeroCarousel';
// import { StoreSearch } from '../../components/StoreSearch';
// import { Catalog } from '../../components/Catalog';
// import { PaymentMethodsSection } from '../../components/PaymentMethodsSection';
// import { ChatPanel } from '../../components/ChatPanel';
// import { useCart } from '../../../hooks/useCart';
// import { Store, Message } from './Home.types';
// import { stores } from './mockData';

// export default function HomeScreen() {

//   const { cart, add, remove, count, total } = useCart();
//   const [selectedStore, setSelectedStore] = useState<Store | null>(null);
//   const [showSearch, setShowSearch] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [listening, setListening] = useState(false);
//   const [showPayment, setShowPayment] = useState(false);
//   const [orderConfirmed, setOrderConfirmed] = useState(false);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');

//   return (
//     <div className="p-4 space-y-4">
//       {orderConfirmed ? (
//         <div className="text-center py-10">
//           <h2 className="text-2xl font-bold mb-4">Thank you for your order!</h2>
//           <p className="mb-4">Your payment was successful. Your order is being processed.</p>
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//             onClick={() => {
//               setOrderConfirmed(false);
//               setSelectedStore(null);
//               setShowSearch(false);
//               setShowPayment(false);
//             }}
//           >
//             Back to Home
//           </button>
//         </div>
//       ) : showPayment && selectedStore ? (
//         <PaymentScreen
//           total={total(selectedStore.id)}
//           onConfirm={() => {
//             setShowPayment(false);
//             setOrderConfirmed(true);
//           }}
//           onBack={() => setShowPayment(false)}
//         />
//       ) : (
//         <>
//           {!showSearch && !selectedStore && (
//             <HeroCarousel
//               isListening={listening}
//               cartCount={count()}
//               onToggleListening={() => setListening(!listening)}
//               onChat={() => setMessages([])}
//               onBrowse={() => setShowSearch(true)}
//             />
//           )}

//           {showSearch && (
//             <StoreSearch
//               stores={stores}
//               onClose={() => setShowSearch(false)}
//               onSelect={store => {
//                 setSelectedStore(store);
//                 setShowSearch(false);
//               }}
//             />
//           )}

//           {selectedStore && (
//             <>
//               <Catalog
//                 store={selectedStore}
//                 cartCount={count(selectedStore.id)}
//                 total={total(selectedStore.id)}
//                 getQuantity={(id) =>
//                   cart.find(
//                     i => i.id === id && i.storeId === selectedStore.id
//                   )?.quantity ?? 0
//                 }
//                 onAdd={(p) => add(p, selectedStore.id)}
//                 onRemove={(id) => remove(id, selectedStore.id)}
//                 onCheckout={() => setShowPayment(true)}
//               />
//               {count(selectedStore.id) > 0 && (
//                 <PaymentMethodsSection
//                   onSelect={setSelectedPaymentMethod}
//                   selectedMethod={selectedPaymentMethod}
//                 />
//               )}
//             </>
//           )}

//           {messages.length > 0 && (
//             <ChatPanel
//               messages={messages}
//               onBack={() => setMessages([])}
//               onSend={text =>
//                 setMessages(m => [...m, { text, sender: 'user' }])
//               }
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// }
