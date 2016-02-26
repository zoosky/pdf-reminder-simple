import $ from "jquery";
import moment from "moment";
import simpleReminder from "../src";

const invoice = {
  contactName: "Mein Kontakt",
  number: 12,
  date: moment(),
  dueDate: moment(),
  billingAddress: {
    street: "Strasse 2",
    postCode: "78556",
    city: "Andere Stadt"
  },
  itemDetails: [{
    name: "Item Name",
    quantity: 2,
    rate: 200,
    total: 400
  }],
  subTotal: 400,
  taxGroups: [{
    name: "Mehrwertsteuer",
    amount: 10
  }],
  adjustment: 20,
  total: 430,
  currencyId: "EUR"
};

const reminder = {
  typeName: "1. Mahnung",
  note: "Sie haben die Rechnung nicht bezahlt!",
  feeAmount: 10,
  creationDate: moment()
};

const profile = {
  organizationSettings: {
    name: "Orbin",
    address: {
      street: "Strasse 333",
      postCode: "3474",
      city: "Stadt"
    }
  },
  invoiceSettings: {
    note: "Meine Notiz"
  }
};

const pdf = simpleReminder(invoice, reminder, profile);
pdf.getDataUrl({}, (data) => {
  $("iframe").attr("src", data);
});
