import Pdf from "pdfmake-browser";
import robotoFont from "roboto-base64";

const defaultStyle = {
  fontSize: 10
};

const tableLayout = {
  hLineWidth: (i) => {
    return (i === 1) ? 1 : 0;
  },
  vLineWidth: () => {
    return 0;
  },
  paddingLeft: () => {
    return 0;
  },
  paddingRight: () => {
    return 0;
  },
  paddingTop: (i) => {
    return (i === 1) ? 15 : 5;
  },
  paddingBottom: () => {
    return 5;
  }
};

const footerLayout = {
  hLineWidth: (i, node) => {
    return (
      i === 0 ||
      i === node.table.body.length ||
      i === node.table.body.length - 1
    ) ? 1 : 0;
  },
  vLineWidth: () => {
    return 0;
  },
  paddingLeft: () => {
    return 0;
  },
  paddingRight: () => {
    return 0;
  },
  paddingTop: (i, node) => {
    return (
      i === 0 ||
      i === node.table.body.length - 1
    ) ? 10 : 5;
  },
  paddingBottom: (i, node) => {
    return (
      i === node.table.body.length - 1 ||
      i === node.table.body.length - 2
    ) ? 10 : 5;
  }
};

export default (invoice, reminder, profile) => {
  return new Pdf(getTemplate(invoice, reminder, profile), {
    Roboto: robotoFont
  });
};

function getTemplate(invoice, reminder, profile) {
  const organizationSettings = profile.organizationSettings;
  const address = organizationSettings.address;
  const billingAddress = invoice.billingAddress;
  const totalAmount = invoice.total + reminder.feeAmount;

  const doc = {
    defaultStyle: defaultStyle,
    content: [{
      text: returnAddressText({
        name: organizationSettings.name,
        street: address.street,
        postCode: address.postCode,
        city: address.city
      }),
      margin: [0, 100, 0, 0],
      fontSize: 8,
      color: "gray"
    }, {
      margin: [0, 10, 0, 0],
      layout: "noBorders",
      table: {
        widths: ["auto", "*", "auto", "auto"],
        body: [
          [invoice.contactName || "", "", "Datum:", {
            text: reminder.creationDate.format("DD.MM.YYYY"),
            alignment: "right"
          }],
          [billingAddress.street || "", "", "", ""],
          [(billingAddress.postCode || "") + " " + (billingAddress.city || ""), "", "", ""]
        ]
      }
    }, {
      fontSize: 18,
      text: reminder.typeName,
      margin: [0, 50, 0, 0]
    }, {
      margin: [0, 25, 0, 0],
      text: reminder.note || ""
    }, {
      margin: [0, 25, 0, 0],
      layout: tableLayout,
      table: {
        headerRows: 1,
        widths: ["*", "auto"],
        body: [
          ["Beschreibung", {
            text: "Betrag",
            alignment: "right"
          }]
        ]
      }
    }]
  };

  doc.content[4].table.body.push([{
    stack: [
      "Rechnung", {
        margin: [0, 2, 0, 0],
        text: invoice.date.format("DD.MM.YYYY"),
        color: "gray"
      }
    ]
  }, {
    text: invoice.total.toFixed(2),
    alignment: "right"
  }]);

  if (reminder.feeAmount) {
    doc.content[4].table.body.push([
      "Gebühr", {
        text: reminder.feeAmount.toFixed(2),
        alignment: "right"
      }
    ]);
  }

  doc.content.push({
    margin: [0, 25, 0, 0],
    layout: footerLayout,
    table: {
      headerRows: 1,
      widths: ["*", "auto"],
      body: [
        [
          "Gesamtsumme " + (invoice.currencyId || "CHF"), {
            text: totalAmount.toFixed(2),
            alignment: "right"
          }
        ]
      ]
    }
  });

  doc.content.push({
    text: profile.invoiceSettings.note || "",
    margin: [0, 20, 0, 0],
    color: "gray",
    fontSize: 8
  });

  return doc;
}

function returnAddressText(address) {
  const location = [address.postCode, address.city].join(" ").trim();

  return [address.name, address.street, location].filter((value) => {
    return value;
  }).join(", ");
}
