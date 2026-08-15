export interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  { text: '千里之行，始於足下。', author: '老子' },
  { text: '學而不思則罔，思而不學則殆。', author: '孔子' },
  { text: '知之者不如好之者，好之者不如樂之者。', author: '孔子' },
  { text: '路漫漫其修遠兮，吾將上下而求索。', author: '屈原' },
  { text: '業精於勤，荒於嬉；行成於思，毀於隨。', author: '韓愈' },
  { text: '不積跬步，無以至千里；不積小流，無以成江海。', author: '荀子' },
  { text: '天將降大任於斯人也，必先苦其心志，勞其筋骨。', author: '孟子' },
  { text: '會當凌絕頂，一覽眾山小。', author: '杜甫' },
  { text: '天生我材必有用，千金散盡還復來。', author: '李白' },
  { text: '寶劍鋒從磨礪出，梅花香自苦寒來。', author: '佚名' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'The best way to predict the future is to invent it.', author: 'Alan Kay' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'Code is like humor. When you have to explain it, it is bad.', author: 'Cory House' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { text: 'Premature optimization is the root of all evil.', author: 'Donald Knuth' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
];

export default quotes;
