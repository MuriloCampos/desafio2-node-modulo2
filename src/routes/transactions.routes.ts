import { Router, json } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import fs from 'fs';

import uploadConfig from '../config/upload';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import csvJSON from '../utils/csvJSON';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });
  const balance = await transactionsRepository.getBalance();

  const responseJSON = {
    transactions,
    balance,
  };

  return response.json(responseJSON);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();
    const createTransaction = new CreateTransactionService();

    const transactions = await importTransactions.execute({
      csvFile: request.file.path,
    });

    // transactions.forEach(async transaction => {
    //   const { title, type, category, value } = transaction;
    //   await createTransaction.execute({
    //     title,
    //     type,
    //     category: category.toString(),
    //     value,
    //   });
    // });

    return response.json(transactions);
  },
);

export default transactionsRouter;
