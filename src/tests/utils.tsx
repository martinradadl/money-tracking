import { LoginI, UserI } from "../data/authentication";
import { TransactionFormI } from "../data/transactions";
import { DebtFormI } from "../data/debts";
import { MovementChartDataI } from "../helpers/movements";

// USERS

export const currencies = [{ name: "fakeCurrency", code: "FAKE" }];
export const timezones = [{ name: "fakeTimezone", offset: "fakeOffset" }];

export const newUser: UserI = {
  _id: "fakeId",
  name: "fakeName",
  email: "fakeEmail",
  password: "fakePassword",
  currency: currencies[0],
  timezone: timezones[0],
  profilePic: "fakeProfilePic",
};

export const updatedUser: UserI = {
  _id: "fakeId",
  name: "fakeUpdatedName",
  email: "fakeUpdatedEmail",
  password: "fakeUpdatedPassword",
  currency: currencies[0],
  timezone: timezones[0],
  profilePic: "fakeUpdatedProfilePic",
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
  date: new Date("1999-02-10T12:30:00"),
  userId: "fakeUserId",
};

export const updatedTransaction: TransactionFormI = {
  _id: "fakeUpdatedId",
  type: "income",
  concept: "fakeUpdatedConcept",
  category: { _id: "fakeId", label: "fakeLabel" },
  amount: "fakeUpdatedAmount",
  date: new Date("2000-02-10T12:30:00"),
  userId: "fakeUpdatedUserId",
};

export const fakeTransactionChartData: MovementChartDataI = {
  group: "income",
  date: "2000-02-02T12:30:00",
  amount: 100,
};

export const fakeTransactionChartData2: MovementChartDataI = {
  group: "expenses",
  date: "2000-04-04T12:30:00",
  amount: 200,
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
  date: new Date("1999-02-10T12:30:00"),
  userId: "fakeUserId",
};

export const updatedDebt: DebtFormI = {
  _id: "fakeId",
  type: "debt",
  entity: "fakeEntity",
  concept: "fakeConcept",
  category: { _id: "fakeId", label: "fakeLabel" },
  amount: "fakeAmount",
  date: new Date("2000-02-10T12:30:00"),
  userId: "fakeUserId",
};

export const fakeDebtChartData: MovementChartDataI = {
  group: "loan",
  date: "2000-02-02T12:30:00",
  amount: 100,
};

export const fakeDebtChartData2: MovementChartDataI = {
  group: "debt",
  date: "2000-04-04T12:30:00",
  amount: 200,
};
