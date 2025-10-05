import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, Globe, User, FileText, Clock, MessageSquare, BookOpen, LogOut, Upload, CheckCircle, Circle, AlertCircle, Phone, Mail, MapPin, Facebook, Instagram, Youtube, CreditCard, Shield, GraduationCap, Calendar, Award, Briefcase, RefreshCw, Languages, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { authAPI, dashboardAPI, applicationAPI, documentsAPI, messagesAPI, lessonsAPI, paymentsAPI, contactAPI } from '../services/api';
import LoginPage from './LoginPage';
import ServiceDetails from './ServiceDetails';
import AdminDashboard from './AdminDashboard';

// Import slider images
// import img1 from '../images/1.jpg';
import img1 from '../images/6.jpg';
import img2 from '../images/2.jpg';
import img3 from '../images/3.jpg';
import img4 from '../images/4.jpg';
import img5 from '../images/5.jpg';

// Memoized message input with internal state to prevent re-renders
const MessageInputForm = React.memo(({ onSend, isSending, editingMessage, onCancelEdit }) => {
  const [localValue, setLocalValue] = React.useState('');
  const textareaRef = React.useRef(null);

  // Update local value when editing message changes
  React.useEffect(() => {
    if (editingMessage) {
      setLocalValue(editingMessage.message);
      textareaRef.current?.focus();
    } else {
      setLocalValue('');
    }
  }, [editingMessage]);

  const handleSubmit = React.useCallback((e) => {
    e.preventDefault();
    if (localValue.trim()) {
      onSend(localValue);
      setLocalValue('');
    }
  }, [localValue, onSend]);

  const handleKeyDown = React.useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape' && editingMessage) {
      onCancelEdit();
    }
  }, [handleSubmit, editingMessage, onCancelEdit]);

  return (
    <div className="border-t p-4">
      {editingMessage && (
        <div className="mb-2 flex items-center justify-between bg-blue-50 px-3 py-2 rounded text-sm">
          <span className="text-blue-900">Editing message...</span>
          <button onClick={onCancelEdit} className="text-blue-900 hover:text-blue-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <textarea
          ref={textareaRef}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here... (Press Enter to send)"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="2"
          autoComplete="off"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending || !localValue.trim()}
          className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 self-end"
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
});

