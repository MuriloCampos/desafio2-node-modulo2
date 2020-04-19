interface NewTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

export default function csvJSON(csv: string): NewTransaction[] {
  const lines: string[] = csv.split('\n');

  const jsonTransactions: NewTransaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');

    if (currentLine.length === 4) {
      const transaction: NewTransaction = {
        title: currentLine[0].trim(),
        type: currentLine[1].trim() === 'income' ? 'income' : 'outcome',
        value: parseInt(currentLine[2].trim(), 10),
        category: currentLine[3].trim(),
      };

      jsonTransactions.push(transaction);
    }
  }

  return jsonTransactions;
}
