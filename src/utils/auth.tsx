export function encodeString(input: string | number | null = null): string | null {
    const index: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+{}[]|:;<>,.?/~`";
    const base: number = index.length;
    if (input === null) return null;
  
    try {
      let encoded: string = '';
      let number: number = typeof input === "number" 
        ? input 
        : [...input].reduce((acc, char) => acc * 256 + char.charCodeAt(0), 0);
  
      while (number > 0) {
        let remainder: number = number % base;
        encoded = index[remainder] + encoded;
        number = Math.floor(number / base);
      }
  
      return encoded || index[0]; 
    } catch (e) {
      console.error(`encodeString Error:`, (e as Error).message);
      return null;
    }
  }
  