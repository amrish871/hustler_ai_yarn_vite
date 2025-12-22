// import { useEffect, useRef, useState } from 'react';
// import { Phone, Lock } from 'lucide-react';
// import { Button, Input, Toaster, toast } from '@myorg/ui';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { mobileSchema, otpSchema } from '@myorg/utils';
// import { apiService } from '../services/api';
// import { ApiRoutes } from '@myorg/config';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@myorg/auth';
// import { z } from 'zod';



// type MobileForm = z.infer<typeof mobileSchema>;
// type OtpForm = z.infer<typeof otpSchema>;

// export default function LoginPage() {
//   const { login: setAuthToken } = useAuth();
//   const navigate = useNavigate();
//   const [otpSent, setOtpSent] = useState(false);
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);
//   const mobileForm = useForm<MobileForm>({
//     resolver: zodResolver(mobileSchema),
//     mode: 'onTouched',
//     defaultValues: { mobile: '' },
//   });
//   const otpForm = useForm<OtpForm>({
//     resolver: zodResolver(otpSchema),
//     mode: 'onTouched',
//     defaultValues: { otp: '' },
//   });
//   const mobileValue = mobileForm.watch('mobile');
//   const otpValue = otpForm.watch('otp');
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     if (otpSent && timer > 0) {
//       timerRef.current = setInterval(() => {
//         setTimer((prev) => {
//           if (prev <= 1) {
//             setCanResend(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       return () => {
//         if (timerRef.current) clearInterval(timerRef.current);
//       };
//     }
//   }, [otpSent, timer]);

//   const handleSendOtp = mobileForm.handleSubmit(async (data) => {
//     try {
//       await toast.promise(
//         apiService.post('/api/v1/request-login-otp/', { mobile_number: data.mobile }),
//         {
//           loading: 'Sending OTP...',
//           success: 'OTP sent successfully!',
//           error: 'Failed to send OTP',
//         }
//       );
//       setOtpSent(true);
//       setTimer(30);
//       setCanResend(false);
//     } catch (err) {
//       // error handled by toast
//     }
//   });

//   const handleResendOtp = () => {
//     if (canResend) {
//       setTimer(30);
//       setCanResend(false);
//       otpForm.reset();
//     }
//   };

//   const handleLogin = otpForm.handleSubmit(async (data) => {
//     try {
//       const apiCall = apiService.post<{ token: string }>('/api/v1/verify-login-otp/', {
//         mobile_number: mobileForm.getValues('mobile'),
//         otp: data.otp,
//       });
//       const response = await toast.promise(apiCall, {
//         loading: 'Verifying OTP...',
//         success: 'Login successful!',
//         error: 'Invalid OTP or verification failed',
//       });
      
//       if (response && response.data.token) {
//         console.log('Login response:', response);
//         setAuthToken(response.data.token);
//         console.log('Login response:', response);
//       }
//       navigate('/dashboard');
//     } catch (err) {
//       // error handled by toast
//     }
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <Toaster position="top-right" />
//       <div className="w-full max-w-md">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
//             <Lock className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
//           <p className="text-gray-600 mt-2">Sign in to continue</p>
//         </div>

//         {/* Login Form */}
//         <div className="bg-white rounded-2xl shadow-xl p-8">

//           {!otpSent ? (
//             <form onSubmit={handleSendOtp} noValidate>
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Mobile Number
//                 </label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <Input
//                     type="tel"
//                     {...mobileForm.register('mobile', {
//                       onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//                         // Only allow digits, max 10
//                         const val = e.target.value.replace(/\D/g, '').slice(0, 10);
//                         mobileForm.setValue('mobile', val, { shouldValidate: true });
//                       },
//                     })}
//                     placeholder="Enter 10-digit mobile number"
//                     className="pl-12 pr-4 py-3"
//                     disabled={otpSent}
//                     error={mobileForm.formState.errors.mobile?.message}
//                     fullWidth
//                     id="mobile"
//                     name="mobile"
//                   />
//                 </div>
//               </div>
//               <Button
//                 type="submit"
//                 variant="primary"
//                 fullWidth
//                 size="lg"
//                 className="py-3"
//               >
//                 Send OTP
//               </Button>
//             </form>
//           ) : (
//             <form onSubmit={handleLogin} noValidate>
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Enter OTP
//                 </label>
//                 <Input
//                   type="text"
//                   {...otpForm.register('otp', {
//                     onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//                       // Only allow digits, max 6
//                       const val = e.target.value.replace(/\D/g, '').slice(0, 6);
//                       otpForm.setValue('otp', val, { shouldValidate: true });
//                     },
//                   })}
//                   placeholder="Enter 4-digit OTP"
//                   className="px-4 py-3"
//                   error={otpForm.formState.errors.otp?.message}
//                   fullWidth
//                   id="otp"
//                   name="otp"
//                 />
//                 <div className="mt-3 text-center">
//                   {canResend ? (
//                     <Button
//                       type="button"
//                       onClick={handleResendOtp}
//                       variant="outline"
//                       size="sm"
//                       className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition p-0 h-auto min-h-0 border-0 bg-transparent shadow-none"
//                     >
//                       Resend OTP
//                     </Button>
//                   ) : (
//                     <p className="text-gray-500 text-sm">
//                       Resend OTP in <span className="font-semibold text-indigo-600">{timer}s</span>
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <Button
//                 type="submit"
//                 variant="primary"
//                 fullWidth
//                 size="lg"
//                 className="py-3"
//               >
//                 Verify & Login
//               </Button>
//             </form>
//           )}

//           {/* Footer Text */}
//           <p className="text-center text-gray-500 text-sm mt-6">
//             By continuing, you agree to our Terms & Privacy Policy
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useRef } from "react";


function Login() {
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState("");
  const recognitionRef = useRef(null);

  // 🎤 Start listening to user
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in this browser");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      console.log("🎙️ Listening...");
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("User said:", transcript);
      setIsListening(false);
      recognition.stop();

      try {
        // 🚀 Send transcript to FastAPI backend with hardcoded Authorization header
        const res = await fetch("http://localhost:8000/api/v1/intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNSIsImV4cCI6MTc3OTUwNzEzMSwicm9sZXMiOlsidXNlciJdfQ.K-0LtKElKjb5AX2hWzrQH3FeUWqWT-xJ1NPTP8yaJNY" // <— hardcoded header
          },
          body: JSON.stringify({ 
            text: transcript,
            user_id: "12345",
            // "text": "string"
          }),
        });

        const data = await res.json();
        console.log("Response from server:", data.assistant_reply);
        const reply = data?.assistant_reply?.message || data.reply || "Got it!";
        console.log("AI says:", reply);
        setResponse(reply);
        speak(reply);
      } catch (error) {
        console.error("Error sending request:", error);
        setResponse("Error communicating with the server.");
        speak("Error communicating with the server.");
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // 🔊 Speak the AI response
  const speak = (text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>🎤 Voice AI Assistant</h2>
      <button onClick={startListening} disabled={isListening}>
        {isListening ? "Listening..." : "Speak"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <strong>Response:</strong>
        <p>{response}</p>
      </div>
    </div>
  );
}


export default Login;