// Memoized messages component to prevent focus loss
const MessagesView = React.memo(({ messages, handleSendMessage, sendingMessage, userId, editingMessage, onEditMessage, onDeleteMessage, onCancelEdit }) => {
  // Find the last user message
  const lastUserMessageIndex = messages.map((m, i) => m.sender_id === userId ? i : -1).filter(i => i !== -1).pop();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

      {/* Messages Display */}
      <div className="bg-white rounded-lg shadow mb-6" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Conversation with Admin</h2>
        </div>

        {/* Messages Area */}
        <div id="user-messages-container" className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start a conversation!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => {
                const isLastUserMessage = msg.sender_id === userId && index === lastUserMessageIndex;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'} group`}
                  >
                    <div className="flex items-end gap-2">
                      {isLastUserMessage && (
                        <div className="flex flex-col gap-1 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditMessage(msg)}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Edit message"
                          >
                            <Edit2 className="w-3 h-3 text-gray-600" />
                          </button>
                          <button
                            onClick={() => onDeleteMessage(msg.id)}
                            className="p-1 hover:bg-red-100 rounded"
                            title="Delete message"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </button>
                        </div>
                      )}
                      <div
                        className={`px-4 py-2 rounded-lg break-all whitespace-pre-line max-w-[80%] ${
                          msg.sender_id === userId
                            ? 'bg-blue-900 text-white self-end'
                            : 'bg-gray-200 text-gray-900 self-start'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Message Input */}
        <MessageInputForm
          onSend={handleSendMessage}
          isSending={sendingMessage}
          editingMessage={editingMessage}
          onCancelEdit={onCancelEdit}
        />
      </div>
    </div>
  );
});

const KamilkoExpat = () => {
  const [currentLang, setCurrentLang] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');

  // Portal data states
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [application, setApplication] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [portalPage, setPortalPage] = useState('dashboard');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [editingMessage, setEditingMessage] = useState(null);

  // Refs to track state for comparison without causing re-renders
  const messagesRef = useRef(messages);
  const unreadCountRef = useRef(unreadCount);

  // Update refs when state changes
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    unreadCountRef.current = unreadCount;
  }, [unreadCount]);

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderImages = [img1, img2, img3, img4, img5];

  // Service detail state
  const [selectedService, setSelectedService] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authAPI.me()
        .then(response => {
          setUser(response.data);
          setIsLoggedIn(true);
          setCurrentPage('portal');
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
        });
    }
  }, []);

  // Fetch dashboard data when logged in
  useEffect(() => {
    if (isLoggedIn && currentPage === 'portal') {
      dashboardAPI.getData()
        .then(response => {
          setDashboardData(response.data);
        })
        .catch(error => {
          console.error('Failed to fetch dashboard data:', error);
        });
    }
  }, [isLoggedIn, currentPage]);

  // Load unread message count periodically
  useEffect(() => {
    if (isLoggedIn && currentPage === 'portal') {
      loadUnreadCount();

      // Poll every 30 seconds for unread count
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, currentPage]);

  // Poll messages when on messages page
  useEffect(() => {
    if (isLoggedIn && currentPage === 'portal' && portalPage === 'messages') {
      // Initial load is handled by the other useEffect

      // Poll every 5 seconds for new messages
      const interval = setInterval(async () => {
        try {
          const response = await messagesAPI.list();
          const newMessages = response.data;

          const prevMessagesStr = JSON.stringify(messagesRef.current);
          const newMessagesStr = JSON.stringify(newMessages);

          // Only update if messages have changed (to prevent focus loss)
          if (prevMessagesStr !== newMessagesStr) {
            setMessages(newMessages);
            // Only refresh unread count if messages changed
            loadUnreadCount();
          }
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isLoggedIn, currentPage, portalPage]);

  // Fetch portal page data based on current portal page
  useEffect(() => {
    if (!isLoggedIn || currentPage !== 'portal') return;

    switch (portalPage) {
      case 'documents':
        documentsAPI.list()
          .then(response => setDocuments(response.data))
          .catch(error => console.error('Failed to fetch documents:', error));
        break;
      case 'messages':
        messagesAPI.list()
          .then(response => {
            setMessages(response.data);
            // Update unread count after viewing messages
            loadUnreadCount();
            // Scroll to bottom after messages load
            setTimeout(() => {
              const messagesContainer = document.getElementById('user-messages-container');
              if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
              }
            }, 100);
          })
          .catch(error => console.error('Failed to fetch messages:', error));
        break;
      case 'progress':
        applicationAPI.get()
          .then(response => setApplication(response.data))
          .catch(error => console.error('Failed to fetch application:', error));
        break;
      case 'learning':
        lessonsAPI.list()
          .then(response => setLessons(response.data))
          .catch(error => console.error('Failed to fetch lessons:', error));
        break;
      default:
        break;
    }
  }, [isLoggedIn, currentPage, portalPage]);

  // Auto-play slider - only when on home or services page
  useEffect(() => {
    if (currentPage !== 'home' && currentPage !== 'services') return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [sliderImages.length, currentPage]);

  // Slider navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const response = await authAPI.login(loginEmail, loginPassword);
      localStorage.setItem('auth_token', response.data.token);
      setUser(response.data.user);
      setIsLoggedIn(true);
      setCurrentPage('portal');
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(' ');
        setLoginError(errorMessages);
      } else {
        setLoginError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setIsLoggedIn(false);
      setUser(null);
      setDashboardData(null);
      setCurrentPage('home');
    }
  };

  const handleSendMessage = useCallback(async (message) => {
    if (!message || !message.trim()) return;

    setSendingMessage(true);
    try {
      if (editingMessage) {
        // Edit existing message
        await messagesAPI.update(editingMessage.id, message);
        // Update message in list
        setMessages(prev => prev.map(msg =>
          msg.id === editingMessage.id ? { ...msg, message } : msg
        ));
        setEditingMessage(null);
      } else {
        // Send new message
        const response = await messagesAPI.send(message);
        // Add new message to the list
        setMessages(prev => [...prev, response.data]);
      }

      // Refresh unread count
      loadUnreadCount();

      // Scroll to bottom
      setTimeout(() => {
        const messagesContainer = document.getElementById('user-messages-container');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  }, [editingMessage]);

  const handleEditMessage = useCallback((msg) => {
    setEditingMessage(msg);
  }, []);

  const handleDeleteMessage = useCallback(async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await messagesAPI.delete(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message. Please try again.');
    }
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingMessage(null);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const response = await messagesAPI.unreadCount();
      const newCount = response.data.unread_count;

      // Only update if count has changed (prevent focus loss)
      if (unreadCountRef.current !== newCount) {
        setUnreadCount(newCount);
      }
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    setRegisterError('');
    setRegisterLoading(true);

    // Validate passwords match
    if (registerData.password !== registerData.password_confirmation) {
      setRegisterError('Passwords do not match');
      setRegisterLoading(false);
      return;
    }

    try {
      await authAPI.register(registerData);
      setRegisterSuccess(true);
      setRegisterData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: ''
      });
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(' ');
        setRegisterError(errorMessages);
      } else {
        setRegisterError(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e?.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordLoading(true);

    try {
      await contactAPI.submit({
        email: forgotEmail,
        message: `Password reset request for: ${forgotEmail}`,
        type: 'password_reset'
      });
      setForgotPasswordSuccess(true);
      setForgotEmail('');
    } catch (error) {
      setForgotPasswordError(error.response?.data?.message || 'Failed to send reset request. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Memoized input handlers to prevent re-renders
  const handleLoginEmailChange = useCallback((e) => {
    setLoginEmail(e.target.value);
  }, []);

  const handleLoginPasswordChange = useCallback((e) => {
    setLoginPassword(e.target.value);
  }, []);

  const handleForgotEmailChange = useCallback((e) => {
    setForgotEmail(e.target.value);
  }, []);

  const handleRegisterChange = useCallback((field) => (e) => {
    setRegisterData(prev => ({...prev, [field]: e.target.value}));
  }, []);

  // Document handlers
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadError('');
  };

  const handleDocumentUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    setUploadLoading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', selectedFile.name);
      formData.append('type', 'application_document');

      await documentsAPI.upload(formData);

      // Refresh documents list
      const response = await documentsAPI.list();
      setDocuments(response.data);

      // Refresh dashboard data
      const dashResponse = await dashboardAPI.getData();
      setDashboardData(dashResponse.data);

      // Reset form
      setSelectedFile(null);
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      setUploadError(error.response?.data?.message || 'Failed to upload document. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDocumentView = async (id, name) => {
    try {
      const response = await documentsAPI.download(id);

      // Determine MIME type from file extension
      const extension = name.split('.').pop().toLowerCase();
      const mimeTypes = {
        'pdf': 'application/pdf',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'txt': 'text/plain',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };

      const mimeType = mimeTypes[extension] || 'application/octet-stream';
      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Clean up after a delay to ensure the new tab loads
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Failed to view document:', error);
    }
  };

  const handleDocumentDownload = async (id, name) => {
    try {
      const response = await documentsAPI.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download document:', error);
    }
  };

  const handleDocumentDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentsAPI.delete(id);
      // Refresh documents list
      const response = await documentsAPI.list();
      setDocuments(response.data);

      // Refresh dashboard data
      const dashResponse = await dashboardAPI.getData();
      setDashboardData(dashResponse.data);
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const translations = {
    en: {
      siteName: 'Euro Expat',
      tagline: 'Your Gateway to Portuguese Residency',
      nav: {
        home: 'Home',
        services: 'Services',
        contact: 'Contact',
        portal: 'Client Portal',
        login: 'Login'
      },
      hero: {
        title: 'Your Bridge to Portuguese Residency',
        subtitle: 'Expert assistance for residence permits, citizenship, and settling in Portugal. Specialized support in Arabic, French, and English.',
        cta: 'Start Your Journey',
        cta2: 'Learn More'
      },
      services: {
        title: 'Our Services',
        subtitle: 'Complete support for your Portuguese residency journey',
        nif: { title: 'NIF Application', desc: 'Get your Portuguese tax identification number quickly.' },
        niss: { title: 'NISS Registration', desc: 'Social security number registration.' },
        courses: { title: 'Course Enrollment', desc: 'Enrollment in certified courses.' },
        aima: { title: 'AIMA Appointments', desc: 'We help you secure AIMA appointments.' },
        citizenship: { title: 'Citizenship Application', desc: 'Complete citizenship assistance.' },
        business: { title: 'Business Activity', desc: 'Set up your business in Portugal.' },
        renewal: { title: 'Permit Renewals', desc: 'Hassle-free permit renewal services.' },
        portuguese: { title: 'Learn Portuguese', desc: 'Portuguese lessons for Arabic speakers.' }
      },
      pricing: {
        title: 'Transparent Pricing',
        subtitle: 'Choose the package that fits your needs',
        starter: { name: 'Starter Package', price: '€399' },
        complete: { name: 'Complete Package', price: '€799', popular: 'Most Popular' },
        premium: { name: 'Premium Package', price: '€1,299' },
        cta: 'Get Started'
      },
      portal: {
        title: 'Client Portal',
        dashboard: 'Dashboard',
        documents: 'My Documents',
        progress: 'Progress',
        messages: 'Messages',
        learning: 'Portuguese Learning',
        logout: 'Logout',
        welcome: 'Welcome back'
      },
      contact: {
        title: 'Get In Touch',
        subtitle: 'Ready to start your Portuguese journey? Contact us today!',
        whatsapp: 'WhatsApp Us',
        send: 'Send Message'
      }
    },
    fr: {
      siteName: 'Euro Expat',
      tagline: 'Votre Porte vers la Résidence Portugaise',
      nav: {
        home: 'Accueil',
        services: 'Services',
        // pricing: 'Tarifs',
        contact: 'Contact',
        portal: 'Portail Client',
        login: 'Connexion'
      },
      hero: {
        title: 'Votre Pont vers la Résidence Portugaise',
        subtitle: 'Assistance experte pour les permis de résidence au Portugal. Support en arabe, français et anglais.',
        cta: 'Commencer',
        cta2: 'En Savoir Plus'
      },
      services: {
        title: 'Nos Services',
        subtitle: 'Soutien complet pour votre résidence portugaise',
        nif: { title: 'Demande NIF', desc: 'Obtenez votre NIF rapidement.' },
        niss: { title: 'Inscription NISS', desc: 'Numéro de sécurité sociale.' },
        courses: { title: 'Inscription aux Cours', desc: 'Cours certifiés requis.' },
        aima: { title: 'Rendez-vous AIMA', desc: 'Nous vous aidons avec AIMA.' },
        citizenship: { title: 'Citoyenneté', desc: 'Assistance complète.' },
        business: { title: 'Activité Commerciale', desc: 'Créez votre entreprise.' },
        renewal: { title: 'Renouvellements', desc: 'Renouvellement facile.' },
        portuguese: { title: 'Apprendre le Portugais', desc: 'Cours pour arabophones.' }
      },
      pricing: {
        title: 'Tarifs Transparents',
        subtitle: 'Choisissez votre forfait',
        starter: { name: 'Forfait Débutant', price: '399€' },
        complete: { name: 'Forfait Complet', price: '799€', popular: 'Le Plus Populaire' },
        premium: { name: 'Forfait Premium', price: '1 299€' },
        cta: 'Commencer'
      },
      portal: {
        title: 'Portail Client',
        dashboard: 'Tableau de Bord',
        documents: 'Mes Documents',
        progress: 'Progrès',
        messages: 'Messages',
        learning: 'Apprentissage',
        logout: 'Déconnexion',
        welcome: 'Bon retour'
      },
      contact: {
        title: 'Contactez-Nous',
        subtitle: 'Prêt à commencer? Contactez-nous!',
        whatsapp: 'WhatsApp',
        send: 'Envoyer'
      }
    },
    ar: {
      siteName: 'كاميلكو إكسبات',
      tagline: 'بوابتك نحو الإقامة البرتغالية',
      nav: {
        home: 'الرئيسية',
        services: 'الخدمات',
        // pricing: 'الأسعار',
        contact: 'اتصل بنا',
        portal: 'بوابة العملاء',
        login: 'تسجيل الدخول'
      },
      hero: {
        title: 'جسرك نحو الإقامة البرتغالية',
        subtitle: 'مساعدة متخصصة في تصاريح الإقامة والجنسية في البرتغال. دعم باللغات العربية والفرنسية والإنجليزية.',
        cta: 'ابدأ رحلتك',
        cta2: 'اعرف المزيد'
      },
      services: {
        title: 'خدماتنا',
        subtitle: 'دعم شامل لرحلة إقامتك البرتغالية',
        nif: { title: 'طلب NIF', desc: 'احصل على رقم NIF بسرعة.' },
        niss: { title: 'تسجيل NISS', desc: 'رقم الضمان الاجتماعي.' },
        courses: { title: 'التسجيل في الدورات', desc: 'دورات معتمدة مطلوبة.' },
        aima: { title: 'مواعيد AIMA', desc: 'نساعدك في مواعيد AIMA.' },
        citizenship: { title: 'طلب الجنسية', desc: 'مساعدة كاملة.' },
        business: { title: 'النشاط التجاري', desc: 'أنشئ عملك التجاري.' },
        renewal: { title: 'تجديد التصاريح', desc: 'تجديد سهل.' },
        portuguese: { title: 'تعلم البرتغالية', desc: 'دروس للناطقين بالعربية.' }
      },
      pricing: {
        title: 'أسعار شفافة',
        subtitle: 'اختر الباقة المناسبة',
        starter: { name: 'الباقة الأساسية', price: '399 يورو' },
        complete: { name: 'الباقة الكاملة', price: '799 يورو', popular: 'الأكثر شعبية' },
        premium: { name: 'الباقة المميزة', price: '1,299 يورو' },
        cta: 'ابدأ الآن'
      },
      portal: {
        title: 'بوابة العملاء',
        dashboard: 'لوحة التحكم',
        documents: 'مستنداتي',
        progress: 'التقدم',
        messages: 'الرسائل',
        learning: 'تعلم البرتغالية',
        logout: 'تسجيل الخروج',
        welcome: 'مرحباً بعودتك'
      },
      contact: {
        title: 'تواصل معنا',
        subtitle: 'هل أنت مستعد؟ اتصل بنا اليوم!',
        whatsapp: 'واتساب',
        send: 'إرسال'
      }
    },
    pt: {
      siteName: 'Euro Expat',
      tagline: 'Sua Porta para a Residência Portuguesa',
      nav: {
        home: 'Início',
        services: 'Serviços',
        // pricing: 'Preços',
        contact: 'Contato',
        portal: 'Portal Cliente',
        login: 'Entrar'
      },
      hero: {
        title: 'Sua Ponte para a Residência Portuguesa',
        subtitle: 'Assistência especializada para residência em Portugal. Suporte em árabe, francês e inglês.',
        cta: 'Começar',
        cta2: 'Saiba Mais'
      },
      services: {
        title: 'Nossos Serviços',
        subtitle: 'Suporte completo para sua residência',
        nif: { title: 'Pedido NIF', desc: 'Obtenha seu NIF rapidamente.' },
        niss: { title: 'Registro NISS', desc: 'Número de segurança social.' },
        courses: { title: 'Inscrição Cursos', desc: 'Cursos certificados.' },
        aima: { title: 'Agendamentos AIMA', desc: 'Ajudamos com AIMA.' },
        citizenship: { title: 'Cidadania', desc: 'Assistência completa.' },
        business: { title: 'Atividade Empresarial', desc: 'Configure sua empresa.' },
        renewal: { title: 'Renovações', desc: 'Renovação fácil.' },
        portuguese: { title: 'Aprender Português', desc: 'Aulas para árabes.' }
      },
      pricing: {
        title: 'Preços Transparentes',
        subtitle: 'Escolha seu pacote',
        starter: { name: 'Pacote Inicial', price: '€399' },
        complete: { name: 'Pacote Completo', price: '€799', popular: 'Mais Popular' },
        premium: { name: 'Pacote Premium', price: '€1.299' },
        cta: 'Começar'
      },
      portal: {
        title: 'Portal do Cliente',
        dashboard: 'Painel',
        documents: 'Documentos',
        progress: 'Progresso',
        messages: 'Mensagens',
        learning: 'Aprender',
        logout: 'Sair',
        welcome: 'Bem-vindo'
      },
      contact: {
        title: 'Entre em Contato',
        subtitle: 'Pronto para começar? Contacte-nos!',
        whatsapp: 'WhatsApp',
        send: 'Enviar'
      }
    }
  };

  const t = translations[currentLang];
  const isRTL = currentLang === 'ar';

  // Service icon mapping
  const serviceIcons = {
    nif: CreditCard,
    niss: Shield,
    courses: GraduationCap,
    aima: Calendar,
    citizenship: Award,
    business: Briefcase,
    renewal: RefreshCw,
    portuguese: Languages
  };

  const NavBar = () => (
    <nav className={`bg-white shadow-md fixed w-full top-0 z-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-900">{t.siteName}</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => setCurrentPage('home')} className="text-gray-700 hover:text-blue-900">{t.nav.home}</button>
            <button onClick={() => setCurrentPage('services')} className="text-gray-700 hover:text-blue-900">{t.nav.services}</button>
            {/* <button onClick={() => setCurrentPage('pricing')} className="text-gray-700 hover:text-blue-900">{t.nav.pricing}</button> */}
            <button onClick={() => setCurrentPage('contact')} className="text-gray-700 hover:text-blue-900">{t.nav.contact}</button>
            {isLoggedIn ? (
              <button onClick={() => setCurrentPage('portal')} className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800">{t.nav.portal}</button>
            ) : (
              <button onClick={() => setCurrentPage('login')} className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800">{t.nav.login}</button>
            )}
            
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-900"
              >
                <Globe className="w-5 h-5" />
                <span className="uppercase text-sm">{currentLang}</span>
              </button>
              {langDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setLangDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-20">
                    <button
                      onClick={() => { setCurrentLang('en'); setLangDropdownOpen(false); }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                    >
                      English
                    </button>
                    <button
                      onClick={() => { setCurrentLang('fr'); setLangDropdownOpen(false); }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Français
                    </button>
                    <button
                      onClick={() => { setCurrentLang('ar'); setLangDropdownOpen(false); }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      العربية
                    </button>
                    <button
                      onClick={() => { setCurrentLang('pt'); setLangDropdownOpen(false); }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
                    >
                      Português
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="block w-full text-left py-2">{t.nav.home}</button>
            <button onClick={() => { setCurrentPage('pricing'); setMobileMenuOpen(false); }} className="block w-full text-left py-2">{t.nav.pricing}</button>
            <button onClick={() => { setCurrentPage('contact'); setMobileMenuOpen(false); }} className="block w-full text-left py-2">{t.nav.contact}</button>
            <div className="pt-2 border-t">
              <button onClick={() => setCurrentLang('en')} className="block w-full text-left py-2">English</button>
              <button onClick={() => setCurrentLang('fr')} className="block w-full text-left py-2">Français</button>
              <button onClick={() => setCurrentLang('ar')} className="block w-full text-left py-2">العربية</button>
              <button onClick={() => setCurrentLang('pt')} className="block w-full text-left py-2">Português</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );

  const HomePage = () => (
    <div className={isRTL ? 'rtl' : 'ltr'} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Slider */}
      <section className="pt-16 relative overflow-hidden">
        <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
          {/* Slider Images */}
          {sliderImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for better text visibility */}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          ))}

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">{t.hero.title}</h1>
              <p className="text-xl md:text-2xl mb-8 drop-shadow-lg max-w-3xl mx-auto">{t.hero.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setCurrentPage('contact')} className="bg-amber-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-600 transition">
                  {t.hero.cta}
                </button>
                <button onClick={() => setCurrentPage('services')} className="bg-white text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition">
                  {t.hero.cta2}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === currentSlide
                    ? 'bg-white'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.services.title}</h2>
            <p className="text-xl text-gray-600">{t.services.subtitle}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {Object.entries(t.services).filter(([key]) => !['title', 'subtitle'].includes(key)).map(([key, service]) => {
              const IconComponent = serviceIcons[key] || FileText;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedService(key)}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0 text-left cursor-pointer"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-blue-900" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.title}</h3>
                  <p className="text-gray-600">{service.desc}</p>
                  <p className="text-blue-900 font-semibold mt-4">Learn More →</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.contact.title}</h2>
          <p className="text-xl mb-8 text-blue-100">{t.contact.subtitle}</p>
          <button onClick={() => setCurrentPage('contact')} className="bg-amber-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-600 transition">
            {t.contact.whatsapp}
          </button>
        </div>
      </section>
    </div>
  );

  const PricingPage = () => (
    <div className={`pt-24 pb-16 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t.pricing.title}</h1>
          <p className="text-xl text-gray-600">{t.pricing.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.pricing.starter.name}</h3>
            <div className="text-4xl font-bold text-blue-900 mb-6">{t.pricing.starter.price}</div>
            <button onClick={() => setCurrentPage('contact')} className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
              {t.pricing.cta}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-amber-500 relative transform md:scale-105">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                {t.pricing.complete.popular}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.pricing.complete.name}</h3>
            <div className="text-4xl font-bold text-blue-900 mb-6">{t.pricing.complete.price}</div>
            <button onClick={() => setCurrentPage('contact')} className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition">
              {t.pricing.cta}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.pricing.premium.name}</h3>
            <div className="text-4xl font-bold text-blue-900 mb-6">{t.pricing.premium.price}</div>
            <button onClick={() => setCurrentPage('contact')} className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
              {t.pricing.cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className={`pt-24 pb-16 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t.contact.title}</h1>
          <p className="text-xl text-gray-600">{t.contact.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-8 border-2 border-green-500">
            <Phone className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t.contact.whatsapp}</h3>
            <p className="text-2xl font-bold text-green-600">+351 912 345 678</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 border-2 border-blue-500">
            <Mail className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Email</h3>
                          <p className="text-lg text-blue-600">info@kamilkoexpat.com</p>
          </div>
        </div>
      </div>
    </div>
  );


  const ClientPortal = () => {
    const renderDashboard = () => (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.portal.welcome}, {user?.name}!</h1>
        <p className="text-gray-600 mb-8">
          Application progress: {dashboardData?.stats?.application_progress || 0}%
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <Clock className="w-8 h-8 text-blue-900 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Application Status</h3>
            <p className="text-gray-600">
              {dashboardData?.stats?.current_status || 'No application yet'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <FileText className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Documents</h3>
            <p className="text-gray-600">
              {dashboardData?.stats?.documents_uploaded || 0} of {dashboardData?.stats?.total_documents || 0} uploaded
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <BookOpen className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Portuguese Learning</h3>
            <p className="text-gray-600">
              {dashboardData?.stats?.lessons_completed || 0} lessons completed
            </p>
          </div>
        </div>
      </div>
    );

    const renderDocuments = () => (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Documents</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
          <input
            type="file"
            onChange={handleFileSelect}
            className="mb-4 w-full border p-2 rounded"
          />
          {selectedFile && (
            <p className="text-sm text-gray-600 mb-2">Selected: {selectedFile.name}</p>
          )}
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-800">{uploadError}</p>
            </div>
          )}
          <button
            onClick={handleDocumentUpload}
            disabled={uploadLoading || !selectedFile}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        <div className="space-y-4">
          {documents.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No documents uploaded yet
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileText className="w-8 h-8 text-blue-900" />
                  <div>
                    <h3 className="font-semibold">{doc.name}</h3>
                    <p className="text-sm text-gray-600">{doc.type} • {doc.size}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDocumentView(doc.id, doc.name)}
                    className="text-green-600 hover:text-green-800 px-3 py-1 rounded hover:bg-green-50"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDocumentDownload(doc.id, doc.name)}
                    className="text-blue-900 hover:text-blue-700 px-3 py-1 rounded hover:bg-blue-50"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDocumentDelete(doc.id)}
                    className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );

    const renderProgress = () => {
      const stages = application?.application?.stages || {
        nif: false,
        niss: false,
        bank_account: false,
        courses: false,
        aima: false
      };

      const appData = application?.application || {};

      const steps = [
        {
          id: 'nif',
          label: 'NIF',
          completed: stages.nif,
          info: appData.nif_number ? `NIF: ${appData.nif_number}` : null
        },
        {
          id: 'niss',
          label: 'NISS',
          completed: stages.niss,
          info: appData.niss_number ? `NISS: ${appData.niss_number}` : null
        },
        {
          id: 'bank_account',
          label: 'Bank Account',
          completed: stages.bank_account,
          info: appData.bank_account_number ? `${appData.bank_name || 'Bank'}: ${appData.bank_account_number}` : null
        },
        {
          id: 'courses',
          label: 'Course Enrollment',
          completed: stages.courses,
          info: appData.course_name ? `Course: ${appData.course_name}` : null
        },
        {
          id: 'aima',
          label: 'AIMA Appointment',
          completed: stages.aima,
          info: appData.aima_appointment_date ? `Date: ${new Date(appData.aima_appointment_date).toLocaleDateString()}` : null
        }
      ];

      return (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Application Progress</h1>

          {!application ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No application data available
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Status: <span className="text-blue-900 capitalize">{appData.status?.replace(/_/g, ' ')}</span>
                  </h2>
                  <span className="text-2xl font-bold text-blue-900">{appData.progress_percentage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-900 h-4 rounded-full transition-all"
                    style={{ width: `${appData.progress_percentage || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Visual Timeline */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-6">Application Steps</h3>

                {/* Timeline */}
                <div className="relative">
                  {steps.map((step, index) => (
                    <div key={step.id} className="relative pb-8 last:pb-0">
                      {/* Connecting Line */}
                      {index < steps.length - 1 && (
                        <div
                          className={`absolute left-4 top-10 bottom-0 w-0.5 ${
                            steps[index + 1].completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          style={{ height: 'calc(100% - 1rem)' }}
                        />
                      )}

                      {/* Step Content */}
                      <div className="relative flex items-start">
                        {/* Step Icon */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </div>

                        {/* Step Details */}
                        <div className="ml-4 flex-1">
                          <h4 className={`text-lg font-semibold ${
                            step.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.label}
                          </h4>
                          {step.info && (
                            <p className="text-sm text-gray-600 mt-1">{step.info}</p>
                          )}
                          {step.completed && (
                            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Details */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Application Details</h3>
                <div className="space-y-2">
                  {appData.created_at && (
                    <p><span className="font-medium">Submitted:</span> {new Date(appData.created_at).toLocaleDateString()}</p>
                  )}
                  {appData.updated_at && (
                    <p><span className="font-medium">Last Updated:</span> {new Date(appData.updated_at).toLocaleDateString()}</p>
                  )}
                  {appData.notes && (
                    <p><span className="font-medium">Notes:</span> {appData.notes}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };


    const renderLearning = () => (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Portuguese Learning</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No lessons available yet
            </div>
          ) : (
            lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
                    <p className="text-gray-600">{lesson.description}</p>
                  </div>
                  {lesson.completed && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-semibold">{lesson.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${lesson.progress}%` }}
                    ></div>
                  </div>
                </div>
                <button className="mt-4 w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800">
                  {lesson.completed ? 'Review Lesson' : 'Continue Learning'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );

    return (
      <div className={`pt-16 min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex">
          <div className="w-64 bg-blue-900 text-white min-h-screen fixed">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-8">{t.portal.title}</h2>
              <nav className="space-y-2">
                <button onClick={() => setPortalPage('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${portalPage === 'dashboard' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>
                  <User className="w-5 h-5" />
                  <span>{t.portal.dashboard}</span>
                </button>
                <button onClick={() => setPortalPage('documents')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${portalPage === 'documents' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>
                  <FileText className="w-5 h-5" />
                  <span>{t.portal.documents}</span>
                </button>
                <button onClick={() => setPortalPage('progress')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${portalPage === 'progress' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>
                  <Clock className="w-5 h-5" />
                  <span>{t.portal.progress}</span>
                </button>
                <button onClick={() => setPortalPage('messages')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg relative ${portalPage === 'messages' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>
                  <MessageSquare className="w-5 h-5" />
                  <span>{t.portal.messages}</span>
                  {unreadCount > 0 && (
                    <span className="absolute right-4 top-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button onClick={() => setPortalPage('learning')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${portalPage === 'learning' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>
                  <BookOpen className="w-5 h-5" />
                  <span>{t.portal.learning}</span>
                </button>
              </nav>
              <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 mt-8">
                <LogOut className="w-5 h-5" />
                <span>{t.portal.logout}</span>
              </button>
            </div>
          </div>

          <div className={`flex-1 ${isRTL ? 'mr-64' : 'ml-64'} p-8`}>
            {portalPage === 'dashboard' && renderDashboard()}
            {portalPage === 'documents' && renderDocuments()}
            {portalPage === 'progress' && renderProgress()}
            {portalPage === 'messages' && (
              <MessagesView
                messages={messages}
                handleSendMessage={handleSendMessage}
                sendingMessage={sendingMessage}
                userId={user?.id}
                editingMessage={editingMessage}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                onCancelEdit={handleCancelEdit}
              />
            )}
            {portalPage === 'learning' && renderLearning()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'services' && <HomePage />}
      {currentPage === 'pricing' && <PricingPage />}
      {currentPage === 'contact' && <ContactPage />}
      {currentPage === 'login' && (
        <LoginPage
          showForgotPassword={showForgotPassword}
          setShowForgotPassword={setShowForgotPassword}
          forgotPasswordSuccess={forgotPasswordSuccess}
          setForgotPasswordSuccess={setForgotPasswordSuccess}
          forgotEmail={forgotEmail}
          handleForgotEmailChange={handleForgotEmailChange}
          forgotPasswordError={forgotPasswordError}
          forgotPasswordLoading={forgotPasswordLoading}
          handleForgotPassword={handleForgotPassword}
          showRegister={showRegister}
          setShowRegister={setShowRegister}
          registerSuccess={registerSuccess}
          setRegisterSuccess={setRegisterSuccess}
          registerData={registerData}
          handleRegisterChange={handleRegisterChange}
          registerError={registerError}
          registerLoading={registerLoading}
          handleRegister={handleRegister}
          loginEmail={loginEmail}
          handleLoginEmailChange={handleLoginEmailChange}
          loginPassword={loginPassword}
          handleLoginPasswordChange={handleLoginPasswordChange}
          loginError={loginError}
          loginLoading={loginLoading}
          handleLogin={handleLogin}
          setLoginError={setLoginError}
          setRegisterError={setRegisterError}
          isRTL={isRTL}
          t={t}
        />
      )}
      {currentPage === 'portal' && isLoggedIn && (
        user?.role === 'admin' ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <ClientPortal />
        )
      )}
      
      {!currentPage.includes('portal') && !currentPage.includes('login') && (
        <footer className={`bg-gray-900 text-white py-12 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold mb-4">{t.siteName}</h3>
            <p className="text-gray-400 mb-6">Your Gateway to Portuguese Residency</p>
            <div className="flex justify-center space-x-6 mb-6">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <Youtube className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            </div>
            <p className="text-gray-500">© 2025 Euro Expat. All rights reserved.</p>
          </div>
        </footer>
      )}

      {/* Service Details Modal */}
      {selectedService && (
        <ServiceDetails
          serviceKey={selectedService}
          onClose={() => setSelectedService(null)}
          isRTL={isRTL}
          currentLang={currentLang}
          t={t}
        />
      )}
    </div>
  );
};

export default KamilkoExpat;