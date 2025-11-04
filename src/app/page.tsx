"use client"

import { useState, useEffect } from 'react'
import { Bell, MessageCircle, Target, Heart, Brain, Sparkles, User, Settings, TrendingUp, Shield, Lightbulb, Phone, HeartHandshake, Zap, Plus, X, Move, Grid3X3, Calendar, Clock, Battery, Wifi, Signal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Widget {
  id: string
  type: 'chat' | 'quote' | 'stats' | 'notifications' | 'mood' | 'calendar' | 'weather' | 'timer'
  title: string
  position: { x: number; y: number }
  size: 'small' | 'medium' | 'large'
  data?: any
}

interface Notification {
  id: number
  category: string
  message: string
  time: string
  read: boolean
}

interface ChatMessage {
  id: number
  type: 'user' | 'assistant'
  message: string
  time: string
  emotion?: 'supportive' | 'encouraging' | 'caring' | 'understanding' | 'urgent' | 'curious' | 'reflective' | 'empathetic'
}

export default function ChangeMindsetApp() {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: '1',
      type: 'chat',
      title: 'Assistente Psicológico',
      position: { x: 0, y: 0 },
      size: 'large'
    },
    {
      id: '2',
      type: 'quote',
      title: 'Reflexão Diária',
      position: { x: 1, y: 0 },
      size: 'medium'
    },
    {
      id: '3',
      type: 'mood',
      title: 'Como me sinto',
      position: { x: 0, y: 1 },
      size: 'small'
    },
    {
      id: '4',
      type: 'stats',
      title: 'Meu Progresso',
      position: { x: 1, y: 1 },
      size: 'small'
    }
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, category: 'Motivação', message: '🌟 Você é capaz de mais do que imagina! Cada pequeno passo conta.', time: '09:00', read: false },
    { id: 2, category: 'Mindset', message: '🧠 Transforme obstáculos em oportunidades de crescimento.', time: '12:00', read: false },
    { id: 3, category: 'Autoestima', message: '💪 Celebre suas conquistas, por menores que sejam!', time: '15:00', read: true },
    { id: 4, category: 'Realização', message: '🎯 Defina uma meta pequena para hoje e alcance-a!', time: '18:00', read: false }
  ])

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      id: 1, 
      type: 'assistant', 
      message: 'Olá! 😊 É um prazer genuíno conversar com você. Sou mais do que um assistente - sou alguém que realmente se importa em te ouvir, compreender e caminhar junto contigo. Não importa se você está celebrando conquistas, enfrentando desafios, ou simplesmente refletindo sobre a vida... estou aqui para te escutar de verdade. O que você gostaria de conversar e explorar hoje? O que está no seu coração neste momento?', 
      time: '10:00',
      emotion: 'empathetic'
    }
  ])

  const [newMessage, setNewMessage] = useState('')
  const [userMood, setUserMood] = useState<'good' | 'neutral' | 'struggling' | 'crisis' | null>(null)
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const [conversationTurn, setConversationTurn] = useState(0)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showAddWidget, setShowAddWidget] = useState(false)

  const motivationalQuotes = [
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "Você não precisa ser perfeito, apenas precisa começar.",
    "Cada dia é uma nova oportunidade para ser melhor que ontem.",
    "Acredite em si mesmo e todo o resto se encaixará.",
    "O único limite é aquele que você coloca em sua mente."
  ]

  const [currentQuote, setCurrentQuote] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Detectar estado emocional mais sofisticado
  const detectEmotionalState = (message: string): 'struggling' | 'neutral' | 'good' | 'crisis' => {
    const lowerMessage = message.toLowerCase()
    
    const crisisKeywords = [
      'suicídio', 'suicidar', 'morrer', 'acabar com tudo', 'não quero mais viver',
      'sem saída', 'não aguento mais', 'quero desaparecer', 'não vale a pena'
    ]
    
    const strugglingKeywords = [
      'triste', 'deprimido', 'ansioso', 'preocupado', 'mal', 'difícil', 'problema', 
      'não consigo', 'desistir', 'cansado', 'sozinho', 'perdido', 'medo', 'stress'
    ]
    
    const goodKeywords = [
      'feliz', 'bem', 'ótimo', 'excelente', 'motivado', 'confiante', 'grato',
      'alegre', 'positivo', 'esperançoso', 'animado', 'realizado', 'orgulhoso'
    ]

    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'crisis'
    }
    
    if (strugglingKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'struggling'
    }
    
    if (goodKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'good'
    }
    
    return 'neutral'
  }

  const generateTherapeuticResponse = (userMessage: string, emotionalState: 'struggling' | 'neutral' | 'good' | 'crisis', context: string[], turn: number): { message: string, emotion: 'supportive' | 'encouraging' | 'caring' | 'understanding' | 'urgent' | 'curious' | 'reflective' | 'empathetic' } => {
    const lowerMessage = userMessage.toLowerCase()

    if (emotionalState === 'crisis') {
      const crisisResponses = [
        "Primeiro, quero que você saiba: estou aqui com você neste momento. O que você está sentindo é avassalador, eu sei, mas não é permanente. Sua vida tem valor e significado, mesmo quando não consegue enxergar isso. 🚨 Por favor, ligue AGORA para o CVV (188) - são pessoas treinadas que podem te ajudar melhor que eu neste momento. Enquanto isso, me conta: você consegue respirar fundo comigo? Vamos fazer isso juntos - inspira... expira... Me diga: o que te trouxe até este ponto hoje?",
        
        "Vejo sua dor e ela é real. Você foi muito corajoso ao compartilhar isso comigo. Quero que entenda: ter esses pensamentos não te faz fraco - mostra que você está sofrendo e precisa de ajuda, e isso é humano. 📞 CVV (188) está disponível 24h e pode te oferecer o suporte que você merece agora. Me conta: quando foi a última vez que você se sentiu um pouco mais seguro?"
      ]
      
      return {
        message: crisisResponses[turn % crisisResponses.length],
        emotion: 'urgent'
      }
    }

    if (emotionalState === 'struggling') {
      const strugglingResponses = [
        "Vejo que você está passando por um momento difícil, e quero que saiba: isso que você está sentindo é completamente válido. Não existe sentimento 'errado'. Você já superou 100% dos seus piores dias até agora, e isso mostra sua resiliência, mesmo quando você não se sente resiliente. Me conta: como você tem cuidado de si mesmo durante esse período?",
        
        "Percebo que as coisas estão pesadas para você. Primeiro, quero reconhecer sua coragem de estar aqui, conversando sobre isso. Isso já é um ato de autocuidado. Me ajuda a entender: quando você pensa no que está vivendo, o que mais te assusta ou preocupa?"
      ]

      return {
        message: strugglingResponses[turn % strugglingResponses.length],
        emotion: 'empathetic'
      }
    }

    if (emotionalState === 'good') {
      const encouragingResponses = [
        "Que energia maravilhosa! 🌟 Fico genuinamente feliz em sentir sua positividade. Esses momentos são preciosos e nos lembram da nossa capacidade de crescimento e alegria. Me conta: o que especificamente está contribuindo para você se sentir assim? Quero entender o que funciona para você.",
        
        "Adorei perceber sua energia positiva! ✨ É contagiante e me deixa animado também. Esses momentos são como sementes que plantamos para os dias mais difíceis. Me ajuda a entender: como você gostaria de usar essa energia positiva? Há algo que você quer criar ou conquistar?"
      ]
      
      return {
        message: encouragingResponses[turn % encouragingResponses.length],
        emotion: 'encouraging'
      }
    }

    const neutralResponses = [
      "Percebo que você está num estado mais reflexivo hoje. 🤔 Às vezes é assim mesmo - nem eufórico, nem devastado, apenas... processando a vida. E isso é completamente normal e saudável. Esses momentos de 'meio termo' podem ser muito ricos para autoconhecimento. Me conta: o que você tem observado sobre si mesmo ultimamente?",
      
      "Obrigado por estar aqui comigo. 💙 Vejo que você está numa energia mais contemplativa, e isso me parece um espaço interessante para explorarmos juntos. Não precisa estar sempre 'bem' ou 'mal' - pode apenas ser humano, com toda a complexidade que isso traz. O que gostaria de explorar sobre você mesmo hoje?"
    ]
    
    return {
      message: neutralResponses[turn % neutralResponses.length],
      emotion: 'curious'
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      message: newMessage,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }

    setChatMessages(prev => [...prev, userMessage])
    
    const newContext = [...conversationContext, newMessage].slice(-5)
    setConversationContext(newContext)

    const emotionalState = detectEmotionalState(newMessage)
    setUserMood(emotionalState)

    const newTurn = conversationTurn + 1
    setConversationTurn(newTurn)

    setTimeout(() => {
      const response = generateTherapeuticResponse(newMessage, emotionalState, newContext, newTurn)
      
      const assistantMessage: ChatMessage = {
        id: chatMessages.length + 2,
        type: 'assistant',
        message: response.message,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        emotion: response.emotion
      }

      setChatMessages(prev => [...prev, assistantMessage])
    }, 1000)

    setNewMessage('')
  }

  const addWidget = (type: Widget['type']) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: getWidgetTitle(type),
      position: { x: 0, y: widgets.length },
      size: 'medium'
    }
    setWidgets([...widgets, newWidget])
    setShowAddWidget(false)
  }

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id))
  }

  const getWidgetTitle = (type: Widget['type']): string => {
    const titles = {
      chat: 'Assistente Psicológico',
      quote: 'Reflexão Diária',
      stats: 'Meu Progresso',
      notifications: 'Notificações',
      mood: 'Como me sinto',
      calendar: 'Calendário',
      weather: 'Clima',
      timer: 'Timer'
    }
    return titles[type]
  }

  const renderWidget = (widget: Widget) => {
    const sizeClasses = {
      small: 'col-span-1 row-span-1 h-32',
      medium: 'col-span-2 row-span-1 h-40',
      large: 'col-span-2 row-span-2 h-80'
    }

    switch (widget.type) {
      case 'chat':
        return (
          <Card key={widget.id} className={`${sizeClasses[widget.size]} relative bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200`}>
            {isEditMode && (
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full z-10"
                onClick={() => removeWidget(widget.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-center space-x-2 mb-3">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">{widget.title}</h3>
                {userMood === 'crisis' && (
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    Urgente
                  </Badge>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm text-blue-700 mb-2">
                  {chatMessages.length > 1 
                    ? `${Math.floor(chatMessages.length / 2)} conversas hoje`
                    : "Pronto para te ouvir"
                  }
                </p>
                {widget.size === 'large' && (
                  <div className="space-y-2">
                    <Input
                      placeholder="O que você gostaria de explorar hoje?"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="text-xs"
                    />
                    <Button onClick={sendMessage} size="sm" className="w-full">
                      Conversar
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )

      case 'quote':
        return (
          <Card key={widget.id} className={`${sizeClasses[widget.size]} relative bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200`}>
            {isEditMode && (
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full z-10"
                onClick={() => removeWidget(widget.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
            <CardContent className="p-4 h-full flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">{widget.title}</h3>
              </div>
              <p className="text-sm text-purple-700 leading-relaxed text-center">
                "{motivationalQuotes[currentQuote]}"
              </p>
            </CardContent>
          </Card>
        )

      case 'mood':
        return (
          <Card key={widget.id} className={`${sizeClasses[widget.size]} relative ${
            userMood === 'crisis' ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300' :
            userMood === 'struggling' ? 'bg-gradient-to-br from-orange-50 to-yellow-100 border-orange-200' :
            userMood === 'good' ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200' :
            'bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200'
          }`}>
            {isEditMode && (
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full z-10"
                onClick={() => removeWidget(widget.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
            <CardContent className="p-4 h-full flex flex-col justify-center items-center">
              <Heart className={`w-8 h-8 mb-2 ${
                userMood === 'crisis' ? 'text-red-600' :
                userMood === 'struggling' ? 'text-orange-500' :
                userMood === 'good' ? 'text-green-600' :
                'text-gray-500'
              }`} />
              <h3 className="font-semibold text-sm mb-1">{widget.title}</h3>
              <p className="text-xs text-center">
                {userMood === 'crisis' ? 'Precisa de apoio' :
                 userMood === 'struggling' ? 'Momento difícil' :
                 userMood === 'good' ? 'Sentindo-se bem' :
                 'Neutro'}
              </p>
            </CardContent>
          </Card>
        )

      case 'stats':
        return (
          <Card key={widget.id} className={`${sizeClasses[widget.size]} relative bg-gradient-to-br from-green-50 to-teal-100 border-green-200`}>
            {isEditMode && (
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full z-10"
                onClick={() => removeWidget(widget.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
            <CardContent className="p-4 h-full flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">{widget.title}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-green-700">Conversas:</span>
                  <span className="text-xs font-semibold text-green-800">{Math.floor(chatMessages.length / 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-green-700">Dias consecutivos:</span>
                  <span className="text-xs font-semibold text-green-800">7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'calendar':
        return (
          <Card key={widget.id} className={`${sizeClasses[widget.size]} relative bg-gradient-to-br from-indigo-50 to-blue-100 border-indigo-200`}>
            {isEditMode && (
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full z-10"
                onClick={() => removeWidget(widget.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
            <CardContent className="p-4 h-full flex flex-col justify-center items-center">
              <Calendar className="w-8 h-8 text-indigo-600 mb-2" />
              <h3 className="font-semibold text-sm mb-1">{widget.title}</h3>
              <p className="text-xs text-indigo-700">
                {currentTime.toLocaleDateString('pt-BR', { 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </p>
            </CardContent>
          </Card>
        )

      case 'timer':
        return (
          <Card key={widget.id} className={`${sizeClasses[widget.size]} relative bg-gradient-to-br from-orange-50 to-red-100 border-orange-200`}>
            {isEditMode && (
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full z-10"
                onClick={() => removeWidget(widget.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
            <CardContent className="p-4 h-full flex flex-col justify-center items-center">
              <Clock className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-semibold text-sm mb-1">{widget.title}</h3>
              <p className="text-lg font-mono text-orange-700">
                {currentTime.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </CardContent>
          </Card>
        )

      default:
        return (
          <Card key={widget.id} className={`${sizeClasses[widget.size]} relative bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200`}>
            {isEditMode && (
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full z-10"
                onClick={() => removeWidget(widget.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
            <CardContent className="p-4 h-full flex flex-col justify-center items-center">
              <Grid3X3 className="w-8 h-8 text-gray-500 mb-2" />
              <h3 className="font-semibold text-sm">{widget.title}</h3>
            </CardContent>
          </Card>
        )
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-black text-white">
      {/* iOS Status Bar */}
      <div className="flex justify-between items-center px-6 py-2 text-sm font-medium">
        <div className="flex items-center space-x-1">
          <span>{currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Signal className="w-4 h-4" />
          <Wifi className="w-4 h-4" />
          <Battery className="w-6 h-3" />
        </div>
      </div>

      {/* iOS Header */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Change Mindset</h1>
            <p className="text-gray-400 text-sm">Transforme sua mentalidade</p>
          </div>
          <div className="flex items-center space-x-3">
            {(userMood === 'struggling' || userMood === 'crisis') && (
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                userMood === 'crisis' ? 'bg-red-900/30 animate-pulse' : 'bg-orange-900/30'
              }`}>
                <Shield className={`w-4 h-4 ${userMood === 'crisis' ? 'text-red-400' : 'text-orange-400'}`} />
                <span className={`text-xs ${userMood === 'crisis' ? 'text-red-300 font-semibold' : 'text-orange-300'}`}>
                  {userMood === 'crisis' ? 'Urgente' : 'Cuidado'}
                </span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditMode(!isEditMode)}
              className={isEditMode ? 'bg-blue-600 text-white' : 'text-gray-400'}
            >
              {isEditMode ? 'Concluído' : 'Editar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Widget Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 auto-rows-min">
          {widgets.map(renderWidget)}
          
          {/* Add Widget Button */}
          {isEditMode && (
            <Dialog open={showAddWidget} onOpenChange={setShowAddWidget}>
              <DialogTrigger asChild>
                <Card className="col-span-1 row-span-1 h-32 border-dashed border-2 border-gray-600 bg-transparent hover:border-gray-500 transition-colors cursor-pointer">
                  <CardContent className="h-full flex flex-col justify-center items-center">
                    <Plus className="w-8 h-8 text-gray-500 mb-2" />
                    <p className="text-xs text-gray-500">Adicionar Widget</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Adicionar Widget</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Escolha um widget para adicionar à sua tela inicial
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center border-gray-600 hover:bg-gray-800"
                    onClick={() => addWidget('chat')}
                  >
                    <MessageCircle className="w-6 h-6 mb-1" />
                    <span className="text-xs">Chat</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center border-gray-600 hover:bg-gray-800"
                    onClick={() => addWidget('quote')}
                  >
                    <Lightbulb className="w-6 h-6 mb-1" />
                    <span className="text-xs">Reflexão</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center border-gray-600 hover:bg-gray-800"
                    onClick={() => addWidget('mood')}
                  >
                    <Heart className="w-6 h-6 mb-1" />
                    <span className="text-xs">Humor</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center border-gray-600 hover:bg-gray-800"
                    onClick={() => addWidget('stats')}
                  >
                    <TrendingUp className="w-6 h-6 mb-1" />
                    <span className="text-xs">Progresso</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center border-gray-600 hover:bg-gray-800"
                    onClick={() => addWidget('calendar')}
                  >
                    <Calendar className="w-6 h-6 mb-1" />
                    <span className="text-xs">Calendário</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center border-gray-600 hover:bg-gray-800"
                    onClick={() => addWidget('timer')}
                  >
                    <Clock className="w-6 h-6 mb-1" />
                    <span className="text-xs">Relógio</span>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Crisis Alert */}
        {userMood === 'crisis' && (
          <Card className="mt-6 bg-gradient-to-r from-red-900/50 to-red-800/50 border-red-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Phone className="w-8 h-8 text-red-400 animate-pulse" />
                <h2 className="text-xl font-bold text-red-300">🚨 Suporte Urgente</h2>
              </div>
              <p className="text-red-200 mb-4 font-semibold">
                Detectei que você pode estar em crise. Sua vida tem valor e você não está sozinho(a). 
                Busque ajuda profissional AGORA.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  📞 CVV: 188 (24h, gratuito)
                </Button>
                <Button size="sm" variant="outline" className="text-red-300 border-red-400">
                  💬 Conversar no Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Struggling Alert */}
        {userMood === 'struggling' && (
          <Card className="mt-6 bg-gradient-to-r from-orange-900/50 to-yellow-900/50 border-orange-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <HeartHandshake className="w-8 h-8 text-orange-400" />
                <h2 className="text-xl font-semibold text-orange-300">Cuidado Especial</h2>
              </div>
              <p className="text-orange-200 mb-4">
                Percebi que você está passando por um momento difícil. Isso é temporário e você tem força para superar.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="text-orange-300 border-orange-400">
                  💬 Conversar no Chat
                </Button>
                <Button size="sm" variant="outline" className="text-orange-300 border-orange-400">
                  📞 CVV: 188 (24h)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* iOS Home Indicator */}
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2">
        <div className="w-32 h-1 bg-white/30 rounded-full"></div>
      </div>
    </div>
  )
}