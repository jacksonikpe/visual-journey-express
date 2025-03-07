
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Pre-defined access code
const ADMIN_ACCESS_CODE = "123456";

const AccessCode = () => {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleVerify = () => {
    setIsSubmitting(true);
    
    // Simple verification against the pre-defined code
    if (value === ADMIN_ACCESS_CODE) {
      toast({
        title: "Success",
        description: "Access granted. Redirecting to admin panel...",
      });
      setTimeout(() => navigate("/admin"), 1000);
    } else {
      toast({
        title: "Error",
        description: "Invalid access code. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 pt-36 pb-16 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary text-center">
            Admin Access
          </h1>
          
          <p className="text-muted-foreground text-center mb-8">
            Enter the 6-digit access code to continue
          </p>
          
          <div className="flex flex-col items-center space-y-6">
            <InputOTP 
              maxLength={6} 
              value={value} 
              onChange={setValue}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} index={index} />
                  ))}
                </InputOTPGroup>
              )}
            />
            
            <Button 
              onClick={handleVerify} 
              disabled={value.length !== 6 || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default AccessCode;
