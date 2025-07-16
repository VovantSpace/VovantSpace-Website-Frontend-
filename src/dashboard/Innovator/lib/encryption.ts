// Simulated encryption for demonstration
// In production, use proper end-to-end encryption libraries

export const encryptMessage = async (content: string): Promise<string> => {
    // Simulate encryption
    const encoder = new TextEncoder()
    const data = encoder.encode(content)
    const buffer = await crypto.subtle.digest("SHA-256", data)
    return `${content}|${Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")}`
  }
  
  export const decryptMessage = async (encryptedContent: string): Promise<string> => {
    // Simulate decryption
    return encryptedContent.split("|")[0]
  }
  
  export const isEncrypted = (content: string): boolean => {
    return content.includes("|")
  }
  
  