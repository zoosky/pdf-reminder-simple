import moment from "moment";
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

export default (options) => {
  return new Pdf(getTemplate(options), {
    Roboto: robotoFont
  });
};

function getTemplate(options) {
  const organizationAddress = options.organizationAddress || null;
  const billingAddress = options.billingAddress || {};
  const date = options.date || moment();
  const customerName = options.customerName || "";
  const reminderName = options.reminderName || "";
  const reminderText = options.reminderText || "";
  const invoiceNumber = options.invoiceNumber || "";
  const invoiceDate = options.invoiceDate || null;
  const invoiceTotal = options.invoiceTotal || 0;
  const feeAmount = options.feeAmount || 0;
  const total = options.total || 0;
  const currency = options.currency || "CHF";
  const note = options.note;

  const leftFields = [];
  if (billingAddress.name) {
    leftFields.push(billingAddress.name);
  }
  if (billingAddress.attn) {
    leftFields.push(billingAddress.attn);
  }
  if (billingAddress.street) {
    leftFields.push(billingAddress.street);
  }
  const location = (billingAddress.postCode || "") + (billingAddress.city && billingAddress.postCode ? " " : "") + (billingAddress.city || "");
  if (location) {
    leftFields.push(location);
  }

  const rightFields = [];
  if (date) {
    rightFields.push({
      key: "Datum:",
      value: date.format("DD.MM.YYYY")
    });
  }
  if (customerName) {
    rightFields.push({
      key: "Kunde:",
      value: customerName
    });
  }

  const headTableBody = [];
  const tableHeight = Math.max(leftFields.length, rightFields.length);
  for (let i = 0; i < tableHeight; i++) {
    const leftValue = leftFields[i];
    const rightObject = rightFields[i] || {};
    headTableBody.push([
      leftValue || "",
      "",
      rightObject.key || "", {
        text: rightObject.value || "",
        alignment: "right"
      }
    ]);
  }

  const organizationAddressText = organizationAddress ? getFlatAddressText(organizationAddress) : "";

  const doc = {
    defaultStyle: defaultStyle,
    content: [{
      text: organizationAddressText,
      margin: [0, 100, 0, 0],
      fontSize: 8,
      color: "gray"
    }, {
      margin: [0, 10, 0, 0],
      layout: "noBorders",
      table: {
        widths: ["auto", "*", "auto", "auto"],
        body: headTableBody
      }
    }, {
      fontSize: 18,
      text: reminderName,
      margin: [0, 50, 0, 0]
    }, {
      margin: [0, 25, 0, 0],
      text: reminderText
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
      "Rechnung " + (invoiceNumber ? invoiceNumber.toString() : ""), {
        margin: [0, 2, 0, 0],
        text: invoiceDate ? invoiceDate.format("DD.MM.YYYY") : "",
        color: "gray"
      }
    ]
  }, {
    text: invoiceTotal.toFixed(2),
    alignment: "right"
  }]);

  if (feeAmount) {
    doc.content[4].table.body.push([
      "Gebühr", {
        text: feeAmount.toFixed(2),
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
          "Gesamtsumme " + currency, {
            text: total.toFixed(2),
            alignment: "right"
          }
        ]
      ]
    }
  });

  if (note) {
    doc.content.push({
      text: note,
      margin: [0, 20, 0, 0],
      color: "gray",
      fontSize: 8
    });
  }

  return doc;
}

function getFlatAddressText(address) {
  const location = [address.postCode, address.city].join(" ").trim();

  return [address.name, address.street, location].filter((value) => {
    return value;
  }).join(", ");
}
