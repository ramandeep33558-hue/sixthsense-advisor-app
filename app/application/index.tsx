import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING } from '../../src/constants/theme';

// Steps in the application process
const STEPS = [
  { id: 1, title: 'Personal Info', icon: 'person' },
  { id: 2, title: 'Experience', icon: 'briefcase' },
  { id: 3, title: 'Background', icon: 'school' },
  { id: 4, title: 'Tax Documents', icon: 'document-text' },
  { id: 5, title: 'Payment', icon: 'wallet' },
  { id: 6, title: 'Video Interview', icon: 'videocam' },
];

// Love & Relationships sub-services
const loveServices = [
  'Soulmate Reading',
  'Twin Flame Guidance',
  'Marriage Compatibility',
  'Divorce Guidance',
  'Rekindling Romance',
  'Finding True Love',
  'Relationship Healing',
  'Past Life Connections',
  'Love Triangle Advice',
  'Long Distance Love',
  'Breakup Recovery',
  'Dating Advice',
];

export default function ApplicationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    country: '',
    // Experience
    yearsExperience: '',
    specialties: [] as string[],
    loveServices: [] as string[],
    bio: '',
    // Background
    background: '',
    toolsUsed: [] as string[],
    // W-9 Tax Info (US)
    w9Name: '',
    w9BusinessName: '',
    w9TaxClassification: '',
    w9ExemptPayee: '',
    w9FatcaExempt: '',
    w9Address: '',
    w9CityStateZip: '',
    w9AccountNumbers: '',
    w9TIN: '',
    w9TINType: 'ssn', // 'ssn' or 'ein'
    w9Signature: false,
    w9SignatureDate: '',
    // W-8BEN (International)
    w8Name: '',
    w8CountryOfCitizenship: '',
    w8PermanentAddress: '',
    w8MailingAddress: '',
    w8TIN_US: '',
    w8TIN_Foreign: '',
    w8DateOfBirth: '',
    w8TreatyCountry: '',
    w8Signature: false,
    // Payment
    paypalEmail: '',
  });

  const specialtiesList = [
    'Love & Relationships', 'Career & Finance', 'Tarot Cards', 'Dream Analysis',
    'Spiritual Guidance', 'Astrology', 'Numerology', 'Life Path',
    'Palm Reading', 'Crystal Ball', 'Angel Messages', 'Psychic Medium',
    'Aura Reading', 'Chakra Healing', 'Past Life', 'Pet Psychic'
  ];

  const toolsList = [
    'Tarot Cards', 'Oracle Cards', 'Crystal Ball', 'Pendulum',
    'Crystals', 'Runes', 'Numerology Charts', 'Birth Charts',
    'Candles', 'Incense', 'Meditation', 'Channeling',
    'Automatic Writing', 'Scrying Mirror', 'Spirit Board', 'None - Natural Gifts'
  ];

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Belize', 'Bolivia', 'Bosnia and Herzegovina',
    'Brazil', 'Bulgaria', 'Cambodia', 'Cameroon', 'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Dominican Republic', 'Ecuador', 'Egypt',
    'El Salvador', 'Estonia', 'Ethiopia', 'Finland', 'France', 'Georgia', 'Germany', 'Ghana', 'Greece',
    'Guatemala', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran',
    'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait',
    'Latvia', 'Lebanon', 'Libya', 'Lithuania', 'Luxembourg', 'Malaysia', 'Maldives', 'Malta', 'Mexico',
    'Moldova', 'Monaco', 'Mongolia', 'Morocco', 'Myanmar', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua',
    'Nigeria', 'North Korea', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Paraguay', 'Peru',
    'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia',
    'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka',
    'Sudan', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tanzania', 'Thailand', 'Trinidad and Tobago',
    'Tunisia', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
    'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zimbabwe'
  ].sort();

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
  ];

  const taxClassifications = [
    { id: 'individual', label: 'Individual/sole proprietor or single-member LLC' },
    { id: 'c_corp', label: 'C Corporation' },
    { id: 's_corp', label: 'S Corporation' },
    { id: 'partnership', label: 'Partnership' },
    { id: 'trust', label: 'Trust/estate' },
    { id: 'llc_c', label: 'LLC taxed as C corporation' },
    { id: 'llc_s', label: 'LLC taxed as S corporation' },
    { id: 'llc_p', label: 'LLC taxed as Partnership' },
  ];

  const MAX_BIO_WORDS = 300;
  const MAX_BACKGROUND_WORDS = 500;

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const toggleLoveService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      loveServices: prev.loveServices.includes(service)
        ? prev.loveServices.filter(s => s !== service)
        : [...prev.loveServices, service]
    }));
  };

  const toggleTool = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      toolsUsed: prev.toolsUsed.includes(tool)
        ? prev.toolsUsed.filter(t => t !== tool)
        : [...prev.toolsUsed, tool]
    }));
  };

  // Validation functions for each step
  const validateStep1 = (): string | null => {
    if (!formData.fullName.trim()) return 'Please enter your full legal name';
    if (!formData.email.trim()) return 'Please enter your email address';
    if (!formData.email.includes('@')) return 'Please enter a valid email address';
    if (!formData.phone.trim()) return 'Please enter your phone number';
    if (!formData.country) return 'Please select your country of residence';
    return null;
  };

  const validateStep2 = (): string | null => {
    if (!formData.yearsExperience.trim()) return 'Please enter your years of experience';
    if (formData.specialties.length === 0) return 'Please select at least one specialty';
    if (formData.specialties.includes('Love & Relationships') && formData.loveServices.length === 0) {
      return 'Please select at least one Love & Relationship service';
    }
    if (!formData.bio.trim()) return 'Please write about yourself';
    if (countWords(formData.bio) < 20) return 'Please write at least 20 words about yourself';
    if (countWords(formData.bio) > MAX_BIO_WORDS) return `Bio must be ${MAX_BIO_WORDS} words or less`;
    return null;
  };

  const validateStep3 = (): string | null => {
    if (formData.toolsUsed.length === 0) return 'Please select at least one tool you use';
    if (!formData.background.trim()) return 'Please write about your psychic background';
    if (countWords(formData.background) < 30) return 'Please write at least 30 words about your background';
    if (countWords(formData.background) > MAX_BACKGROUND_WORDS) return `Background must be ${MAX_BACKGROUND_WORDS} words or less`;
    return null;
  };

  const validateStep4 = (): string | null => {
    const isUS = formData.country === 'United States';
    
    if (isUS) {
      // W-9 Validation
      if (!formData.w9Name.trim()) return 'Please enter your legal name for tax purposes';
      if (!formData.w9TaxClassification) return 'Please select your federal tax classification';
      if (!formData.w9Address.trim()) return 'Please enter your address';
      if (!formData.w9CityStateZip.trim()) return 'Please enter your city, state, and ZIP code';
      if (!formData.w9TIN.trim()) return 'Please enter your Social Security Number or EIN';
      if (!formData.w9Signature) return 'Please certify the information by checking the signature box';
    } else {
      // W-8BEN Validation
      if (!formData.w8Name.trim()) return 'Please enter your legal name';
      if (!formData.w8CountryOfCitizenship.trim()) return 'Please enter your country of citizenship';
      if (!formData.w8PermanentAddress.trim()) return 'Please enter your permanent address';
      if (!formData.w8DateOfBirth.trim()) return 'Please enter your date of birth';
      if (!formData.w8Signature) return 'Please certify the information by checking the signature box';
    }
    return null;
  };

  const validateStep5 = (): string | null => {
    if (!formData.paypalEmail.trim()) return 'Please enter your PayPal email address';
    if (!formData.paypalEmail.includes('@')) return 'Please enter a valid PayPal email address';
    return null;
  };

  const validateCurrentStep = (): string | null => {
    switch (currentStep) {
      case 1: return validateStep1();
      case 2: return validateStep2();
      case 3: return validateStep3();
      case 4: return validateStep4();
      case 5: return validateStep5();
      default: return null;
    }
  };

  const handleNext = async () => {
    // Validate current step before proceeding
    const validationError = validateCurrentStep();
    if (validationError) {
      Alert.alert('Required Fields', validationError);
      return;
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save application data to AsyncStorage before going to video interview
      const applicationData = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        years_experience: formData.yearsExperience,
        specialties: formData.specialties,
        love_services: formData.loveServices,
        bio: formData.bio,
        background: formData.background,
        tools_used: formData.toolsUsed,
        tax_form_type: formData.country === 'United States' ? 'w9' : 'w8ben',
        tax_form_completed: formData.country === 'United States' ? formData.w9Signature : formData.w8Signature,
        paypal_email: formData.paypalEmail,
      };
      
      try {
        await AsyncStorage.setItem('application_data', JSON.stringify(applicationData));
        router.push('/application/video-interview');
      } catch (error) {
        console.error('Failed to save application data:', error);
        Alert.alert('Error', 'Failed to save application data. Please try again.');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const renderStepIndicator = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stepScroll}>
      <View style={styles.stepIndicator}>
        {STEPS.map((step, index) => (
          <View key={step.id} style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              currentStep >= step.id && styles.stepCircleActive,
              currentStep === step.id && styles.stepCircleCurrent
            ]}>
              {currentStep > step.id ? (
                <Ionicons name="checkmark" size={14} color="#FFF" />
              ) : (
                <Ionicons name={step.icon as any} size={14} color={currentStep >= step.id ? '#FFF' : COLORS.textMuted} />
              )}
            </View>
            {index < STEPS.length - 1 && (
              <View style={[
                styles.stepLine,
                currentStep > step.id && styles.stepLineActive
              ]} />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Legal Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor={COLORS.textMuted}
          value={formData.fullName}
          onChangeText={(text) => setFormData({...formData, fullName: text})}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Phone Number <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => setFormData({...formData, phone: text})}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Country of Residence <Text style={styles.required}>*</Text></Text>
        <Text style={styles.inputHint}>Select your country for tax purposes</Text>
        <TouchableOpacity 
          style={styles.countrySelector}
          onPress={() => setShowCountryPicker(true)}
        >
          <Ionicons name="globe-outline" size={20} color={COLORS.textMuted} />
          <Text style={[
            styles.countrySelectorText,
            formData.country && styles.countrySelectorTextSelected
          ]}>
            {formData.country || 'Select your country'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredCountries = countries.filter(country => 
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const renderCountryPicker = () => (
    <Modal
      visible={showCountryPicker}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCountryPicker(false)}
    >
      <View style={styles.countryModalOverlay}>
        <View style={[styles.countryModalContent, { paddingBottom: insets.bottom }]}>
          {/* Header */}
          <View style={styles.countryModalHeader}>
            <Text style={styles.countryModalTitle}>Select Country</Text>
            <TouchableOpacity 
              style={styles.countryModalClose}
              onPress={() => {
                setShowCountryPicker(false);
                setCountrySearch('');
              }}
            >
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          
          {/* Search */}
          <View style={styles.countrySearchContainer}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} />
            <TextInput
              style={styles.countrySearchInput}
              placeholder="Search countries..."
              placeholderTextColor={COLORS.textMuted}
              value={countrySearch}
              onChangeText={setCountrySearch}
              autoFocus
            />
            {countrySearch.length > 0 && (
              <TouchableOpacity onPress={() => setCountrySearch('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Country List */}
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.countryItem,
                  formData.country === item && styles.countryItemSelected
                ]}
                onPress={() => {
                  setFormData({...formData, country: item});
                  setShowCountryPicker(false);
                  setCountrySearch('');
                }}
              >
                <Text style={[
                  styles.countryItemText,
                  formData.country === item && styles.countryItemTextSelected
                ]}>
                  {item}
                </Text>
                {formData.country === item && (
                  <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No countries found</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Your Experience</Text>
      <Text style={styles.stepSubtitle}>Share your psychic abilities and specialties</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Years of Experience <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 5"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="number-pad"
          value={formData.yearsExperience}
          onChangeText={(text) => setFormData({...formData, yearsExperience: text})}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Main Specialties <Text style={styles.required}>*</Text></Text>
        <Text style={styles.inputHint}>Select all that apply (at least one required)</Text>
        <View style={styles.specialtiesGrid}>
          {specialtiesList.map((specialty) => (
            <TouchableOpacity
              key={specialty}
              style={[
                styles.specialtyChip,
                formData.specialties.includes(specialty) && styles.specialtyChipActive
              ]}
              onPress={() => toggleSpecialty(specialty)}
            >
              <Text style={[
                styles.specialtyText,
                formData.specialties.includes(specialty) && styles.specialtyTextActive
              ]}>
                {specialty}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Love & Relationships Sub-services */}
      {formData.specialties.includes('Love & Relationships') && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Love & Relationship Services <Text style={styles.required}>*</Text></Text>
          <Text style={styles.inputHint}>Select specific services you offer (at least one required)</Text>
          <View style={styles.specialtiesGrid}>
            {loveServices.map((service) => (
              <TouchableOpacity
                key={service}
                style={[
                  styles.loveChip,
                  formData.loveServices.includes(service) && styles.loveChipActive
                ]}
                onPress={() => toggleLoveService(service)}
              >
                <Text style={[
                  styles.loveText,
                  formData.loveServices.includes(service) && styles.loveTextActive
                ]}>
                  {service}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.inputLabel}>About You <Text style={styles.required}>*</Text></Text>
          <Text style={[
            styles.wordCount,
            countWords(formData.bio) > MAX_BIO_WORDS && styles.wordCountError
          ]}>
            {countWords(formData.bio)}/{MAX_BIO_WORDS} words
          </Text>
        </View>
        <Text style={styles.inputHint}>
          Tell clients about your gift and how you can help them. (Min 20 words)
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your psychic abilities, your journey, and what makes your readings special..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={6}
          value={formData.bio}
          onChangeText={(text) => setFormData({...formData, bio: text})}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Your Background</Text>
      <Text style={styles.stepSubtitle}>Tell us about your psychic journey and tools</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tools You Use <Text style={styles.required}>*</Text></Text>
        <Text style={styles.inputHint}>Select what you work with (at least one required)</Text>
        <View style={styles.specialtiesGrid}>
          {toolsList.map((tool) => (
            <TouchableOpacity
              key={tool}
              style={[
                styles.toolChip,
                formData.toolsUsed.includes(tool) && styles.toolChipActive
              ]}
              onPress={() => toggleTool(tool)}
            >
              <Text style={[
                styles.toolText,
                formData.toolsUsed.includes(tool) && styles.toolTextActive
              ]}>
                {tool}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.inputLabel}>Your Psychic Background <Text style={styles.required}>*</Text></Text>
          <Text style={[
            styles.wordCount,
            countWords(formData.background) > MAX_BACKGROUND_WORDS && styles.wordCountError
          ]}>
            {countWords(formData.background)}/{MAX_BACKGROUND_WORDS} words
          </Text>
        </View>
        <Text style={styles.inputHint}>
          Share your journey - how did you discover your gift? (Min 30 words)
        </Text>
        <TextInput
          style={[styles.input, styles.textAreaLarge]}
          placeholder="Share your story... When did you first realize you had psychic abilities? How have you developed your gifts over time? Any certifications or training?"
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={8}
          value={formData.background}
          onChangeText={(text) => setFormData({...formData, background: text})}
        />
      </View>
    </View>
  );

  const renderStep4 = () => {
    const isUS = formData.country === 'United States';
    
    if (isUS) {
      // US W-9 Form
      return (
        <View style={styles.stepContent}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Form W-9</Text>
            <Text style={styles.formSubtitle}>Request for Taxpayer Identification Number and Certification</Text>
          </View>

          {/* Part 1: Identification */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Part I - Taxpayer Identification</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>1. Name (as shown on your income tax return)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your legal name"
                placeholderTextColor={COLORS.textMuted}
                value={formData.w9Name}
                onChangeText={(text) => setFormData({...formData, w9Name: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>2. Business name/disregarded entity name (if different)</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional - Enter business name"
                placeholderTextColor={COLORS.textMuted}
                value={formData.w9BusinessName}
                onChangeText={(text) => setFormData({...formData, w9BusinessName: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>3. Federal Tax Classification</Text>
              <View style={styles.taxClassGrid}>
                {taxClassifications.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.taxClassOption,
                      formData.w9TaxClassification === item.id && styles.taxClassOptionActive
                    ]}
                    onPress={() => setFormData({...formData, w9TaxClassification: item.id})}
                  >
                    <View style={[
                      styles.radioCircle,
                      formData.w9TaxClassification === item.id && styles.radioCircleActive
                    ]}>
                      {formData.w9TaxClassification === item.id && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.taxClassText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Part 2: Address */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Address</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>4. Address (number, street, apt/suite)</Text>
              <TextInput
                style={styles.input}
                placeholder="123 Main Street, Apt 4B"
                placeholderTextColor={COLORS.textMuted}
                value={formData.w9Address}
                onChangeText={(text) => setFormData({...formData, w9Address: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>5. City, State, and ZIP code</Text>
              <TextInput
                style={styles.input}
                placeholder="Los Angeles, CA 90001"
                placeholderTextColor={COLORS.textMuted}
                value={formData.w9CityStateZip}
                onChangeText={(text) => setFormData({...formData, w9CityStateZip: text})}
              />
            </View>
          </View>

          {/* Part 3: TIN */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Part I - Taxpayer Identification Number (TIN)</Text>
            
            <View style={styles.tinTypeRow}>
              <TouchableOpacity
                style={[styles.tinTypeOption, formData.w9TINType === 'ssn' && styles.tinTypeActive]}
                onPress={() => setFormData({...formData, w9TINType: 'ssn'})}
              >
                <Text style={[styles.tinTypeText, formData.w9TINType === 'ssn' && styles.tinTypeTextActive]}>
                  Social Security Number (SSN)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tinTypeOption, formData.w9TINType === 'ein' && styles.tinTypeActive]}
                onPress={() => setFormData({...formData, w9TINType: 'ein'})}
              >
                <Text style={[styles.tinTypeText, formData.w9TINType === 'ein' && styles.tinTypeTextActive]}>
                  Employer ID Number (EIN)
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {formData.w9TINType === 'ssn' ? 'Social Security Number' : 'Employer Identification Number'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={formData.w9TINType === 'ssn' ? 'XXX-XX-XXXX' : 'XX-XXXXXXX'}
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
                keyboardType="number-pad"
                value={formData.w9TIN}
                onChangeText={(text) => setFormData({...formData, w9TIN: text})}
              />
            </View>
          </View>

          {/* Part 4: Certification */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Part II - Certification</Text>
            <Text style={styles.certificationText}>
              Under penalties of perjury, I certify that:{'\n\n'}
              1. The number shown on this form is my correct taxpayer identification number, and{'\n\n'}
              2. I am not subject to backup withholding because: (a) I am exempt from backup withholding, or (b) I have not been notified by the IRS that I am subject to backup withholding as a result of a failure to report all interest or dividends, or (c) the IRS has notified me that I am no longer subject to backup withholding, and{'\n\n'}
              3. I am a U.S. citizen or other U.S. person, and{'\n\n'}
              4. The FATCA code(s) entered on this form (if any) indicating that I am exempt from FATCA reporting is correct.
            </Text>
            
            <TouchableOpacity
              style={styles.signatureBox}
              onPress={() => setFormData({...formData, w9Signature: !formData.w9Signature})}
            >
              <View style={[styles.checkbox, formData.w9Signature && styles.checkboxActive]}>
                {formData.w9Signature && <Ionicons name="checkmark" size={16} color="#FFF" />}
              </View>
              <Text style={styles.signatureText}>
                I certify the above information is correct (Electronic Signature)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      // International W-8BEN Form
      return (
        <View style={styles.stepContent}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Form W-8BEN</Text>
            <Text style={styles.formSubtitle}>Certificate of Foreign Status of Beneficial Owner for U.S. Tax Withholding</Text>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="globe" size={24} color={COLORS.info} />
            <Text style={styles.infoText}>
              This form is for individuals who are not U.S. citizens or residents. It certifies your foreign status for tax purposes.
            </Text>
          </View>

          {/* Part 1: Identification */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Part I - Identification of Beneficial Owner</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>1. Name of individual</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full legal name"
                placeholderTextColor={COLORS.textMuted}
                value={formData.w8Name}
                onChangeText={(text) => setFormData({...formData, w8Name: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>2. Country of citizenship</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your country of citizenship"
                placeholderTextColor={COLORS.textMuted}
                value={formData.w8CountryOfCitizenship}
                onChangeText={(text) => setFormData({...formData, w8CountryOfCitizenship: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>3. Permanent residence address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Street, city, country, postal code"
                placeholderTextColor={COLORS.textMuted}
                multiline
                value={formData.w8PermanentAddress}
                onChangeText={(text) => setFormData({...formData, w8PermanentAddress: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>4. Mailing address (if different)</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional - Enter mailing address"
                placeholderTextColor={COLORS.textMuted}
                value={formData.w8MailingAddress}
                onChangeText={(text) => setFormData({...formData, w8MailingAddress: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>5. Date of birth (MM/DD/YYYY)</Text>
              <TextInput
                style={styles.input}
                placeholder="01/15/1990"
                placeholderTextColor={COLORS.textMuted}
                value={formData.w8DateOfBirth}
                onChangeText={(text) => setFormData({...formData, w8DateOfBirth: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>6. Foreign tax identifying number (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Your country's tax ID number"
                placeholderTextColor={COLORS.textMuted}
                value={formData.w8TIN_Foreign}
                onChangeText={(text) => setFormData({...formData, w8TIN_Foreign: text})}
              />
            </View>
          </View>

          {/* Part 2: Treaty */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Part II - Claim of Tax Treaty Benefits</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Country claiming treaty benefits (if any)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter country name or leave blank"
                placeholderTextColor={COLORS.textMuted}
                value={formData.w8TreatyCountry}
                onChangeText={(text) => setFormData({...formData, w8TreatyCountry: text})}
              />
            </View>
          </View>

          {/* Certification */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Part III - Certification</Text>
            
            <TouchableOpacity
              style={styles.signatureBox}
              onPress={() => setFormData({...formData, w8Signature: !formData.w8Signature})}
            >
              <View style={[styles.checkbox, formData.w8Signature && styles.checkboxActive]}>
                {formData.w8Signature && <Ionicons name="checkmark" size={16} color="#FFF" />}
              </View>
              <Text style={styles.signatureText}>
                I certify that I am the beneficial owner of the income to which this form relates, I am not a U.S. person, and I have provided accurate information (Electronic Signature)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  const renderStep5 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Payment Method</Text>
      <Text style={styles.stepSubtitle}>How would you like to receive payments?</Text>

      <View style={styles.paymentOption}>
        <View style={styles.paymentIcon}>
          <Ionicons name="logo-paypal" size={32} color="#003087" />
        </View>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentTitle}>PayPal</Text>
          <Text style={styles.paymentDesc}>Fast, secure payments to your PayPal account</Text>
        </View>
        <View style={styles.radioSelected}>
          <View style={styles.radioInner} />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>PayPal Email Address <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="your@paypal-email.com"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="email-address"
          value={formData.paypalEmail}
          onChangeText={(text) => setFormData({...formData, paypalEmail: text})}
        />
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={24} color={COLORS.info} />
        <Text style={styles.infoText}>
          Withdrawals are processed weekly. See Terms & Conditions for full payment details.
        </Text>
      </View>
    </View>
  );

  const renderStep6 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Video Interview</Text>
      <Text style={styles.stepSubtitle}>Answer a sample client question (5 min max)</Text>

      {/* Sample Question Card */}
      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <View style={styles.clientAvatar}>
            <Text style={styles.clientInitial}>N</Text>
          </View>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>Sample Client Question</Text>
            <Text style={styles.clientDate}>Practice Reading</Text>
          </View>
        </View>
        <View style={styles.questionBody}>
          <Text style={styles.questionText}>
            "Hello, my name is Navneet Kaur. My date of birth is February 22, 1999. Can you tell me about my married life? And also tell me about my career."
          </Text>
        </View>
      </View>

      <View style={styles.videoRequirements}>
        <Text style={styles.requirementsTitle}>Video Requirements:</Text>
        
        <View style={styles.requirementItem}>
          <Ionicons name="time" size={20} color={COLORS.primary} />
          <Text style={styles.requirementText}>Maximum 5 minutes length</Text>
        </View>
        
        <View style={styles.requirementItem}>
          <Ionicons name="videocam" size={20} color={COLORS.primary} />
          <Text style={styles.requirementText}>Record directly in the app (no uploads)</Text>
        </View>
        
        <View style={styles.requirementItem}>
          <Ionicons name="construct" size={20} color={COLORS.primary} />
          <Text style={styles.requirementText}>You can use your tools (cards, crystals, etc.)</Text>
        </View>
        
        <View style={styles.requirementItem}>
          <Ionicons name="sunny" size={20} color={COLORS.primary} />
          <Text style={styles.requirementText}>Good lighting facing you</Text>
        </View>
        
        <View style={styles.requirementItem}>
          <Ionicons name="volume-mute" size={20} color={COLORS.primary} />
          <Text style={styles.requirementText}>Quiet environment</Text>
        </View>
      </View>

      <View style={styles.tipBox}>
        <Ionicons name="bulb" size={24} color={COLORS.gold} />
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Pro Tip</Text>
          <Text style={styles.tipText}>
            Show your authentic reading style! Use your tarot cards, crystals, or any tools you normally use. 
            Speak naturally and connect with the question as if it's a real client.
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Country Picker Modal */}
      {renderCountryPicker()}
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Become an Advisor</Text>
        <Text style={styles.stepCount}>{currentStep}/6</Text>
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        {currentStep === 6 && renderStep6()}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.nextGradient}
          >
            <Text style={styles.nextText}>
              {currentStep === 6 ? 'Record Video' : 'Continue'}
            </Text>
            <Ionicons name={currentStep === 6 ? 'videocam' : 'arrow-forward'} size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.backgroundElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  stepCount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stepScroll: {
    maxHeight: 60,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
  },
  stepCircleCurrent: {
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  stepLine: {
    width: 24,
    height: 2,
    backgroundColor: COLORS.backgroundElevated,
  },
  stepLineActive: {
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  stepContent: {
    paddingTop: SPACING.md,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  stepSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  inputHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  wordCount: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  wordCountError: {
    color: COLORS.error,
  },
  required: {
    color: COLORS.error,
    fontWeight: '400',
  },
  input: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  textAreaLarge: {
    height: 160,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  specialtyChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  specialtyChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  specialtyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  specialtyTextActive: {
    color: '#FFF',
    fontWeight: '500',
  },
  loveChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: '#E8A0B8' + '50',
  },
  loveChipActive: {
    backgroundColor: '#E8A0B8',
    borderColor: '#E8A0B8',
  },
  loveText: {
    fontSize: 12,
    color: '#E8A0B8',
  },
  loveTextActive: {
    color: '#FFF',
    fontWeight: '500',
  },
  toolChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.secondary + '50',
  },
  toolChipActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  toolText: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  toolTextActive: {
    color: COLORS.background,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info + '15',
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  paymentIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  paymentDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  earningsInfo: {
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: 12,
  },
  earningsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  earningsLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  earningsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gold,
  },
  earningsNote: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  questionCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  clientInfo: {
    marginLeft: SPACING.md,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  clientDate: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  questionBody: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 12,
  },
  questionText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  videoRequirements: {
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  requirementsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  requirementText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.gold + '15',
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gold,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    gap: SPACING.sm,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  // Country selection
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  countrySelectorText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textMuted,
  },
  countrySelectorTextSelected: {
    color: COLORS.textPrimary,
  },
  // Country Picker Modal
  countryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  countryModalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingTop: SPACING.md,
  },
  countryModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  countryModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  countryModalClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countrySearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundElevated,
    margin: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    gap: SPACING.sm,
  },
  countrySearchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  countryItemSelected: {
    backgroundColor: COLORS.primary + '10',
  },
  countryItemText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  countryItemTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  noResults: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 15,
    color: COLORS.textMuted,
  },
  // W-9 Form styles
  formHeader: {
    backgroundColor: COLORS.primary + '15',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  formSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  taxClassGrid: {
    gap: SPACING.sm,
  },
  taxClassOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  taxClassOptionActive: {},
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  taxClassText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  tinTypeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  tinTypeOption: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundCard,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tinTypeActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tinTypeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  tinTypeTextActive: {
    color: '#FFF',
    fontWeight: '500',
  },
  certificationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  signatureBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  signatureText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
});
