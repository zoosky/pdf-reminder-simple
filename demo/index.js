import $ from "jquery";
import moment from "moment";
import simpleReminder from "../src";

const pdf = simpleReminder({
  organizationAddress: {
    name: "Orbin",
    street: "Strasse 333",
    postCode: "3474",
    city: "Stadt"
  },
  billingAddress: {
    name: "Mein Kontakt",
    attn: "Mr. Melk",
    street: "Strasse 2",
    postCode: "78556",
    city: "Andere Stadt"
  },
  date: moment(),
  customerName: "MyCompany GmbH",
  reminderName: "1. Mahnung",
  reminderText: "Sie haben die Rechnung nicht bezahlt!",
  invoiceNumber: 12,
  invoiceDate: moment(),
  invoiceTotal: 430,
  feeAmount: 10,
  total: 440,
  currency: "EUR",
  note: "Meine Notiz"
});
pdf.getDataUrl({}, (data) => {
  $("iframe").attr("src", data);
});
