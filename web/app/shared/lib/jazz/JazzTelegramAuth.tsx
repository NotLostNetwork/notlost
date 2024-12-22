// TODO: solve auth by just giving unique telegram id
// https://discord.com/channels/1139617727565271160/1313981442354839653/1320430551986995240

// TODO: below is claude hallucination code
// import { AgentSecret, CryptoProvider } from "cojson"
// import { Account, AuthMethod, AuthResult, ID } from "jazz-tools"
// import { useEffect, useMemo, useState } from "react"

// type TelegramAuthState = (
//   | {
//       state: "uninitialized"
//     }
//   | {
//       state: "loading"
//     }
//   | {
//       state: "ready"
//       signIn: (telegramId: string) => void
//     }
//   | {
//       state: "signedIn"
//       logOut: () => void
//     }
// ) & {
//   errors: string[]
// }

// export class BrowserTelegramAuth implements AuthMethod {
//   private callbacks: {
//     onReady: (methods: { signIn: (telegramId: string) => void }) => void
//     onSignedIn: (methods: { logOut: () => void }) => void
//     onError: (error: Error) => void
//   }

//   private localStorageKey = "telegram-auth-account"
//   private crypto?: CryptoProvider

//   constructor(callbacks: typeof BrowserTelegramAuth.prototype.callbacks) {
//     this.callbacks = callbacks
//   }

//   async start(crypto: CryptoProvider): Promise<AuthResult> {
//     this.crypto = crypto
//     const stored = localStorage.getItem(this.localStorageKey)

//     if (stored) {
//       try {
//         const { telegramId } = JSON.parse(stored)
//         return {
//           status: "signedIn",
//           accountID: this.createAccountId(telegramId),
//         }
//       } catch {
//         localStorage.removeItem(this.localStorageKey)
//       }
//     }

//     return new Promise((resolve) => {
//       this.callbacks.onReady({
//         signIn: async (telegramId: string) => {
//           try {
//             localStorage.setItem(
//               this.localStorageKey,
//               JSON.stringify({ telegramId }),
//             )

//             this.callbacks.onSignedIn({
//               logOut: () => this.logOut(),
//             })

//             resolve({
//               status: "signedIn",
//               accountID: this.createAccountId(telegramId),
//             })
//           } catch (error) {
//             this.callbacks.onError(error as Error)
//             resolve({ status: "error", error: error as Error })
//           }
//         },
//       })
//     })
//   }

//   private createAccountId(telegramId: string): ID<Account> {
//     return `telegram:${telegramId}` as ID<Account>
//   }

//   private logOut() {
//     localStorage.removeItem(this.localStorageKey)
//     this.callbacks.onReady({
//       signIn: (telegramId: string) => this.signIn(telegramId),
//     })
//   }

//   private async signIn(telegramId: string) {
//     try {
//       localStorage.setItem(this.localStorageKey, JSON.stringify({ telegramId }))

//       this.callbacks.onSignedIn({
//         logOut: () => this.logOut(),
//       })
//     } catch (error) {
//       this.callbacks.onError(error as Error)
//     }
//   }

//   getAccountID(): ID<Account> {
//     const stored = localStorage.getItem(this.localStorageKey)
//     if (!stored) throw new Error("Not signed in")
//     const { telegramId } = JSON.parse(stored)
//     return this.createAccountId(telegramId)
//   }

//   async getAccountSecret(): Promise<AgentSecret> {
//     if (!this.crypto) throw new Error("Crypto provider not initialized")
//     const stored = localStorage.getItem(this.localStorageKey)
//     if (!stored) throw new Error("Not signed in")
//     const { telegramId } = JSON.parse(stored)

//     // Generate a deterministic secret using the crypto provider
//     const secretBytes = await this.crypto.deriveKey(
//       `telegram-auth-${telegramId}`,
//       32,
//     )
//     return Buffer.from(secretBytes).toString("base64") as AgentSecret
//   }
// }

// export function useTelegramAuth() {
//   const [state, setState] = useState<TelegramAuthState>({
//     state: "loading",
//     errors: [],
//   })

//   const authMethod = useMemo(() => {
//     return new BrowserTelegramAuth({
//       onReady: ({ signIn }) => {
//         setState({
//           state: "ready",
//           signIn,
//           errors: [],
//         })
//       },
//       onSignedIn: ({ logOut }) => {
//         setState({ state: "signedIn", logOut, errors: [] })
//       },
//       onError: (error) => {
//         setState((current) => ({
//           ...current,
//           errors: [...current.errors, error.toString()],
//         }))
//       },
//     })
//   }, [])

//   return [authMethod, state] as const
// }
