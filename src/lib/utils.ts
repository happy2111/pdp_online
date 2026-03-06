import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 9);

  const part1 = digits.slice(0, 2);
  const part2 = digits.slice(2, 5);
  const part3 = digits.slice(5, 7);
  const part4 = digits.slice(7, 9);

  let formatted = "";

  if (part1) formatted += part1;
  if (part2) formatted += ` ${part2}`;
  if (part3) formatted += `-${part3}`;
  if (part4) formatted += `-${part4}`;

  return formatted;
};

export function getLocaleFromPathname() {
  if (typeof window === "undefined") return "ru";
  const match = window.location.pathname.match(/^\/(ru|uz)(\/|$)/);
  return match?.[1] ?? "ru";
}

export const printMe = () =>  console.log(`%c
          _____                _____          
         /\\    \\              |\\    \\         
        /::\\____\\             |:\\____\\        
       /:::/    /             |::|   |        
      /:::/    /              |::|   |        
     /:::/    /               |::|   |        
    /:::/____/                |::|   |        
   /::::\\    \\                |::|   |        
  /::::::\\    \\   _____       |::|___|______  
 /:::/\\:::\\    \\ /\\    \\      /::::::::\\    \\ 
/:::/  \\:::\\    /::\\____\\    /::::::::::\\____\\
\\::/    \\:::\\  /:::/    /   /:::/~~~~/~~      
 \\/____/ \\:::\\/:::/    /   /:::/    /         
          \\::::::/    /   /:::/    /          
           \\::::/    /   /:::/    /           
           /:::/    /    \\::/    /            
          /:::/    /      \\/____/             
         /:::/    /                           
        /:::/    /                            
        \\::/    /                             
         \\/____/             
         
         
Stop debugging my code and start hiring me!        
                                              
\n%chttps://github.com/happy2111
`,
  "color:#00ffcc; font-size:12px; font-family:monospace;",
  "color:#4ea1ff; font-size:12px; font-family:monospace; text-decoration:underline;");


