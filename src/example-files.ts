export const TEMPLATES = {
foodora:
`
receipt({width: 32},
n(),

title("foodora"),
n(2),
title(externalId),
n(),
title(upperCase(isPickup ? message.pickupAt : message.deliverAt)),
title(formatDate(deliverAt, "HH:mm")),

n(),

divider(),
n(),
text({align: "center"}, upperCase(contact.firstName + " " + contact.lastName)),
text({align: "center", style: "bold"}, message.tel + ": " + contact.phone),
n(),
divider(),

walkItems((item, depth, parents) => {
  const topLevel = depth == 0
  const totalAmount = parents
    .map(p => p.amount)
    .reduce((acc, curr) => acc * curr, item.amount)
  return [
    n(),
    row({style: topLevel ? "bold" : "normal"},
      col("[ ] "), col({width: depth * 3}),
      col({width: 3}, totalAmount > (topLevel ? 0 : 1) ? totalAmount : ""),
      col({width: "*", wrapped: true}, item.shortName),
      col({width: 7, align: "right"}, currencySymbol + formatDecimal(item.total, "0.00"))
    )
  ]
}),

orderComment ? [
    n(),
    text(orderComment)
] : null,

n(),
divider(),
n(),

row({style: "title"},
  col(message.total + ":"),
  col({width: "*"}),
  col(currencySymbol + formatDecimal(total, "0.00"))
),

n(),
divider(),
n(),

text({align: "center"}, formatDate(acceptedTime, "d MMM YYYY")),
text({align: "center"}, message.orderedAt + " " + formatDate(timestamp, "HH:mm")),

n(6)
)
`.trim()
,
hungryhouse:
`
receipt({width: 32},
n(),

bitmap({align: "center"}, 1),
n(),
text({align: "center"}, "ORDER NO."),
title(externalId),
n(),
!isPickup ? [
  title("DELIVERY")
] : [
  row({style: "title inverted"}, 
      col({width: "*"}), col("COLLECTION"), col({width: "*"}))
], 
title(formatDate(deliverAt, "HH:mm")),

n(),

divider(),
n(),
text({align: "center"}, upperCase(contact.firstName + " " + contact.lastName)),
!isPickup ? [
  text({align: "center", style: "bold"}, upperCase(
    (address.name ? address.name + ": " : "") +
    (address.building ? address.building + " " : "") +
    address.street
  )),
  text({align: "center"}, upperCase(address.city + ", " + address.zip))
] : null,
text({align: "center", style: "bold"}, "TEL: " + contact.phone),
address.info ? [
  n(),
  text({align: "center"}, address.info)
] : null,
n(),
divider(),

walkItems((item, depth, parents) => {
  const topLevel = depth == 0
  const totalAmount = parents
    .map(p => p.amount)
    .reduce((acc, curr) => acc * curr, item.amount)
  return [
    n(),
    row({style: topLevel ? "bold" : "normal"},
      col("[ ] "), col({width: depth * 3}),
      col({width: 3}, totalAmount > (topLevel ? 0 : 1) ? totalAmount : ""),
      col({width: "*", wrapped: true}, item.shortName),
      col({width: 7, align: "right"}, currencySymbol + formatDecimal(item.total, "0.00"))
    )
  ]
}),
fees.concat(discounts).map(item => [
  n(),
  row({style: "bold"},
      col(item.name + ":"),
      col({width: "*"}),
      col(currencySymbol + formatDecimal(item.value, "0.00"))
  ) 
]),

!orderComment ? null : [
    n(),
    text(orderComment)
],

n(),
divider(),
n(),

row({style: "title"},
  col(message.total + ":"),
  col({width: "*"}),
  col(currencySymbol + formatDecimal(total, "0.00"))
),

n(),
divider(),
n(),
        
title({align: "center"}, paid ? "PREPAID" : paymentType),

n(),
divider(),
n(),        
        
text({align: "center"}, formatDate(acceptedTime, "d MMM YYYY")),
text({align: "center"}, message.orderedAt + " " + formatDate(timestamp, "HH:mm")),

n(6)
)
`.trim()
}

