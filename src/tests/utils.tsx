import { LoginI, UserI } from "../data/authentication";
import { TransactionFormI } from "../data/transactions";
import { DebtFormI } from "../data/debts";

// USERS

export const currencies = [{ name: "fakeCurrency", code: "FAKE" }];

export const newUser: UserI = {
  _id: "fakeId",
  name: "fakeName",
  email: "fakeEmail",
  password: "fakePassword",
  currency: currencies[0],
};

export const updatedUser: UserI = {
  _id: "fakeId",
  name: "fakeUpdatedName",
  email: "fakeUpdatedEmail",
  password: "fakeUpdatedPassword",
  currency: currencies[0],
};

export const loggedUser: LoginI = {
  email: "fakeEmail",
  password: "fakePassword",
};

// TOKENS

export const fakeToken = "fakeToken";

// TRANSACTIONS

export const newTransaction: TransactionFormI = {
  _id: "fakeId",
  type: "income",
  concept: "fakeConcept",
  category: { _id: "fakeId", label: "fakeLabel" },
  amount: "fakeAmount",
  userId: "fakeUserId",
};

export const updatedTransaction: TransactionFormI = {
  _id: "fakeUpdatedId",
  type: "income",
  concept: "fakeUpdatedConcept",
  category: { _id: "fakeId", label: "fakeLabel" },
  amount: "fakeUpdatedAmount",
  userId: "fakeUpdatedUserId",
};

export const categories = [{ _id: "fakeId", label: "fakeLabel" }];

// DEBTS

export const newDebt: DebtFormI = {
  _id: "fakeId",
  type: "debt",
  entity: "fakeEntity",
  concept: "fakeConcept",
  category: { _id: "fakeId", label: "fakeLabel" },
  amount: "fakeAmount",
  userId: "fakeUserId",
};

export const updatedDebt: DebtFormI = {
  _id: "fakeId",
  type: "debt",
  entity: "fakeEntity",
  concept: "fakeConcept",
  category: { _id: "fakeId", label: "fakeLabel" },
  amount: "fakeAmount",
  userId: "fakeUserId",
};
