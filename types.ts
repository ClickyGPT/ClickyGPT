
export enum MessageAuthor {
  User = 'user',
  AI = 'ai',
  System = 'system',
}

export interface Message {
  id: string;
  author: MessageAuthor;
  text: string;
  title?: string;
}
