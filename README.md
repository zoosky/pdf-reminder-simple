# pdf-reminder-simple
[![NPM Version][npm-image]][downloads-url] [![NPM Downloads][downloads-image]][downloads-url]

**A simple pdf reminder template**

## Usage

```javascript
import moment from "moment";
import simpleReminder from "pdf-reminder-simple";

simpleReminder({
  invertHeader: true,
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
}).print("reminder.pdf");
```

## License

[MIT](LICENSE)

[downloads-image]: https://img.shields.io/npm/dm/pdf-reminder-simple.svg
[downloads-url]: https://npmjs.org/package/pdf-reminder-simple
[npm-image]: https://img.shields.io/npm/v/pdf-reminder-simple.svg
[npm-url]: https://npmjs.org/package/pdf-reminder-simple