export const MESSAGES = {
en:
`
{
"locale": "en",
"deliverAt": "Deliver at",
"pickupAt": "Pickup at",
"tel": "Tel",
"total": "Total",
"orderedAt": "Ordered at"
}
`.trim()
,
de:
`
{
"locale": "de",
"deliverAt": "Lieferung um",
"pickupAt": "Abholung um",
"tel": "Tel",
"total": "Gesamt",
"orderedAt": "Bestellt um"
}
`.trim()
}

export const ORDERS = {
normal:
`
{
  "id": "0ACFC7A5-4976-42C0-A6CC-A401AD561B09",
  "timestamp": 1450191838193,
  "deliveryPlatform": {
    "id": 4,
    "name": "9Cookies",
    "type": "NINE_COOKIES"
  },
  "deliverAt": 1450195172350,
  "preorder": false,
  "state": 1,
  "externalId": "NORMAL-26-1450191837819",
  "expiresAt": 1450192438193,
  "dispatchState": 0,
  "trackingState": 0,
  "acceptedTime": 1450191872350,
  "orderComment": "K\u00f6nnten Sie es bitte schneller machen? Ich bin sehr hungrig.",
  "rev": 0,
  "customerId": "C226EB81-424E-42C1-BC7F-343658464CD8",
  "paid": false,
  "paymentType": "CASH",
  "paymentMethod": "Bar",
  "currency": "EUR",
  "currencySymbol": "\u20ac",
  "total": 0,
  "items": [
    {
      "amount": 1,
      "article": 999,
      "name": "Vorspeise",
      "shortName": "Vorspeise",
      "price": 0,
      "groupName": "Hinweise",
      "total": 0
    },
    {
      "amount": 1,
      "modifiers": [
        {
          "amount": 1,
          "article": 9999,
          "name": "Ich m\u00f6chte Ananasst\u00fccken auf meiner Pizza.",
          "shortName": "Ich m\u00f6chte Ananasst\u00fccken auf meiner Pizza.",
          "price": 0,
          "groupName": "Hinweise",
          "total": 0
        }
      ],
      "article": 999,
      "name": "Hauptgericht",
      "shortName": "Hauptgericht",
      "price": 0,
      "groupName": "Hinweise",
      "total": 0
    },
    {
      "amount": 1,
      "article": 999,
      "name": "Dessert",
      "shortName": "Dessert",
      "price": 0,
      "groupName": "Hinweise",
      "total": 0
    }
  ],
  "externalDelivery": false,
  "contact": {
    "firstName": "Max",
    "lastName": "Mustermann",
    "language": 11,
    "languageName": "Deutsch",
    "customerContactId": "25C0B9E9-08F5-4375-94C8-F5DCA791A54D",
    "phone": "080012345678"
  },
  "externalRestaurantId": "26",
  "address": {
    "street": "J\u00e4gerstra\u00dfe",
    "zip": "10117",
    "city": "Berlin",
    "building": "40",
    "customerAddressId": "E890CD7B-F9E2-4633-81E4-F4A4FBCED0ED",
    "geocodedManually": true,
    "latitude": 52.5146322,
    "longitude": 13.3978577,
    "distance": 733
  },
  "__expectedLiveTracking": false,
  "__test": true,
  "__tracked": 0
}
`.trim()
,
pickup:
`
{
  "id": "0ACFC7A5-4976-42C0-A6CC-A401AD561B09",
  "timestamp": 1450191838193,
  "deliveryPlatform": {
    "id": 4,
    "name": "9Cookies",
    "type": "NINE_COOKIES"
  },
  "deliverAt": 1450193372350,
  "preorder": false,
  "state": 1,
  "externalId": "PICKUP-26-1450191837819",
  "expiresAt": 1450192438193,
  "dispatchState": 1,
  "trackingState": 0,
  "acceptedTime": 1450191872350,
  "orderComment": "K\u00f6nnten Sie es bitte schneller machen? Ich bin sehr hungrig.",
  "rev": 0,
  "customerId": "C226EB81-424E-42C1-BC7F-343658464CD8",
  "paid": false,
  "paymentType": "CASH",
  "paymentMethod": "Bar",
  "currency": "EUR",
  "currencySymbol": "\u20ac",
  "total": 0,
  "items": [
    {
      "amount": 1,
      "article": 999,
      "name": "Vorspeise",
      "shortName": "Vorspeise",
      "price": 0,
      "groupName": "Hinweise",
      "total": 0
    },
    {
      "amount": 1,
      "modifiers": [
        {
          "amount": 1,
          "article": 9999,
          "name": "Ich m\u00f6chte Ananasst\u00fccken auf meiner Pizza.",
          "shortName": "Ich m\u00f6chte Ananasst\u00fccken auf meiner Pizza.",
          "price": 0,
          "groupName": "Hinweise",
          "total": 0
        }
      ],
      "article": 999,
      "name": "Hauptgericht",
      "shortName": "Hauptgericht",
      "price": 0,
      "groupName": "Hinweise",
      "total": 0
    },
    {
      "amount": 1,
      "article": 999,
      "name": "Dessert",
      "shortName": "Dessert",
      "price": 0,
      "groupName": "Hinweise",
      "total": 0
    }
  ],
  "externalDelivery": false,
  "contact": {
    "firstName": "Max",
    "lastName": "Mustermann",
    "language": 11,
    "languageName": "Deutsch",
    "customerContactId": "25C0B9E9-08F5-4375-94C8-F5DCA791A54D",
    "phone": "080012345678"
  },
  "externalRestaurantId": "26",
  "address": {
    "street": "J\u00e4gerstra\u00dfe",
    "zip": "10117",
    "city": "Berlin",
    "building": "40",
    "customerAddressId": "E890CD7B-F9E2-4633-81E4-F4A4FBCED0ED",
    "geocodedManually": true,
    "latitude": 52.5146322,
    "longitude": 13.3978577,
    "distance": 733
  },
  "__expectedLiveTracking": false,
  "__test": true,
  "__tracked": 0
}
`.trim()
,
external:
`
{
  "id": "0ACFC7A5-4976-42C0-A6CC-A401AD561B09",
  "timestamp": 1450191838193,
  "deliveryPlatform": {
    "id": 4,
    "name": "9Cookies",
    "type": "NINE_COOKIES"
  },
  "deliverAt": 1450193372350,
  "preorder": false,
  "state": 1,
  "externalId": "EXTERNAL-26-1450191837819",
  "expiresAt": 1450192438193,
  "dispatchState": 0,
  "trackingState": 0,
  "acceptedTime": 1450191872350,
  "orderComment": "K\u00f6nnten Sie es bitte schneller machen? Ich bin sehr hungrig.",
  "rev": 0,
  "customerId": "C226EB81-424E-42C1-BC7F-343658464CD8",
  "paid": false,
  "paymentType": "CASH",
  "paymentMethod": "Bar",
  "currency": "EUR",
  "currencySymbol": "\u20ac",
  "total": 0,
  "items": [
    {
      "amount": 1,
      "article": 999,
      "name": "Vorspeise",
      "shortName": "Vorspeise",
      "price": 0,
      "groupName": "Hinweise",
      "total": 0
    },
    {
      "amount": 1,
      "modifiers": [
        {
          "amount": 1,
          "article": 9999,
          "name": "Ich m\u00f6chte Ananasst\u00fccken auf meiner Pizza.",
          "shortName": "Ich m\u00f6chte Ananasst\u00fccken auf meiner Pizza.",
          "price": 0,
          "groupName": "Hinweise",
          "total": 0
        }
      ],
      "article": 999,
      "name": "Hauptgericht",
      "shortName": "Hauptgericht",
      "price": 0,
      "groupName": "Hinweise",
      "total": 0
    },
    {
      "amount": 1,
      "article": 999,
      "name": "Dessert",
      "shortName": "Dessert",
      "price": 0,
      "groupName": "Hinweise",
      "total": 0
    }
  ],
  "externalDelivery": true,
  "contact": {
    "firstName": "Max",
    "lastName": "Mustermann",
    "language": 11,
    "languageName": "Deutsch",
    "customerContactId": "25C0B9E9-08F5-4375-94C8-F5DCA791A54D",
    "phone": "080012345678"
  },
  "externalRestaurantId": "26",
  "address": {
    "street": "J\u00e4gerstra\u00dfe",
    "zip": "10117",
    "city": "Berlin",
    "building": "40",
    "customerAddressId": "E890CD7B-F9E2-4633-81E4-F4A4FBCED0ED",
    "geocodedManually": true,
    "latitude": 52.5146322,
    "longitude": 13.3978577,
    "distance": 733
  },
  "__expectedLiveTracking": false,
  "__test": true,
  "__tracked": 0
}
`.trim()
,
hh:
`
{
  "id": "6E0D268E-9C47-4BB9-A5E2-25B975379EF7",
  "timestamp": 1455291968683,
  "deliveryPlatform": {
    "id": 3,
    "name": "Hungry House",
    "type": "HUNGRY_HOUSE"
  },
  "deliverAt": 1455292886428,
  "preorder": false,
  "state": 1,
  "externalId": "1455291966",
  "expiresAt": 1455292568683,
  "dispatchState": 0,
  "trackingState": 0,
  "acceptedTime": 1455291986428,
  "rev": 0,
  "orderComment": "Go shorty! It's your birthday. We're gonna party like it's your birthday.",
  "customerId": "8BC77A6A-7CE5-42B8-9981-E55D6D2A5FF5",
  "paid": true,
  "paymentType": "ONLINE",
  "paymentMethod": "Schon Bezahlt",
  "currency": "EUR",
  "currencySymbol": "\u20ac",
  "total": 18.91,
  "items": [
    {
      "amount": 1,
      "article": 9991,
      "name": "porcao de coxinha",
      "shortName": "porcao de coxinha",
      "price": 4.9,
      "total": 4.9
    },
    {
      "amount": 1,
      "article": 9991,
      "name": "batata frita",
      "shortName": "batata frita",
      "price": 2.99,
      "total": 2.99
    },
    {
      "amount": 1,
      "article": 9991,
      "name": "pao de alho",
      "shortName": "pao de alho",
      "price": 1.69,
      "total": 1.69
    },
    {
      "amount": 1,
      "article": 9991,
      "name": "mousse de maracuja",
      "shortName": "mousse de maracuja",
      "price": 2.9,
      "total": 2.9
    },
    {
      "amount": 1,
      "modifiers": [
        {
          "amount": 1,
          "article": 9991,
          "name": "coca-cola",
          "shortName": "coca-cola",
          "price": 0,
          "total": 0
        }
      ],
      "article": 9991,
      "name": "bottle of soft drink",
      "shortName": "bottle of soft drink",
      "price": 2.5,
      "total": 2.5
    },
    {
      "amount": 3,
      "modifiers": [
        {
          "amount": 2,
          "article": 9991,
          "name": "ketchup",
          "shortName": "ketchup",
          "price": 0,
          "total": 0
        },
        {
          "amount": 1,
          "article": 9991,
          "name": "without salad",
          "shortName": "without salad",
          "price": 0,
          "total": 0
        }
      ],
      "article": 9991,
      "name": "x-bacon burger",
      "shortName": "x-bacon burger",
      "price": 4.9,
      "total": 4.9
    }
  ],
  "discounts": [
    {
      "name": "20% off Taste Test",
      "value": -3.97
    }
  ],
  "fees": [
    {
      "name": "Liefergeb\u00fchr",
      "value": 3
    }
  ],
  "externalRestaurantId": "9000",
  "minimumAcceptTime": 0,
  "externalDelivery": true,
  "contact": {
    "firstName": "John",
    "lastName": "Smtith",
    "company": "",
    "description": "it's a flat",
    "language": 11,
    "languageName": "Deutsch",
    "customerContactId": "2B4ACDCD-AF6C-4E51-A989-2E1B5A684DCA",
    "phone": "1111 111111",
    "email": "xxxx.xxxx@gmail.com"
  },
  "address": {
    "name": "",
    "street": "Deerfields Close",
    "zip": "NW9 6QH",
    "city": "London",
    "info": "it's a flat",
    "building": "14",
    "customerAddressId": "DC2E02E8-8431-4897-BE8A-53248C3849CE",
    "geocodedManually": true,
    "latitude": 52.4896674,
    "longitude": 13.350683,
    "distance": 0
  },
  "__test": false,
  "__expectedLiveTracking": false,
  "__tracked": 0
}
`.trim()
,
hh_pickup:
`
{
  "id": "6E0D268E-9C47-4BB9-A5E2-25B975379EF7",
  "timestamp": 1455291968683,
  "deliveryPlatform": {
    "id": 3,
    "name": "Hungry House",
    "type": "HUNGRY_HOUSE"
  },
  "deliverAt": 1455292886428,
  "preorder": false,
  "state": 1,
  "externalId": "1455291966",
  "expiresAt": 1455292568683,
  "dispatchState": 1,
  "trackingState": 0,
  "acceptedTime": 1455291986428,
  "rev": 0,
  "orderComment": "Go shorty! It's your birthday. We're gonna party like it's your birthday.",
  "customerId": "8BC77A6A-7CE5-42B8-9981-E55D6D2A5FF5",
  "paid": false,
  "paymentType": "CASH",
  "paymentMethod": "Bar",
  "currency": "EUR",
  "currencySymbol": "\u20ac",
  "total": 18.91,
  "items": [
    {
      "amount": 1,
      "article": 9991,
      "name": "porcao de coxinha",
      "shortName": "porcao de coxinha",
      "price": 4.9,
      "total": 4.9
    },
    {
      "amount": 1,
      "article": 9991,
      "name": "batata frita",
      "shortName": "batata frita",
      "price": 2.99,
      "total": 2.99
    },
    {
      "amount": 1,
      "article": 9991,
      "name": "pao de alho",
      "shortName": "pao de alho",
      "price": 1.69,
      "total": 1.69
    },
    {
      "amount": 1,
      "article": 9991,
      "name": "mousse de maracuja",
      "shortName": "mousse de maracuja",
      "price": 2.9,
      "total": 2.9
    },
    {
      "amount": 1,
      "modifiers": [
        {
          "amount": 1,
          "article": 9991,
          "name": "coca-cola",
          "shortName": "coca-cola",
          "price": 0,
          "total": 0
        }
      ],
      "article": 9991,
      "name": "bottle of soft drink",
      "shortName": "bottle of soft drink",
      "price": 2.5,
      "total": 2.5
    },
    {
      "amount": 3,
      "modifiers": [
        {
          "amount": 2,
          "article": 9991,
          "name": "ketchup",
          "shortName": "ketchup",
          "price": 0,
          "total": 0
        },
        {
          "amount": 1,
          "article": 9991,
          "name": "without salad",
          "shortName": "without salad",
          "price": 0,
          "total": 0
        }
      ],
      "article": 9991,
      "name": "x-bacon burger",
      "shortName": "x-bacon burger",
      "price": 4.9,
      "total": 4.9
    }
  ],
  "discounts": [
    {
      "name": "20% off Taste Test",
      "value": -3.97
    }
  ],
  "fees": [
    {
      "name": "Liefergeb\u00fchr",
      "value": 3
    }
  ],
  "externalRestaurantId": "9000",
  "minimumAcceptTime": 0,
  "externalDelivery": true,
  "contact": {
    "firstName": "John",
    "lastName": "Smtith",
    "company": "",
    "description": "it's a flat",
    "language": 11,
    "languageName": "Deutsch",
    "customerContactId": "2B4ACDCD-AF6C-4E51-A989-2E1B5A684DCA",
    "phone": "1111 111111",
    "email": "xxxx.xxxx@gmail.com"
  },
  "address": {
    "name": "",
    "street": "Deerfields Close",
    "zip": "NW9 6QH",
    "city": "London",
    "info": "it's a flat",
    "building": "14",
    "customerAddressId": "DC2E02E8-8431-4897-BE8A-53248C3849CE",
    "geocodedManually": true,
    "latitude": 52.4896674,
    "longitude": 13.350683,
    "distance": 0
  },
  "__test": false,
  "__expectedLiveTracking": false,
  "__tracked": 0
}
`.trim()
}