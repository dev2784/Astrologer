import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Linking, ActivityIndicator, Platform } from 'react-native';
import { MapPin, Phone, Mail, MessageCircle, Send } from 'lucide-react-native';
import { api } from '../utils/api'; 

export default function ContactScreen() {
  // TODO: Replace this with your actual mobile language store (Zustand or Context)
  const language = "en"; // "en" or "hi"

  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const WHATSAPP_NUMBER = "919340553012";
  const EMAIL_ADDRESS = "panditji@example.com"; 
  const MAP_QUERY = "Mangalnath+Mandir,+Ujjain,+Madhya+Pradesh";

  const openMap = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${MAP_QUERY}`,
      android: `geo:0,0?q=${MAP_QUERY}`,
    });
    if (url) Linking.openURL(url);
  };

  const handleLink = async (type: 'phone' | 'email' | 'whatsapp') => {
    let url = '';
    if (type === 'phone') url = `tel:+${WHATSAPP_NUMBER}`;
    if (type === 'email') url = `mailto:${EMAIL_ADDRESS}`;
    if (type === 'whatsapp') url = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=Hari%20Om!%20I%20have%20an%20inquiry.`;
    
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', `Cannot open ${type} on this device.`);
    }
  };

  const handleContactSubmit = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      Alert.alert('Missing Fields', language === "hi" ? "कृपया सभी अनिवार्य फ़ील्ड भरें।" : "Please fill all required fields.");
      return;
    }

    setSubmitStatus("loading");
    
    try {
      // Ensure your backend has this route available
      await api.post('/contact', formData); 
      
      setSubmitStatus("success");
      setFormData({ name: "", phone: "", email: "", message: "" });
      
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error: any) {
      setSubmitStatus("error");
      Alert.alert('Error', error?.response?.data?.error || 'Failed to send message.');
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      
      {/* 1. MAP BANNER (Tap to open native maps) */}
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={openMap}
        className="w-full h-48 bg-slate-800 justify-center items-center"
      >
        <MapPin size={40} color="#ffffff" className="mb-2 opacity-80" />
        <Text className="text-3xl font-bold text-white tracking-widest text-center px-4">
          {language === "hi" ? "संपर्क करें" : "Contact Us"}
        </Text>
        <Text className="text-slate-300 mt-2 font-medium">Tap to open Maps</Text>
      </TouchableOpacity>

      {/* 2. CONTACT INFO SECTION */}
      <View className="px-4 py-6 -mt-6">
        
        {/* Address Card */}
        <View className="bg-white p-6 rounded-2xl border border-slate-200 mb-4 shadow-sm">
          <View className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <MapPin size={24} color="#ea580c" />
          </View>
          <Text className="text-lg font-bold text-slate-900 mb-1">
            {language === "hi" ? "हमारा पता" : "Our Address"}
          </Text>
          <Text className="text-slate-600 text-base leading-6">
            Mangalnath Mandir Road,{"\n"}Ujjain, Madhya Pradesh{"\n"}India - 456006
          </Text>
        </View>

        {/* Direct Contact Card */}
        <View className="bg-white p-6 rounded-2xl border border-slate-200 mb-4 shadow-sm">
          <View className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Phone size={24} color="#dc2626" />
          </View>
          <Text className="text-lg font-bold text-slate-900 mb-4">
            {language === "hi" ? "सीधा संपर्क" : "Direct Contact"}
          </Text>
          
          <TouchableOpacity onPress={() => handleLink('phone')} className="flex-row items-center mb-4">
            <Phone size={20} color="#94a3b8" />
            <Text className="ml-3 text-slate-700 font-bold text-base">+{WHATSAPP_NUMBER}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => handleLink('email')} className="flex-row items-center">
            <Mail size={20} color="#94a3b8" />
            <Text className="ml-3 text-slate-700 font-bold text-base">{EMAIL_ADDRESS}</Text>
          </TouchableOpacity>
        </View>

        {/* WhatsApp CTA */}
        <TouchableOpacity 
          onPress={() => handleLink('whatsapp')}
          className="bg-[#25D366] flex-row items-center justify-center py-4 rounded-2xl mb-8 shadow-sm"
        >
          <MessageCircle size={24} color="#ffffff" />
          <Text className="text-white font-bold text-lg ml-3">
            {language === "hi" ? "व्हाट्सएप पर चैट करें" : "Chat on WhatsApp"}
          </Text>
        </TouchableOpacity>

        {/* 3. CONTACT FORM */}
        <View className="bg-white p-6 rounded-2xl border border-slate-200 mb-10 shadow-sm">
          <Text className="text-2xl font-bold text-slate-900 mb-2">
            {language === "hi" ? "हमें संदेश भेजें" : "Send Us a Message"}
          </Text>
          <Text className="text-slate-500 mb-6 leading-5">
            {language === "hi" 
              ? "पूजा बुकिंग, मुहूर्त या अन्य किसी भी जानकारी के लिए नीचे दिए गए फॉर्म को भरें। हम जल्द ही आपसे संपर्क करेंगे।" 
              : "Fill out the form below for Puja bookings, Muhurat inquiries, or any other questions. We will get back to you shortly."}
          </Text>

          <Text className="text-sm font-bold text-slate-700 mb-1">{language === "hi" ? "आपका नाम" : "Your Name"} *</Text>
          <TextInput 
            className="bg-slate-50 p-4 rounded-xl mb-4 text-slate-800 border border-slate-200"
            placeholder={language === "hi" ? "नाम दर्ज करें" : "John Doe"}
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
          />

          <Text className="text-sm font-bold text-slate-700 mb-1">{language === "hi" ? "फ़ोन नंबर" : "Phone Number"} *</Text>
          <TextInput 
            className="bg-slate-50 p-4 rounded-xl mb-4 text-slate-800 border border-slate-200"
            placeholder="+91 00000 00000"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => setFormData({...formData, phone: text})}
          />

          <Text className="text-sm font-bold text-slate-700 mb-1">{language === "hi" ? "ईमेल आईडी (वैकल्पिक)" : "Email Address (Optional)"}</Text>
          <TextInput 
            className="bg-slate-50 p-4 rounded-xl mb-4 text-slate-800 border border-slate-200"
            placeholder="example@mail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
          />

          <Text className="text-sm font-bold text-slate-700 mb-1">{language === "hi" ? "आपका संदेश" : "Your Message"} *</Text>
          <TextInput 
            className="bg-slate-50 p-4 rounded-xl mb-6 text-slate-800 border border-slate-200 h-28"
            placeholder={language === "hi" ? "आपकी आवश्यकता या प्रश्न यहाँ लिखें..." : "How can we help you?"}
            multiline
            textAlignVertical="top"
            value={formData.message}
            onChangeText={(text) => setFormData({...formData, message: text})}
          />

          <TouchableOpacity 
            className={`py-4 rounded-xl flex-row items-center justify-center ${
              submitStatus === "loading" ? "bg-slate-400" : 
              submitStatus === "success" ? "bg-green-600" : 
              submitStatus === "error" ? "bg-red-600" : "bg-orange-600"
            }`}
            onPress={handleContactSubmit}
            disabled={submitStatus === "loading"}
          >
            {submitStatus === "loading" ? (
              <ActivityIndicator color="#ffffff" />
            ) : submitStatus === "success" ? (
              <Text className="text-white font-bold text-lg">{language === "hi" ? "संदेश सफलतापूर्वक भेजा गया!" : "Message Sent Successfully!"}</Text>
            ) : submitStatus === "error" ? (
              <Text className="text-white font-bold text-lg">Failed! Try Again</Text>
            ) : (
              <>
                <Text className="text-white font-bold text-lg mr-2">{language === "hi" ? "संदेश भेजें" : "Send Message"}</Text>
                <Send size={20} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}