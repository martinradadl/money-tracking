import { LoginI, UserI } from "../data/authentication";
import { TransactionFormI } from "../data/transactions";

export const newUser: UserI = {
  _id: "fakeId",
  name: "fakeName",
  email: "fakeEmail",
  password: "fakePassword",
};

export const updatedUser: UserI = {
  _id: "fakeId",
  name: "fakeUpdatedName",
  email: "fakeUpdatedEmail",
  password: "fakeUpdatedPassword",
};

export const loggedUser: LoginI = {
  email: "fakeEmail",
  password: "fakePassword",
};


export const newTransaction: TransactionFormI = {
    _id: "01",
    type: "income",
    concept: "August Salary",
    category: { _id: "66da1b9328ba43a7f62749d2", label: "Salary" },
    amount: "999",
    userId: "1234",
  };
  
  export const updatedTransaction: TransactionFormI = {
    _id: "01",
    type: "income",
    concept: "September Salary",
    category: { _id: "66da1b9328ba43a7f62749d2", label: "Salary" },
    amount: "888",
    userId: "1234",
  };
  
  export const categories = [{ _id: "01", label: "Salary" }];
