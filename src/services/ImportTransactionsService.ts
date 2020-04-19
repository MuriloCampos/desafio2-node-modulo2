import fs from 'fs';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import csvJSON from '../utils/csvJSON';
import AppError from '../errors/AppError';

interface Request {
  csvFile: string;
}

interface NewTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute({ csvFile }: Request): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    let data;
    try {
      data = fs.readFileSync(csvFile, 'utf8');
    } catch (err) {
      throw new AppError(err.message);
    }

    const jsonData: NewTransaction[] = csvJSON(data);
    const responseJSON: Transaction[] = [];

    for (let i = 0; i < jsonData.length; i++) {
      const newTransaction = await createTransaction.execute({
        title: jsonData[i].title,
        type: jsonData[i].type,
        category: jsonData[i].category,
        value: jsonData[i].value,
      });

      responseJSON.push(newTransaction);
    }

    await fs.promises.unlink(csvFile);

    return responseJSON;
  }
}

export default ImportTransactionsService;
