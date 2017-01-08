'use strict';

let Wit = null;
let interactive = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

const accessToken = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node examples/quickstart.js <wit-access-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    console.log('sending...', JSON.stringify(response));
  },
  
  /*
   * BENIE_APLHA Example
   */
  getProduct({context, entities}) {
    var product = firstEntityValue(entities, 'product');
    if (product) {
      context.productInfo = {
        name: "Sorine",
        presentation: "0,5 MG/ML SOL NAS CT FR PLAS TRANS GOT X 30 ML",
        activeIngredient: "Cloridrato de Nafazolina",
        usage: "Descongestionantes Nasais Tópicos",
      };
      delete context.missingProduct;
    } else {
      context.missingProduct = true;
      delete context.forecast;
    }
    return context;
  },
  
  getQuotation({context, entities}) {
    context.quotation = {
      items: [
        {
          caterer: "Drogasmil",
          price: "11.90"
        },
        {
          caterer: "Pacheco",
          price: "12.70"
        },
        {
          caterer: "Raia",
          price: "15.10"
        }
      ]
    };
    return context;
  },
  
  getPaymentOptions({context}) {
    var paymentOptions = {
      items:[
        {name: "Dinheiro"},
        {name: "Débito"},
        {name: "Crédito"}
      ]
    };
    context.paymentOptions = paymentOptions;
    return context;
  },
  
  getCurrentOrder({context}) {
    
    var cart = {
      items: [
        {
          productName: "SORINE - 0,5 MG/ML SOL NAS CT FR PLAS TRANS GOT X 30 ML ",
          price: 11.90
        }
      ],
      totalCost: 11.90,
      catererId: 1,
      catererName: "Drogasmil"
    };
    
    var orderInfo = {
      customerName: "Daniel Marreco",
      customerAddress: "Rua Canning, 22 ap 104 - Ipanema",
      customerPhone: "(21)981040760",
      cart: cart
    };
    
    context.orderInfo = orderInfo;
    
    return context;
  },
  
  
  selectCaterer({context, entities}) {
    var selectedCaterer = firstEntityValue(entities, 'caterer');
    context.caterer = selectedCaterer;
    return context;
  },
  
  selectPaymentForm({context, entities}) {
    var selectPaymentForm = firstEntityValue(entities, 'paymentForm');
    context.paymentForm = selectPaymentForm;
    return context;
  },
  
  /*
   * WEATHER example
   */
  getForecast({context, entities}) {
    var location = firstEntityValue(entities, 'location');
    if (location) {
      context.forecast = 'sunny in ' + location; // we should call a weather API here
      delete context.missingLocation;
    } else {
      context.missingLocation = true;
      delete context.forecast;
    }
    return context;
  },
};

const client = new Wit({accessToken, actions});
interactive(client);
