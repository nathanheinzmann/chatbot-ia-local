"use client"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { generateAnswer } from "@/lib/embedding"

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Olá! Cole o texto que você quer que eu analise." },
  ])
  const [input, setInput] = useState("")
  const [context, setContext] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isContextSet, setIsContextSet] = useState(false)
  const [aiPower, setAiPower] = useState(0.6) // Valor padrão da temperatura

  const handleSetContext = () => {
    if (!input.trim()) return
    setContext(input)
    setIsContextSet(true)
    setMessages([
      { role: "system", content: "Olá! Cole o texto que você quer que eu analise." },
      { role: "assistant", content: "Contexto recebido! Agora você pode fazer perguntas sobre o texto." }
    ])
    setInput("")
  }

  const handleSend = async () => {
    if (!input.trim()) return
    if (!isContextSet) {
      setMessages([...messages,
      { role: "user", content: input },
      { role: "assistant", content: "Por favor, primeiro defina o texto de contexto usando o botão 'Definir Contexto'." }
      ])
      setInput("")
      return
    }

    setMessages([...messages, { role: "user", content: input }])
    setInput("")
    setIsLoading(true)

    try {
      const answer = await generateAnswer(input, context, aiPower)
      setMessages(msgs => [...msgs, { role: "assistant", content: answer }])
    } catch (error) {
      setMessages(msgs => [...msgs, {
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao gerar a resposta. Por favor, tente novamente."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isContextSet) {
        handleSend()
      } else {
        handleSetContext()
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {isContextSet && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Contexto Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {context}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-2 pt-4">
          {messages.map((msg, i) => (
            <div key={i} className={`text-sm ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <span className="block px-3 py-2 rounded-md bg-muted text-muted-foreground">
                <strong>{msg.role === "user" ? "Você" : "Assistente"}</strong>: {msg.content}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isContextSet ? "Digite sua pergunta..." : "Cole o texto aqui..."}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={isContextSet ? handleSend : handleSetContext}
            disabled={isLoading || !input.trim()}
          >
            {isContextSet ? "Enviar" : "Definir Contexto"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Potência da IA:</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex-1">
                  <Slider
                    value={[aiPower]}
                    onValueChange={([value]) => setAiPower(value)}
                    min={0.1}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ajuste a criatividade da IA (0.1 - 1.0)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-sm text-muted-foreground">{aiPower.toFixed(1)}</span>
        </div>
      </div>
    </div>
  )
}
