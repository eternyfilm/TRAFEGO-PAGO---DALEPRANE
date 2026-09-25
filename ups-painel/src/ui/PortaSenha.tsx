import { useState, type ReactNode } from 'react'

// Trava simples de acesso. A senha vem de VITE_APP_SENHA (definida no host).
// Se não houver senha configurada, não trava nada.
//
// Aviso honesto: isto é uma trava leve, do lado do cliente. Segura visitante
// casual, não é criptografia. Pra proteção real (dados sensíveis), use login
// por email do Supabase. Aqui os dados são tarefas de operação, não segredo.

const SENHA = import.meta.env.VITE_APP_SENHA as string | undefined
const CHAVE = 'ups-painel:destravado:v1'

export function PortaSenha({ children }: { children: ReactNode }) {
  const [destravado, setDestravado] = useState(() => {
    if (!SENHA) return true
    try {
      return localStorage.getItem(CHAVE) === '1'
    } catch {
      return false
    }
  })
  const [tentativa, setTentativa] = useState('')
  const [erro, setErro] = useState(false)

  if (destravado) return <>{children}</>

  function entrar(e: React.FormEvent) {
    e.preventDefault()
    if (tentativa === SENHA) {
      try {
        localStorage.setItem(CHAVE, '1')
      } catch {
        /* ignora */
      }
      setDestravado(true)
    } else {
      setErro(true)
      setTentativa('')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <form className="card" onSubmit={entrar} style={{ width: '100%', maxWidth: 380 }}>
        <div
          className="marca"
          style={{ justifyContent: 'center', marginBottom: 18, fontSize: 26 }}
        >
          UPS<b>·</b>DIGITAL
        </div>
        <label className="campo">Senha de acesso</label>
        <input
          type="password"
          value={tentativa}
          onChange={(e) => {
            setTentativa(e.target.value)
            setErro(false)
          }}
          autoFocus
          placeholder="••••••••"
        />
        {erro && (
          <p style={{ color: 'var(--st-travado)', fontSize: 13, margin: '8px 0 0' }}>
            Senha incorreta.
          </p>
        )}
        <button className="btn ouro" type="submit" style={{ width: '100%', marginTop: 16 }}>
          Entrar
        </button>
      </form>
    </div>
  )
}
