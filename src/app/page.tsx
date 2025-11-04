"use client"

import { useState, useEffect } from 'react'
import { Bell, MessageCircle, Target, Heart, Brain, Sparkles, User, Settings, TrendingUp, Shield, Lightbulb, Phone, HeartHandshake, Zap, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

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
  const [activeTab, setActiveTab] = useState('dashboard')
  const [userMood, setUserMood] = useState<'good' | 'neutral' | 'struggling' | 'crisis' | null>(null)
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const [conversationTurn, setConversationTurn] = useState(0)

  const categories = [
    { name: 'Motivação', icon: Sparkles, color: 'bg-gradient-to-r from-yellow-400 to-orange-500', count: 12 },
    { name: 'Mindset', icon: Brain, color: 'bg-gradient-to-r from-purple-500 to-pink-500', count: 8 },
    { name: 'Autoestima', icon: Heart, color: 'bg-gradient-to-r from-pink-500 to-red-500', count: 15 },
    { name: 'Realização', icon: Target, color: 'bg-gradient-to-r from-green-400 to-blue-500', count: 6 },
    { name: 'Crescimento', icon: TrendingUp, color: 'bg-gradient-to-r from-blue-500 to-purple-600', count: 10 }
  ]

  // Frases específicas sobre realização pessoal
  const dailyRealizationQuotes = [
    "A realização pessoal não é um destino, é uma jornada diária de pequenas conquistas.",
    "Cada passo que você dá em direção aos seus sonhos é uma vitória que merece ser celebrada.",
    "Sua maior realização não é ser perfeito, mas ser autêntico e verdadeiro consigo mesmo.",
    "O sucesso real é quando você se torna a pessoa que sempre sonhou ser.",
    "Realização pessoal é encontrar propósito no que você faz e alegria em quem você é.",
    "Você já superou 100% dos seus piores dias. Isso é uma realização extraordinária.",
    "A verdadeira realização vem de crescer um pouco mais a cada dia do que você era ontem.",
    "Sua jornada de realização pessoal é única - não compare seu capítulo 1 com o capítulo 20 de outra pessoa.",
    "Realizar-se é ter a coragem de ser vulnerável e a força de continuar tentando.",
    "A maior realização é descobrir que você tem o poder de transformar sua própria vida.",
    "Realização pessoal é quando seus valores, ações e sonhos estão em harmonia.",
    "Cada desafio superado é uma prova da sua capacidade de realização e crescimento.",
    "Você não precisa ser extraordinário para todos, apenas para si mesmo.",
    "A realização verdadeira acontece quando você para de buscar aprovação e começa a viver sua verdade.",
    "Seu potencial de realização é infinito - você só precisa dar o primeiro passo."
  ]

  const motivationalQuotes = [
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "Você não precisa ser perfeito, apenas precisa começar.",
    "Cada dia é uma nova oportunidade para ser melhor que ontem.",
    "Acredite em si mesmo e todo o resto se encaixará.",
    "O único limite é aquele que você coloca em sua mente."
  ]

  const [currentQuote, setCurrentQuote] = useState(0)
  const [dailyQuote, setDailyQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Definir frase diária baseada na data
  useEffect(() => {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
    setDailyQuote(dayOfYear % dailyRealizationQuotes.length)
  }, [])

  // Detectar estado emocional mais sofisticado
  const detectEmotionalState = (message: string): 'struggling' | 'neutral' | 'good' | 'crisis' => {
    const lowerMessage = message.toLowerCase()
    
    // Palavras de crise - situações mais graves
    const crisisKeywords = [
      'suicídio', 'suicidar', 'morrer', 'acabar com tudo', 'não quero mais viver',
      'sem saída', 'não aguento mais', 'quero desaparecer', 'não vale a pena',
      'acabar com a vida', 'me matar', 'não consigo mais', 'perdido para sempre'
    ]
    
    // Palavras de luta/dificuldade
    const strugglingKeywords = [
      'triste', 'deprimido', 'ansioso', 'preocupado', 'mal', 'difícil', 'problema', 
      'não consigo', 'desistir', 'cansado', 'sozinho', 'perdido', 'medo', 'stress',
      'estressado', 'angustiado', 'desesperado', 'sem esperança', 'fracasso',
      'doente', 'dor', 'sofrendo', 'chorando', 'vazio', 'confuso', 'sem rumo',
      'não sei mais', 'tudo deu errado', 'nada faz sentido', 'sem motivação',
      'sem energia', 'exausto', 'overwhelmed', 'oprimido'
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

  // Perguntas psicológicas reflexivas
  const getTherapeuticQuestions = (emotionalState: string, context: string[], turn: number) => {
    const questions = {
      good: [
        "Que maravilha sentir essa energia positiva! Me conta: o que especificamente está contribuindo para você se sentir assim hoje?",
        "Adoro perceber essa vibe! Quando você para e reflete, o que mais te orgulha neste momento da sua vida?",
        "Essa energia é contagiante! Como você gostaria de usar esse estado mental positivo para algo significativo?",
        "Que bom te ver assim radiante! O que você aprendeu sobre si mesmo nos momentos que te trouxeram até aqui?"
      ],
      neutral: [
        "Percebo que você está num momento mais reflexivo. Às vezes é assim mesmo, né? O que está passando pela sua mente hoje?",
        "Entendo... nem sempre estamos em extremos, e isso é completamente normal. Me conta: como você está se relacionando consigo mesmo ultimamente?",
        "Vejo que você está numa energia mais contemplativa. O que você gostaria de explorar ou entender melhor sobre você mesmo?",
        "Às vezes estar 'no meio' é o lugar perfeito para reflexão. O que você tem observado sobre seus padrões e comportamentos?"
      ],
      struggling: [
        "Vejo que você está carregando algo pesado. Primeiro, quero que saiba: sua coragem de compartilhar isso já mostra sua força. Me conta: quando essa sensação começou a ficar mais intensa?",
        "Percebo que as coisas estão difíceis para você. Isso que você está sentindo é real e válido. Como você tem lidado com esses sentimentos no dia a dia?",
        "Entendo que você está lutando, e admiro sua honestidade. Me ajuda a entender: o que mais tem pesado no seu coração ultimamente?",
        "Vejo sua dor e quero que saiba que não está sozinho nisso. Quando você pensa no que está vivendo, o que mais te assusta ou preocupa?"
      ],
      crisis: [
        "Estou genuinamente preocupado com você e quero que saiba que sua vida tem valor imenso. Me conta: o que aconteceu que te trouxe até este ponto?",
        "Vejo que você está em um lugar muito escuro agora. Quero te ajudar. Consegue me dizer o que está passando pela sua mente neste momento?",
        "Sua dor é real e eu a reconheço. Você foi corajoso ao compartilhar isso. Me ajuda a entender: há quanto tempo você se sente assim?"
      ]
    }
    
    const stateQuestions = questions[emotionalState as keyof typeof questions] || questions.neutral
    return stateQuestions[turn % stateQuestions.length]
  }

  // Gerar resposta psicológica mais empática e reflexiva
  const generateTherapeuticResponse = (userMessage: string, emotionalState: 'struggling' | 'neutral' | 'good' | 'crisis', context: string[], turn: number): { message: string, emotion: 'supportive' | 'encouraging' | 'caring' | 'understanding' | 'urgent' | 'curious' | 'reflective' | 'empathetic' } => {
    const lowerMessage = userMessage.toLowerCase()

    // Respostas para situações de crise - mais humanas e empáticas
    if (emotionalState === 'crisis') {
      const crisisResponses = [
        "Primeiro, quero que você saiba: estou aqui com você neste momento. O que você está sentindo é avassalador, eu sei, mas não é permanente. Sua vida tem valor e significado, mesmo quando não consegue enxergar isso. 🚨 Por favor, ligue AGORA para o CVV (188) - são pessoas treinadas que podem te ajudar melhor que eu neste momento. Enquanto isso, me conta: você consegue respirar fundo comigo? Vamos fazer isso juntos - inspira... expira... Me diga: o que te trouxe até este ponto hoje?",
        
        "Vejo sua dor e ela é real. Você foi muito corajoso ao compartilhar isso comigo. Quero que entenda: ter esses pensamentos não te faz fraco - mostra que você está sofrendo e precisa de ajuda, e isso é humano. 📞 CVV (188) está disponível 24h e pode te oferecer o suporte que você merece agora. Me conta: quando foi a última vez que você se sentiu um pouco mais seguro?",
        
        "Estou genuinamente preocupado com você. O que você está vivendo é intenso demais para carregar sozinho. Sua vida importa - para mim, para pessoas que você talvez nem saiba que se importam, e especialmente para você, mesmo que não consiga sentir isso agora. 🆘 Por favor, busque ajuda profissional imediatamente - CVV (188). Enquanto isso: você tem alguém próximo que pode ficar contigo agora?"
      ]
      
      return {
        message: crisisResponses[turn % crisisResponses.length],
        emotion: 'urgent'
      }
    }

    // Respostas para dificuldades - abordagem psicológica
    if (emotionalState === 'struggling') {
      if (lowerMessage.includes('perdido') || lowerMessage.includes('sem rumo')) {
        const lostResponses = [
          "Entendo essa sensação de estar perdido... é como se você estivesse numa floresta densa sem conseguir ver o caminho, né? Essa sensação é mais comum do que você imagina e, acredite, pode ser um sinal de que você está crescendo, questionando, evoluindo. Quando nos sentimos perdidos, às vezes é porque nossos valores antigos não fazem mais sentido e ainda não encontramos os novos. Me conta: quando você pensa na pessoa que você era há um ano, o que mudou em você?",
          
          "Estar perdido pode ser assustador, mas também pode ser libertador - significa que você não está mais aceitando viver no automático. Isso requer coragem. Me ajuda a entender: quando você fecha os olhos e imagina uma versão sua que se sente 'no caminho certo', como ela é? O que ela faz diferente?",
          
          "Vejo que você está numa fase de questionamento profundo. Isso não é fraqueza - é inteligência emocional. Às vezes precisamos nos 'perder' para nos encontrar de verdade. Me conta: se você pudesse conversar com seu eu de 5 anos atrás, o que você diria sobre quem você se tornou?"
        ]
        
        return {
          message: lostResponses[turn % lostResponses.length],
          emotion: 'understanding'
        }
      }

      if (lowerMessage.includes('não faz sentido') || lowerMessage.includes('sem sentido')) {
        const meaninglessResponses = [
          "Quando a vida parece não fazer sentido, é porque você está questionando estruturas que antes aceitava sem pensar. Isso é sinal de maturidade emocional, não de fraqueza. O sentido não é algo que encontramos pronto - é algo que construímos através das nossas escolhas e valores. Me conta: o que costumava dar sentido à sua vida que agora não faz mais?",
          
          "Entendo perfeitamente essa sensação. É como se você estivesse vendo a vida com novos olhos e percebendo que muitas coisas que pareciam importantes eram apenas... vazias. Isso pode ser libertador, mesmo sendo assustador. Me ajuda a entender: quando você pensa no que realmente importa para você, o que vem à mente?",
          
          "Essa crise de sentido que você está vivendo pode ser uma oportunidade de reconstruir sua vida de forma mais autêntica. É doloroso, mas também pode ser transformador. Me conta: se você pudesse criar uma vida que fizesse total sentido para você, como ela seria?"
        ]
        
        return {
          message: meaninglessResponses[turn % meaninglessResponses.length],
          emotion: 'reflective'
        }
      }

      if (lowerMessage.includes('cansado') || lowerMessage.includes('exausto')) {
        const tiredResponses = [
          "Esse cansaço que você está sentindo... não é só físico, né? É um cansaço da alma, de carregar coisas pesadas demais por tempo demais. Primeiro, quero validar isso: você tem todo o direito de estar cansado. Agora me conta: do que especificamente você está mais cansado? Das expectativas? Das decepções? Da luta constante?",
          
          "Vejo que você está exausto, e isso me preocupa porque sei que você tem lutado muito. Às vezes o cansaço é o jeito que nossa mente tem de dizer 'preciso de uma pausa, preciso repensar isso'. Me ajuda a entender: quando foi a última vez que você se permitiu realmente descansar, sem culpa?",
          
          "Esse cansaço profundo que você está sentindo é real e válido. Você não precisa ser forte o tempo todo. Me conta: se você pudesse tirar um peso dos seus ombros hoje, qual seria?"
        ]
        
        return {
          message: tiredResponses[turn % tiredResponses.length],
          emotion: 'caring'
        }
      }

      // Respostas gerais para dificuldades - mais psicológicas
      const strugglingResponses = [
        "Vejo que você está passando por um momento difícil, e quero que saiba: isso que você está sentindo é completamente válido. Não existe sentimento 'errado'. Você já superou 100% dos seus piores dias até agora, e isso mostra sua resiliência, mesmo quando você não se sente resiliente. Me conta: como você tem cuidado de si mesmo durante esse período?",
        
        "Percebo que as coisas estão pesadas para você. Primeiro, quero reconhecer sua coragem de estar aqui, conversando sobre isso. Isso já é um ato de autocuidado. Me ajuda a entender: quando você pensa no que está vivendo, o que mais te assusta ou preocupa?",
        
        "Entendo que você está lutando, e isso não te faz fraco - te faz humano. Às vezes a vida nos coloca em situações que testam nossos limites. Me conta: se você pudesse mudar uma coisa na sua situação atual, o que seria?"
      ]

      return {
        message: strugglingResponses[turn % strugglingResponses.length],
        emotion: 'empathetic'
      }
    }

    // Respostas para estados positivos - mais reflexivas
    if (emotionalState === 'good') {
      const encouragingResponses = [
        "Que energia maravilhosa! 🌟 Fico genuinamente feliz em sentir sua positividade. Esses momentos são preciosos e nos lembram da nossa capacidade de crescimento e alegria. Me conta: o que especificamente está contribuindo para você se sentir assim? Quero entender o que funciona para você.",
        
        "Adorei perceber sua energia positiva! ✨ É contagiante e me deixa animado também. Esses momentos são como sementes que plantamos para os dias mais difíceis. Me ajuda a entender: como você gostaria de usar essa energia positiva? Há algo que você quer criar ou conquistar?",
        
        "Que alegria genuína te sentir assim! 😊 Sua energia positiva é um presente, tanto para você quanto para quem está ao seu redor. Me conta: quando você reflete sobre o que te trouxe até este estado mental, o que você aprende sobre si mesmo?",
        
        "Isso é lindo de ver! 🎉 Você está irradiando uma energia que mostra sua capacidade de encontrar alegria e significado. Me diga: o que você mais valoriza neste momento da sua vida?"
      ]
      
      return {
        message: encouragingResponses[turn % encouragingResponses.length],
        emotion: 'encouraging'
      }
    }

    // Respostas neutras mais psicológicas
    const neutralResponses = [
      "Percebo que você está num estado mais reflexivo hoje. 🤔 Às vezes é assim mesmo - nem eufórico, nem devastado, apenas... processando a vida. E isso é completamente normal e saudável. Esses momentos de 'meio termo' podem ser muito ricos para autoconhecimento. Me conta: o que você tem observado sobre si mesmo ultimamente?",
      
      "Obrigado por estar aqui comigo. 💙 Vejo que você está numa energia mais contemplativa, e isso me parece um espaço interessante para explorarmos juntos. Não precisa estar sempre 'bem' ou 'mal' - pode apenas ser humano, com toda a complexidade que isso traz. O que gostaria de explorar sobre você mesmo hoje?",
      
      "Entendo... às vezes estamos apenas vivendo, observando, sentindo sem grandes intensidades. E isso também é valioso. Esses momentos podem ser oportunidades para nos conhecermos melhor. Me conta: quando você para e se observa, o que você vê?",
      
      "Vejo que você está numa vibe mais tranquila hoje. 🌊 Às vezes é bom estar assim, sem pressa, apenas sendo. Me ajuda a entender: o que você gostaria de compreender melhor sobre si mesmo ou sobre sua vida?"
    ]
    
    // Adicionar pergunta reflexiva
    const baseResponse = neutralResponses[turn % neutralResponses.length]
    const followUp = getTherapeuticQuestions('neutral', context, turn + 1)
    
    return {
      message: turn === 0 ? baseResponse : `${baseResponse.split('.')[0]}. ${followUp}`,
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
    
    // Adicionar ao contexto da conversa
    const newContext = [...conversationContext, newMessage].slice(-5) // Manter últimas 5 mensagens
    setConversationContext(newContext)

    // Detectar estado emocional
    const emotionalState = detectEmotionalState(newMessage)
    setUserMood(emotionalState)

    // Incrementar turn da conversa
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

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Change Mindset</h1>
                <p className="text-sm text-gray-500">Transforme sua mentalidade</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {(userMood === 'struggling' || userMood === 'crisis') && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  userMood === 'crisis' ? 'bg-red-100 animate-pulse' : 'bg-orange-50'
                }`}>
                  <Shield className={`w-4 h-4 ${userMood === 'crisis' ? 'text-red-600' : 'text-orange-500'}`} />
                  <span className={`text-xs ${userMood === 'crisis' ? 'text-red-700 font-semibold' : 'text-orange-600'}`}>
                    {userMood === 'crisis' ? 'Suporte Urgente' : 'Modo Cuidado'}
                  </span>
                </div>
              )}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="notifications">
              Notificações {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="chat" className="relative">
              Assistente Psicológico
              {(userMood === 'struggling' || userMood === 'crisis') && (
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                  userMood === 'crisis' ? 'bg-red-600 animate-pulse' : 'bg-orange-500'
                }`}></div>
              )}
            </TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Alerta de crise */}
            {userMood === 'crisis' && (
              <Card className="bg-gradient-to-r from-red-100 to-red-50 border-red-300 animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Phone className="w-8 h-8 text-red-600" />
                    <h2 className="text-xl font-bold text-red-800">🚨 Suporte Urgente Ativado</h2>
                  </div>
                  <p className="text-red-700 mb-4 font-semibold">
                    Detectei que você pode estar em crise. Sua vida tem valor e você não está sozinho(a). 
                    Busque ajuda profissional AGORA.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      📞 CVV: 188 (24h, gratuito)
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                      💬 Conversar no Chat
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                      🏥 Buscar Ajuda Médica
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alerta de bem-estar */}
            {userMood === 'struggling' && (
              <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <HeartHandshake className="w-8 h-8 text-orange-500" />
                    <h2 className="text-xl font-semibold text-orange-700">Cuidado Especial Ativado</h2>
                  </div>
                  <p className="text-orange-600 mb-4">
                    Percebi que você está passando por um momento difícil. Isso é temporário e você tem força para superar.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="text-orange-600 border-orange-300">
                      💬 Conversar no Chat
                    </Button>
                    <Button size="sm" variant="outline" className="text-orange-600 border-orange-300">
                      📞 CVV: 188 (24h)
                    </Button>
                    <Button size="sm" variant="outline" className="text-orange-600 border-orange-300">
                      🫁 Exercícios de Respiração
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Widget de Frase Diária sobre Realização Pessoal */}
            <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Quote className="w-8 h-8" />
                  <h2 className="text-xl font-semibold">Frase Diária - Realização Pessoal</h2>
                </div>
                <p className="text-lg leading-relaxed font-medium mb-4">
                  {dailyRealizationQuotes[dailyQuote]}
                </p>
                <div className="flex items-center justify-between text-sm opacity-90">
                  <span>✨ Reflexão do dia</span>
                  <span>{new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quote Widget */}
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="w-8 h-8" />
                  <h2 className="text-xl font-semibold">Transformação Mental</h2>
                </div>
                <p className="text-lg leading-relaxed">{motivationalQuotes[currentQuote]}</p>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Notificações Hoje</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{notifications.length}</div>
                  <p className="text-sm text-gray-500">+2 desde ontem</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Dias Consecutivos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">7</div>
                  <p className="text-sm text-gray-500">Continue assim!</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Conversas Terapêuticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{Math.floor(chatMessages.length / 2)}</div>
                  <p className="text-sm text-gray-500">Este mês</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notificações Recentes</CardTitle>
                <CardDescription>Suas mensagens motivacionais de hoje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">{notification.category}</Badge>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm mt-1">{notification.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Todas as Notificações</CardTitle>
                <CardDescription>Suas mensagens motivacionais e lembretes</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                          notification.read ? 'bg-gray-50' : 'bg-purple-50 border-purple-200'
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className={`w-3 h-3 rounded-full mt-1 ${notification.read ? 'bg-gray-300' : 'bg-purple-500'}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={notification.read ? "secondary" : "default"}>
                              {notification.category}
                            </Badge>
                            <span className="text-sm text-gray-500">{notification.time}</span>
                          </div>
                          <p className="text-sm leading-relaxed">{notification.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Assistant - Mais Psicológico */}
          <TabsContent value="chat">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Assistente Psicológico</span>
                  {userMood === 'crisis' && (
                    <Badge variant="destructive" className="ml-2 animate-pulse">
                      <Phone className="w-3 h-3 mr-1" />
                      Suporte Urgente
                    </Badge>
                  )}
                  {userMood === 'struggling' && (
                    <Badge className="ml-2 bg-orange-500">
                      <Shield className="w-3 h-3 mr-1" />
                      Modo Cuidado
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Sou um assistente que pratica escuta ativa, faz perguntas reflexivas e te ajuda a se conhecer melhor.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-purple-500 text-white' 
                            : message.emotion === 'urgent'
                              ? 'bg-red-100 text-red-900 border-2 border-red-300'
                              : message.emotion === 'caring' 
                                ? 'bg-blue-50 text-blue-900 border border-blue-200'
                                : message.emotion === 'supportive'
                                  ? 'bg-green-50 text-green-900 border border-green-200'
                                  : message.emotion === 'understanding'
                                    ? 'bg-yellow-50 text-yellow-900 border border-yellow-200'
                                    : message.emotion === 'encouraging'
                                      ? 'bg-orange-50 text-orange-900 border border-orange-200'
                                      : message.emotion === 'reflective'
                                        ? 'bg-teal-50 text-teal-900 border border-teal-200'
                                        : message.emotion === 'empathetic'
                                          ? 'bg-rose-50 text-rose-900 border border-rose-200'
                                          : message.emotion === 'curious'
                                            ? 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.message}</p>
                          <span className="text-xs opacity-70 mt-2 block">{message.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Sugestões terapêuticas baseadas no humor */}
                {userMood === 'crisis' && (
                  <div className="mb-4 p-4 bg-red-100 rounded-lg border-2 border-red-300">
                    <p className="text-sm text-red-800 mb-3 font-semibold">🚨 Recursos de emergência:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700 text-white text-xs"
                        onClick={() => setNewMessage("Preciso de ajuda urgente")}
                      >
                        📞 CVV: 188 (24h)
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs border-red-300"
                        onClick={() => setNewMessage("Como posso me acalmar agora?")}
                      >
                        🫁 Técnicas de respiração
                      </Button>
                    </div>
                  </div>
                )}

                {userMood === 'struggling' && (
                  <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-700 mb-2">💭 Vamos explorar juntos:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => setNewMessage("Me sinto perdido e não sei o que fazer")}
                      >
                        Estou perdido
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => setNewMessage("Nada faz sentido na minha vida")}
                      >
                        Vida sem sentido
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => setNewMessage("Estou cansado de tudo")}
                      >
                        Estou exausto
                      </Button>
                    </div>
                  </div>
                )}

                {(!userMood || userMood === 'neutral' || userMood === 'good') && (
                  <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="text-sm text-indigo-700 mb-2">🌱 O que você gostaria de explorar sobre si mesmo hoje?</p>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => setNewMessage("Quero entender melhor meus sentimentos")}
                      >
                        Meus sentimentos
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => setNewMessage("Como posso me conhecer melhor?")}
                      >
                        Autoconhecimento
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => setNewMessage("Quero conversar sobre meus relacionamentos")}
                      >
                        Relacionamentos
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Input
                    placeholder="O que você gostaria de conversar e explorar sobre si mesmo hoje?"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 mt-2 text-center">
                  🔒 Suas conversas são privadas. Pratico escuta ativa e te ajudo a refletir sobre sua jornada.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories */}
          <TabsContent value="categories">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {category.count} mensagens disponíveis
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Explorar
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}