import {
  table as tableLayout,
  footer as footerLayout
} from "./layout";
import headTable from "./head-table";
import moment from "moment";
import Pdf from "pdfmake-browser";
import robotoFont from "roboto-base64";

const defaultStyle = {
  fontSize: 10
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
  const invertHeader = options.invertHeader || false;

  let leftFields = [];
  const organizationAddressText = organizationAddress ? getFlatAddressText(organizationAddress) : "";
  if (organizationAddressText) {
    leftFields.push({
      text: organizationAddressText,
      fontSize: 8,
      color: "gray",
      margin: [0, 0, 0, 10]
    }, "");
  }
  if (billingAddress.name) {
    leftFields.push({
      text: billingAddress.name
    }, "");
  }
  if (billingAddress.attn) {
    leftFields.push({
      text: billingAddress.attn
    }, "");
  }
  if (billingAddress.street) {
    leftFields.push({
      text: billingAddress.street
    }, "");
  }
  const location = (billingAddress.postCode || "") + (billingAddress.city && billingAddress.postCode ? " " : "") + (billingAddress.city || "");
  if (location) {
    leftFields.push({
      text: location
    }, "");
  }

  let rightFields = [];
  if (organizationAddressText) {
    rightFields.push({
      text: ""
    }, "");
  }
  if (date) {
    rightFields.push({
      text: "Datum:"
    }, {
      text: date.format("DD.MM.YYYY")
    });
  }
  if (customerName) {
    rightFields.push({
      text: "Kunde:"
    }, {
      text: customerName
    });
  }

  const oldLeftFields = leftFields;
  leftFields = invertHeader ? rightFields : leftFields;
  rightFields = invertHeader ? oldLeftFields : rightFields;

  const headTableBody = headTable.getBody(leftFields, rightFields);

  const doc = {
    defaultStyle: defaultStyle,
    pageMargins: [60, 110, 60, 150],
    content: [{
      margin: [0, 30, 0, 0],
      layout: "noBorders",
      table: {
        widths: invertHeader ? ["auto", 210, 0, "auto", "auto"] : ["auto", "auto", "*", "auto", "auto"],
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

  doc.content[3].table.body.push([{
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
    doc.content[3].table.body.push([
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
      margin: [0, 20, 0, 0],
      color: "gray",
      fontSize: 8,
      table: {
        dontBreakRows: true,
        body: [
          [{
            text: note
          }]
        ]
      },
      layout: "noBorders"
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
